"use client";

import { Bot, Check, ChevronDown, CircleAlert, Code2, CornerDownLeft, FileText, FlaskConical, GitPullRequest, GripVertical, Pause, Play, Plus, RotateCcw, Search, Send, Square, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { lifecycleActionClass, lifecycleInputClass, useLifecycleAction } from "./lifecycle-actions";

export type PlanStatus = "draft" | "running" | "paused" | "completed" | "cancelled" | "failed";
const toolColors: Record<string, string> = { Search: "bg-sky-500/10 text-sky-600", Read: "bg-emerald-500/10 text-emerald-600", Edit: "bg-amber-500/10 text-amber-600", Test: "bg-teal-500/10 text-teal-600", Ship: "bg-orange-500/10 text-orange-600" };
const toolIcons: Record<string, typeof Bot> = { Search, Read: FileText, Edit: Code2, Test: FlaskConical, Ship: GitPullRequest };
function ToolMark({ tool }: { tool: string }) { const Icon = toolIcons[tool]; return Icon ? <Icon aria-hidden="true" className="size-3 shrink-0" /> : null; }

export interface PlanStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "cancelled" | "failed";
  progress?: number;
  elapsedMs?: number;
  error?: string;
  activity?: AgentActivityItem[];
  tool?: string;
  estimatedMs?: number;
}
export interface AgentPlanProps {
  title?: string;
  steps: PlanStep[];
  status: PlanStatus;
  onStepsChange?: (steps: PlanStep[]) => void;
  onRun?: () => void | Promise<void>;
  onPause?: () => void | Promise<void>;
  onResume?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onRetry?: (stepId: string) => void | Promise<void>;
  onNote?: (note: string) => void | Promise<void>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Execution, activity and editable plan data remain host-owned. */
export function AgentPlanRunner({ title = "Execution plan", steps, status, onStepsChange, onRun, onPause, onResume, onCancel, onRetry, onNote, open, defaultOpen = true, onOpenChange, className }: AgentPlanProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(defaultOpen);
  const [renaming, setRenaming] = useState<string>();
  const renameInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (renaming) renameInput.current?.focus(); }, [renaming]);
  const [newTitle, setNewTitle] = useState("");
  const [note, setNote] = useState("");
  const [newId, setNewId] = useState(0);
  const action = useLifecycleAction();
  const isOpen = open ?? expanded;
  const editable = status === "draft" && !!onStepsChange;
  const completed = steps.filter((step) => step.status === "completed").length;
  const failed = steps.find((step) => step.status === "failed");
  const current = steps.find((step) => step.status === "running");
  const elapsed = steps.reduce((sum, step) => sum + (step.elapsedMs ?? 0), 0);
  const calls = steps.reduce((sum, step) => sum + (step.activity?.filter((item) => item.type === "tool").length ?? 0), 0);
  const busy = action.pending.has("plan");
  const changeOpen = () => { if (open === undefined) setExpanded(!isOpen); onOpenChange?.(!isOpen); };
  const move = (index: number, offset: number) => {
    if (index + offset < 0 || index + offset >= steps.length) return;
    const next = [...steps];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onStepsChange?.(next);
  };
  const execute = (fn: () => void | Promise<void>) => { void action.run("plan", fn); };
  const statusLabel = status === "failed" ? "Needs attention" : status.charAt(0).toUpperCase() + status.slice(1);
  return <section className={cn("mx-auto w-full max-w-md overflow-clip rounded-2xl border border-border bg-background text-foreground", className)} aria-label={title} data-status={status}>
    <header className="px-4 pt-3.5">
      <div className="flex items-center gap-2"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted"><Bot className="size-3 text-muted-foreground" /></span><p className="min-w-0 flex-1 truncate text-xs text-muted-foreground"><span className="font-medium text-foreground">Agent</span><span className="ml-1.5 font-mono">Execution plan</span></p><span className={cn("rounded-full bg-muted px-2 py-0.5 text-[10px]", status === "failed" && "bg-amber-500/10 text-amber-600", status === "running" && "text-primary")}>{statusLabel}</span><button type="button" aria-label={isOpen ? "Hide plan" : "Show plan"} aria-expanded={isOpen} aria-controls={`${id}-body`} onClick={changeOpen} className="rounded p-0.5 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronDown className={cn("size-3.5", !isOpen && "-rotate-90")} /></button></div>
      <h2 className="mt-2 text-sm font-medium leading-5">{title}</h2>
      <div aria-hidden="true" className="mt-3 flex gap-1">{steps.map((step) => <span key={step.id} className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"><motion.span initial={false} animate={{ scaleX: step.status === "completed" ? 1 : step.status === "running" ? (step.progress ?? 0) / 100 : 0 }} transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }} className="absolute inset-0 origin-left rounded-full bg-primary" /></span>)}</div>
    </header>
    <AgentDisclosure id={`${id}-body`} open={isOpen}>
      <div className="px-4 pb-3 pt-4">
        <ol>{steps.map((step, index) => <li key={step.id} className="group relative" data-status={step.status} onDragOver={(event) => { if (editable) event.preventDefault(); }} onDrop={(event) => { if (!editable) return; event.preventDefault(); const source = steps.findIndex((item) => item.id === event.dataTransfer.getData("text/plain")); if (source < 0 || source === index) return; const next = [...steps]; const [moved] = next.splice(source, 1); next.splice(index, 0, moved); onStepsChange?.(next); }}>
          {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[9px] top-7 w-px bg-border" />}
          <div className={cn("flex items-center gap-2.5", index === steps.length - 1 ? "min-h-[22px]" : "min-h-9")}>
            {editable ? <button type="button" draggable onDragStart={(event) => { event.dataTransfer.setData("text/plain", step.id); event.dataTransfer.effectAllowed = "move"; }} aria-label={`Reorder ${step.title}, drag or use arrow keys`} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); move(index, event.key === "ArrowUp" ? -1 : 1); } }} className="grid size-5 shrink-0 cursor-grab place-items-center rounded-full border border-border bg-background text-[10px] text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"><span className="group-hover:hidden">{index + 1}</span><GripVertical className="hidden size-3 group-hover:block" /></button> : <span className={cn("relative grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] tabular-nums text-muted-foreground", step.status === "completed" && "bg-foreground text-background", step.status === "running" && "bg-primary/10 text-primary", step.status === "failed" && "bg-amber-500/10 text-amber-600")}>{step.status === "completed" ? <Check className="size-3" /> : step.status === "failed" ? <CircleAlert className="size-3" /> : index + 1}</span>}
            <div className="min-w-0 flex-1">{editable && renaming === step.id ? <input ref={renameInput} aria-label={`Step ${index + 1} title`} className="w-full rounded border border-border bg-transparent px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" value={step.title} onBlur={() => setRenaming(undefined)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "Escape") setRenaming(undefined); }} onChange={(event) => onStepsChange?.(steps.map((item) => item.id === step.id ? { ...item, title: event.target.value } : item))} /> : editable ? <button type="button" className="block w-full truncate text-left text-sm focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Rename ${step.title}`} onClick={() => setRenaming(step.id)}>{step.title}</button> : <span className={cn("block truncate text-sm", step.status === "pending" && status !== "draft" && "text-muted-foreground")}>{step.title}</span>}</div>
            {editable ? <AnimatedDropdown ariaLabel={`Change tool for ${step.title}`} value={step.tool ?? "Task"} disabled={busy} onValueChange={(tool) => onStepsChange?.(steps.map((item) => item.id === step.id ? { ...item, tool } : item))} className="shrink-0" trigger={<><ToolMark tool={step.tool ?? "Task"} /><span className="truncate">{step.tool ?? "Task"}</span></>} triggerClassName={cn("h-5 gap-1 rounded-full border-border/50 bg-muted/70 px-1.5 py-0 text-xs font-normal text-muted-foreground [&>svg:last-child]:hidden", toolColors[step.tool ?? ""])} align="end" indicatorPosition="end" menuWidth={160} items={[...new Set(["Search", "Read", "Edit", "Test", "Ship", step.tool ?? "Task"])].map((tool) => ({ id: tool, kind: "option" as const, value: tool, textValue: tool, label: <span className={cn("inline-flex items-center gap-1 rounded-full bg-muted/70 px-1.5 py-0.5 text-xs text-muted-foreground", toolColors[tool])}><ToolMark tool={tool} />{tool}</span> }))} /> : <span className={cn("inline-flex h-5 items-center gap-1 rounded-full border border-border/50 bg-muted/70 px-1.5 text-xs text-muted-foreground", toolColors[step.tool ?? ""])}><ToolMark tool={step.tool ?? "Task"} />{step.tool ?? "Task"}</span>}
            <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">{step.elapsedMs !== undefined ? `${(step.elapsedMs / 1000).toFixed(1)}s` : step.estimatedMs ? `~${Math.round(step.estimatedMs / 1000)}s` : "—"}</span>
            {editable && <button type="button" className="rounded p-1 text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Remove ${step.title}`} onClick={() => onStepsChange?.(steps.filter((item) => item.id !== step.id))}><X className="size-3" /></button>}
          </div>
          <AnimatePresence initial={false}>{(step.status === "running" || step.status === "failed") && <motion.div key="activity" initial={{ opacity: 0, y: reduced ? 0 : -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: EASE_OUT }} className="ml-[30px] space-y-2 pb-3">{!!step.activity?.length && <AgentActivity items={step.activity} status={step.status === "running" ? "working" : "complete"} defaultOpen collapseOnComplete={false} className="text-[10px]" />}{step.error && <p className="text-[11px] text-destructive">{step.error}</p>}{step.status === "failed" && onRetry && <button type="button" className={lifecycleActionClass} disabled={busy} onClick={() => execute(() => onRetry(step.id))}><RotateCcw className="size-3" />Retry</button>}</motion.div>}</AnimatePresence>
        </li>)}</ol>
        {!steps.length && <p className="py-3 text-xs text-muted-foreground">No steps yet.</p>}
        {editable && <form className="mt-3 flex gap-1.5" onSubmit={(event) => { event.preventDefault(); if (!newTitle.trim()) return; onStepsChange?.([...steps, { id: `${id}-step-${newId}`, title: newTitle.trim(), status: "pending" }]); setNewId(newId + 1); setNewTitle(""); }}><div className="relative min-w-0 flex-1"><Plus aria-hidden="true" className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><input aria-label="New step" placeholder="Add a step…" className={cn(lifecycleInputClass, "h-9 w-full rounded-full pl-9 text-sm")} value={newTitle} onChange={(event) => setNewTitle(event.target.value)} /></div><button type="submit" aria-label="Add step" className={cn(lifecycleActionClass, "size-9 p-0")} disabled={!newTitle.trim()}><CornerDownLeft className="size-3.5" /></button></form>}
      </div>
      {onNote && (status === "running" || status === "paused" || status === "failed") && <form className="flex gap-2 px-4 pb-3" onSubmit={(event) => { event.preventDefault(); if (note.trim()) void action.run("note", async () => { await onNote(note.trim()); setNote(""); }); }}><input aria-label="Steer the plan" className={cn(lifecycleInputClass, "h-9 flex-1 text-xs")} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note to steer the plan…" /><button type="submit" aria-label="Queue note" className={lifecycleActionClass} disabled={!note.trim() || action.pending.has("note")}><Send className="size-3" /></button></form>}
    </AgentDisclosure>
    <footer className="flex min-h-12 items-center justify-between gap-3 border-t border-border px-4 py-2" aria-busy={busy}><span className="min-w-0 truncate text-xs text-muted-foreground">{status === "draft" ? `${steps.length} steps${steps.some((step) => step.estimatedMs) ? ` · ~${Math.round(steps.reduce((sum, step) => sum + (step.estimatedMs ?? 0), 0) / 1000)}s` : ""}` : failed ? `Step ${steps.indexOf(failed) + 1} failed` : current ? `Step ${steps.indexOf(current) + 1} of ${steps.length}` : `${completed}/${steps.length} complete`}{elapsed > 0 ? ` · ${(elapsed / 1000).toFixed(1)}s · ${calls} calls` : ""}</span><div className="flex shrink-0 items-center gap-1.5">
      {status === "draft" && onRun && <button type="button" className={cn(lifecycleActionClass, "border-transparent bg-primary text-primary-foreground hover:bg-primary/90")} disabled={busy || !steps.length || steps.some((step) => !step.title.trim())} onClick={() => execute(onRun)}><Play className="size-3" />Run plan</button>}
      {status === "running" && onPause && <button type="button" className={lifecycleActionClass} disabled={busy} onClick={() => execute(onPause)}><Pause className="size-3" />Pause</button>}
      {status === "paused" && onResume && <button type="button" className={lifecycleActionClass} disabled={busy} onClick={() => execute(onResume)}><Play className="size-3" />Resume</button>}
      {(status === "running" || status === "paused") && onCancel && <button type="button" aria-label="Cancel plan" className={lifecycleActionClass} disabled={busy} onClick={() => execute(onCancel)}><Square className="size-3" /></button>}
    </div></footer>
    {(action.errors.plan || action.errors.note) && <p role="alert" className="px-4 pb-3 text-xs text-destructive">{action.errors.plan || action.errors.note}</p>}
  </section>;
}

