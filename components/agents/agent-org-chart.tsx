"use client";

import {
  Check,
  Code2,
  FileText,
  Network,
  PenLine,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { NumberTicker } from "@/components/motion/number-ticker";
import { cn } from "@/lib/utils";

export type OrgChartAccent = "sky" | "amber" | "emerald" | "violet" | "rose";

export interface OrgChartAgent {
  id: string;
  name: string;
  model: string;
  task: string;
  status: "queued" | "running" | "done" | "error";
  progress?: number;
  cost?: number;
  elapsedSeconds?: number;
  accent?: OrgChartAccent;
  tools?: Array<"search" | "doc" | "code" | "write" | "terminal">;
  children?: OrgChartAgent[];
}

export interface AgentOrgChartProps {
  root: OrgChartAgent;
  onReplay?: () => void;
  className?: string;
}

const ACCENT_MAP: Record<
  OrgChartAccent,
  { ring: string; badge: string; stroke: string; line: string }
> = {
  sky: {
    ring: "bg-sky-500/15 text-sky-400",
    badge: "text-sky-400",
    stroke: "stroke-sky-400",
    line: "bg-sky-400/70",
  },
  amber: {
    ring: "bg-amber-500/15 text-amber-400",
    badge: "text-amber-400",
    stroke: "stroke-amber-400",
    line: "bg-amber-400/70",
  },
  emerald: {
    ring: "bg-emerald-500/15 text-emerald-400",
    badge: "text-emerald-400",
    stroke: "stroke-emerald-400",
    line: "bg-emerald-400/70",
  },
  violet: {
    ring: "bg-violet-500/15 text-violet-400",
    badge: "text-violet-400",
    stroke: "stroke-violet-400",
    line: "bg-violet-400/70",
  },
  rose: {
    ring: "bg-rose-500/15 text-rose-400",
    badge: "text-rose-400",
    stroke: "stroke-rose-400",
    line: "bg-rose-400/70",
  },
};

function ToolIcon({ kind }: { kind: NonNullable<OrgChartAgent["tools"]>[number] }) {
  switch (kind) {
    case "search":
      return <Search aria-hidden="true" className="size-3" />;
    case "doc":
      return <FileText aria-hidden="true" className="size-3" />;
    case "code":
      return <Code2 aria-hidden="true" className="size-3" />;
    case "write":
      return <PenLine aria-hidden="true" className="size-3" />;
    default:
      return <Terminal aria-hidden="true" className="size-3" />;
  }
}

function StatusPill({
  status,
  progress = 45,
  accent,
  reduce,
}: {
  status: OrgChartAgent["status"];
  progress?: number;
  accent: OrgChartAccent;
  reduce: boolean;
}) {
  const palette = ACCENT_MAP[accent];
  const label =
    status === "queued"
      ? "Queued"
      : status === "running"
        ? "Running"
        : status === "done"
          ? "Done"
          : "Failed";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium",
        status === "queued" && "bg-muted/40 text-muted-foreground",
        status === "running" && "bg-card text-foreground",
        status === "done" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        status === "error" && "border-rose-500/30 bg-rose-500/10 text-rose-500",
      )}
    >
      {status === "running" ? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3 -rotate-90">
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <motion.circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            pathLength="1"
            strokeWidth="2"
            strokeLinecap="round"
            className={palette.stroke}
            initial={false}
            animate={{
              strokeDasharray: `${Math.max(0.08, Math.min(1, progress / 100))} 1`,
            }}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
          />
        </svg>
      ) : status === "done" ? (
        <Check aria-hidden="true" className="size-3" />
      ) : status === "error" ? (
        <X aria-hidden="true" className="size-3" />
      ) : (
        <span
          aria-hidden="true"
          className="size-2 rounded-full border border-dashed border-muted-foreground/60"
        />
      )}
      <span>{label}</span>
    </span>
  );
}

