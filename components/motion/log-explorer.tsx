"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, Pause, Play, Search } from "lucide-react";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/agents/code-block";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  payload?: unknown;
  context?: string;
}
export interface LogExplorerProps {
  /** Append-only host stream. A paused view holds the entries visible at pause time. */
  entries: readonly ExecutionLog[];
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  service?: string;
  environment?: string;
  headerActions?: ReactNode;
  className?: string;
}
const levels = ["all", "debug", "info", "warn", "error"] as const;

export function LogExplorer({ entries, paused, defaultPaused = false, onPausedChange, service, environment, headerActions, className }: LogExplorerProps) {
  const [internalPaused, setInternalPaused] = useState(defaultPaused);
  const frozen = paused ?? internalPaused;
  const [snapshot, setSnapshot] = useState<readonly ExecutionLog[]>(() => [...entries]);
  const wasPaused = useRef(frozen);
  const latestLive = useRef(entries);
  // Capture the last committed live feed on an externally controlled pause too.
  if (frozen && !wasPaused.current) setSnapshot([...latestLive.current]);
  wasPaused.current = frozen;
  if (!frozen) latestLive.current = entries;
  const source = frozen ? snapshot : entries;
  const [level, setLevel] = useState<(typeof levels)[number]>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [following, setFollowing] = useState(true);
  const [scrollable, setScrollable] = useState(false);
  const viewport = useRef<HTMLElement>(null);
  const atTail = useRef(true);
  const pendingScroll = useRef<number | null>(null);
  const visible = source.filter((entry) => (level === "all" || entry.level === level) && `${entry.message} ${entry.id}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const measure = () => setScrollable(node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    const list = node.querySelector("ol");
    if (list) observer.observe(list);
    return () => observer.disconnect();
  }, []);
  // Reconcile after every committed layout change, including filtering and payload expansion.
  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node) return;
    if (pendingScroll.current !== null) {
      node.scrollTop = pendingScroll.current;
      pendingScroll.current = null;
      atTail.current = node.scrollHeight - node.clientHeight - node.scrollTop <= 16;
      setFollowing(atTail.current);
    }
    else if (atTail.current && !frozen) node.scrollTop = node.scrollHeight;
  });
  return <section aria-label="Execution logs" className={cn("mx-auto flex h-144 w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-muted text-foreground", className)}>
    <header className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-4 sm:px-6"><h2 className="text-xl font-medium tracking-tight">Execution logs</h2>{service && <span className="rounded-full border border-border px-2 py-1 font-mono text-xs text-muted-foreground">{service}{environment && ` · ${environment}`}</span>}<div className="ml-auto flex items-center gap-2">{headerActions}<span role="img" aria-label={frozen ? "Paused" : "Live"} className={cn("size-2 rounded-full", frozen ? "bg-muted-foreground" : "bg-emerald-500")}/><Button size="sm" className="h-9 rounded-full px-4 text-xs" aria-label={frozen ? "Resume logs" : "Pause logs"} aria-pressed={frozen} onClick={() => { if (!frozen) setSnapshot([...entries]); setInternalPaused(!frozen); onPausedChange?.(!frozen); }}>{frozen ? <Play className="size-3.5"/> : <Pause className="size-3.5"/>}{frozen ? "Resume" : "Pause"}</Button></div></header>
    <div className="mx-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background sm:mx-4"><div className="flex shrink-0 flex-wrap items-center gap-3 px-3 py-3 sm:px-5"><fieldset aria-label="Severity" className="m-0 flex min-w-0 gap-0.5 rounded-full border-0 bg-muted p-0.5">{levels.filter(item => item !== "debug" || source.some(entry => entry.level === "debug")).map(item => <button type="button" key={item} className={cn("h-8 cursor-pointer whitespace-nowrap rounded-full px-2 text-xs font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3.5", item === level ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")} aria-pressed={item === level} onClick={() => setLevel(item)}>{item} <span className="ml-1 tabular-nums">{item === "all" ? source.length : source.filter(entry => entry.level === item).length}</span></button>)}</fieldset><label className="relative ml-auto min-w-36 flex-1 sm:max-w-56"><Search aria-hidden className="absolute top-3 left-3 size-4 text-muted-foreground"/><input aria-label="Search logs" className="h-10 w-full rounded-full border border-border bg-background pr-3 pl-10 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Search logs…" value={query} onChange={event => setQuery(event.target.value)}/></label></div>
    <section ref={viewport} aria-label="Log entries" tabIndex={scrollable ? 0 : -1} className="min-h-0 flex-1 overflow-auto overscroll-contain px-2 py-3 font-mono text-xs [overflow-anchor:none] [mask-image:linear-gradient(to_bottom,transparent,black_24px)] focus-visible:ring-2 focus-visible:ring-ring sm:px-4" onScroll={event => { const node = event.currentTarget; atTail.current = node.scrollHeight - node.clientHeight - node.scrollTop <= 16; setFollowing(atTail.current); }}>
      {!visible.length && <p role="status" className="p-8 text-center text-muted-foreground">No matching log entries.</p>}
      <ol>{visible.map(entry => <li key={entry.id}><button type="button" aria-label={`Inspect: ${entry.message}`} aria-expanded={expanded.has(entry.id)} className="grid min-h-9 w-full cursor-pointer grid-cols-[auto_1fr_auto] items-baseline gap-x-3 gap-y-1 rounded-xl px-1 py-2 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring sm:grid-cols-[5.25rem_3rem_minmax(0,1fr)_auto]" onClick={() => { pendingScroll.current = viewport.current?.scrollTop ?? 0; setExpanded(current => { const next = new Set(current); if (next.has(entry.id)) next.delete(entry.id); else next.add(entry.id); return next; }); }}><time dateTime={entry.timestamp} className="text-muted-foreground">{entry.timestamp.includes("T") ? entry.timestamp.slice(11,19) : entry.timestamp}</time><span className={cn("w-fit rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",entry.level === "error" ? "bg-destructive/10 text-destructive" : entry.level === "warn" ? "bg-amber-500/10 text-amber-600 dark:text-amber-300" : entry.level === "info" ? "bg-sky-500/10 text-sky-600 dark:text-sky-300" : "bg-muted text-muted-foreground")}>{entry.level}</span><span className="col-span-2 min-w-0 break-words sm:col-span-1">{entry.message}{entry.context && <span className="text-muted-foreground"> · {entry.context}</span>}</span><ChevronRight aria-hidden className={cn("col-start-3 row-start-1 size-3.5 self-center text-muted-foreground transition-transform motion-reduce:transition-none sm:col-start-4", expanded.has(entry.id) && "rotate-90")}/></button>{expanded.has(entry.id) && <div className="mx-3 mb-3 overflow-auto rounded-xl border border-border bg-muted/30 p-3"><CodeBlock code={JSON.stringify(entry.payload ?? {}, null, 2)} language="json"/></div>}</li>)}</ol>
    </section></div><footer className="flex shrink-0 items-center justify-between gap-2 px-6 py-3 font-mono text-xs text-muted-foreground"><span>{frozen ? "Paused" : "● Live"} · {visible.length} of {source.length} entries{frozen && entries.length > snapshot.length ? ` · ${entries.length - snapshot.length} held` : ""}</span><button type="button" className="cursor-pointer hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { atTail.current = true; setFollowing(true); if (viewport.current) { viewport.current.scrollTop = viewport.current.scrollHeight; viewport.current.focus({ preventScroll: true }); } }}>{following ? "Following latest" : "Jump to latest"}</button></footer>
  </section>;
}
