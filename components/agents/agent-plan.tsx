"use client";

import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  CornerDownLeft,
  FileText,
  FlaskConical,
  GitPullRequest,
  GripVertical,
  MessageSquareText,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Search,
  Square,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import type { AgentActivityItem } from "@/components/agents/agent-activity";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { lifecycleInputClass, useLifecycleAction } from "./lifecycle-actions";

export type PlanStatus = "draft" | "running" | "paused" | "completed" | "cancelled" | "failed";

const toolStyles: Record<string, string> = {
  Search: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Read: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  Edit: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Test: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Ship: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  Note: "border-lime-500/35 bg-lime-500/10 text-lime-400",
  "Your note": "border-lime-500/35 bg-lime-500/10 text-lime-400",
};

const toolIcons: Record<string, typeof Bot> = {
  Search,
  Read: FileText,
  Edit: Code2,
  Test: FlaskConical,
  Ship: GitPullRequest,
  Note: MessageSquareText,
  "Your note": MessageSquareText,
};

function ToolMark({ tool }: { tool: string }) {
  const Icon = toolIcons[tool];
  return Icon ? <Icon aria-hidden="true" className="size-3 shrink-0" /> : null;
}

export interface PlanStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "cancelled" | "failed";
  progress?: number;
  elapsedMs?: number;
  error?: string;
  logs?: string[];
  toolCalls?: number;
  activity?: AgentActivityItem[];
  tool?: string;
  estimatedMs?: number;
}

export interface AgentPlanProps {
  title?: string;
  agentName?: string;
  model?: string;
  steps: PlanStep[];
  status: PlanStatus;
  queuedNotes?: Array<{ id: string; text: string }>;
  onStepsChange?: (steps: PlanStep[]) => void;
  onRun?: () => void | Promise<void>;
  onPause?: () => void | Promise<void>;
  onResume?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onRetry?: (stepId: string) => void | Promise<void>;
  onNote?: (note: string) => void | Promise<void>;
  onEdit?: () => void | Promise<void>;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function getStepLogs(step: PlanStep): string[] {
  if (step.logs?.length) return step.logs;
  if (!step.activity?.length) return [];
  const lines: string[] = [];
  for (const item of step.activity) {
    if ("content" in item && typeof item.content === "string") {
      for (const line of item.content.split("\n")) {
        if (line.trim()) lines.push(line);
      }
    } else if (item.type === "tool" && typeof item.target === "string") {
      lines.push(`${item.action} ${item.target}`);
    } else if ("label" in item && typeof item.label === "string") {
      lines.push(item.label);
    }
  }
  return lines;
}

function StatusBadge({ status, reduce }: { status: PlanStatus; reduce: boolean }) {
  const config =
    status === "running"
      ? {
          label: "Running",
          pill: "border-sky-500/35 bg-sky-500/10 text-sky-400",
          dot: "bg-sky-400",
          pulse: true,
        }
      : status === "failed"
        ? {
            label: "Needs attention",
            pill: "border-rose-500/35 bg-rose-500/10 text-rose-400",
            dot: "bg-rose-400",
            pulse: false,
          }
        : status === "paused" || status === "cancelled"
          ? {
              label: "Stopped",
              pill: "border-amber-500/35 bg-amber-500/10 text-amber-400",
              dot: "bg-amber-400",
              pulse: false,
            }
          : status === "completed"
            ? {
                label: "Finished",
                pill: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
                dot: "bg-emerald-400",
                pulse: false,
              }
            : {
                label: "Draft",
                pill: "border-border bg-foreground/[0.04] text-muted-foreground",
                dot: "bg-muted-foreground/70",
                pulse: false,
              };

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium",
        config.pill,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          config.dot,
          config.pulse && !reduce && "animate-pulse",
        )}
      />
      <span>{config.label}</span>
    </span>
  );
}

