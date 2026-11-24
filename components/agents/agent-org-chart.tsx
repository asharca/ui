"use client";

import {
  BarChart2,
  Check,
  Code2,
  FileText,
  FlaskConical,
  Globe,
  Network,
  PenLine,
  RotateCcw,
  ScanSearch,
  Search,
  Table2,
  Terminal,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type OrgChartAccent =
  | "blue"
  | "sky"
  | "teal"
  | "lime"
  | "amber"
  | "emerald"
  | "yellow"
  | "violet"
  | "rose";

export type OrgChartIconKind =
  | "network"
  | "search"
  | "scan"
  | "chart"
  | "pen"
  | "code"
  | "flask";

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
  icon?: OrgChartIconKind;
  tools?: Array<"search" | "doc" | "code" | "write" | "terminal" | "globe" | "table">;
  children?: OrgChartAgent[];
}

export interface AgentOrgChartProps {
  root: OrgChartAgent;
  onReplay?: () => void;
  className?: string;
}

const ACCENT_MAP: Record<
  OrgChartAccent,
  { ring: string; stroke: string; line: string }
> = {
  blue: {
    ring: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    stroke: "stroke-blue-400",
    line: "bg-blue-400",
  },
  sky: {
    ring: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    stroke: "stroke-sky-400",
    line: "bg-sky-400",
  },
  teal: {
    ring: "border-teal-500/20 bg-teal-500/10 text-teal-400",
    stroke: "stroke-teal-400",
    line: "bg-teal-400",
  },
  lime: {
    ring: "border-lime-500/20 bg-lime-500/10 text-lime-400",
    stroke: "stroke-lime-400",
    line: "bg-lime-400",
  },
  amber: {
    ring: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    stroke: "stroke-amber-400",
    line: "bg-amber-400",
  },
  emerald: {
    ring: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    stroke: "stroke-emerald-400",
    line: "bg-emerald-400",
  },
  yellow: {
    ring: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    stroke: "stroke-yellow-400",
    line: "bg-yellow-400",
  },
  violet: {
    ring: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    stroke: "stroke-violet-400",
    line: "bg-violet-400",
  },
  rose: {
    ring: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    stroke: "stroke-rose-400",
    line: "bg-rose-400",
  },
};

