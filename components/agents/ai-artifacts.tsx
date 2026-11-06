"use client";

import { useId, useState } from "react";
import { Code2, Copy, Download, FileText, History, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CodeBlock } from "@/components/agents/code-block";
import type { AgentCodeLanguage } from "@/components/agents/agent-code";
import { Button } from "@/components/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { PresenceGate } from "@/lib/presence-gate";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ArtifactVersion { id: string; label: string; content: string; }
export interface AIArtifactProps {
  title: string;
  filename: string;
  versions: ArtifactVersion[];
  kind: "code" | "document";
  language?: AgentCodeLanguage;
  version?: string;
  defaultVersion?: string;
  onVersionChange?: (id: string) => void;
  /** Saving is host-owned; append the saved revision to versions after success. */
  onSave?: (content: string, baseVersion: string) => void | Promise<void>;
  onCopy?: (content: string) => void | Promise<void>;
  onClose?: () => void;
  className?: string;
}

/** Text-only Markdown: generated HTML and code are never evaluated. */
function DocumentContent({ content }: { content: string }) {
  const occurrences = new Map<string, number>();
  return <div className="space-y-3 text-sm leading-6">{content.split(/\n\n+/).map((paragraph) => {
    const occurrence = occurrences.get(paragraph) ?? 0;
    occurrences.set(paragraph, occurrence + 1);
    const key = JSON.stringify([paragraph, occurrence]);
    return paragraph.startsWith("# ") ? <h2 key={key} className="text-xl font-medium leading-tight tracking-tight">{paragraph.slice(2)}</h2> : paragraph.startsWith("## ") ? <h3 key={key} className="pt-3 text-base font-medium">{paragraph.slice(3)}</h3> : <p key={key} className="whitespace-pre-wrap text-muted-foreground">{paragraph}</p>;
  })}</div>;
}

