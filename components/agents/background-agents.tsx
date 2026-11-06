"use client";

import { ArrowUp, ArrowUpRight, Bot, Check, ChevronDown, RotateCcw, Send, Square, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { lifecycleActionClass, lifecycleInputClass, useLifecycleAction } from "./lifecycle-actions";

export interface BackgroundAgent {
  id: string;
  title: string;
  status: "queued" | "running" | "needs-input" | "review" | "completed" | "failed" | "cancelled";
  progress?: number;
  currentStep?: string;
  branch?: string;
  question?: string;
  error?: string;
  result?: string;
  /** The latest answer the user gave this agent. */
  answer?: string;
  diff?: string;
  /** Optional line counts shown on finished rows. */
  additions?: number;
  deletions?: number;
  pullRequestUrl?: string;
  activity?: AgentActivityItem[];
  answerOptions?: string[];
  steps?: string[];
  elapsedMs?: number;
}
export interface BackgroundAgentsProps {
  agents: BackgroundAgent[];
  onSubmit?: (task: string) => void | Promise<void>;
  onAnswer?: (id: string, answer: string) => void | Promise<void>;
  onCancel?: (id: string) => void | Promise<void>;
  onRetry?: (id: string) => void | Promise<void>;
  onOpen?: (id: string) => void | Promise<void>;
  className?: string;
}

function BackgroundAgentRow({ agent, onAnswer, onCancel, onRetry, onOpen }: Omit<BackgroundAgentsProps, "agents"> & { agent: BackgroundAgent }) {
  const [answer, setAnswer] = useState("");
  const [details, setDetails] = useState(agent.status === "needs-input");
  const id = useId();
  const action = useLifecycleAction();
  const busy = action.pending.has(agent.id);
  const needsYou = agent.status === "needs-input" || agent.status === "review";
  const progress = agent.status === "completed" ? 100 : Math.min(100, Math.max(0, agent.progress ?? 0));
  const reduced = useReducedMotion();
  const subtitle = agent.status === "failed" ? agent.error ?? agent.currentStep : agent.status === "completed" ? agent.branch ?? agent.currentStep : agent.question ?? agent.currentStep ?? agent.branch ?? agent.status;
  const doneSteps = agent.status === "completed" ? agent.steps?.length ?? 0 : Math.floor(progress / 100 * (agent.steps?.length ?? 0));
  return <li data-agent-id={agent.id} data-status={agent.status} className="group relative">
    <button type="button" aria-expanded={details} aria-controls={id} onClick={() => setDetails(!details)} className="flex h-14 w-full items-center gap-3 px-3 text-left outline-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
      <span className={cn("relative grid size-5 shrink-0 place-items-center text-primary", needsYou && "text-amber-500", agent.status === "completed" && "rounded-full bg-emerald-500 text-white", agent.status === "failed" && "rounded-full bg-rose-500 text-white", agent.status === "queued" && "text-muted-foreground")}>
        {!needsYou && agent.status !== "completed" && agent.status !== "failed" && <svg role="img" aria-label={`${progress}% complete`} viewBox="0 0 32 32" className="absolute inset-0 size-5 -rotate-90"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity=".15" /><circle cx="16" cy="16" r="12" pathLength="1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${progress / 100} 1`} /></svg>}
        {agent.status === "completed" && <Check className="size-3" strokeWidth={3} />}
        {agent.status === "failed" && <X className="size-3" strokeWidth={3} />}
        {needsYou && <span className="size-2.5 rounded-full bg-current" />}
      </span>
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-medium">{agent.title}</strong><span className="relative block h-4 overflow-hidden text-xs leading-4"><AnimatePresence initial={false}><motion.span key={subtitle} initial={{ y: reduced ? 0 : 16, opacity: reduced ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -16, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25, ease: EASE_OUT }} className={cn("absolute inset-x-0 top-0 truncate text-muted-foreground", needsYou && "text-amber-600 dark:text-amber-400", agent.status === "failed" && "text-rose-600 dark:text-rose-400", agent.status === "completed" && "font-mono")}>{subtitle}</motion.span></AnimatePresence></span></span>
      <span className={cn("shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground", needsYou && "font-sans text-amber-600 dark:text-amber-400", agent.status === "failed" && "font-sans text-rose-600 dark:text-rose-400")}>{needsYou ? "Needs you" : agent.status === "queued" ? "Queued" : agent.status === "failed" ? "Failed" : agent.status === "completed" && (agent.additions !== undefined || agent.deletions !== undefined) ? <><span className="text-emerald-600 dark:text-emerald-400">+{agent.additions ?? 0}</span> <span className="text-rose-600 dark:text-rose-400">−{agent.deletions ?? 0}</span></> : agent.elapsedMs !== undefined ? `${Math.floor(agent.elapsedMs / 60000)}:${String(Math.floor(agent.elapsedMs / 1000) % 60).padStart(2, "0")}` : agent.status === "completed" ? "Done" : `${Math.round(progress)}%`}</span><ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground", details && "rotate-180")} />
    </button>
    {needsYou && <div className="absolute right-3 top-2 flex gap-1 rounded-full bg-background opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">{onCancel && <button type="button" aria-label={`Cancel ${agent.title}`} className={lifecycleActionClass} disabled={busy} onClick={() => void action.run(agent.id, () => onCancel(agent.id))}><Square className="size-3" />Stop</button>}{onOpen && <button type="button" aria-label={`Open ${agent.title}`} className={lifecycleActionClass} disabled={busy} onClick={() => void action.run(agent.id, () => onOpen(agent.id))}>Open<ArrowUpRight className="size-3" /></button>}</div>}
    <AgentDisclosure open={details} id={id}><div className="space-y-3 pb-3 pl-11 pr-3 pt-0.5">
      {!!agent.steps?.length && <ol aria-label="Steps" className="space-y-1.5 text-xs text-muted-foreground">{agent.steps.map((step, index) => { const done = index < doneSteps; const current = index === doneSteps && agent.status !== "failed" && agent.status !== "cancelled"; return <li key={step} className="flex items-center gap-2"><span className={cn("grid size-3.5 shrink-0 place-items-center rounded-full border border-border", done && "border-foreground bg-foreground text-background", current && (needsYou ? "border-amber-500 bg-amber-500" : "border-primary"))}>{done && <Check className="size-2" strokeWidth={4} />}</span><span className={cn("truncate", (done || current) && "text-foreground")}>{step}</span></li>; })}</ol>}
      {agent.error && <p className="text-xs text-destructive">{agent.error}</p>}
      {agent.status === "needs-input" && onAnswer && (agent.answerOptions?.length ? <div className="flex flex-wrap gap-2">{agent.answerOptions.map((option, index) => <button key={option} type="button" className={cn(lifecycleActionClass, index === 0 && "border-transparent bg-primary text-primary-foreground hover:bg-primary/90")} disabled={busy} onClick={() => void action.run(agent.id, () => onAnswer(agent.id, option))}>{option}</button>)}</div> : <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); if (answer.trim()) void action.run(agent.id, async () => { await onAnswer(agent.id, answer.trim()); setAnswer(""); }); }}><input aria-label={`Answer ${agent.title}`} placeholder="Your answer…" value={answer} onChange={(event) => setAnswer(event.target.value)} className={cn(lifecycleInputClass, "flex-1 text-xs")} /><button type="submit" aria-label="Send answer" className={lifecycleActionClass} disabled={busy || !answer.trim()}><Send className="size-3" /></button></form>)}
      {agent.result && <p className="text-xs text-muted-foreground">{agent.result}</p>}{agent.diff && <pre className="max-h-56 overflow-auto rounded-lg bg-muted/60 p-3 font-mono text-[10px]">{agent.diff}</pre>}{agent.activity && <AgentActivity items={agent.activity} status={agent.status === "running" ? "working" : "complete"} defaultOpen collapseOnComplete={false} />}
      {agent.answer && <p className="text-xs text-muted-foreground">You said: <span className="text-foreground">{agent.answer}</span></p>}
      {!needsYou && <div className="flex flex-wrap gap-2" aria-busy={busy}>
        {(["running", "queued", "needs-input"] as string[]).includes(agent.status) && onCancel && <button type="button" className={lifecycleActionClass} disabled={busy} aria-label={`Cancel ${agent.title}`} onClick={() => void action.run(agent.id, () => onCancel(agent.id))}><Square className="size-3" />Stop</button>}
        {(agent.status === "failed" || agent.status === "cancelled") && onRetry && <button type="button" className={lifecycleActionClass} disabled={busy} aria-label={`Retry ${agent.title}`} onClick={() => void action.run(agent.id, () => onRetry(agent.id))}><RotateCcw className="size-3" />Retry</button>}
        {onOpen && (agent.status === "completed" || agent.status === "review") && <button type="button" className={lifecycleActionClass} disabled={busy} aria-label={`Open ${agent.title}`} onClick={() => void action.run(agent.id, () => onOpen(agent.id))}>Open<ArrowUpRight className="size-3" /></button>}
        {agent.pullRequestUrl && <a className={lifecycleActionClass} href={agent.pullRequestUrl}>View pull request<ArrowUpRight className="size-3" /></a>}
      </div>}
      {action.errors[agent.id] && <p role="alert" className="text-xs text-destructive">{action.errors[agent.id]}</p>}
    </div></AgentDisclosure>
  </li>;
}

