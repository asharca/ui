"use client";

import { Layers, LockKeyhole, Minimize2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { lifecycleActionClass, useLifecycleAction } from "./lifecycle-actions";

export interface ContextSource { id: string; label: string; tokens: number; removable?: boolean; }
export interface ContextCategory { id: string; label: string; tokens: number; color?: string; sources?: ContextSource[]; detail?: string; }
export interface ContextMeterProps {
  capacity: number;
  categories: ContextCategory[];
  warningThreshold?: number;
  /** Auto-compaction is opt-in and triggers once per below-to-above crossing. */
  autoCompact?: boolean;
  compactThreshold?: number;
  onAutoCompactChange?: (enabled: boolean) => void;
  onCompact?: () => void | Promise<void>;
  onRemoveSource?: (categoryId: string, sourceId: string) => void | Promise<void>;
  onClearCategory?: (categoryId: string) => void | Promise<void>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  model?: string;
  className?: string;
}
const palette = ["bg-slate-400", "bg-sky-500", "bg-emerald-500", "bg-violet-500", "bg-amber-400"];
const tokens = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
const compactTokens = (value: number) => value >= 1000 ? `${(value / 1000).toFixed(value >= 100000 ? 0 : 1).replace(/\.0$/, "")}k` : value.toLocaleString();

export function ContextMeter({ capacity, categories, warningThreshold = 0.7, autoCompact = false, compactThreshold = 0.85, onAutoCompactChange, onCompact, onRemoveSource, onClearCategory, open, defaultOpen = true, onOpenChange, model, className }: ContextMeterProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [selected, setSelected] = useState<string>();
  const isOpen = open ?? internalOpen;
  const reduced = useReducedMotion();
  const id = useId();
  const action = useLifecycleAction();
  const total = categories.reduce((sum, category) => sum + tokens(category.tokens), 0);
  const limit = tokens(capacity);
  const ratio = limit ? total / limit : total ? Infinity : 0;
  const threshold = Math.max(0, Math.min(1, compactThreshold));
  const warning = Math.max(0, Math.min(1, warningThreshold));
  const crossed = useRef(false);
  useEffect(() => {
    const above = limit > 0 && ratio >= threshold;
    if (!above) crossed.current = false;
    if (autoCompact && onCompact && above && !crossed.current) { crossed.current = true; void action.run("compact", onCompact); }
  }, [ratio, limit, threshold, autoCompact, onCompact, action.run]);
  const state = total > limit ? "over-limit" : ratio >= warning ? "warning" : "available";
  return <section aria-label="Context window" data-state={state} className={cn("mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-1.5 text-sm text-foreground", className)}>
    <header className="flex items-center gap-2.5 px-3 pb-3 pt-2"><Layers className="mx-1.5 size-4 shrink-0 text-muted-foreground" /><button type="button" className="min-w-0 flex-1 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-expanded={isOpen} aria-controls={id} onClick={() => { if (open === undefined) setInternalOpen(!isOpen); onOpenChange?.(!isOpen); }}><h2 className="text-sm font-medium">Context window</h2>{model && <span className="block text-xs text-muted-foreground">{model}</span>}</button><span className={cn("pr-1 text-xl font-medium tabular-nums", state === "over-limit" && "text-destructive", state === "warning" && "text-amber-600")}>{limit ? <NumberTicker value={Math.round(ratio * 100)} suffix="%" duration={0.4} /> : "—"}</span></header>
    <div className="overflow-clip rounded-2xl border border-border bg-background">
      <div className="space-y-3 px-4 pt-3.5 pb-4"><div className="flex items-center justify-between gap-3"><span><strong className="font-mono text-sm font-medium"><NumberTicker value={total} format={compactTokens} duration={0.4} /></strong><span className="ml-1 text-xs text-muted-foreground">of {compactTokens(limit)} tokens</span></span><span className="font-mono text-xs text-muted-foreground">{compactTokens(Math.max(0, limit - total))} left</span></div>
        <meter aria-label="Context tokens" min={0} max={Math.max(1, limit)} value={Math.min(total, Math.max(1, limit))} aria-valuetext={`${total.toLocaleString()} tokens used of ${limit.toLocaleString()} capacity${total > limit ? ", over limit" : ""}`} className="sr-only" />
        <div className="relative flex h-2.5 gap-1 rounded-full bg-muted/40">{categories.map((category, index) => <motion.button key={category.id} type="button" aria-label={`${category.label}: ${tokens(category.tokens).toLocaleString()} tokens`} aria-pressed={selected === category.id} onClick={() => { setSelected(selected === category.id ? undefined : category.id); if (open === undefined) setInternalOpen(true); onOpenChange?.(true); }} initial={false} animate={{ width: `${limit ? Math.min(100, tokens(category.tokens) / limit * 100) : 0}%`, opacity: selected && selected !== category.id ? 0.3 : 1 }} transition={{ duration: reduced ? 0 : 0.25, ease: EASE_OUT }} className={cn("min-w-0 shrink rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", category.color ?? palette[index % palette.length])} />)}<span aria-hidden="true" className="pointer-events-none absolute -inset-y-1.5 w-px bg-muted-foreground/60" style={{ left: `${threshold * 100}%` }} /></div>
      </div>
      {state !== "available" && <p role="status" className={cn("border-t border-border px-4 py-2 text-[11px]", state === "over-limit" ? "text-destructive" : "text-amber-600")}>{state === "over-limit" ? `${(total - limit).toLocaleString()} tokens over capacity. Free context before continuing.` : "Context is filling up. Consider compacting the conversation."}</p>}
      <AgentDisclosure open={isOpen} id={id}><ul className="border-t border-border py-1">{!categories.length && <li className="p-4 text-xs text-muted-foreground">No context sources.</li>}{categories.map((category, index) => <li key={category.id} className={cn("px-4", selected && selected !== category.id && "opacity-40")}>
        <div className="flex min-h-11 items-center gap-3"><span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", category.color ?? palette[index % palette.length])} /><button type="button" onClick={() => setSelected(selected === category.id ? undefined : category.id)} aria-expanded={selected === category.id} className="min-w-0 flex-1 truncate rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="text-sm">{category.label}</span>{category.detail && <span className="ml-2 text-xs text-muted-foreground">{category.detail}</span>}</button><span className="font-mono text-xs tabular-nums text-muted-foreground">{compactTokens(tokens(category.tokens))}</span><span className="flex w-24 shrink-0 justify-end">{category.id === "conversation" && onCompact ? <button type="button" className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" disabled={action.pending.has("compact")} onClick={() => void action.run("compact", onCompact)}>Compact</button> : onClearCategory && category.id !== "system" && category.id !== "tools" ? <button type="button" className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40" disabled={!category.tokens || action.pending.has(category.id)} onClick={() => void action.run(category.id, () => onClearCategory(category.id))}>{category.id === "files" ? "Unpin" : "Clear"}</button> : <span className="flex items-center gap-1 text-xs text-muted-foreground"><LockKeyhole className="size-3" />Pinned</span>}</span></div>
        <AgentDisclosure open={selected === category.id}>{!!category.sources?.length ? <ul className="space-y-2 border-l border-border pb-3 pl-5 text-[11px] text-muted-foreground">{category.sources.map((source) => <li key={source.id} className="flex items-center gap-2"><span className="min-w-0 flex-1 break-words">{source.label}</span><span className="font-mono">{compactTokens(tokens(source.tokens))}</span>{source.removable && onRemoveSource && <button type="button" className="rounded p-1 focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Unpin ${source.label}`} disabled={action.pending.has(`${category.id}/${source.id}`)} onClick={() => void action.run(`${category.id}/${source.id}`, () => onRemoveSource(category.id, source.id))}><X className="size-3" /></button>}</li>)}</ul> : <p className="pb-3 pl-5 text-[11px] text-muted-foreground">{tokens(category.tokens).toLocaleString()} tokens · {limit ? (tokens(category.tokens) / limit * 100).toFixed(1) : "0.0"}% of capacity</p>}</AgentDisclosure>
      </li>)}</ul></AgentDisclosure>
      <footer className="flex min-h-12 items-center justify-between gap-2 border-t border-border px-4 py-2">{onAutoCompactChange ? <button type="button" aria-label="Automatic context compaction" aria-pressed={autoCompact} onClick={() => onAutoCompactChange(!autoCompact)} className="min-w-0 truncate rounded text-left text-xs text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">{autoCompact ? "Auto-compacts" : "Auto-compact off"} at {Math.round(threshold * 100)}%</button> : <span className="text-xs text-muted-foreground">{autoCompact ? "Auto-compacts" : "Compact threshold"} at {Math.round(threshold * 100)}%</span>}{onCompact && <button type="button" className={lifecycleActionClass} disabled={action.pending.has("compact") || total === 0} onClick={() => void action.run("compact", onCompact)}><Minimize2 className="size-3" />{action.pending.has("compact") ? "Compacting…" : "Compact now"}</button>}</footer>
    </div>
    {Object.entries(action.errors).filter(([, error]) => error).map(([key, error]) => <p key={key} role="alert" className="px-3 pt-2 text-xs text-destructive">{error}</p>)}
  </section>;
}