export function AIArtifact({ title, filename, versions, kind, language = "typescript", version, defaultVersion, onVersionChange, onSave, onCopy, onClose, className }: AIArtifactProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [internalVersion, setVersion] = useState(defaultVersion);
  const current = versions.find(item => item.id === (version ?? internalVersion)) ?? versions.at(-1);
  const [edit, setEdit] = useState<{ base: string; text: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const content = edit && current && edit.base === current.id ? edit.text : current?.content ?? "";
  const dirty = Boolean(current && content !== current.content);
  const choose = (next: string) => { if (saving || dirty) return; if (version === undefined) setVersion(next); onVersionChange?.(next); setEdit(null); setEditing(false); setMessage(""); setError(""); };
  const copy = async () => {
    setError(""); setMessage("");
    try {
      if (onCopy) await onCopy(content);
      else { if (!navigator.clipboard) throw new Error("Clipboard unavailable. Select the text to copy it."); await navigator.clipboard.writeText(content); }
      setMessage("Copied current content");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Copy failed"); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([content], { type: kind === "document" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setMessage("Downloaded current content");
  };
  const save = async () => {
    if (!current || !onSave || saving) return;
    setSaving(true); setError(""); setMessage("");
    try { await onSave(content, current.id); setEdit(null); setMessage("Document saved"); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Save failed; your edits are preserved."); }
    finally { setSaving(false); }
  };
  return <section aria-label={kind === "code" ? "Code artifact" : "Document artifact"} onKeyDown={event => { if (event.key === "Escape" && history) { event.stopPropagation(); setHistory(false); } }} className={cn("w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-background text-foreground", className)}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted">{kind === "code" ? <Code2 className="size-4 text-muted-foreground" /> : <FileText className="size-4 text-muted-foreground" />}</span><div className="min-w-0"><h2 className="truncate text-sm font-medium">{kind === "code" ? filename : title}</h2><p className="mt-1 text-xs text-muted-foreground">{kind === "code" ? title : "Markdown document"}</p></div></div>
      <div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label={`Copy ${kind}`} title={`Copy ${kind}`} disabled={!current} onClick={copy}><Copy className="size-4" /></Button><Button variant="ghost" size="icon" aria-label={`Download ${kind}`} title={`Download ${kind}`} disabled={!current} onClick={download}><Download className="size-4" /></Button>{kind === "document" ? <Button variant="ghost" size="icon" aria-label="Version history" title="Version history" aria-expanded={history} aria-controls={`${id}-history`} onClick={() => setHistory(value => !value)}><History className="size-4" /></Button> : <Button variant="ghost" size="icon" aria-label="Close artifact" disabled={!onClose} onClick={onClose}><X className="size-4" /></Button>}</div>
    </header>
    {kind === "document" && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-1.5"><Tabs value={editing ? "edit" : "preview"} onValueChange={mode => setEditing(mode === "edit")}><TabsList><TabsTrigger value="preview" disabled={saving} indicatorClassName="bg-background shadow-sm" className="w-20 text-xs [&_[data-tabs-label]]:text-foreground">Preview</TabsTrigger>{onSave && <TabsTrigger value="edit" disabled={!current || saving} indicatorClassName="bg-background shadow-sm" className="w-20 text-xs [&_[data-tabs-label]]:text-foreground">Edit</TabsTrigger>}</TabsList></Tabs><span className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : current?.label}</span></div>}
    <div className="relative isolate">
      {!current ? <p className="p-6 text-sm text-muted-foreground">No artifact versions available.</p> : kind === "code" ? <CodeBlock code={current.content} language={language} copyable={false} showLineNumbers className="rounded-2xl border-0 bg-transparent" /> : <div className="h-80 overflow-auto overscroll-contain px-5 py-5 sm:px-6">{editing ? <textarea aria-label="Document content" value={content} disabled={saving} onChange={event => setEdit({ base: current.id, text: event.target.value })} className="h-full min-h-64 w-full resize-none rounded-lg bg-transparent p-2 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring" /> : <DocumentContent content={content} />}</div>}
      <AnimatePresence initial={false}>{history && <PresenceGate>{({ gate }) => <motion.section {...gate} id={`${id}-history`} aria-label="Version history" initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : 20 }} transition={{ duration: 0.18, ease: EASE_OUT }} className="absolute inset-y-0 right-0 z-10 w-full max-w-xs overflow-y-auto border-l border-border bg-background p-5"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-sm font-medium">Version history</h3><Button variant="ghost" size="icon" aria-label="Close version history" onClick={() => setHistory(false)}><X className="size-4" /></Button></div><p className="mb-4 text-xs leading-5 text-muted-foreground">{dirty ? "Save or discard edits before switching versions." : "Open an earlier draft to review or continue from it."}</p><div className="space-y-2">{versions.toReversed().map((item, index) => <button key={item.id} type="button" disabled={saving || dirty} aria-pressed={current?.id === item.id} onClick={() => choose(item.id)} className={cn("w-full rounded-xl border border-border p-3 text-left text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", current?.id === item.id && "bg-muted/50")}><span className="block font-medium">{item.label}</span><span className="mt-1 block text-xs text-muted-foreground">{index === versions.length - 1 ? "First draft" : "Saved revision"}</span></button>)}</div></motion.section>}</PresenceGate>}</AnimatePresence>
    </div>
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-xs text-muted-foreground"><span>{kind === "code" ? `${content.split("\n").length} lines` : `${content.trim().split(/\s+/).filter(Boolean).length} words`}</span>{kind === "document" && dirty && onSave ? <div className="flex items-center gap-2"><Button variant="ghost" size="sm" disabled={saving} onClick={() => setEdit(null)} className="h-7 rounded-full text-xs"><RotateCcw className="size-3" />Discard</Button><Button size="sm" disabled={saving} onClick={save} className="h-7 rounded-full text-xs">{saving ? "Saving…" : "Save version"}</Button></div> : <span>{kind === "code" ? current?.label : editing ? "Editing Markdown" : "All changes saved"}</span>}<span role="status" className="sr-only">{message}</span>{error && <p role="alert" className="w-full text-destructive">{error}</p>}</footer>
  </section>;
}
