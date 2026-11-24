"use client";

import {
  AlertTriangle,
  Check,
  ExternalLink,
  GitBranch,
  GitCommit,
  Globe,
  RotateCcw,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DeploymentBuildStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  durationSeconds?: number;
}

export interface DeploymentLogEntry {
  id: string;
  time: string;
  level?: "info" | "warn" | "error" | "success";
  message: string;
}

export interface DeploymentBuildProps {
  commitMessage: string;
  environment: "Production" | "Preview";
  branch: string;
  commitSha: string;
  author: string;
  createdAgo: string;
  domains: string[];
  status: "queued" | "building" | "ready" | "error";
  elapsedSeconds: number;
  steps: DeploymentBuildStep[];
  logs: DeploymentLogEntry[];
  errorSummary?: string;
  onRedeploy?: () => void;
  onRetry?: () => void;
  visitHref?: string;
  className?: string;
}

/** Deployment build view with live step checklist, streaming logs, and preview reveal slot. */
export function DeploymentBuild({
  commitMessage,
  environment,
  branch,
  commitSha,
  author,
  createdAgo,
  domains,
  status,
  elapsedSeconds,
  steps,
  logs,
  errorSummary = "Typecheck failed in app/pricing/page.tsx (exit code 1)",
  onRedeploy,
  onRetry,
  visitHref = "#preview",
  className,
}: DeploymentBuildProps) {
  const reduce = useReducedMotion() ?? false;
  const logContainerRef = useRef<HTMLDivElement>(null);
  const doneSteps = steps.filter((s) => s.status === "done").length;
  const logCount = logs.length;

  useEffect(() => {
    const el = logContainerRef.current;
    if (!el || logCount === 0) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [logCount, reduce]);

  return (
    <section
      aria-label={`Deployment ${commitMessage}`}
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {commitMessage}
            </h3>
            <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {environment}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-mono">
              <GitBranch aria-hidden="true" className="size-3" />
              {branch}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <GitCommit aria-hidden="true" className="size-3" />
              {commitSha}
            </span>
            <span>{author}</span>
            <span aria-hidden="true">·</span>
            <span>{createdAgo}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            <NumberTicker value={elapsedSeconds} decimals={1} startOnView={false} />s
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
              status === "ready" &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
              status === "building" &&
                "border-sky-500/30 bg-sky-500/10 text-sky-400",
              status === "error" &&
                "border-rose-500/30 bg-rose-500/10 text-rose-400",
              status === "queued" &&
                "border-border bg-background text-muted-foreground",
            )}
          >
            {status === "ready"
              ? "Ready"
              : status === "building"
                ? "Building"
                : status === "error"
                  ? "Error"
                  : "Queued"}
          </span>
          {onRedeploy ? (
            <button
              type="button"
              onClick={onRedeploy}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-3" />
              Redeploy
            </button>
          ) : null}
          <a
            href={visitHref}
            onClick={(event) => {
              if (visitHref.startsWith("#")) event.preventDefault();
            }}
            aria-disabled={status !== "ready"}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
              status === "ready"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "pointer-events-none border border-border bg-muted/40 text-muted-foreground/60",
            )}
          >
            Visit
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </div>
      </header>

      {/* Fixed preview slot */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background p-4">
        <AnimatePresence mode="wait" initial={false}>
          {status === "ready" ? (
            <motion.div
              key="ready-preview"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="grid h-16 w-28 shrink-0 place-items-center rounded-xl border border-border bg-gradient-to-br from-sky-500/15 via-card to-emerald-500/15 p-2"
                >
                  <div className="w-full space-y-1.5">
                    <div className="h-1.5 w-10 rounded-full bg-foreground/70" />
                    <div className="h-1 w-16 rounded-full bg-muted-foreground/40" />
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      <div className="h-3 rounded bg-card/90" />
                      <div className="h-3 rounded bg-primary/30" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-500">
                    Deployment live in {elapsedSeconds.toFixed(1)}s
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {domains.map((domain) => (
                      <span
                        key={domain}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[11px] text-foreground"
                      >
                        <Globe aria-hidden="true" className="size-3 text-muted-foreground" />
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                HTTP 200 · Edge cached
              </span>
            </motion.div>
          ) : status === "error" ? (
            <motion.div
              key="error-preview"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5"
            >
              <div className="flex items-start gap-2.5 text-xs">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-rose-400"
                />
                <div>
                  <p className="font-semibold text-rose-400">Build check failed</p>
                  <p className="mt-0.5 font-mono text-rose-300/90">
                    {errorSummary}
                  </p>
                </div>
              </div>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-rose-500 px-3 text-xs font-medium text-white transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <RotateCcw aria-hidden="true" className="size-3" />
                  Retry
                </button>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="building-sketch"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="grid h-14 w-24 place-items-center rounded-xl border border-dashed border-border bg-muted/30"
                >
                  <div className="h-2 w-12 animate-pulse rounded-full bg-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {status === "queued"
                      ? "Waiting for build worker"
                      : "Building application bundle"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    The preview shows up once the build is live
                  </p>
                </div>
              </div>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={false}
                  animate={{
                    width: `${Math.max(8, Math.round((doneSteps / Math.max(1, steps.length)) * 100))}%`,
                  }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Checklist + live log */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Build steps</span>
            <span className="font-mono text-muted-foreground tabular-nums">
              {doneSteps}/{steps.length}
            </span>
          </div>
          <ol className="space-y-2">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full border",
                      step.status === "done" &&
                        "border-emerald-500 bg-emerald-500/15 text-emerald-500",
                      step.status === "running" &&
                        "border-primary text-primary",
                      step.status === "error" &&
                        "border-rose-500 bg-rose-500/15 text-rose-400",
                      step.status === "pending" && "border-border",
                    )}
                  >
                    {step.status === "done" ? (
                      <Check className="size-2.5" strokeWidth={2.5} />
                    ) : step.status === "running" ? (
                      <span className="size-1.5 animate-ping rounded-full bg-primary" />
                    ) : step.status === "error" ? (
                      <span className="size-1.5 rounded-full bg-rose-400" />
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "truncate",
                      step.status === "pending"
                        ? "text-muted-foreground"
                        : step.status === "error"
                          ? "font-medium text-rose-400"
                          : "text-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </span>
                {step.durationSeconds !== undefined ? (
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {step.durationSeconds.toFixed(1)}s
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={logContainerRef}
          role="log"
          aria-label="Streaming build output"
          className="h-64 overflow-y-auto rounded-2xl border border-border bg-neutral-950 p-3.5 font-mono text-[11px] leading-6 text-neutral-300"
        >
          {logs.map((entry) => (
            <div key={entry.id} className="flex gap-2.5">
              <span className="shrink-0 text-neutral-500">{entry.time}</span>
              <span
                className={cn(
                  "break-all",
                  entry.level === "error" && "text-rose-400",
                  entry.level === "success" && "text-emerald-400",
                  entry.level === "warn" && "text-amber-300",
                )}
              >
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