/** Scheduling and task execution are supplied by the host, never inferred by the surface. */
export function BackgroundAgents({ agents, onSubmit, className, ...callbacks }: BackgroundAgentsProps) {
  const [task, setTask] = useState("");
  const action = useLifecycleAction();
  return <section aria-label="Background agents" className={cn("mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-1.5 text-foreground", className)}>
    <header className="flex h-14 items-center gap-2.5 px-3 pb-3 pt-2"><span className="grid size-7 shrink-0 place-items-center rounded-full"><Bot className="size-4 text-muted-foreground" /></span><div className="min-w-0"><h2 className="truncate text-sm font-medium">Background agents</h2><p className="truncate text-xs text-muted-foreground">{([["running", agents.filter((agent) => agent.status === "running").length], ["needs you", agents.filter((agent) => agent.status === "needs-input" || agent.status === "review").length], ["failed", agents.filter((agent) => agent.status === "failed").length], ["done", agents.filter((agent) => agent.status === "completed").length]] as const).filter(([, count]) => count > 0).map(([label, count]) => `${count} ${label}`).join(" · ") || "No tasks"}</p></div></header>
    {agents.length ? <ul className="max-h-[620px] divide-y divide-border overflow-y-auto rounded-2xl border border-border bg-background">{agents.map((agent) => <BackgroundAgentRow key={agent.id} agent={agent} {...callbacks} />)}</ul> : <p className="rounded-2xl border border-border bg-background p-8 text-center text-xs text-muted-foreground">No background tasks.</p>}
    {onSubmit && <form className="relative mt-1.5 flex h-10 items-center rounded-full border border-border bg-background" onSubmit={(event) => { event.preventDefault(); if (task.trim()) void action.run("submit", async () => { await onSubmit(task.trim()); setTask(""); }); }}><input className="h-full min-w-0 flex-1 rounded-full bg-transparent pl-4 pr-11 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring" aria-label="New background task" placeholder="Start a task in the background" value={task} onChange={(event) => setTask(event.target.value)} /><button type="submit" aria-label="Start" className="absolute right-1 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" disabled={!task.trim() || action.pending.has("submit")}><ArrowUp className="size-4" /></button></form>}
    {action.errors.submit && <p role="alert" className="px-3 py-2 text-xs text-destructive">{action.errors.submit}</p>}
  </section>;
}