function AgentCard({
  agent,
  isRoot = false,
  reduce,
}: {
  agent: OrgChartAgent;
  isRoot?: boolean;
  reduce: boolean;
}) {
  const accent = agent.accent ?? "sky";
  const palette = ACCENT_MAP[accent];
  const dimmed = agent.status === "queued";

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
      className={cn(
        "relative rounded-2xl border bg-card p-3.5 text-left transition-colors",
        agent.status === "running"
          ? "border-border-strong shadow-sm"
          : "border-border",
        isRoot && "mx-auto w-full max-w-xs",
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={cn("grid size-7 shrink-0 place-items-center rounded-full", palette.ring)}
          >
            {isRoot ? (
              <Network className="size-3.5" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">
              {agent.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {agent.model}
            </p>
          </div>
        </div>
        <StatusPill
          status={agent.status}
          progress={agent.progress}
          accent={accent}
          reduce={reduce}
        />
      </div>

      <p
        className={cn(
          "mt-3 line-clamp-2 text-xs leading-relaxed",
          dimmed ? "text-muted-foreground/75" : "text-muted-foreground",
        )}
      >
        {agent.tools?.length ? (
          <span className="mr-1.5 inline-flex items-center gap-1 align-middle text-muted-foreground/80">
            {agent.tools.map((tool) => (
              <ToolIcon key={tool} kind={tool} />
            ))}
          </span>
        ) : null}
        {agent.task}
      </p>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        <span>${(agent.cost ?? 0).toFixed(2)}</span>
        <span aria-hidden="true">·</span>
        <span>{agent.elapsedSeconds ?? 0}s</span>
      </div>
    </motion.div>
  );
}

function summarizeTree(root: OrgChartAgent) {
  let total = 0;
  let running = 0;
  let cost = 0;
  const walk = (node: OrgChartAgent) => {
    total += 1;
    if (node.status === "running") running += 1;
    cost += node.cost ?? 0;
    for (const child of node.children ?? []) walk(child);
  };
  walk(root);
  return { total, running, cost };
}

/** Hierarchical multi-agent orchestrator org chart with live connector lines. */
export function AgentOrgChart({ root, onReplay, className }: AgentOrgChartProps) {
  const reduce = useReducedMotion() ?? false;
  const summary = summarizeTree(root);
  const children = root.children ?? [];

  return (
    <section
      aria-label="Agent orchestration org chart"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-background p-4 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 pb-5">
        <div className="flex items-center gap-2">
          <Network aria-hidden="true" className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Agents</h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
          <span>{summary.total} agents</span>
          <span aria-hidden="true">·</span>
          <span>
            <NumberTicker value={summary.running} startOnView={false} /> running
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <NumberTicker
              value={summary.cost}
              decimals={2}
              prefix="$"
              startOnView={false}
            />
          </span>
          {onReplay ? (
            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay agent run"
              title="Replay agent run"
              className="ml-1 inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex flex-col items-center">
        <AgentCard agent={root} isRoot reduce={reduce} />

        {children.length > 0 ? (
          <>
            <div className="relative h-6 w-px bg-border" aria-hidden="true">
              <motion.div
                initial={false}
                animate={{
                  scaleY: root.status === "queued" ? 0 : 1,
                }}
                transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}
                style={{ transformOrigin: "top" }}
                className={cn("h-full w-full", ACCENT_MAP[root.accent ?? "sky"].line)}
              />
            </div>
            <div
              className={cn(
                "relative grid w-full gap-4 pt-5",
                children.length === 1
                  ? "max-w-xs grid-cols-1"
                  : children.length === 2
                    ? "max-w-2xl grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-3",
              )}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[16%] top-0 hidden h-px bg-border md:block"
              />
              {children.map((child) => {
                const childAccent = ACCENT_MAP[child.accent ?? "sky"];
                const active = child.status !== "queued";
                return (
                  <div key={child.id} className="relative flex flex-col">
                    <div
                      aria-hidden="true"
                      className="mx-auto hidden h-5 w-px bg-border md:block md:-mt-5"
                    >
                      <motion.div
                        initial={false}
                        animate={{ scaleY: active ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
                        style={{ transformOrigin: "top" }}
                        className={cn("h-full w-full", childAccent.line)}
                      />
                    </div>
                    <AgentCard agent={child} reduce={reduce} />

                    {child.children?.length ? (
                      <div className="mt-3 space-y-3 border-l border-border pl-4">
                        {child.children.map((sub) => (
                          <AgentCard key={sub.id} agent={sub} reduce={reduce} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