function RunningDotSpinner({ reduce }: { reduce: boolean }) {
  return (
    <span aria-hidden="true" className="relative grid size-5 shrink-0 place-items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={cn("size-5 text-sky-400", !reduce && "animate-spin")}
        style={{ animationDuration: "1.4s" }}
      >
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="2"
        />
        <path
          d="M 10 2 A 8 8 0 0 1 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute size-1.5 rounded-full bg-sky-400" />
    </span>
  );
}

/** Execution, activity and editable plan data remain host-owned. */
export function AgentPlanRunner({
  title = "Execution plan",
  agentName = "Relay",
  model = "claude-opus-5-5",
  steps,
  status,
  queuedNotes,
  onStepsChange,
  onRun,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onNote,
  onEdit,
  collapsible = false,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
}: AgentPlanProps) {
  const id = useId();
  const reduced = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(defaultOpen);
  const [renaming, setRenaming] = useState<string>();
  const renameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renaming) renameInput.current?.focus();
  }, [renaming]);
  const [newTitle, setNewTitle] = useState("");
  const [note, setNote] = useState("");
  const [newId, setNewId] = useState(0);
  const action = useLifecycleAction();
  const isOpen = open ?? expanded;
  const editable = status === "draft" && !!onStepsChange;
  const completed = steps.filter((step) => step.status === "completed").length;
  const failedIndex = steps.findIndex((step) => step.status === "failed");
  const currentIndex = steps.findIndex((step) => step.status === "running");
  const nextPendingIndex = steps.findIndex((step) => step.status === "pending" || step.status === "cancelled");
  const failed = failedIndex >= 0 ? steps[failedIndex] : undefined;
  const current = currentIndex >= 0 ? steps[currentIndex] : undefined;
  const elapsed = steps.reduce((sum, step) => sum + (step.elapsedMs ?? 0), 0);
  const estimatedTotal = Math.round(
    steps.reduce((sum, step) => sum + (step.estimatedMs ?? 0), 0) / 1000,
  );
  const calls = steps.reduce((sum, step) => {
    if (step.toolCalls !== undefined) return sum + step.toolCalls;
    const actTools = step.activity?.filter((item) => item.type === "tool").length ?? 0;
    if (actTools > 0) return sum + actTools;
    return sum + getStepLogs(step).length;
  }, 0);
  const busy = action.pending.has("plan");
  const changeOpen = () => {
    if (open === undefined) setExpanded(!isOpen);
    onOpenChange?.(!isOpen);
  };
  const move = (index: number, offset: number) => {
    if (index + offset < 0 || index + offset >= steps.length) return;
    const next = [...steps];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onStepsChange?.(next);
  };
  const execute = (fn: () => void | Promise<void>) => {
    void action.run("plan", fn);
  };

  const footerSummary = (() => {
    if (status === "draft") {
      return `${steps.length} ${steps.length === 1 ? "step" : "steps"}${estimatedTotal > 0 ? ` · ~${estimatedTotal}s` : ""}`;
    }
    const baseStats = `${elapsed > 0 || calls > 0 ? ` · ${(elapsed / 1000).toFixed(1)}s · ${calls} ${calls === 1 ? "call" : "calls"}` : status === "paused" || status === "cancelled" ? " · 0.0s · 0 calls" : ""}`;
    if (failed) {
      return `Step ${failedIndex + 1} failed${baseStats}`;
    }
    if (status === "paused" || status === "cancelled") {
      const idx = currentIndex >= 0 ? currentIndex : nextPendingIndex >= 0 ? nextPendingIndex : steps.length;
      const prefix = idx === 0 ? "Stopped before step 1" : `Stopped at step ${idx + 1}`;
      return `${prefix}${baseStats}`;
    }
    if (status === "completed") {
      return `Finished in ${(elapsed / 1000).toFixed(1)}s${baseStats}`;
    }
    if (current) {
      return `Step ${currentIndex + 1} of ${steps.length}${baseStats}`;
    }
    return `${completed}/${steps.length} complete${baseStats}`;
  })();

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-md overflow-clip rounded-2xl border border-border bg-card text-foreground shadow-sm",
        className,
      )}
      aria-label={title}
      data-status={status}
    >
      <header className="px-4 pt-3.5">
        <div className="flex items-center gap-2">
          <Bot aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{agentName}</span>
            <span className="ml-1.5 font-mono">{model}</span>
          </p>
          <StatusBadge status={status} reduce={reduced} />
          {collapsible ? (
            <button
              type="button"
              aria-label={isOpen ? "Hide plan" : "Show plan"}
              aria-expanded={isOpen}
              aria-controls={`${id}-body`}
              onClick={changeOpen}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isOpen ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          ) : null}
        </div>
        <h2 className="mt-2 text-sm font-medium leading-5 text-foreground">{title}</h2>
        <div aria-hidden="true" className="mt-3 flex gap-1.5">
          {steps.map((step) => {
            const barScale =
              step.status === "completed"
                ? 1
                : step.status === "running"
                  ? Math.max(0.05, (step.progress ?? 0) / 100)
                  : step.status === "failed"
                    ? Math.max(0.45, (step.progress ?? 100) / 100)
                    : 0;
            return (
              <span
                key={step.id}
                className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/[0.1]"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: barScale }}
                  transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }}
                  className={cn(
                    "absolute inset-0 origin-left rounded-full",
                    step.status === "completed" && "bg-foreground",
                    step.status === "running" && "bg-sky-500",
                    step.status === "failed" && "bg-rose-500",
                  )}
                />
              </span>
            );
          })}
        </div>
      </header>

      <AgentDisclosure id={`${id}-body`} open={isOpen}>
        <div className="px-4 pb-3 pt-4">
          <ol>
            <AnimatePresence initial={false}>
              {steps.map((step, index) => {
                const isActivelyRunning =
                  step.status === "running" && status === "running";
                const logs = getStepLogs(step);
                const showLogs =
                  (isActivelyRunning || step.status === "failed") &&
                  (logs.length > 0 || !!step.error || (step.status === "failed" && !!onRetry));
                const toolName = step.tool ?? "Task";

                return (
                  <motion.li
                    key={step.id}
                    layout={reduced ? false : "position"}
                    initial={reduced ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.18, ease: EASE_OUT }}
                    className="group relative"
                    data-status={step.status}
                    onDragOver={(event) => {
                      if (editable) event.preventDefault();
                    }}
                    onDrop={(event) => {
                      if (!editable) return;
                      event.preventDefault();
                      const source = steps.findIndex(
                        (item) => item.id === event.dataTransfer.getData("text/plain"),
                      );
                      if (source < 0 || source === index) return;
                      const next = [...steps];
                      const [moved] = next.splice(source, 1);
                      next.splice(index, 0, moved);
                      onStepsChange?.(next);
                    }}
                  >
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[9px] top-7 w-px bg-border"
                      />
                    )}
                    <div
                      className={cn(
                        "flex items-center gap-2.5",
                        index === steps.length - 1 && !showLogs ? "min-h-7" : "min-h-9",
                      )}
                    >
                      {editable ? (
                        <button
                          type="button"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/plain", step.id);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          aria-label={`Reorder ${step.title}, drag or use arrow keys`}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                              event.preventDefault();
                              move(index, event.key === "ArrowUp" ? -1 : 1);
                            }
                          }}
                          className="grid size-5 shrink-0 cursor-grab place-items-center rounded-full border border-border bg-background text-[10px] font-mono text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="group-hover:hidden">{index + 1}</span>
                          <GripVertical className="hidden size-3 group-hover:block" />
                        </button>
                      ) : isActivelyRunning ? (
                        <RunningDotSpinner reduce={reduced} />
                      ) : (
                        <span
                          className={cn(
                            "relative grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-mono tabular-nums",
                            step.status === "completed" && "bg-foreground text-background",
                            step.status === "failed" && "bg-rose-500 text-white",
                            (step.status === "pending" ||
                              step.status === "cancelled" ||
                              step.status === "running") &&
                              "border border-border/80 bg-background text-muted-foreground",
                          )}
                        >
                          {step.status === "completed" ? (
                            <Check className="size-3" strokeWidth={2.75} />
                          ) : step.status === "failed" ? (
                            <X className="size-3" strokeWidth={2.75} />
                          ) : (
                            index + 1
                          )}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        {editable && renaming === step.id ? (
                          <input
                            ref={renameInput}
                            aria-label={`Step ${index + 1} title`}
                            className="w-full rounded border border-border bg-transparent px-1.5 py-0.5 text-[13.5px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={step.title}
                            onBlur={() => setRenaming(undefined)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === "Escape") {
                                setRenaming(undefined);
                              }
                            }}
                            onChange={(event) =>
                              onStepsChange?.(
                                steps.map((item) =>
                                  item.id === step.id
                                    ? { ...item, title: event.target.value }
                                    : item,
                                ),
                              )
                            }
                          />
                        ) : editable ? (
                          <button
                            type="button"
                            className="block w-full truncate text-left text-[13.5px] font-medium text-foreground/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Rename ${step.title}`}
                            onClick={() => setRenaming(step.id)}
                          >
                            {step.title}
                          </button>
                        ) : (
                          <span
                            className={cn(
                              "block truncate text-[13.5px] font-medium",
                              step.status === "pending" &&
                                status !== "draft" &&
                                "font-normal text-muted-foreground",
                              step.status === "cancelled" && "text-muted-foreground",
                              step.status === "failed" && "text-rose-400",
                            )}
                          >
                            {step.title}
                          </span>
                        )}
                      </div>

                      {editable ? (
                        <AnimatedDropdown
                          ariaLabel={`Change tool for ${step.title}`}
                          value={toolName}
                          disabled={busy}
                          onValueChange={(tool) =>
                            onStepsChange?.(
                              steps.map((item) =>
                                item.id === step.id ? { ...item, tool } : item,
                              ),
                            )
                          }
                          className="shrink-0"
                          trigger={
                            <>
                              <ToolMark tool={toolName} />
                              <span className="truncate">{toolName}</span>
                            </>
                          }
                          triggerClassName={cn(
                            "h-5 gap-1 rounded-full border px-2 py-0 text-[11px] font-medium [&>svg:last-child]:hidden",
                            toolStyles[toolName] ??
                              "border-border/70 bg-foreground/[0.04] text-muted-foreground",
                          )}
                          align="end"
                          indicatorPosition="end"
                          menuWidth={160}
                          items={[
                            ...new Set(["Search", "Read", "Edit", "Test", "Ship", toolName]),
                          ].map((tool) => ({
                            id: tool,
                            kind: "option" as const,
                            value: tool,
                            textValue: tool,
                            label: (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px]",
                                  toolStyles[tool] ??
                                    "border-border/70 bg-foreground/[0.04] text-muted-foreground",
                                )}
                              >
                                <ToolMark tool={tool} />
                                {tool}
                              </span>
                            ),
                          }))}
                        />
                      ) : (
                        <span
                          className={cn(
                            "inline-flex h-5 shrink-0 items-center gap-1 rounded-full border px-2 text-[11px] font-medium",
                            toolStyles[toolName] ??
                              "border-border/70 bg-foreground/[0.04] text-muted-foreground",
                          )}
                        >
                          <ToolMark tool={toolName} />
                          <span>{toolName}</span>
                        </span>
                      )}

                      <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                        {step.status !== "pending" && step.elapsedMs !== undefined
                          ? `${(step.elapsedMs / 1000).toFixed(1)}s`
                          : step.estimatedMs
                            ? `~${Math.round(step.estimatedMs / 1000)}s`
                            : "—"}
                      </span>

                      {editable && (
                        <button
                          type="button"
                          className="rounded p-1 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Remove ${step.title}`}
                          onClick={() =>
                            onStepsChange?.(steps.filter((item) => item.id !== step.id))
                          }
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {showLogs && (
                        <motion.div
                          key="logs"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: reduced ? 0 : 0.18, ease: EASE_OUT }}
                          className="ml-[30px] overflow-hidden pb-3 pt-0.5"
                        >
                          <div className="space-y-1 font-mono text-xs leading-relaxed">
                            {logs.map((line, lineIdx) => {
                              const isLastRunning =
                                step.status === "running" &&
                                lineIdx === logs.length - 1 &&
                                !step.error;
                              return (
                                <p
                                  key={`${step.id}:${line}`}
                                  className={cn(
                                    "flex items-baseline gap-2",
                                    isLastRunning
                                      ? "text-foreground/95"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className="select-none text-muted-foreground/60"
                                  >
                                    ›
                                  </span>
                                  <span className="min-w-0 break-words">
                                    {line}
                                    {isLastRunning && !reduced && (
                                      <span
                                        aria-hidden="true"
                                        className="ml-1 inline-block h-3.5 w-1.5 translate-y-[2px] animate-pulse rounded-[1px] bg-foreground/70"
                                      />
                                    )}
                                  </span>
                                </p>
                              );
                            })}
                            {step.error && (
                              <p className="flex items-baseline gap-2 text-rose-400">
                                <span aria-hidden="true" className="select-none opacity-80">
                                  ›
                                </span>
                                <span className="min-w-0 break-words">{step.error}</span>
                              </p>
                            )}
                          </div>
                          {step.status === "failed" && onRetry && (
                            <button
                              type="button"
                              className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.05] px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                              disabled={busy}
                              onClick={() => execute(() => onRetry(step.id))}
                            >
                              <RotateCcw aria-hidden="true" className="size-3" />
                              Retry
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>

          {!steps.length && (
            <p className="py-3 text-xs text-muted-foreground">No steps yet.</p>
          )}

          {editable && (
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!newTitle.trim()) return;
                onStepsChange?.([
                  ...steps,
                  {
                    id: `${id}-step-${newId}`,
                    title: newTitle.trim(),
                    status: "pending",
                    tool: "Edit",
                    estimatedMs: 2000,
                  },
                ]);
                setNewId(newId + 1);
                setNewTitle("");
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Plus
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  aria-label="Add step"
                  placeholder="Add a step"
                  className={cn(
                    lifecycleInputClass,
                    "h-9 w-full rounded-full bg-background/80 pl-9 text-xs",
                  )}
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
              </div>
              <button
                type="submit"
                aria-label="Submit new step"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
                disabled={!newTitle.trim()}
              >
                <CornerDownLeft className="size-3.5" />
              </button>
            </form>
          )}
        </div>

        {(!!queuedNotes?.length ||
          (onNote &&
            (status === "running" ||
              status === "paused" ||
              status === "cancelled" ||
              status === "failed"))) && (
          <div className="px-4 pb-3">
            {!!queuedNotes?.length && (
              <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Up next</span>
                {queuedNotes.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 rounded-full border border-lime-500/35 bg-lime-500/10 px-2.5 py-0.5 text-[11px] font-medium text-lime-400"
                  >
                    <MessageSquareText aria-hidden="true" className="size-3" />
                    {item.text}
                  </span>
                ))}
              </div>
            )}
            {onNote &&
              (status === "running" ||
                status === "paused" ||
                status === "cancelled" ||
                status === "failed") && (
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (note.trim()) {
                      void action.run("note", async () => {
                        await onNote(note.trim());
                        setNote("");
                      });
                    }
                  }}
                >
                  <div className="relative min-w-0 flex-1">
                    <MessageSquareText
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      aria-label="Steer the next step"
                      className={cn(
                        lifecycleInputClass,
                        "h-9 w-full rounded-full bg-background/80 pl-9 text-xs",
                      )}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Steer the next step"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Queue"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
                    disabled={!note.trim() || action.pending.has("note")}
                  >
                    <CornerDownLeft className="size-3.5" />
                  </button>
                </form>
              )}
          </div>
        )}
      </AgentDisclosure>

      <footer
        className="flex min-h-12 items-center justify-between gap-3 border-t border-border px-4 py-2"
        aria-busy={busy}
      >
        <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground tabular-nums">
          {footerSummary}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {status !== "draft" && status !== "running" && onEdit && (
            <button
              type="button"
              aria-label="Edit plan"
              onClick={() => execute(onEdit)}
              disabled={busy}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
          {status === "draft" && onRun && (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={busy || !steps.length || steps.some((step) => !step.title.trim())}
              onClick={() => execute(onRun)}
            >
              <Play className="size-3" />
              Run plan
            </button>
          )}
          {status === "running" && (onPause || onCancel) && (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={busy}
              onClick={() => execute((onPause ?? onCancel)!)}
            >
              <Square className="size-3" />
              Stop
            </button>
          )}
          {(status === "paused" || status === "cancelled") && onResume && (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={busy}
              onClick={() => execute(onResume)}
            >
              <Play className="size-3" />
              Resume
            </button>
          )}
          {status === "completed" && onRun && (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={busy}
              onClick={() => execute(onRun)}
            >
              <RotateCcw className="size-3" />
              Run again
            </button>
          )}
        </div>
      </footer>
      {(action.errors.plan || action.errors.note) && (
        <p role="alert" className="px-4 pb-3 text-xs text-destructive">
          {action.errors.plan || action.errors.note}
        </p>
      )}
    </section>
  );
}

