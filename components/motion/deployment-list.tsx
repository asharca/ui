"use client";

import { ArrowUpRight, Check, Copy, GitBranch, Plus, RotateCcw } from "lucide-react";
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
  environment: "Production" | "Preview";
  duration: string;
  stage: 1 | 2 | 3 | 4 | 5;
  status: "Building" | "Ready";
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

/** Recent deployments list with 5-stage progress bars, promote/rollback reordering, and URL copy. */
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

  const visible = useMemo(() => {
    const base =
      filter === "all"
        ? deployments
        : deployments.filter((item) => item.environment === filter);
    return [...base].sort((a, b) => Number(Boolean(b.current)) - Number(Boolean(a.current)));
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
        "mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold">Deployments</h3>
          <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums">
            <NumberTicker value={deployments.length} startOnView={false} />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-border bg-background p-0.5">
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
                      className="absolute inset-0 rounded-full bg-card shadow-xs"
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

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {visible.map((item) => (
          <motion.li
            key={item.id}
            layout={!reduce}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </span>
                {item.current ? (
                  <motion.span
                    layoutId={`${uid}-current`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500"
                  >
                    Current
                  </motion.span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-mono">
                  <GitBranch aria-hidden="true" className="size-3" />
                  {item.branch}
                </span>
                <span className="font-mono">{item.sha}</span>
                <span>{item.age}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {item.environment}
                </span>
                <span className="font-mono tabular-nums">{item.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                          ? item.status === "Building" && stageNum === item.stage
                            ? "animate-pulse bg-sky-400"
                            : "bg-emerald-500"
                          : "bg-muted",
                      )}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                aria-label={`Copy URL for ${item.title}`}
                onClick={() => void copyUrl(item)}
                className="grid size-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {copiedId === item.id ? (
                  <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy aria-hidden="true" className="size-3.5" />
                )}
              </button>

              {!item.current && item.status === "Ready" ? (
                item.environment === "Preview" && onPromote ? (
                  <button
                    type="button"
                    onClick={() => onPromote(item.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Promote
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </button>
                ) : onRollback ? (
                  <button
                    type="button"
                    onClick={() => onRollback(item.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RotateCcw aria-hidden="true" className="size-3" />
                    Rollback
                  </button>
                ) : null
              ) : null}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
