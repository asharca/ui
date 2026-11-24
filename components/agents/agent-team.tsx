"use client";

import { Check, ChevronDown, Network, Play, RotateCcw, Square, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { useEffect, useId, useRef, useState } from "react";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import type { TodoItem } from "@/components/agents/todo-list";
import { cn } from "@/lib/utils";
import { lifecycleActionClass, useLifecycleAction } from "./lifecycle-actions";

export interface TeamAgentNode {
  id: string;
  name: string;
  role: string;
  status: "queued" | "running" | "waiting" | "completed" | "failed" | "cancelled";
  progress?: number;
  currentStep?: string;
  summary?: string;
  dependsOn?: string[];
  steps?: TodoItem[];
  report?: string;
  error?: string;
  elapsedMs?: number;
  color?: string;
  children?: TeamAgentNode[];
}
export interface AgentTeamProps {
  agents: TeamAgentNode[];
  onCancel?: (id: string) => void | Promise<void>;
  onRetry?: (id: string) => void | Promise<void>;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  onRun?: () => void | Promise<void>;
  onCancelAll?: () => void | Promise<void>;
  /** Host-reported tool calls across the whole team, shown in the footer. */
  toolCalls?: number;
  /** Host-reported wall-clock time for the current run, shown in the footer. */
  elapsedMs?: number;
  className?: string;
}

const clock = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
const startedStatuses: TeamAgentNode["status"][] = ["running", "completed", "failed", "cancelled"];
const PULSE_DURATION_MS = 550;

interface ReportPulse {
  key: string;
  id: string;
  color: string;
  y: number;
}

function StepStatusMark({ status, color }: { status?: TodoItem["status"]; color?: string }) {
  if (status === "completed") {
    return (
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center rounded-full bg-foreground text-background"
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span
        aria-hidden="true"
        className={cn("grid size-4 shrink-0 place-items-center", color ?? "text-primary")}
      >
        <span className="size-2.5 animate-pulse rounded-full bg-current" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full border border-dashed border-muted-foreground/45"
    />
  );
}

/** A nested semantic list, rather than an ARIA tree with incomplete keyboard behavior. */
export function AgentTeam({
  agents,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  onCancel,
  onRetry,
  onRun,
  onCancelAll,
  toolCalls,
  elapsedMs,
  className,
}: AgentTeamProps) {
  const reduced = useReducedMotion();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedIds);
  const expanded = expandedIds ?? internalExpanded;
  const action = useLifecycleAction();
  const prefix = useId();

  // Track newly completed direct subagents so a pulse can travel up the branch before landing.
  const prevStatuses = useRef<Map<string, TeamAgentNode["status"]> | null>(null);
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const pulseCounter = useRef(0);
  const timers = useRef<number[]>([]);
  const [inFlightIds, setInFlightIds] = useState<string[]>([]);
  const [pulses, setPulses] = useState<ReportPulse[]>([]);

  useEffect(() => {
    const currentStatuses = new Map<string, TeamAgentNode["status"]>();
    const collectStatuses = (nodes: TeamAgentNode[]) => {
      for (const node of nodes) {
        currentStatuses.set(node.id, node.status);
        if (node.children) collectStatuses(node.children);
      }
    };
    collectStatuses(agents);

    if (prevStatuses.current === null) {
      prevStatuses.current = currentStatuses;
      return;
    }

    if (!reduced) {
      const newlyCompleted: Array<{ node: TeamAgentNode; index: number }> = [];
      for (const lead of agents) {
        (lead.children ?? []).forEach((child, index) => {
          const prev = prevStatuses.current?.get(child.id);
          if (child.status === "completed" && prev && prev !== "completed") {
            newlyCompleted.push({ node: child, index });
          }
        });
      }

      if (newlyCompleted.length > 0) {
        for (const { node, index } of newlyCompleted) {
          const el = rowRefs.current.get(node.id);
          const y = (el ? el.offsetTop : index * 48) + 24;
          const pulseKey = `${node.id}-${pulseCounter.current++}`;
          setInFlightIds((prev) => (prev.includes(node.id) ? prev : [...prev, node.id]));
          setPulses((prev) => [
            ...prev,
            { key: pulseKey, id: node.id, color: node.color ?? "text-primary", y },
          ]);
          const timer = window.setTimeout(() => {
            setInFlightIds((prev) => prev.filter((id) => id !== node.id));
            setPulses((prev) => prev.filter((p) => p.key !== pulseKey));
          }, PULSE_DURATION_MS);
          timers.current.push(timer);
        }
      }
    }

    prevStatuses.current = currentStatuses;
  }, [agents, reduced]);

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => {
      for (const timer of pendingTimers) window.clearTimeout(timer);
    };
  }, []);

  const names = new Map<string, string>();
  let started = 0;
  const collect = (nodes: TeamAgentNode[], depth: number) => {
    for (const node of nodes) {
      names.set(node.id, node.name);
      if (depth > 0 && startedStatuses.includes(node.status)) started++;
      if (node.children) collect(node.children, depth + 1);
    }
  };
  collect(agents, 0);
  const running = agents.some((agent) => agent.status === "running");
  const finished =
    agents.length > 0 &&
    agents.every(
      (agent) =>
        agent.status === "completed" ||
        agent.status === "failed" ||
        agent.status === "cancelled",
    );
  const toggle = (id: string, open: boolean) => {
    const next = open ? expanded.filter((item) => item !== id) : [...expanded, id];
    if (expandedIds === undefined) setInternalExpanded(next);
    onExpandedIdsChange?.(next);
  };
  const hasNodeActions = (node: TeamAgentNode) =>
    (Boolean(onCancel) && ["queued", "running", "waiting"].includes(node.status)) ||
    (Boolean(onRetry) && ["failed", "cancelled"].includes(node.status));
  const nodeActions = (node: TeamAgentNode) => {
    const busy = action.pending.has(node.id);
    return (
      <>
        {onCancel && ["queued", "running", "waiting"].includes(node.status) && (
          <button
            type="button"
            className={lifecycleActionClass}
            disabled={busy}
            onClick={() => void action.run(node.id, () => onCancel(node.id))}
          >
            <Square className="size-3" />
            Stop {node.name}
          </button>
        )}
        {onRetry && ["failed", "cancelled"].includes(node.status) && (
          <button
            type="button"
            className={lifecycleActionClass}
            disabled={busy}
            onClick={() => void action.run(node.id, () => onRetry(node.id))}
          >
            <RotateCcw className="size-3" />
            Retry {node.name}
          </button>
        )}
      </>
    );
  };

  const renderChildren = (
    nodes: TeamAgentNode[],
    ancestry: Set<string>,
    topLevel = false,
  ) => (
    <ul className="relative ml-8 pb-2">
      {topLevel && (
        <AnimatePresence>
          {pulses.map((pulse) => (
            <motion.span
              key={pulse.key}
              aria-hidden="true"
              initial={{ x: 14, y: pulse.y, opacity: 0, scale: 0.6 }}
              animate={{
                x: [14, 0, 0],
                y: [pulse.y, pulse.y, 0],
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.25, 1, 0.5],
              }}
              transition={{
                duration: PULSE_DURATION_MS / 1000,
                times: [0, 0.25, 0.88, 1],
                ease: EASE_OUT,
              }}
              className={cn(
                "pointer-events-none absolute -left-[3.5px] top-0 z-10 size-2 rounded-full bg-current shadow-[0_0_8px_currentColor]",
                pulse.color,
              )}
            />
          ))}
        </AnimatePresence>
      )}
      {nodes.map((node) => {
        if (ancestry.has(node.id)) return null;
        const nextAncestry = new Set(ancestry).add(node.id);
        const open = expanded.includes(node.id);
        const contentId = `${prefix}-${encodeURIComponent(node.id)}`;
        const idle = node.status === "waiting" || node.status === "queued";
        const subtitle =
          node.status === "completed"
            ? (node.report ?? node.currentStep)
            : node.status === "failed"
              ? (node.error ?? node.currentStep)
              : idle && node.dependsOn?.length
                ? `Starts after ${node.dependsOn.map((id) => names.get(id) ?? id).join(", ")}`
                : (node.currentStep ?? "Awaiting next step");
        const actionable = hasNodeActions(node);

        return (
          <motion.li
            key={node.id}
            ref={(el) => {
              if (el) rowRefs.current.set(node.id, el);
              else rowRefs.current.delete(node.id);
            }}
            data-agent-id={node.id}
            data-status={node.status}
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }}
            className="relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border last:before:h-6 after:absolute after:left-0 after:top-6 after:h-px after:w-3.5 after:bg-border"
          >
            <button
              type="button"
              className="flex h-12 w-full min-w-0 items-center gap-2.5 rounded-xl pr-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              aria-expanded={open}
              aria-controls={contentId}
              onClick={() => toggle(node.id, open)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid size-5 shrink-0 place-items-center rounded-full",
                  node.status === "completed" && "bg-foreground text-background",
                  node.status === "failed" && "bg-rose-500 text-white",
                  node.status === "cancelled" && "bg-foreground/[0.08] text-muted-foreground",
                  idle && "border border-dashed border-muted-foreground/40",
                  node.status === "running" && (node.color ?? "text-primary"),
                )}
              >
                {node.status === "running" && (
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="absolute inset-0 size-5 -rotate-90">
                    <circle
                      cx="10"
                      cy="10"
                      r="8.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity=".15"
                    />
                    <motion.circle
                      cx="10"
                      cy="10"
                      r="8.5"
                      pathLength="1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        strokeDasharray: `${Math.min(100, Math.max(4, node.progress ?? 0)) / 100} 1`,
                      }}
                      transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }}
                    />
                  </svg>
                )}
                {node.status === "completed" && <Check className="size-3" strokeWidth={3} />}
                {node.status === "failed" && <X className="size-3" strokeWidth={3} />}
                {node.status === "cancelled" && <Square className="size-2.5" />}
              </span>
              <span className={cn("min-w-0 flex-1", idle && "opacity-50")}>
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {node.name}
                  <span className={cn("size-1.5 rounded-full bg-current", node.color ?? "text-primary")} />
                </span>
                <span
                  className={cn(
                    "block truncate text-xs text-muted-foreground",
                    node.status === "failed" && "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {subtitle}
                </span>
              </span>
              {node.elapsedMs !== undefined && (
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {clock(node.elapsedMs)}
                </span>
              )}
              {!idle && (
                <ChevronDown
                  aria-hidden="true"
                  className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
                />
              )}
            </button>
            <AgentDisclosure open={open} id={contentId}>
              <div className="space-y-3 pb-3 pl-[30px] pr-4 text-xs">
                {node.summary && (
                  <p className="text-[13px] text-foreground/85">{node.summary}</p>
                )}
                {!!node.dependsOn?.length && !node.summary && (
                  <p className="text-muted-foreground">
                    Depends on: {node.dependsOn.map((id) => names.get(id) ?? id).join(", ")}
                  </p>
                )}
                {!!node.steps?.length && (
                  <ul className="space-y-2">
                    {node.steps.map((step) => (
                      <li key={step.id} className="flex items-center gap-2.5 text-xs">
                        <StepStatusMark status={step.status} color={node.color} />
                        <span
                          className={cn(
                            "min-w-0 truncate",
                            step.status === "completed"
                              ? "text-foreground/90"
                              : step.status === "in-progress"
                                ? "font-medium text-foreground"
                                : "text-muted-foreground",
                          )}
                        >
                          {step.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {node.report && (
                  <div className="rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-xs leading-relaxed">
                    <span className={cn("font-semibold", node.color ?? "text-primary")}>
                      Report:
                    </span>{" "}
                    <span className="text-foreground/90">{node.report}</span>
                  </div>
                )}
                {node.error && <p className="text-destructive">{node.error}</p>}
                {actionable && (
                  <div className="flex gap-2" aria-busy={action.pending.has(node.id)}>
                    {nodeActions(node)}
                  </div>
                )}
                {action.errors[node.id] && (
                  <p role="alert" className="text-destructive">
                    {action.errors[node.id]}
                  </p>
                )}
              </div>
            </AgentDisclosure>
            {!!node.children?.length && (
              <div className="-ml-4 pl-[26px]">{renderChildren(node.children, nextAncestry)}</div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );

  return (
    <section
      aria-label="Agent team"
      className={cn("mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-1.5 text-foreground", className)}
    >
      <h2 className="sr-only">Agent team</h2>
      <div className="overflow-clip rounded-2xl border border-border bg-background">
        {agents.length ? (
          <ul>
            {agents.map((lead) => {
              const children = lead.children ?? [];
              const reports = children.filter(
                (child) => child.status === "completed" && !inFlightIds.includes(child.id),
              ).length;
              return (
                <li key={lead.id} data-agent-id={lead.id} data-status={lead.status}>
                  <div className={cn("flex items-center gap-2.5 px-4 pt-3.5", children.length ? "pb-2" : "pb-3.5")}>
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-border/80 bg-foreground/[0.06] text-muted-foreground"
                    >
                      <Network className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        <span className="sr-only">Lead: </span>
                        {lead.name}
                      </p>
                      <p
                        className={cn(
                          "truncate text-xs text-muted-foreground",
                          lead.status === "completed" && "text-emerald-600 dark:text-emerald-400",
                          lead.status === "failed" && "text-rose-600 dark:text-rose-400",
                        )}
                      >
                        {lead.status === "completed"
                          ? (lead.report ?? lead.currentStep)
                          : lead.status === "failed"
                            ? (lead.error ?? lead.currentStep)
                            : lead.currentStep}
                      </p>
                    </div>
                    {children.length > 0 && (
                      <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {reports} of {children.length} reports in
                      </p>
                    )}
                    {(lead.status === "failed" || lead.status === "cancelled") && nodeActions(lead)}
                  </div>
                  {children.length > 0 && renderChildren(children, new Set([lead.id]), true)}
                  {action.errors[lead.id] && (
                    <p role="alert" className="px-4 pb-3 text-xs text-destructive">
                      {action.errors[lead.id]}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="p-8 text-center text-xs text-muted-foreground">No agents assigned.</p>
        )}
      </div>
      <footer className="flex min-h-12 items-center justify-between gap-3 py-1.5 pl-3 pr-1.5">
        <span className="min-w-0 truncate font-mono text-xs tabular-nums text-muted-foreground">
          {started} {started === 1 ? "subagent" : "subagents"}
          {toolCalls !== undefined && ` · ${toolCalls} tool ${toolCalls === 1 ? "call" : "calls"}`}
          {elapsedMs !== undefined && ` · ${clock(elapsedMs)}`}
        </span>
        <div className="flex shrink-0 gap-2">
          {running && onCancelAll ? (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              disabled={action.pending.has("stop")}
              onClick={() => void action.run("stop", onCancelAll)}
            >
              <Square className="size-3" />
              Stop all
            </button>
          ) : (
            !running &&
            onRun && (
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                disabled={action.pending.has("run")}
                onClick={() => void action.run("run", onRun)}
              >
                {finished ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
                {finished ? "Run again" : "Run"}
              </button>
            )
          )}
        </div>
      </footer>
      {(action.errors.run || action.errors.stop) && (
        <p role="alert" className="px-3 pb-2 text-xs text-destructive">
          {action.errors.run || action.errors.stop}
        </p>
      )}
    </section>
  );
}
