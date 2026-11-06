"use client";

import { ArrowUp, Bot, Check, FilePen, Mail, Play, RotateCcw, SquareTerminal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { ToolApprovalParameter } from "@/components/agents/tool-approval";
import { ActionSwapText } from "@/components/motion/action-swap";
import { Button } from "@/components/motion/button/base";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";
import { useLifecycleAction, type LifecycleActionController } from "./lifecycle-actions";

export interface QueuedToolRequest {
  id: string;
  tool: string;
  target: string;
  risk: "low" | "medium" | "high";
  /** A rule key must describe the exact capability/target scope the host grants. */
  rule: string;
  ruleDescription: string;
  /** Only expose standing approval when the host supports this exact capability. */
  allowAlways?: boolean;
  icon?: ReactNode;
  preview: string;
  kind: "command" | "diff" | "message";
  parameters?: ToolApprovalParameter[];
  reason?: string;
}
export interface ToolApprovalDecision {
  requestId: string;
  decision: "once" | "always" | "deny";
  note: string;
  rule: string;
  /** Always includes every currently queued request matching the exact rule. */
  requestIds: string[];
}
export interface ResolvedToolRequest extends QueuedToolRequest {
  decision: ToolApprovalDecision["decision"] | "rule";
  note?: string;
}
export interface ToolApprovalQueueProps {
  requests: QueuedToolRequest[];
  /** Host-persisted outcomes, newest first. Rejected decisions must not appear here. */
  resolved?: ResolvedToolRequest[];
  /** Resolve only once the host has persisted the decision and updated its queue. */
  onDecision: (decision: ToolApprovalDecision) => void | Promise<void>;
  title?: string;
  emptyDescription?: ReactNode;
  /** Optional host action, such as restarting a local demonstration. */
  onReplay?: () => void;
  className?: string;
}

export function ToolApprovalQueue({ requests, resolved = [], onDecision, title, emptyDescription = "No requests are waiting for your decision.", onReplay, className }: ToolApprovalQueueProps) {
  const action = useLifecycleAction();
  const reduced = useReducedMotion();
  const request = requests[0];
  const denied = resolved.reduce((count, item) => count + Number(item.decision === "deny"), 0);
  const allowedByRule = resolved.reduce((count, item) => count + Number(item.decision === "rule"), 0);
  const approved = resolved.length - denied - allowedByRule;
  return (
    <motion.section layout={!reduced} transition={SPRING_LAYOUT} aria-label="Tool approval queue" className={cn("mx-auto w-full max-w-md overflow-clip rounded-3xl border border-border bg-card p-1.5 pb-1 text-foreground", className)}>
      <motion.header layout={reduced ? false : "position"} className="flex items-center gap-2.5 px-3 pb-3 pt-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted"><Bot className="size-3.5 text-muted-foreground" /></span>
        <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-medium">Needs your approval</h2>{title && <p className="truncate text-xs text-muted-foreground">{title}</p>}</div>
        <span className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs", requests.length ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300")}>
          <span className="relative size-1.5 rounded-full bg-current">{requests.length > 0 && !reduced && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />}</span>
          <ActionSwapText value={String(requests.length)}><span className="tabular-nums">{requests.length ? `${requests.length} waiting` : "All clear"}</span></ActionSwapText>
        </span>
      </motion.header>
      <AnimatePresence initial={false} mode="wait">
        {request ? (
          <PresenceGate key={request.id}>{({ gate }) => <motion.div {...gate} layout={!reduced} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }}><QueueFront request={request} requests={requests} onDecision={onDecision} action={action} /></motion.div>}</PresenceGate>
        ) : <PresenceGate key="empty">{({ gate }) => <motion.div {...gate} layout={!reduced} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col items-center rounded-2xl border border-border bg-background px-4 py-6 text-center">
          <QueueCompleteArtwork reduced={!!reduced} />
          <p role="status" className="mt-2 text-sm font-medium">All caught up</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{emptyDescription}</p>
          {onReplay && <Button type="button" variant="ghost" size="sm" onClick={onReplay} className="mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw className="size-3" />Replay</Button>}
        </motion.div>}</PresenceGate>}
      </AnimatePresence>
      {requests.length > 1 && <ul className="mt-1.5 space-y-1.5">{requests.slice(1, 4).map((item) => <motion.li key={item.id} layout={reduced ? false : "position"} transition={SPRING_LAYOUT} className="flex h-[46px] items-center gap-2.5 rounded-2xl border border-border bg-background px-3 text-xs">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-3.5">{item.icon ?? (item.kind === "command" ? <SquareTerminal /> : item.kind === "message" ? <Mail /> : <FilePen />)}</span>
        <span className="shrink-0">{item.tool}</span><span className="min-w-0 flex-1 truncate font-mono text-muted-foreground">{item.target}</span>
        <span className={cn("size-1.5 shrink-0 rounded-full", item.risk === "high" ? "bg-rose-500" : item.risk === "medium" ? "bg-amber-500" : "bg-emerald-500")}><span className="sr-only">{item.risk} risk</span></span>
      </motion.li>)}</ul>}
      {requests.length > 4 && <motion.p layout={reduced ? false : "position"} className="mt-1.5 px-3 pt-0.5 text-xs text-muted-foreground">{requests.length - 4} more waiting</motion.p>}
      <motion.div layout={reduced ? false : "position"} className="mt-1.5">{resolved.length > 0 && <>
        <h3 className="flex items-center justify-between gap-3 px-4 pb-1 pt-3 text-xs"><span className="font-medium">Resolved</span><span className="font-normal text-muted-foreground">{[approved > 0 && `${approved} approved`, denied > 0 && `${denied} denied`, allowedByRule > 0 && `${allowedByRule} allowed by rule`].filter(Boolean).join(" · ")}</span></h3>
        <ul aria-label="Resolved requests" className="pb-2">{resolved.map((item) => <motion.li key={item.id} layout={reduced ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5 px-4 py-1.5 text-xs">
          <span className={cn("mt-px grid size-4 shrink-0 place-items-center rounded-full", item.decision === "deny" ? "bg-rose-500 text-white" : "bg-foreground text-background")}>{item.decision === "deny" ? <X className="size-2.5" strokeWidth={3} /> : <Check className="size-2.5" strokeWidth={3} />}</span>
          <span className="min-w-0 flex-1"><span className="flex items-baseline gap-1.5"><span className="shrink-0">{item.tool}</span><span className="min-w-0 truncate font-mono text-muted-foreground">{item.target}</span></span>{item.note && <span className="mt-0.5 block truncate text-muted-foreground" title={item.note}>“{item.note}”</span>}</span>
          <span className="shrink-0 text-muted-foreground">{item.decision === "deny" ? "Denied" : item.decision === "rule" ? "Allowed by rule" : "Approved"}</span>
        </motion.li>)}</ul>
      </>}</motion.div>
    </motion.section>
  );
}

