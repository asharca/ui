"use client";

import { Check, Copy, GitBranch, Plus, Rocket, Undo2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DeploymentItem {
  id: string;
  title: string;
  branch: string;
  sha: string;
  age: string;
  authorInitials?: string;
  authorAccent?: string;
  environment: "Production" | "Preview";
  duration: string;
  stage: 1 | 2 | 3 | 4 | 5;
  status: "Building" | "Ready" | "Error";
  current?: boolean;
  url: string;
}

export interface DeploymentListProps {
  deployments: DeploymentItem[];
  onDeploy?: () => void;
  onPromote?: (id: string) => void;
  onRollback?: (id: string) => void;
  className?: string;
}

function StatusGlyph({ status }: { status: DeploymentItem["status"] }) {
  if (status === "Ready") {
    return (
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-neutral-950"
      >
        <Check className="size-3" strokeWidth={2.75} />
      </span>
    );
  }
  if (status === "Error") {
    return (
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded-full bg-rose-500 text-neutral-950"
      >
        <X className="size-3" strokeWidth={2.75} />
      </span>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5 shrink-0 animate-spin text-sky-400"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2.2"
      />
      <path
        d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Recent deployments list with 5-stage pipeline bars, promote/rollback reordering, and URL copy. */
export function DeploymentList({
  deployments,
  onDeploy,
  onPromote,
  onRollback,
  className,
}: DeploymentListProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [filter, setFilter] = useState<"all" | "Production" | "Preview">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const buildingCount = deployments.filter((item) => item.status === "Building").length;

  const visible = useMemo(() => {
    if (filter === "all") return deployments;
    return deployments.filter((item) => item.environment === filter);
  }, [deployments, filter]);

  const copyUrl = async (item: DeploymentItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId((prev) => (prev === item.id ? null : prev)), 1500);
  };

  return (
    <section
      aria-label="Recent deployments"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold">Deployments</h3>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            <NumberTicker value={deployments.length} startOnView={false} />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-border bg-background/60 p-0.5">
            {(["all", "Production", "Preview"] as const).map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "relative rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors outline-none",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId={`${uid}-env`}
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                    />
                  ) : null}
                  <span className="relative z-10">{tab === "all" ? "All" : tab}</span>
                </button>
              );
            })}
          </div>
          {onDeploy ? (
            <button
              type="button"
              onClick={onDeploy}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Deploy
            </button>
          ) : null}
        </div>
      </header>

      <ul className="mt-4 divide-y divide-border">
        {visible.map((item) => (
          <motion.li
            key={item.id}
            layout={!reduce}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="flex flex-col gap-3 py-3.5 first:pt-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <StatusGlyph status={item.status} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  {item.current ? (
                    <motion.span
                      layoutId={`${uid}-current`}
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      className="rounded-full border border-border bg-foreground/[0.06] px-2 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      Current
                    </motion.span>
                  ) : null}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <GitBranch aria-hidden="true" className="size-3" />
                    <span className="max-w-[10rem] truncate">{item.branch}</span>
                  </span>
                  <span className="font-mono">{item.sha}</span>
                  {item.authorInitials ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-4 place-items-center rounded-full text-[9px] font-semibold text-white",
                        item.authorAccent ?? "bg-sky-500",
                      )}
                    >
                      {item.authorInitials}
                    </span>
                  ) : null}
                  <span>{item.age}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {item.environment}
              </span>

              {/* 5-stage pipeline bar */}
              <div
                role="img"
                aria-label={`${item.stage} of 5 pipeline stages complete`}
                className="flex items-center gap-1"
              >
                {[1, 2, 3, 4, 5].map((stageNum) => {
                  const filled = stageNum <= item.stage;
                  return (
                    <span
                      key={stageNum}
                      className={cn(
                        "h-1.5 w-3.5 rounded-full transition-colors",
                        filled
                          ? item.status === "Error" && stageNum === item.stage
                            ? "bg-rose-500"
                            : item.status === "Building" && stageNum === item.stage
                              ? "animate-pulse bg-sky-400"
                              : "bg-emerald-500"
                          : "bg-foreground/[0.08]",
                      )}
                    />
                  );
                })}
              </div>

              <div className="w-14 text-right font-mono tabular-nums">
                <p className="text-xs text-foreground">{item.duration}</p>
                <p
                  className={cn(
                    "text-[11px]",
                    item.status === "Ready" && "text-emerald-500",
                    item.status === "Building" && "text-sky-400",
                    item.status === "Error" && "text-rose-400",
                  )}
                >
                  {item.status}
                </p>
              </div>

              <div className="flex w-16 items-center justify-end gap-1">
                {!item.current && item.status === "Ready" ? (
                  item.environment === "Preview" && onPromote ? (
                    <button
                      type="button"
                      aria-label={`Promote ${item.title} to production`}
                      title="Promote to production"
                      onClick={() => onPromote(item.id)}
                      className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Rocket aria-hidden="true" className="size-3.5" />
                    </button>
                  ) : onRollback ? (
                    <button
                      type="button"
                      aria-label={`Rollback to ${item.title}`}
                      title="Rollback"
                      onClick={() => onRollback(item.id)}
                      className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Undo2 aria-hidden="true" className="size-3.5" />
                    </button>
                  ) : null
                ) : null}

                <button
                  type="button"
                  aria-label={`Copy URL for ${item.title}`}
                  onClick={() => void copyUrl(item)}
                  className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {copiedId === item.id ? (
                    <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy aria-hidden="true" className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <footer className="mt-2 border-t border-border pt-3 font-mono text-xs text-muted-foreground tabular-nums">
        {deployments.length} deployments · {buildingCount} building · avg 45s
      </footer>
    </section>
  );
}