export function AgentPlanPill(props: AgentPlanProps) {
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? internalOpen;
  const reduce = useReducedMotion();
  const id = useId();
  const completed = props.steps.filter((step) => step.status === "completed").length;
  const current = props.steps.find((step) => step.status === "running" || step.status === "failed");
  const setOpen = (next: boolean) => { if (props.open === undefined) setInternalOpen(next); props.onOpenChange?.(next); };
  useEffect(() => { if (props.status === "failed") { if (props.open === undefined) setInternalOpen(true); props.onOpenChange?.(true); } }, [props.status, props.open, props.onOpenChange]);
  return <div className={cn("mx-auto w-full max-w-md", props.className)}>
    <motion.button type="button" aria-expanded={open} aria-controls={id} aria-label={`Show plan: ${props.title ?? "Agent plan"}`} onClick={() => setOpen(!open)} initial={false} animate={{ opacity: open ? 0.65 : 1 }} transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }} className="mx-auto flex h-10 max-w-full items-center gap-2.5 rounded-full border border-border bg-background px-3.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 -rotate-90 text-primary"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" opacity=".15" /><circle cx="12" cy="12" r="9" pathLength="1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${props.steps.length ? completed / props.steps.length : 0} 1`} /></svg>
      <AnimatePresence mode="wait" initial={false}><motion.span key={current?.id ?? props.status} initial={{ opacity: 0, y: reduce ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -5 }} transition={{ duration: 0.15, ease: EASE_OUT }} className="min-w-0 truncate">{current?.title ?? props.title ?? "Agent plan"}</motion.span></AnimatePresence><span className="shrink-0 font-mono text-[10px] text-muted-foreground">{completed}/{props.steps.length}</span><ChevronDown className={cn("size-3 text-muted-foreground", open && "rotate-180")} />
    </motion.button>
    <AgentDisclosure id={id} open={open}><AgentPlanRunner {...props} className="mt-3" open={open} onOpenChange={setOpen} /></AgentDisclosure>
  </div>;
}