const completedArtworkRows = [
  { id: "command", Icon: SquareTerminal, width: 26 },
  { id: "file", Icon: FilePen, width: 20 },
  { id: "message", Icon: Mail, width: 23 },
];

function QueueCompleteArtwork({ reduced }: { reduced: boolean }) {
  return <svg viewBox="0 0 120 88" className="h-22 w-30" aria-hidden="true">
    <rect x="31" y="17" width="62" height="62" rx="11" transform="rotate(-6 62 48)" className="fill-background stroke-border" />
    <motion.g initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_LAYOUT}>
      <rect x="27" y="14" width="66" height="64" rx="11" className="fill-background stroke-border" />
      {completedArtworkRows.map(({ id, Icon, width }, index) => <g key={id} transform={`translate(0 ${index * 16})`}>
        <circle cx="39" cy="30" r="5.5" className="fill-muted" />
        <Icon x="35" y="26" width="8" height="8" className="text-muted-foreground" />
        <rect x="49" y="28.5" width={width} height="3" rx="1.5" className="fill-muted-foreground/25" />
        <motion.g initial={reduced ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING_LAYOUT, delay: reduced ? 0 : index * 0.05 }}>
          <circle cx="83" cy="30" r="4.5" className="fill-emerald-500" />
          <Check x="79.5" y="26.5" width="7" height="7" strokeWidth="3.5" className="text-white" />
        </motion.g>
      </g>)}
    </motion.g>
    <motion.g initial={reduced ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING_LAYOUT}>
      <circle cx="93" cy="14" r="9" className="fill-emerald-500 stroke-background" strokeWidth="2" />
      <Play x="88" y="9" width="10" height="10" className="fill-white text-white" />
    </motion.g>
  </svg>;
}

