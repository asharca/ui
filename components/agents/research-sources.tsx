"use client";

import { type ReactNode, useId, useState } from "react";
import { BookOpen, Check, ArrowUpRight, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { SPRING_LAYOUT, SPRING_SWAP } from "@/lib/ease";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface ResearchSource { id: string; title: string; url: string; summary: string; type: string; excerpt?: string; publisher?: string; category?: string; }
export interface ResearchSourcesProps {
  sources: ResearchSource[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  title?: string;
  description?: string;
  className?: string;
}
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts: ReactNode[] = [];
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(offset, match.index));
    parts.push(<mark key={`match-${match.index}`} className="rounded bg-primary/15 text-foreground">{match[0]}</mark>);
    offset = match.index + match[0].length;
  }
  parts.push(text.slice(offset));
  return <>{parts}</>;
}
export function ResearchSources({ sources, selected, defaultSelected = [], onSelectedChange, query, onQueryChange, title = "Building accessible interfaces", description = "Pick the references your assistant should read before it answers.", className }: ResearchSourcesProps) {
  const id = useId();
  const reduce = useReducedMotion(); const hover = useHoverCapable();
  const [internalSelected, setSelected] = useState(defaultSelected);
  const [internalQuery, setQuery] = useState("");
  const [type, setType] = useState("");
  const currentQuery = query ?? internalQuery;
  const chosen = (selected ?? internalSelected).filter(sourceId => sources.some(source => source.id === sourceId));
  const types = Array.from(new Set(sources.map(source => source.type)));
  const words = currentQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const visible = sources.filter(source => (!type || source.type === type) && words.every(word => `${source.title} ${source.summary} ${source.excerpt ?? ""}`.toLowerCase().includes(word)));
  const choose = (next: string[]) => { if (selected === undefined) setSelected(next); onSelectedChange?.(next); };
  return <section aria-label="Research sources" className={cn("w-full rounded-3xl border border-border bg-background p-5 text-foreground sm:p-6", className)}>
    <header className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="mb-1 text-xs text-muted-foreground">Sources &amp; references</p><h2 className="text-xl font-medium">{title}</h2><p className="mt-1.5 text-sm text-muted-foreground">{description}</p></div><span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted"><BookOpen className="size-4" /></span></header>
    <label className="relative my-5 block" htmlFor={`${id}-search`}><Search aria-hidden className="pointer-events-none absolute top-3 left-3.5 size-4 text-muted-foreground" /><input id={`${id}-search`} type="search" aria-label="Search sources" value={currentQuery} onChange={event => { if (query === undefined) setQuery(event.target.value); onQueryChange?.(event.target.value); }} placeholder="Search your sources…" className="h-10 w-full rounded-full border border-border bg-transparent pr-3.5 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring" /></label>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><Tabs value={type} onValueChange={setType}><TabsList aria-label="Source type" className="bg-muted">{["", ...types].map(value => <TabsTrigger key={value} value={value} className="px-3.5 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground" indicatorClassName="bg-background shadow-sm">{value || "All"}</TabsTrigger>)}</TabsList></Tabs><span className="text-xs text-muted-foreground">{visible.length} of {sources.length}</span></div>
    <ul className="space-y-2">{visible.map(source => <motion.li key={source.id} layout={!reduce} initial={false} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} whileHover={hover && !reduce ? { y: -1 } : undefined} className={cn("relative flex gap-4 rounded-2xl border bg-background p-4 transition-colors duration-200 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring", chosen.includes(source.id) ? "border-foreground/30" : "border-border")}>
      <button type="button" aria-label={`${chosen.includes(source.id) ? "Remove" : "Add"} ${source.title} ${chosen.includes(source.id) ? "from" : "to"} context`} aria-pressed={chosen.includes(source.id)} onClick={() => choose(chosen.includes(source.id) ? chosen.filter(value => value !== source.id) : [...chosen, source.id])} className="absolute inset-0 size-full cursor-pointer rounded-2xl outline-none" />
      <span aria-hidden="true" className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border", chosen.includes(source.id) ? "border-foreground bg-foreground text-background" : "border-border")}>{chosen.includes(source.id) && <Check className="size-3.5" />}</span>
      <div className="pointer-events-none min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className={cn("rounded-full border px-2 py-0.5 font-medium", source.type === "Guide" ? "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300" : source.type === "Specification" ? "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{source.type}</span>{source.publisher && <span>{source.publisher}</span>}{source.category && <><span aria-hidden>·</span><span>{source.category}</span></>}</div><h3 className="mt-2 inline-flex min-w-0 max-w-full text-sm font-medium">{/^https?:\/\//i.test(source.url) ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative inline-flex max-w-full items-center gap-1.5 rounded-full outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate"><Highlight text={source.title} query={currentQuery} /></span><ArrowUpRight className="size-3 shrink-0 text-muted-foreground" /></a> : <Highlight text={source.title} query={currentQuery} />}</h3><p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground"><Highlight text={source.summary} query={currentQuery} /></p>{source.excerpt && <details className="pointer-events-auto relative mt-3 rounded-lg bg-muted/40 p-2 text-xs"><summary className="cursor-pointer font-medium">Read excerpt</summary><p className="mt-2 whitespace-pre-wrap leading-6 text-muted-foreground"><Highlight text={source.excerpt} query={currentQuery} /></p></details>}</div>
    </motion.li>)}</ul>{!visible.length && <p role="status" className="py-10 text-center text-sm text-muted-foreground">{sources.length ? "No sources match these filters." : "No sources supplied."}</p>}
    <footer className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4"><span className="shrink-0 text-xs text-muted-foreground"><motion.span key={chosen.length} initial={reduce ? false : { y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING_SWAP} className="inline-block tabular-nums" aria-live="polite">{chosen.length}</motion.span> <span className="text-muted-foreground">sources in context</span></span><div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{sources.filter(source => chosen.includes(source.id)).map(source => <span key={source.id} className="inline-flex max-w-48 items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs"><span className="truncate">{source.title}</span><button type="button" onClick={() => choose(chosen.filter(value => value !== source.id))} aria-label={`Remove ${source.title} from context`} className="grid size-5 shrink-0 place-items-center rounded-full outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"><X className="size-3" /></button></span>)}</div>{chosen.length > 0 && <Button variant="ghost" className="ml-auto h-9 rounded-full" onClick={() => choose([])}>Clear</Button>}</footer>
  </section>;
}