function ToolIcon({ kind }: { kind: NonNullable<OrgChartAgent["tools"]>[number] }) {
  switch (kind) {
    case "search":
      return <Search aria-hidden="true" className="size-3" />;
    case "globe":
      return <Globe aria-hidden="true" className="size-3" />;
    case "table":
      return <Table2 aria-hidden="true" className="size-3" />;
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

function RoleIcon({ agent, isRoot }: { agent: OrgChartAgent; isRoot: boolean }) {
  const kind = agent.icon;
  if (kind === "network" || (!kind && isRoot)) return <Network className="size-3.5" />;
  if (kind === "search") return <Search className="size-3.5" />;
  if (kind === "scan") return <ScanSearch className="size-3.5" />;
  if (kind === "chart") return <BarChart2 className="size-3.5" />;
  if (kind === "pen") return <PenLine className="size-3.5" />;
  if (kind === "code") return <Code2 className="size-3.5" />;
  if (kind === "flask") return <FlaskConical className="size-3.5" />;
  const lower = agent.name.toLowerCase();
  if (lower.includes("research")) return <Search className="size-3.5" />;
  if (lower.includes("scrap")) return <ScanSearch className="size-3.5" />;
  if (lower.includes("analy")) return <BarChart2 className="size-3.5" />;
  if (lower.includes("writ")) return <PenLine className="size-3.5" />;
  if (lower.includes("cod")) return <Code2 className="size-3.5" />;
  if (lower.includes("test")) return <FlaskConical className="size-3.5" />;
  return <Network className="size-3.5" />;
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
        "relative inline-flex h-6 shrink-0 items-center overflow-hidden rounded-full border px-2.5 text-[11px] font-medium transition-colors",
        status === "queued" && "border-border/70 bg-foreground/[0.03] text-muted-foreground",
        status === "running" && "border-border bg-foreground/[0.05] text-foreground",
        status === "done" && "border-border/80 bg-foreground/[0.05] text-foreground",
        status === "error" && "border-rose-500/30 bg-rose-500/10 text-rose-400",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
          className="inline-flex items-center gap-1.5"
        >
          {status === "running" ? (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3 -rotate-90">
              <circle
                cx="8"
                cy="8"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.18"
                strokeWidth="2"
              />
              <motion.circle
                cx="8"
                cy="8"
                r="5.5"
                fill="none"
                pathLength="1"
                strokeWidth="2"
                strokeLinecap="round"
                className={palette.stroke}
                initial={false}
                animate={{
                  strokeDasharray: `${Math.max(0.08, Math.min(1, progress / 100))} 1`,
                }}
                transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}
              />
            </svg>
          ) : status === "done" ? (
            <Check aria-hidden="true" className="size-3 text-foreground" strokeWidth={2.5} />
          ) : status === "error" ? (
            <X aria-hidden="true" className="size-3" />
          ) : (
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-muted-foreground/60"
            />
          )}
          <span>{label}</span>
        </motion.span>
      </AnimatePresence>
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
  const accent = agent.accent ?? "blue";
  const palette = ACCENT_MAP[accent];
  const dimmed = agent.status === "queued";

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
      className={cn(
        "relative rounded-2xl border bg-background p-3.5 text-left transition-colors duration-200",
        agent.status === "running"
          ? "border-border-strong shadow-sm"
          : dimmed
            ? "border-border/55"
            : "border-border/80",
        isRoot && "mx-auto w-full md:w-[calc((100%-2rem)/3)]",
      )}
    >
      <div
        className={cn(
          "transition-opacity duration-300",
          dimmed ? "opacity-45" : "opacity-100",
        )}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg border",
                palette.ring,
              )}
            >
              <RoleIcon agent={agent} isRoot={isRoot} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
                {agent.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
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

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {agent.tools?.length ? (
            <span className="mr-1.5 inline-flex items-center gap-1 align-middle text-muted-foreground/80">
              {agent.tools.map((tool) => (
                <ToolIcon key={tool} kind={tool} />
              ))}
            </span>
          ) : null}
          <span>{agent.task}</span>
        </p>

        <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          <NumberTicker
            value={agent.cost ?? 0}
            decimals={2}
            prefix="$"
            startOnView={false}
          />
          <span aria-hidden="true">·</span>
          <span>{agent.elapsedSeconds ?? 0}s</span>
        </div>
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

/** Hierarchical multi-agent orchestrator org chart with colored orthogonal connector branches. */
export function AgentOrgChart({ root, onReplay, className }: AgentOrgChartProps) {
  const reduce = useReducedMotion() ?? false;
  const summary = summarizeTree(root);
  const children = root.children ?? [];

  return (
    <section
      aria-label="Agent orchestration org chart"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 pb-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-lg border border-border bg-background/80 text-muted-foreground"
          >
            <Network className="size-3.5" />
          </span>
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
              className="ml-1 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            {/* Colored SVG orthogonal trunk + multi-branch distribution */}
            <div className="hidden w-full md:block" aria-hidden="true">
              <svg
                aria-hidden="true"
                viewBox="0 0 600 44"
                preserveAspectRatio="none"
                className="h-11 w-full overflow-visible"
              >
                {children.length === 3 ? (
                  <>
                    <path
                      d="M300 0 L300 20 L100 20 L100 44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-border"
                    />
                    <path
                      d="M300 0 L300 44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-border"
                    />
                    <path
                      d="M300 0 L300 20 L500 20 L500 44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-border"
                    />
                    <motion.path
                      d="M300 0 L300 20 L100 20 L100 44"
                      fill="none"
                      strokeWidth="1.5"
                      className={ACCENT_MAP[children[0]?.accent ?? "sky"].stroke}
                      initial={false}
                      animate={{ pathLength: children[0]?.status === "queued" ? 0 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
                    />
                    <motion.path
                      d="M300 0 L300 44"
                      fill="none"
                      strokeWidth="1.5"
                      className={ACCENT_MAP[children[1]?.accent ?? "amber"].stroke}
                      initial={false}
                      animate={{ pathLength: children[1]?.status === "queued" ? 0 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
                    />
                    <motion.path
                      d="M300 0 L300 20 L500 20 L500 44"
                      fill="none"
                      strokeWidth="1.5"
                      className={ACCENT_MAP[children[2]?.accent ?? "emerald"].stroke}
                      initial={false}
                      animate={{ pathLength: children[2]?.status === "queued" ? 0 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
                    />
                  </>
                ) : (
                  <line
                    x1="300"
                    y1="0"
                    x2="300"
                    y2="44"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-border-strong"
                  />
                )}
              </svg>
            </div>

            <div className="h-5 w-px bg-border md:hidden" aria-hidden="true" />

            <div
              className={cn(
                "grid w-full gap-4",
                children.length === 1
                  ? "max-w-xs grid-cols-1"
                  : children.length === 2
                    ? "max-w-2xl grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-3",
              )}
            >
              {children.map((child) => {
                const subs = child.children ?? [];
                return (
                  <div key={child.id} className="relative flex flex-col">
                    <AgentCard agent={child} reduce={reduce} />

                    {subs.length ? (
                      <div className="relative mt-3 flex flex-col gap-3 pl-5">
                        {subs.map((sub, subIndex) => {
                          const subPalette =
                            ACCENT_MAP[sub.accent ?? child.accent ?? "sky"];
                          const nextSub = subs[subIndex + 1];
                          const nextPalette = nextSub
                            ? ACCENT_MAP[nextSub.accent ?? child.accent ?? "sky"]
                            : null;
                          const active = sub.status !== "queued";
                          const nextActive = nextSub ? nextSub.status !== "queued" : false;

                          return (
                            <div key={sub.id} className="relative">
                              {/* Upper vertical stub from parent card or previous sub-row */}
                              <span
                                aria-hidden="true"
                                className="absolute -left-3 -top-3 bottom-1/2 w-px bg-border"
                              />
                              <motion.span
                                aria-hidden="true"
                                initial={false}
                                animate={{ scaleY: active ? 1 : 0 }}
                                transition={{
                                  duration: reduce ? 0 : 0.22,
                                  delay: reduce || !active ? 0 : subIndex === 0 ? 0 : 0.1,
                                  ease: EASE_OUT,
                                }}
                                style={{ transformOrigin: "top" }}
                                className={cn(
                                  "absolute -left-3 -top-3 bottom-1/2 w-px",
                                  subPalette.line,
                                )}
                              />

                              {/* Horizontal elbow arm into sub card */}
                              <span
                                aria-hidden="true"
                                className="absolute -left-3 top-1/2 h-px w-3 bg-border"
                              />
                              <motion.span
                                aria-hidden="true"
                                initial={false}
                                animate={{ scaleX: active ? 1 : 0 }}
                                transition={{
                                  duration: reduce ? 0 : 0.18,
                                  delay: reduce || !active ? 0 : subIndex === 0 ? 0.16 : 0.24,
                                  ease: EASE_OUT,
                                }}
                                style={{ transformOrigin: "left" }}
                                className={cn(
                                  "absolute -left-3 top-1/2 h-px w-3",
                                  subPalette.line,
                                )}
                              />

                              {/* Lower vertical continuation to next sub-row */}
                              {nextSub ? (
                                <>
                                  <span
                                    aria-hidden="true"
                                    className="absolute -left-3 bottom-0 top-1/2 w-px bg-border"
                                  />
                                  {nextPalette ? (
                                    <motion.span
                                      aria-hidden="true"
                                      initial={false}
                                      animate={{ scaleY: nextActive ? 1 : 0 }}
                                      transition={{
                                        duration: reduce ? 0 : 0.18,
                                        ease: EASE_OUT,
                                      }}
                                      style={{ transformOrigin: "top" }}
                                      className={cn(
                                        "absolute -left-3 bottom-0 top-1/2 w-px",
                                        nextPalette.line,
                                      )}
                                    />
                                  ) : null}
                                </>
                              ) : null}

                              <AgentCard agent={sub} reduce={reduce} />
                            </div>
                          );
                        })}
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