function QueueFront({ request, requests, onDecision, action }: { request: QueuedToolRequest; requests: QueuedToolRequest[]; onDecision: ToolApprovalQueueProps["onDecision"]; action: LifecycleActionController }) {
  const [note, setNote] = useState("");
  const [denying, setDenying] = useState(false);
  const denialInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (denying) denialInput.current?.focus(); }, [denying]);
  const [always, setAlways] = useState(false);
  const ruleId = useId();
  const reduced = useReducedMotion();
  const busy = action.pending.has("decision");
  const submit = (decision: ToolApprovalDecision["decision"], decisionNote = decision === "deny" ? note.trim() : "") => {
    void action.run("decision", () => onDecision({ requestId: request.id, decision, note: decisionNote, rule: request.rule, requestIds: decision === "always" ? requests.filter((item) => item.rule === request.rule).map((item) => item.id) : [request.id] }));
  };
  return <motion.div layout={!reduced} transition={SPRING_LAYOUT} className="overflow-clip rounded-2xl border border-border bg-background" aria-busy={busy}>
    <motion.div layout={reduced ? false : "position"} className="flex items-center gap-3 px-4 pt-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-3.5">{request.icon ?? (request.kind === "command" ? <SquareTerminal /> : request.kind === "message" ? <Mail /> : <FilePen />)}</span>
      <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium">{request.tool}</h3><p className="truncate font-mono text-xs text-muted-foreground">{request.target}</p></div>
      <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-xs", request.risk === "high" ? "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300" : request.risk === "medium" ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300")}>{request.kind !== "command" && request.risk !== "high" ? "Review" : `${request.risk.charAt(0).toUpperCase() + request.risk.slice(1)} risk`}</span>
    </motion.div>
    <motion.div layout={reduced ? false : "position"} className="space-y-2.5 px-4 py-3">
      <QueuePreview request={request} />
      {request.reason && <p className="text-pretty text-xs leading-5 text-muted-foreground"><span className="text-foreground">Why:</span> {request.reason}</p>}
      {!!request.parameters?.length && <dl className="space-y-1 text-xs text-muted-foreground">{request.parameters.map((parameter) => <div key={parameter.id} className="flex gap-2"><dt>{parameter.label}</dt><dd className="min-w-0 flex-1 break-words">{parameter.value}</dd></div>)}</dl>}
    </motion.div>
    {denying ? <motion.form layout={reduced ? false : "position"} className="space-y-2 px-4 pb-4 pt-1" onSubmit={(event) => { event.preventDefault(); submit("deny"); }}>
      <Input ref={denialInput} aria-label="Note to agent" placeholder="Tell the agent what to do instead…" disabled={busy} value={note} onChange={setNote} classNames={{ field: "h-10 bg-background ring-0 focus-within:border-muted-foreground/40", input: "text-sm leading-5", rightIcon: "right-1 [&_button]:size-8" }} rightIcon={<Button type="submit" size="icon" aria-label="Send" disabled={busy} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowUp className="size-4" /></Button>} />
      <div className="flex items-center justify-between gap-2"><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => submit("deny", "")} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Deny without a note</Button><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => setDenying(false)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Cancel</Button></div>
    </motion.form> : <motion.div layout={reduced ? false : "position"} className="flex items-center gap-2 px-4 pb-4 pt-1">
      {request.allowAlways && <div className="mr-auto flex min-w-0 items-center gap-2"><Checkbox id={ruleId} aria-label={`Always allow ${request.ruleDescription}`} checked={always} disabled={busy} onCheckedChange={setAlways} /><label htmlFor={ruleId} title={request.ruleDescription} className="min-w-0 cursor-pointer truncate text-xs text-muted-foreground">Always allow <code className="text-foreground">{request.ruleDescription}</code></label></div>}
      <Button type="button" variant="secondary" size="sm" disabled={busy} className={cn("shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", !request.allowAlways && "ml-auto")} onClick={() => setDenying(true)}><X className="size-3" />Deny</Button>
      <Button type="button" size="sm" disabled={busy} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => submit(always && request.allowAlways ? "always" : "once")}><Check className="size-3" />{busy ? "Saving…" : "Approve"}</Button>
    </motion.div>}
    {action.errors.decision && <div role="alert" className="mx-4 mb-4 rounded-lg border border-destructive/30 p-3 text-xs text-destructive">{action.errors.decision}<p>Your request remains in the queue. Choose a decision to retry.</p></div>}
  </motion.div>;
}

function QueuePreview({ request, className }: { request: QueuedToolRequest; className?: string }) {
  let offset = 0;
  return <div className={cn("overflow-hidden rounded-xl bg-muted/60 font-mono text-xs", className)}>
    {request.kind === "diff" && <div className="border-b border-border/50 px-3 py-1.5 text-muted-foreground">{request.target}</div>}
    <pre className="overflow-x-auto py-2 leading-5"><code>{request.preview.split("\n").map((line) => {
      const key = offset;
      offset += line.length + 1;
      const diff = request.kind === "diff";
      const added = diff && line.startsWith("+");
      const removed = diff && line.startsWith("-");
      const prompt = request.kind === "command" && line.startsWith("$ ");
      const content = diff && (added || removed || line.startsWith(" ")) ? line.slice(1) : prompt ? line.slice(2) : line;
      return <span key={key} className={cn("block min-h-5 px-3", added ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : removed ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : diff ? "text-muted-foreground" : "text-foreground")}>
        {(diff || prompt) && <span aria-hidden="true" className="inline-block w-4 select-none opacity-60">{added ? "+" : removed ? "−" : prompt ? "$" : " "}</span>}{content || "\u00a0"}
      </span>;
    })}</code></pre>
  </div>;
}
