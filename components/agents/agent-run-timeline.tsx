"use client";

import { Check, Lock, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface AgentRunSubagent {
  id: string;
  name: string;
  status: "queued" | "running" | "completed";
  elapsedSeconds?: number;
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

function PieWedgeIcon({ progress = 50 }: { progress?: number }) {
  const pct = Math.max(0.03, Math.min(1, progress / 100));
  const theta = pct * Math.PI * 2 - Math.PI / 2;
  const r = 7;
  const cx = 10;
  const cy = 10;
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 text-amber-400">
      <circle
        cx={cx}
        cy={cy}
        r="8.25"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.25"
      />
      {pct >= 0.995 ? (
        <circle cx={cx} cy={cy} r={r} fill="currentColor" />
      ) : (
        <path
          d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`}
          fill="currentColor"
        />
      )}
    </svg>
  );
}

/** Step-by-step agent run timeline with pie progress marks, curved delegation branches, and approval gate. */
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
  const allCompleted = steps.length > 0 && doneCount === steps.length;
  const waitingOnGate = steps.some(
    (step) => step.requiresApproval && step.status === "blocked",
  );

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {allCompleted && onReplay ? (
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-3" />
              Run again
            </button>
          ) : waitingOnGate ? (
            <span className="text-xs text-muted-foreground">Waiting on you</span>
          ) : (
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              <NumberTicker value={doneCount} startOnView={false} /> of {steps.length} done
            </p>
          )}
        </div>
      </header>

      <ol className="space-y-0">
        {steps.map((step, index) => {
          const hasNext = index < steps.length - 1;
          const visibleSubagents = (step.subagents ?? []).filter(
            (sub) => sub.status !== "queued",
          );
          const showBranch =
            step.status === "running" && visibleSubagents.length > 0;
          const isGate = !!step.requiresApproval;

          return (
            <li
              key={step.id}
              className={cn("relative pl-8 last:pb-0", showBranch ? "pb-0" : "pb-5")}
            >
              {hasNext && !showBranch ? (
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
                  "absolute left-0 top-0.5 grid size-6 place-items-center rounded-full border text-xs transition-colors",
                  step.status === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  step.status === "running" &&
                    "border-transparent bg-background",
                  step.status !== "completed" &&
                    step.status !== "running" &&
                    step.status !== "rejected" &&
                    isGate &&
                    "border-sky-500/45 bg-sky-500/10 text-sky-400",
                  step.status === "rejected" &&
                    "border-rose-500/45 bg-rose-500/10 text-rose-400",
                  step.status === "pending" &&
                    !isGate &&
                    "border-foreground/25 bg-card text-muted-foreground",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {step.status === "completed" ? (
                    <motion.span
                      key="done"
                      initial={reduce ? false : { scale: 0.65, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={reduce ? { duration: 0 } : SPRING_SWAP}
                      className="grid place-items-center"
                    >
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </motion.span>
                  ) : step.status === "running" ? (
                    <motion.span
                      key="running"
                      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduce ? undefined : { scale: 0.8, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.16 }}
                      className="grid place-items-center"
                    >
                      <PieWedgeIcon progress={step.progress} />
                    </motion.span>
                  ) : step.status === "rejected" ? (
                    <X key="rejected" className="size-3.5" />
                  ) : isGate ? (
                    <Lock key="lock" className="size-3" />
                  ) : null}
                </AnimatePresence>
              </span>

              <div className="flex min-h-6 items-center justify-between gap-3">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    step.status === "pending" && !isGate
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.label}
                </p>

                {isGate && step.status === "pending" ? (
                  <span className="shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                    Needs approval
                  </span>
                ) : isGate && step.status === "blocked" ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    {onReject ? (
                      <button
                        type="button"
                        onClick={() => onReject(step.id)}
                        className="inline-flex h-7 items-center rounded-full border border-border bg-background/80 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Reject
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onApprove?.(step.id)}
                      className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
                      Approve
                    </button>
                  </div>
                ) : (step.status === "running" || step.status === "completed") &&
                  step.elapsedSeconds !== undefined ? (
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    <NumberTicker value={step.elapsedSeconds} startOnView={false} />s
                  </span>
                ) : null}
              </div>

              <AnimatePresence initial={false}>
                {showBranch ? (
                  <motion.div
                    key="subagent-branch"
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: reduce ? 0 : 0.24, ease: EASE_OUT }}
                    className="-ml-8 overflow-hidden pl-8"
                  >
                    <div className={cn("relative pt-1", hasNext && "pb-5")}>
                      {/* Curved top detour from main spine out to sub-rail */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 26 16"
                        className="pointer-events-none absolute -left-[21px] top-0 h-4 w-[26px] text-border"
                        fill="none"
                      >
                        <path
                          d="M 1 0 C 1 9 25.5 5 25.5 16"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        />
                      </svg>

                      <ul className="relative mt-2 space-y-2 pl-6">
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2 left-[4.5px] top-2 w-px bg-border"
                        />
                        {visibleSubagents.map((sub) => (
                          <motion.li
                            key={sub.id}
                            initial={reduce ? false : { opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
                            className="relative flex items-center justify-between gap-2 text-xs"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute -left-6 top-1/2 flex size-2.5 -translate-y-1/2 items-center justify-center"
                            >
                              {sub.status === "running" && !reduce ? (
                                <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-amber-400/70" />
                              ) : null}
                              <span
                                className={cn(
                                  "relative size-1.5 rounded-full",
                                  sub.status === "completed"
                                    ? "bg-muted-foreground/70"
                                    : "bg-amber-400",
                                )}
                              />
                            </span>
                            <span
                              className={cn(
                                "min-w-0 truncate",
                                sub.status === "completed"
                                  ? "text-muted-foreground"
                                  : "text-foreground/90",
                              )}
                            >
                              {sub.name}
                            </span>
                            {sub.elapsedSeconds !== undefined ? (
                              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                                <NumberTicker
                                  value={sub.elapsedSeconds}
                                  startOnView={false}
                                />
                                s
                              </span>
                            ) : sub.detail ? (
                              <span className="truncate text-[11px] text-muted-foreground">
                                {sub.detail}
                              </span>
                            ) : null}
                          </motion.li>
                        ))}
                      </ul>

                      {hasNext ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 26 24"
                          className="pointer-events-none absolute -left-[21px] bottom-0 h-6 w-[26px] text-border"
                          fill="none"
                        >
                          <path
                            d="M 25.5 0 C 25.5 12 1 8 1 24"
                            stroke="currentColor"
                            strokeWidth="1.25"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
