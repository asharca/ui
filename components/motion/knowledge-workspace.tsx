"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { FileText, Globe2, StickyNote, ArrowUpRight, Plus, Search, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { Switch } from "@/components/motion/switch";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { Citations } from "@/components/agents/citations";
import { KnowledgeSearchText } from "@/components/motion/knowledge-search-text";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type KnowledgeSourceKind = "document" | "note" | "link";
export interface KnowledgeSource {
  id: string;
  title: string;
  kind: KnowledgeSourceKind;
  content: string;
  url?: string;
  enabled: boolean;
  status: "ready" | "processing" | "error";
  error?: string;
  /** Host-measured tokens; absent means unknown, never estimated by this component. */
  tokens?: number;
}
export interface KnowledgeSourceDraft { title: string; kind: KnowledgeSourceKind; content: string; url?: string }
export interface KnowledgeWorkspaceProps {
  sources?: KnowledgeSource[];
  defaultSources?: KnowledgeSource[];
  onSourcesChange?: (sources: KnowledgeSource[]) => void;
  contextBudget: number;
  onCreate: (draft: KnowledgeSourceDraft) => Promise<KnowledgeSource>;
  /** Character budgets are measured from supplied text; token budgets remain host-measured. */
  contextUnit?: "tokens" | "characters";
  onRemove: (source: KnowledgeSource) => Promise<void>;
  onToggle: (source: KnowledgeSource, enabled: boolean) => Promise<void>;
  onUpdate?: (source: KnowledgeSource, draft: KnowledgeSourceDraft) => Promise<KnowledgeSource>;
  footer?: ReactNode;
  className?: string;
}
const kinds: KnowledgeSourceKind[] = ["document", "link", "note"];
const textClass = "w-full min-h-32 rounded-xl border border-border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** A document-management surface. Search is explicitly literal full-text filtering. All writes are host callbacks. */
export function KnowledgeWorkspace({ sources: controlledSources, defaultSources = [], onSourcesChange, contextBudget, contextUnit = "tokens", onCreate, onRemove, onToggle, onUpdate, footer, className }: KnowledgeWorkspaceProps) {
  const [internal, setInternal] = useState(defaultSources);
  const sources = controlledSources ?? internal;
  const sourcesRef = useRef(sources); sourcesRef.current = sources;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<KnowledgeSourceKind | "all">("all");
  const [contextSelection, setContextSelection] = useState<KnowledgeSourceKind | null>(null);
  const [view, setView] = useState<"create" | "read" | "remove" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sources.find((source) => source.id === selectedId);
  const [draft, setDraft] = useState<KnowledgeSourceDraft>({ title: "", kind: "note", content: "" });
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [pending, setPending] = useState<string[]>([]);
  const pendingRef = useRef(new Set<string>());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const alive = useRef(true);
  const fileGeneration = useRef(0);
  const id = useId();
  const reduce = useReducedMotion();
  useEffect(() => { alive.current = true; return () => { alive.current = false; ++fileGeneration.current; }; }, []);
  const update = (next: KnowledgeSource[]) => { sourcesRef.current = next; if (controlledSources === undefined) setInternal(next); onSourcesChange?.(next); };
  const close = () => { if (busy) return; ++fileGeneration.current; setView(null); setError(null); };
  const create = async () => {
    if (lock.current) return;
    if (!draft.title.trim() || (draft.kind !== "link" && !draft.content.trim())) { setError("Add a title and source content."); return; }
    if (draft.kind === "link") { try { const url = new URL(draft.url ?? ""); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { setError("Use a valid http or https reference URL."); return; } }
    lock.current = true; setBusy(true); setError(null);
    try {
      const source = await onCreate({ ...draft, title: draft.title.trim() });
      if (!alive.current) return;
      if (sourcesRef.current.some((item) => item.id === source.id)) throw new Error("The host returned a source ID that already exists.");
      update([...sourcesRef.current, source]); setView(null); setNotice(`Added ${source.title}. Status: ${source.status}.`);
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Could not add this source."); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  const remove = async () => {
    if (!selected || lock.current || pendingRef.current.has(selected.id)) return;
    lock.current = true; setBusy(true); setError(null);
    try { await onRemove(selected); if (alive.current) { update(sourcesRef.current.filter((item) => item.id !== selected.id)); setView(null); setNotice(`Removed ${selected.title}.`); } }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Could not remove this source."); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  const toggle = async (source: KnowledgeSource) => {
    if (pendingRef.current.has(source.id)) return;
    pendingRef.current.add(source.id); setPending([...pendingRef.current]); setError(null);
    try { await onToggle(source, !source.enabled); if (alive.current) { update(sourcesRef.current.map((item) => item.id === source.id ? { ...item, enabled: !source.enabled } : item)); setNotice(`${source.title} ${source.enabled ? "excluded from" : "included in"} context.`); } }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Could not change context."); }
    finally { pendingRef.current.delete(source.id); if (alive.current) setPending([...pendingRef.current]); }
  };
  const saveSource = async () => {
    if (!selected || !onUpdate || lock.current || pendingRef.current.has(selected.id)) return;
    if (!draft.title.trim() || (draft.kind !== "link" && !draft.content.trim())) { setError("Add a title and source content."); return; }
    if (draft.kind === "link") { try { const url = new URL(draft.url ?? ""); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { setError("Use a valid http or https reference URL."); return; } }
    lock.current = true; setBusy(true); setError(null);
    try { const next = await onUpdate(selected, { ...draft, title: draft.title.trim() }); if (next.id !== selected.id) throw new Error("The host must preserve the source identity when updating."); if (alive.current) { update(sourcesRef.current.map(source => source.id === next.id ? next : source)); setView(null); setNotice(`Updated ${next.title}.`); } }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Could not save this source. Your edits are preserved."); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  const enabled = sources.filter((source) => source.enabled && source.status === "ready");
  const measure = (source: KnowledgeSource) => contextUnit === "characters" ? source.content.length + (source.kind === "link" ? (source.url?.length ?? 0) : 0) : Math.max(0, source.tokens ?? 0);
  const known = enabled.reduce((sum, source) => sum + measure(source), 0);
  const unknown = contextUnit === "tokens" && enabled.some((source) => source.tokens === undefined);
  const kindLabels = { document: "Documents", link: "Reference links", note: "Notes" };
  const kindColors = { document: "bg-blue-500", link: "bg-teal-500", note: "bg-amber-500" };
  const needle = query.trim().toLocaleLowerCase();
  const filtered = sources.filter((source) => (filter === "all" || source.kind === filter) && `${source.title} ${source.content} ${source.url ?? ""}`.toLocaleLowerCase().includes(needle));
  return <section aria-label="AI knowledge workspace" className={cn("min-h-[var(--preview-viewport-height,100svh)] w-full bg-background px-5 py-8 text-foreground sm:px-10", className)}><div className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-xs text-muted-foreground">Workspace / AI context</p><h2 className="text-xl font-medium">Knowledge base</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Give your assistant the context it needs. Keep documents, reference links, and useful notes in one place.</p></div><Button size="sm" className="rounded-full" onClick={() => { ++fileGeneration.current; setDraft({ title: "", kind: "note", content: "" }); setError(null); setView("create"); }}><Plus className="size-4" />Add source</Button></header>
    <section aria-label="Assistant context" className="rounded-3xl border border-border p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">Assistant context</p><p className="mt-1 text-xl font-medium tabular-nums">{known.toLocaleString()}<span className="text-sm text-muted-foreground"> / {contextBudget.toLocaleString()} {contextUnit}</span></p></div><p className="text-xs text-muted-foreground">{enabled.length} of {sources.length} sources included</p></div>
      <meter aria-label={`Known context ${contextUnit}`} min={0} max={Math.max(1, contextBudget)} value={Math.min(known, Math.max(1, contextBudget))} aria-valuetext={`${known} known ${contextUnit}; ${unknown ? "some sources unmeasured" : "all ready sources measured"}`} className="sr-only" />
      <figure className="m-0 mt-12"><div className="flex h-2.5 w-full gap-1">{kinds.map(kind => { const amount = enabled.filter(source => source.kind === kind).reduce((sum, source) => sum + measure(source), 0); return <motion.button key={kind} type="button" aria-label={`${kindLabels[kind]}: ${amount.toLocaleString()} ${contextUnit}`} aria-pressed={contextSelection === kind} onClick={() => setContextSelection(contextSelection === kind ? null : kind)} className={cn("relative h-full min-w-0 rounded-full outline-none after:absolute after:inset-x-0 after:-inset-y-3 focus-visible:ring-2 focus-visible:ring-ring", kindColors[kind])} style={{ flexBasis: 0, flexGrow: amount }} animate={{ opacity: contextSelection && contextSelection !== kind ? 0.35 : 1 }} transition={reduce ? { duration: 0 } : { duration: 0.2 }} />; })}<span className="h-full rounded-full bg-muted" style={{ flexBasis: 0, flexGrow: Math.max(0, contextBudget - known) }} /></div>
        <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">{kinds.map(kind => <button key={kind} type="button" aria-pressed={contextSelection === kind} onClick={() => setContextSelection(contextSelection === kind ? null : kind)} className={cn("flex min-h-8 items-center gap-2 rounded-full px-1 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none", contextSelection && contextSelection !== kind && "opacity-35")}><span className={cn("size-2 rounded-full", kindColors[kind])} /><span className="text-muted-foreground">{kindLabels[kind]}</span><AnimatedNumber value={enabled.filter(source => source.kind === kind).reduce((sum, source) => sum + measure(source), 0)} startOnView={false} duration={0.2} className="font-mono text-xs" /></button>)}<span className="ml-auto text-xs text-muted-foreground">{Math.max(0, contextBudget - known).toLocaleString()} left{unknown ? " · Unmeasured sources" : ""}</span></figcaption>
      </figure>{known > contextBudget && <p role="status" className="mt-2 text-xs text-destructive">Context exceeds budget. Exclude sources before running your assistant.</p>}
    </section>
    <div className="grid gap-3 sm:grid-cols-3">{kinds.map(kind => { const count = sources.filter(source => source.kind === kind).length; return <div key={kind} className="flex flex-col rounded-3xl border border-border p-4"><div className="mb-4 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-full bg-muted">{kind === "link" ? <Globe2 className="size-4" /> : kind === "note" ? <StickyNote className="size-4" /> : <FileText className="size-4" />}</span><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className={cn("size-1.5 rounded-full", kindColors[kind])} />{count} {count === 1 ? "source" : "sources"}</span></div><h3 className="text-xl font-medium">{kindLabels[kind]}</h3><div className="mt-2 flex items-end justify-between gap-3"><p className="text-xs leading-relaxed text-muted-foreground">{kind === "document" ? "Playbooks, briefs, and guidelines" : kind === "link" ? "Useful pages and trusted resources" : "Instructions in your own words"}</p><Button type="button" variant="outline" size="icon" aria-label={`Add ${kind}`} className="size-9 shrink-0 rounded-full" onClick={() => { ++fileGeneration.current; setDraft({ title: "", kind, content: "" }); setError(null); setView("create"); }}><Plus className="size-4" /></Button></div></div>; })}</div>
    <div><div className="flex flex-wrap items-center justify-between gap-4"><Tabs value={filter} onValueChange={value => setFilter(value as KnowledgeSourceKind | "all")} variant="underline" className="max-w-full overflow-x-auto pb-1"><TabsList className="gap-4 min-w-max">{(["all", ...kinds] as const).map(kind => <TabsTrigger key={kind} value={kind} className="px-1 text-xs" indicatorClassName="bg-primary">{kind === "all" ? "All sources" : kind === "link" ? "Links" : kindLabels[kind]}</TabsTrigger>)}</TabsList></Tabs><Input aria-label="Search knowledge sources" placeholder="Search sources…" value={query} onChange={setQuery} leftIcon={<Search className="size-4" />} className="w-full sm:w-64" /></div>
      <p className="mt-4 mb-3 text-xs text-muted-foreground">{filtered.length} sources</p>
      {error && !view && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}<p role="status" className="sr-only">{notice}</p>
    <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border">{filtered.map((source) => <motion.li layout={!reduce} transition={SPRING_LAYOUT} key={source.id} className="flex items-center gap-4 px-4 py-4 sm:px-5"><span className={cn("grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 motion-reduce:transition-none", source.enabled ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>{source.kind === "link" ? <Globe2 className="size-4.5" /> : source.kind === "note" ? <StickyNote className="size-4.5" /> : <FileText className="size-4.5" />}</span><button type="button" className="min-w-0 flex-1 cursor-pointer rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => { setSelectedId(source.id); setDraft({ title: source.title, kind: source.kind, content: source.content, url: source.url }); setError(null); setView("read"); }}><span className="flex min-h-6 min-w-0 items-center gap-2 text-sm font-medium"><span className="truncate"><KnowledgeSearchText text={source.title} query={query} /></span><ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" /></span><span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground"><KnowledgeSearchText text={(source.kind === "link" ? source.url : source.content) || "No extracted text supplied"} query={query} /></span><span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className={cn("rounded-full border px-2 py-0.5 font-medium", source.kind === "document" ? "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300" : source.kind === "link" ? "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{source.kind[0].toUpperCase() + source.kind.slice(1)}</span>{source.kind !== "link" && <span>{contextUnit === "tokens" && source.tokens === undefined ? "Tokens unknown" : `${measure(source).toLocaleString()} ${contextUnit}`}</span>}{source.status !== "ready" && <span className={source.status === "error" ? "text-destructive" : ""}>{source.status}</span>}</span></button><Switch ariaLabel={`Use ${source.title} in assistant context`} checked={source.enabled} disabled={pending.includes(source.id) || source.status !== "ready"} onCheckedChange={() => toggle(source)} className="shrink-0 [&_button]:h-6 [&_button]:w-10 [&_button>div]:size-4 [&_button>div>div]:size-4" /></motion.li>)}</ul>
    {!filtered.length && <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{sources.length ? "No sources match your search and type filter." : "No knowledge sources yet. Add a note, reference, or text document."}</p>}
    </div>
    <footer className="flex flex-wrap items-start justify-between gap-3 text-xs text-muted-foreground"><p className="max-w-lg leading-relaxed">Choose which sources your assistant can use. Only add information you’re comfortable sharing with your workspace.</p>{footer}</footer>
    <MorphingModal viewId={view} onClose={close} placement="center" className="max-h-[85dvh] max-w-2xl overflow-y-auto" ariaLabel={view === "create" ? "Add knowledge source" : view === "remove" ? "Remove knowledge source" : "Read knowledge source"}>
      <div className="space-y-4 p-2">
        {view === "create" && <><h3 className="text-lg font-medium">Add source</h3><p className="text-sm text-muted-foreground">Give your assistant useful context to work with.</p><div className="flex flex-wrap gap-1">{kinds.map((kind) => <Button key={kind} size="sm" className="rounded-full" variant={draft.kind === kind ? "secondary" : "ghost"} aria-pressed={draft.kind === kind} disabled={busy} onClick={() => { ++fileGeneration.current; setDraft({ title: "", kind, content: "" }); setError(null); }}>{kind === "document" ? "Document" : kind === "note" ? "Note" : "Link"}</Button>)}</div><Input label="Title" value={draft.title} disabled={busy} onChange={(title) => setDraft({ ...draft, title })} />{draft.kind === "link" && <><Input label="Source URL" type="url" value={draft.url ?? ""} disabled={busy} onChange={(url) => setDraft({ ...draft, url })} /><p className="text-xs text-muted-foreground">Links are saved as references. Page content is not fetched by this interface.</p></>}{draft.kind === "document" && <label className="block text-sm">Import a plain text or Markdown file<input aria-label="Import text document" className="mt-2 block w-full text-xs" type="file" accept=".txt,.md,text/plain,text/markdown" disabled={busy} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const generation = ++fileGeneration.current; try { const content = await file.text(); if (alive.current && generation === fileGeneration.current) setDraft((current) => ({ ...current, title: current.title || file.name, content })); } catch { if (alive.current && generation === fileGeneration.current) setError("Could not read this text file."); } }} /></label>}<label htmlFor={`${id}-source-content`} className="block text-sm">{draft.kind === "link" ? "Context for this link" : "Content"}</label><textarea id={`${id}-source-content`} className={textClass} disabled={busy} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} /></>}
        {view === "read" && selected && <><h3 className="text-lg font-medium">Source details</h3><p className="text-sm text-muted-foreground">Give your assistant useful context to work with.</p>{selected.error && <p role="alert" className="text-sm text-destructive">{selected.error}</p>}{onUpdate ? <><Input label="Title" value={draft.title} disabled={busy} onChange={title => setDraft({ ...draft, title })} />{draft.kind === "link" && <><Input label="Source URL" type="url" value={draft.url ?? ""} disabled={busy} onChange={url => setDraft({ ...draft, url })} /><p className="text-xs text-muted-foreground">Links are saved as references. Page content is not fetched by this interface.</p></>}<label htmlFor={`${id}-edit-content`} className="block text-sm">{draft.kind === "link" ? "Context for this link" : "Content"}</label><textarea id={`${id}-edit-content`} className={textClass} disabled={busy} value={draft.content} onChange={event => setDraft({ ...draft, content: event.target.value })} /></> : <><h4 className="text-base font-medium">{selected.title}</h4><p className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-7">{selected.content || "No extracted text has been provided by the host."}</p><Citations title="Source reference" defaultOpen citations={[{ id: selected.id, title: selected.title, url: selected.url, icon: <FileText /> }]} /></>}</>}
        {view === "remove" && selected && <><h3 className="text-lg font-semibold">Remove {selected.title}?</h3><p className="text-sm text-muted-foreground">This removes the source from this library and assistant context. The host controls whether the original document is deleted.</p></>}
        {view !== "create" && !selected && <p>This source is no longer available.</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center justify-end gap-2">{view === "read" && selected && <Button variant="ghost" disabled={busy || pending.includes(selected.id)} onClick={() => setView("remove")} className="mr-auto text-destructive"><Trash2 className="size-4" />Remove</Button>}<Button variant="ghost" disabled={busy} onClick={close}>{view === "read" ? "Close source" : "Cancel"}</Button>{view === "read" && onUpdate && <Button disabled={busy} onClick={saveSource}>{busy ? "Saving…" : "Save changes"}</Button>}{view === "create" && <Button disabled={busy} onClick={create}>{busy ? "Adding…" : "Add to library"}</Button>}{view === "remove" && selected && <Button disabled={busy} onClick={remove} className="bg-destructive text-destructive-foreground">{busy ? "Removing…" : "Confirm removal"}</Button>}</div>
      </div>
    </MorphingModal>
  </div></section>;
}