export function AgentPlanPill(props: AgentPlanProps) {
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? internalOpen;
  const reduce = useReducedMotion() ?? false;
  const id = useId();
  const prevStatus = useRef<PlanStatus>(props.status);
  const { open: controlledOpen, onOpenChange, status } = props;
  const completed = props.steps.filter((step) => step.status === "completed").length;
  const current = props.steps.find(
    (step) => step.status === "running" || step.status === "failed",
  );
  const totalElapsed = props.steps.reduce((sum, s) => sum + (s.elapsedMs ?? 0), 0);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (prevStatus.current !== "failed" && status === "failed") {
      if (controlledOpen === undefined) setInternalOpen(true);
      onOpenChange?.(true);
    }
    prevStatus.current = status;
  }, [status, controlledOpen, onOpenChange]);

  const activeTitle = current?.title ?? props.title ?? "Agent plan";

  return (
    <LayoutGroup id={id}>
      <div className={cn("mx-auto w-full max-w-md", props.className)}>
        {!open ? (
          <motion.button
            key="pill"
            layoutId={`${id}-surface`}
            type="button"
            aria-expanded={false}
            aria-label={`Show plan: ${activeTitle}`}
            onClick={() => setOpen(true)}
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            style={{ borderRadius: 9999 }}
            className="mx-auto flex h-10 max-w-full items-center gap-2.5 border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          >
            {props.status === "failed" ? (
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-rose-500 text-white">
                <X className="size-2.5" strokeWidth={3} />
              </span>
            ) : props.status === "completed" ? (
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-foreground text-background">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            ) : props.status === "running" ? (
              <span aria-hidden="true" className="relative grid size-4 shrink-0 place-items-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={cn("size-4 text-sky-400", !reduce && "animate-spin")}
                  style={{ animationDuration: "1.4s" }}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.18"
                    strokeWidth="2"
                  />
                  <path
                    d="M 10 2 A 8 8 0 0 1 18 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute size-1.5 rounded-full bg-sky-400" />
              </span>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 shrink-0 -rotate-90 text-muted-foreground"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  opacity=".18"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  pathLength="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${props.steps.length ? Math.max(0.12, completed / props.steps.length) : 0.12} 1`}
                />
              </svg>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current?.id ?? props.status}
                initial={reduce ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
                className="min-w-0 truncate text-[13px] font-medium"
              >
                {activeTitle}
              </motion.span>
            </AnimatePresence>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {completed}/{props.steps.length}
            </span>
            {totalElapsed > 0 && (
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {(totalElapsed / 1000).toFixed(1)}s
              </span>
            )}
            <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            layoutId={`${id}-surface`}
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            style={{ borderRadius: 16 }}
            className="w-full"
          >
            <AgentPlanRunner
              {...props}
              collapsible
              open
              onOpenChange={(next) => setOpen(next)}
            />
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
