"use client";

import { Check, Lock, RotateCcw, ShieldCheck, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface AgentRunSubagent {
  id: string;
  name: string;
  status: "queued" | "running" | "completed";
  detail?: string;
}

export interface AgentRunStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "blocked" | "rejected";
  elapsedSeconds?: number;
  progress?: number;
  requiresApproval?: boolean;
  subagents?: AgentRunSubagent[];
}

export interface AgentRunTimelineProps {
  title: string;
  steps: AgentRunStep[];
  onApprove?: (stepId: string) => void;
  onReject?: (stepId: string) => void;
  onReplay?: () => void;
  className?: string;
}

/** Step-by-step agent run timeline with delegating branches and approval gate. */
export function AgentRunTimeline({
  title,
  steps,
  onApprove,
  onReject,
  onReplay,
  className,
}: AgentRunTimelineProps) {
  const reduce = useReducedMotion() ?? false;
  const doneCount = steps.filter((step) => step.status === "completed").length;

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            <NumberTicker value={doneCount} startOnView={false} /> of {steps.length} done
          </p>
        </div>
        {onReplay ? (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Replay timeline"
            title="Replay timeline"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </header>

      <ol className="space-y-1">
        {steps.map((step, index) => {
          const hasNext = index < steps.length - 1;
          const hasActiveBranch =
            !!step.subagents?.length &&
            step.subagents.some((sub) => sub.status !== "completed");

          return (
            <li key={step.id} className="relative pl-8 pb-5 last:pb-0">
              {hasNext ? (
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-[11px] top-6 w-px bg-border"
                >
                  <motion.div
                    initial={false}
                    animate={{ scaleY: step.status === "completed" ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: EASE_OUT }}
                    style={{ transformOrigin: "top" }}
                    className="h-full w-full bg-primary"
                  />
                </div>
              ) : null}

              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-0.5 grid size-6 place-items-center rounded-full border text-xs",
                  step.status === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  step.status === "running" && "border-primary/40 bg-background text-primary",
                  step.status === "blocked" && "border-amber-500/40 bg-amber-500/10 text-amber-500",
                  step.status === "rejected" && "border-rose-500/40 bg-rose-500/10 text-rose-500",
                  step.status === "pending" && "border-border bg-background text-muted-foreground",
                )}
              >
                {step.status === "completed" ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : step.status === "blocked" ? (
                  <Lock className="size-3" />
                ) : step.status === "rejected" ? (
                  <X className="size-3.5" />
                ) : step.status === "running" ? (
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 -rotate-90">
                    <circle
                      cx="10"
                      cy="10"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="2.5"
                    />
                    <motion.circle
                      cx="10"
                      cy="10"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      pathLength="1"
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        strokeDasharray: `${Math.max(0.1, Math.min(1, (step.progress ?? 55) / 100))} 1`,
                      }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
                    />
                  </svg>
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                )}
              </span>

              <div className="flex items-center justify-between gap-3 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "pending"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.requiresApproval && step.status === "blocked" ? (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-500">
                    Needs approval
                  </span>
                ) : step.elapsedSeconds !== undefined ? (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    <NumberTicker value={step.elapsedSeconds} startOnView={false} />s
                  </span>
                ) : null}
              </div>

              {step.subagents?.length ? (
                <AgentDisclosure open={hasActiveBranch || step.status === "running"}>
                  <ul className="mt-2.5 space-y-1.5 rounded-2xl border border-border bg-background p-2.5">
                    {step.subagents.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-1.5 rounded-full",
                              sub.status === "completed"
                                ? "bg-emerald-500"
                                : sub.status === "running"
                                  ? "animate-pulse bg-primary"
                                  : "bg-muted-foreground/40",
                            )}
                          />
                          <span className="font-medium">{sub.name}</span>
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground">
                          {sub.detail ?? sub.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AgentDisclosure>
              ) : null}

              {step.requiresApproval && step.status === "blocked" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove?.(step.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ShieldCheck aria-hidden="true" className="size-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject?.(step.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
