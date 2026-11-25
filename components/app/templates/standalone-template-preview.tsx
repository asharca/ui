"use client";

import {
  Activity,
  ArrowLeftRight,
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  FolderKanban,
  GitBranch,
  Globe,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  MessageSquarePlus,
  Play,
  Plus,
  Plug,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Wallet,
  Webhook,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  PreviewExpand,
  PreviewExpandStage,
  PreviewExpandToggle,
  PreviewReplayToggle,
  PreviewViewportToggle,
} from "@/components/app/docs/preview-fullscreen";
import { cn } from "@/lib/utils";

type StandaloneSlug =
  | "workflow-studio"
  | "forecast-community"
  | "asset-workspace"
  | "assistant-workspace";

const WORKFLOW_NODES = [
  {
    id: "trigger",
    label: "Webhook Trigger",
    kind: "Trigger",
    detail: "POST /v1/inbound-lead · Signed HMAC",
    duration: "14ms",
    icon: Webhook,
    tone: "text-sky-500 bg-sky-500/10 border-sky-500/25",
  },
  {
    id: "enrich",
    label: "Knowledge Retrieval",
    kind: "Context",
    detail: "Vector index · Top 6 account docs",
    duration: "180ms",
    icon: Database,
    tone: "text-violet-500 bg-violet-500/10 border-violet-500/25",
  },
  {
    id: "agent",
    label: "Triage Agent",
    kind: "LLM Step",
    detail: "Classify priority & draft reply",
    duration: "640ms",
    icon: Bot,
    tone: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
  },
  {
    id: "notify",
    label: "Slack & CRM Sync",
    kind: "Action",
    detail: "Post #revops-triage + update deal",
    duration: "92ms",
    icon: CheckCircle2,
    tone: "text-amber-500 bg-amber-500/10 border-amber-500/25",
  },
] as const;

export function WorkflowStudioTemplatePreview() {
  const [view, setView] = useState<"canvas" | "knowledge" | "traces" | "signin">(
    "canvas",
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>("agent");
  const [runningStep, setRunningStep] = useState<number>(-1);
  const [lastRunStatus, setLastRunStatus] = useState<string>("Ready to test");
  const [email, setEmail] = useState("");

  const activeNode =
    WORKFLOW_NODES.find((node) => node.id === selectedNodeId) ?? WORKFLOW_NODES[0];

  const handleRunFlow = () => {
    setRunningStep(0);
    setLastRunStatus("Running trigger...");
    WORKFLOW_NODES.forEach((node, idx) => {
      window.setTimeout(() => {
        setRunningStep(idx);
        setSelectedNodeId(node.id);
        setLastRunStatus(
          idx === WORKFLOW_NODES.length - 1
            ? `Completed 4/4 steps · 926ms`
            : `Running ${node.label}...`,
        );
        if (idx === WORKFLOW_NODES.length - 1) {
          window.setTimeout(() => setRunningStep(-1), 900);
        }
      }, idx * 240);
    });
  };

  return (
    <div className="flex min-h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/70 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-foreground text-background">
            <GitBranch className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Workflow Studio
          </span>
          <span className="hidden rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            lead-router.flow
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-full bg-foreground/[0.05] p-0.5 text-xs">
          {(
            [
              ["canvas", "Canvas"],
              ["knowledge", "Knowledge"],
              ["traces", "Traces"],
              ["signin", "Sign in"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-colors",
                view === id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "signin" ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-card/30 px-4 py-8">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h3 className="text-center text-xl font-semibold tracking-tight">
              Welcome back
            </h3>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Sign in to build and run your workflows.
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => setView("canvas")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium transition-colors hover:bg-foreground/[0.05]"
              >
                <span className="font-semibold text-sky-500">G</span>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => setView("canvas")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium transition-colors hover:bg-foreground/[0.05]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-3.5 fill-current"
                >
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.15v3.18c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                </svg>
                Continue with GitHub
              </button>
            </div>
            <div className="my-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>or use your email</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setView("canvas");
              }}
              className="space-y-2.5"
            >
              <label className="block text-[11px] font-medium text-muted-foreground">
                Work email
                <div className="mt-1 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                  <Mail
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-sky-600 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-sky-500"
              >
                Enter workspace
              </button>
            </form>
          </div>
        </div>
      ) : view === "knowledge" ? (
        <div className="grid flex-1 gap-3 p-4 sm:grid-cols-3">
          {[
            {
              title: "Enterprise Pricing Handbook",
              chunks: "148 chunks · Updated 2h ago",
              status: "Indexed",
            },
            {
              title: "SOC2 & Security FAQ",
              chunks: "84 chunks · Updated yesterday",
              status: "Indexed",
            },
            {
              title: "SDK Webhook Schema v4",
              chunks: "212 chunks · Synced via GitHub",
              status: "Live sync",
            },
          ].map((source) => (
            <div
              key={source.title}
              className="flex flex-col justify-between rounded-xl border border-border bg-card/60 p-3.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <FileText
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    {source.status}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium">{source.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {source.chunks}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView("canvas")}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-sky-500 hover:underline"
              >
                Attach to workflow
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : view === "traces" ? (
        <div className="flex flex-1 flex-col gap-2 p-4">
          {[
            {
              runId: "run_94f1c",
              summary: "Inbound signup · acme.io",
              duration: "926ms",
              cost: "$0.004",
              ok: true,
            },
            {
              runId: "run_94f1a",
              summary: "Billing escalation · enterprise",
              duration: "1.18s",
              cost: "$0.006",
              ok: true,
            },
            {
              runId: "run_94e88",
              summary: "Webhook retry · rate-limited",
              duration: "412ms",
              cost: "$0.001",
              ok: false,
            },
          ].map((run) => (
            <div
              key={run.runId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    run.ok ? "bg-emerald-500" : "bg-amber-500",
                  )}
                />
                <span className="font-mono text-muted-foreground">
                  {run.runId}
                </span>
                <span className="font-medium text-foreground">
                  {run.summary}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-muted-foreground">
                <span>{run.duration}</span>
                <span>{run.cost}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid flex-1 gap-0 md:grid-cols-[1fr_240px]">
          <div
            className="relative flex flex-col justify-between p-4"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-border bg-card/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {lastRunStatus}
              </span>
              <button
                type="button"
                onClick={handleRunFlow}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                <Play className="size-3" aria-hidden="true" />
                Run flow
              </button>
            </div>

            <div className="my-4 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
              {WORKFLOW_NODES.map((node, index) => {
                const Icon = node.icon;
                const selected = node.id === selectedNodeId;
                const activeRun = runningStep === index;
                return (
                  <div
                    key={node.id}
                    className="flex flex-1 flex-col items-center gap-2 sm:flex-row"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={cn(
                        "w-full rounded-xl border bg-background/95 p-3 text-left transition-all",
                        selected
                          ? "border-sky-500 ring-2 ring-sky-500/20"
                          : "border-border hover:border-foreground/30",
                        activeRun && "scale-[1.02] border-emerald-500",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-md border",
                            node.tone,
                          )}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {node.duration}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold">{node.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {node.kind}
                      </p>
                    </button>
                    {index < WORKFLOW_NODES.length - 1 ? (
                      <ChevronRight
                        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span>4 nodes · 3 edges · Published v12</span>
              <span>Auto-saved</span>
            </div>
          </div>

          <div className="border-t border-border bg-card/50 p-4 md:border-t-0 md:border-l">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Node inspector
            </p>
            <h4 className="mt-1.5 text-sm font-semibold">{activeNode.label}</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {activeNode.detail}
            </p>
            <div className="mt-4 space-y-2 rounded-xl border border-border bg-background/70 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{activeNode.kind}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg latency</span>
                <span className="font-mono">{activeNode.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Retry policy</span>
                <span className="font-mono">3x exp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FORECAST_MARKETS = [
  {
    id: "championship",
    category: "Sports · Oct 18, 2026",
    question: "Who takes home the championship?",
    volume: "86.4k USDC volume · 2,104 people",
    outcomes: [
      { label: "Brooklyn Bears", odds: "2.08x", pct: 48 },
      { label: "LA Waves", odds: "3.13x", pct: 32 },
      { label: "Chicago Comets", odds: "5.00x", pct: 20 },
    ],
  },
  {
    id: "ai-benchmark",
    category: "Tech · Q4 2026",
    question: "Will open-weight models cross 90% on SWE-verified?",
    volume: "142.1k USDC volume · 3,490 people",
    outcomes: [
      { label: "Yes before Dec", odds: "1.61x", pct: 62 },
      { label: "Q1 2027", odds: "3.57x", pct: 28 },
      { label: "Later", odds: "10.0x", pct: 10 },
    ],
  },
  {
    id: "rate-cut",
    category: "Macro · Dec FOMC",
    question: "Federal funds target cut size in December?",
    volume: "310.8k USDC volume · 5,812 people",
    outcomes: [
      { label: "25 bps", odds: "1.47x", pct: 68 },
      { label: "50 bps", odds: "4.55x", pct: 22 },
      { label: "Hold", odds: "10.0x", pct: 10 },
    ],
  },
] as const;

export function ForecastCommunityTemplatePreview() {
  const [tab, setTab] = useState<"markets" | "leaderboards" | "rewards">(
    "markets",
  );
  const [marketIdx, setMarketIdx] = useState(0);
  const [selectedOutcome, setSelectedOutcome] = useState(0);
  const [stake, setStake] = useState(50);
  const [balance, setBalance] = useState(1250);
  const [receipt, setReceipt] = useState<string | null>(null);

  const market = FORECAST_MARKETS[marketIdx] ?? FORECAST_MARKETS[0];
  const outcome = market.outcomes[selectedOutcome] ?? market.outcomes[0];
  const multiplier = Number.parseFloat(outcome.odds.replace("x", "")) || 2;
  const payout = (stake * multiplier).toFixed(2);

  const handleTrade = () => {
    if (balance < stake) return;
    setBalance((prev) => Number((prev - stake).toFixed(2)));
    setReceipt(`Backed ${outcome.label} · $${stake} for $${payout}`);
  };

  return (
    <div className="flex min-h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <span className="text-base font-bold tracking-tight">forecast.</span>

        <div className="flex items-center gap-1 rounded-full bg-white/[0.06] p-1 text-xs">
          {(
            [
              ["markets", "Markets"],
              ["leaderboards", "Leaderboards"],
              ["rewards", "Rewards"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors",
                tab === id
                  ? "bg-white/12 text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-mono text-xs tabular-nums">
          <span className="size-2 rounded-full bg-sky-400" />$
          {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {tab === "leaderboards" ? (
        <div className="mx-5 mb-5 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Top seasonal forecasters</p>
            <span className="text-xs text-white/50">30d ROI</span>
          </div>
          <div className="space-y-2">
            {[
              { rank: "#1", handle: "elena.eth", accuracy: "78% hit", roi: "+$18,420" },
              { rank: "#2", handle: "marcus_quant", accuracy: "74% hit", roi: "+$12,910" },
              { rank: "#3", handle: "kai.markets", accuracy: "71% hit", roi: "+$9,340" },
            ].map((row) => (
              <div
                key={row.rank}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sky-400">{row.rank}</span>
                  <span className="font-medium">{row.handle}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-white/55">{row.accuracy}</span>
                  <span className="text-emerald-400">{row.roi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === "rewards" ? (
        <div className="mx-5 mb-5 grid flex-1 gap-3 sm:grid-cols-2">
          {[
            {
              title: "Weekly Accuracy Streak",
              progress: "4 / 5 markets resolved",
              bonus: "+120 USDC boost",
            },
            {
              title: "Liquidity Pioneer",
              progress: "3 markets supported",
              bonus: "2.0x fee rebate",
            },
          ].map((quest) => (
            <div
              key={quest.title}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div>
                <Trophy className="size-4 text-amber-400" aria-hidden="true" />
                <p className="mt-2.5 text-sm font-semibold">{quest.title}</p>
                <p className="mt-1 text-xs text-white/60">{quest.progress}</p>
              </div>
              <span className="mt-4 inline-flex w-fit rounded-full bg-sky-500/20 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                {quest.bonus}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
          <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-[#0f2554] via-[#0c1c3f] to-[#0a1328] p-5">
            <div className="flex items-center justify-between text-xs text-white/65">
              <span>Forecast spotlight hub</span>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums">
                  {marketIdx + 1} / {FORECAST_MARKETS.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOutcome(0);
                    setMarketIdx((idx) => (idx + 1) % FORECAST_MARKETS.length);
                  }}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white hover:bg-white/15"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-amber-300">
                  <Trophy className="size-3.5" aria-hidden="true" />
                  <span>Championship season</span>
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  The final call.
                </h3>
                <p className="mt-1 text-xs text-white/70">
                  Every tick updates implied probability.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090e1a]/90 p-3.5">
                <p className="text-[11px] text-white/55">{market.category}</p>
                <p className="mt-1 text-sm font-semibold">{market.question}</p>

                <div className="mt-3 space-y-2">
                  {market.outcomes.map((item, idx) => {
                    const active = idx === selectedOutcome;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedOutcome(idx)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                          active
                            ? "bg-sky-500/20 ring-1 ring-sky-400/50"
                            : "hover:bg-white/[0.04]",
                        )}
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <span className="font-medium text-white">
                            {item.label}
                          </span>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-sky-500 transition-all duration-300"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono tabular-nums">
                          <span className="text-white/55">{item.odds}</span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-white">
                            {item.pct}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2.5 text-[11px] text-white/45">
                  {market.volume}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/60">Ticket:</span>
              <span className="font-semibold text-sky-300">{outcome.label}</span>
              <div className="flex items-center gap-1">
                {[25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setStake(amount)}
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono transition-colors",
                      stake === amount
                        ? "bg-white text-slate-950"
                        : "bg-white/10 text-white/75 hover:bg-white/20",
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {receipt ? (
                <span className="text-[11px] text-emerald-400">{receipt}</span>
              ) : null}
              <button
                type="button"
                onClick={handleTrade}
                className="rounded-full bg-sky-500 px-3.5 py-1.5 font-medium text-white transition-colors hover:bg-sky-400"
              >
                Buy ${stake} · Pays ${payout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PORTFOLIO_SERIES: Record<"1D" | "1W" | "1M", number[]> = {
  "1D": [124800, 125400, 125100, 126900, 127300, 126800, 128440],
  "1W": [119200, 121400, 120800, 123900, 125600, 126900, 128440],
  "1M": [109500, 113800, 116400, 114900, 121300, 125100, 128440],
};

export function AssetWorkspaceTemplatePreview() {
  const [tab, setTab] = useState<"overview" | "swap" | "staking" | "connect">(
    "overview",
  );
  const [range, setRange] = useState<"1D" | "1W" | "1M">("1W");
  const [swapEth, setSwapEth] = useState(1.25);
  const [stakedSol, setStakedSol] = useState(120);
  const [swapReceipt, setSwapReceipt] = useState<string | null>(null);

  const series = PORTFOLIO_SERIES[range];
  const polylinePoints = useMemo(() => {
    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = Math.max(max - min, 1);
    return series
      .map((value, idx) => {
        const x = (idx / (series.length - 1)) * 280;
        const y = 70 - ((value - min) / span) * 56;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [series]);

  return (
    <div className="flex min-h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-background">
            <Wallet className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">folio.</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-full bg-foreground/[0.05] p-0.5 text-xs">
          {(
            [
              ["overview", "Overview"],
              ["swap", "Swap"],
              ["staking", "Staking"],
              ["connect", "Connect"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-colors",
                tab === id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "connect" ? (
        <div className="flex flex-1 items-center justify-center bg-card/30 p-5">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="mx-auto inline-flex size-10 items-center justify-center rounded-xl border border-border bg-card">
              <Wallet className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              Welcome to Asset Workspace
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Your multi-chain balances start with a clearer view.
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => setTab("overview")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium hover:bg-foreground/[0.05]"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => setTab("overview")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium hover:bg-foreground/[0.05]"
              >
                Continue with email
              </button>
              <button
                type="button"
                onClick={() => setTab("overview")}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-lime-200"
              >
                Connect wallet
              </button>
            </div>
          </div>
        </div>
      ) : tab === "swap" ? (
        <div className="flex flex-1 flex-col items-center justify-center p-5">
          <div className="w-full max-w-md space-y-3 rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Instant route swap</span>
              <span className="font-mono text-muted-foreground">
                Slippage 0.3%
              </span>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pay</span>
                <span>ETH</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <input
                  type="number"
                  step="0.25"
                  min="0.1"
                  value={swapEth}
                  onChange={(event) =>
                    setSwapEth(Number.parseFloat(event.target.value) || 0.25)
                  }
                  className="w-28 bg-transparent font-mono text-xl font-semibold outline-none"
                />
                <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium">
                  ETH
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-background">
                <ArrowLeftRight className="size-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Receive estimated</span>
                <span>USDC</span>
              </div>
              <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {(swapEth * 3240).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            {swapReceipt ? (
              <p className="text-center text-xs text-emerald-500">
                {swapReceipt}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() =>
                setSwapReceipt(
                  `Swapped ${swapEth} ETH for ${(swapEth * 3240).toFixed(2)} USDC`,
                )
              }
              className="w-full rounded-xl bg-foreground py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              Confirm swap
            </button>
          </div>
        </div>
      ) : tab === "staking" ? (
        <div className="grid flex-1 gap-3 p-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
              6.4% APY · Solana Native
            </span>
            <h4 className="mt-3 text-base font-semibold">Active Delegation</h4>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
              {stakedSol} SOL
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Est. annual reward: {(stakedSol * 0.064).toFixed(2)} SOL
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setStakedSol((s) => s + 25)}
                className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background"
              >
                + Stake 25 SOL
              </button>
              <button
                type="button"
                onClick={() => setStakedSol((s) => Math.max(0, s - 25))}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
              >
                Unstake
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Validator breakdown
            </p>
            <div className="mt-3 space-y-2 text-xs">
              {[
                ["Figment Institutional", "99.98% uptime", "6.4%"],
                ["Coinbase Cloud", "99.95% uptime", "6.2%"],
              ].map(([name, uptime, apy]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-[11px] text-muted-foreground">{uptime}</p>
                  </div>
                  <span className="font-mono text-emerald-500">{apy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 gap-4 p-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Net balance</p>
                <p className="mt-0.5 font-mono text-2xl font-semibold tabular-nums">
                  $128,440.18
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  +$5,910.40 (+4.82%)
                </span>
              </div>
              <div className="flex gap-1 rounded-full bg-foreground/[0.05] p-0.5 text-[11px]">
                {(["1D", "1W", "1M"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      range === r
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <svg
              viewBox="0 0 280 80"
              className="mt-4 h-28 w-full overflow-visible"
              role="img"
              aria-label="Portfolio performance curve"
            >
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
            </svg>

            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>3 connected wallets</span>
              <span>Synced 12s ago</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { symbol: "BTC", name: "Bitcoin", val: "$64,210", delta: "+3.4%" },
              { symbol: "ETH", name: "Ethereum", val: "$34,920", delta: "+5.1%" },
              { symbol: "SOL", name: "Solana", val: "$19,410", delta: "+8.9%" },
              { symbol: "USDC", name: "USD Coin", val: "$9,900", delta: "0.0%" },
            ].map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-3 py-2.5 text-xs"
              >
                <div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {asset.name}
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <p className="font-medium">{asset.val}</p>
                  <p className="text-[11px] text-emerald-500">{asset.delta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STARTER_PROMPTS = [
  { label: "Portfolio site", icon: Globe },
  { label: "Analytics dashboard", icon: LayoutDashboard },
  { label: "Landing page", icon: FileText },
  { label: "Task manager", icon: ListChecks },
] as const;

export function AssistantWorkspaceTemplatePreview() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [model, setModel] = useState("Sonnet 5");
  const [credits, setCredits] = useState(490);
  const [draft, setDraft] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(null);

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmittedPrompt(trimmed);
    setDraft("");
    setCredits((c) => Math.max(0, c - 4));
  };

  return (
    <div className="flex min-h-[460px] w-full overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      {sidebarOpen ? (
        <aside className="flex w-52 shrink-0 flex-col justify-between border-r border-border bg-card/60 p-3">
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setSubmittedPrompt(null)}
              className="flex w-full items-center gap-2 rounded-lg bg-foreground px-2.5 py-2 font-medium text-background"
            >
              <MessageSquarePlus className="size-3.5" aria-hidden="true" />
              New chat
            </button>
            {[
              { label: "Projects", icon: FolderKanban },
              { label: "Knowledge", icon: Database },
              { label: "Integrations", icon: Plug },
              { label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
          <p className="px-2 text-[11px] text-muted-foreground">
            Workspace · Personal
          </p>
        </aside>
      ) : null}

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle workspace navigation"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
          {submittedPrompt ? (
            <button
              type="button"
              onClick={() => setSubmittedPrompt(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              Reset thread
            </button>
          ) : null}
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pb-8">
          <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-sky-400">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            What should we move forward?
          </h3>

          {submittedPrompt ? (
            <div className="mt-5 w-full space-y-2.5 rounded-2xl border border-border bg-card/60 p-4 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-medium text-foreground">
                  {submittedPrompt}
                </span>
                <span className="font-mono">{model}</span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Scaffolded plan with 3 project routes, knowledge retrieval hook,
                and streaming SSE route handler ready to inspect in your project
                workspace.
              </p>
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(draft);
            }}
            className="mt-6 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border/70 bg-foreground/[0.03] px-4 py-2 text-xs text-muted-foreground">
              <span>{credits} Credits Remaining</span>
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="size-3 text-emerald-500" aria-hidden="true" />
                Local workspace
              </span>
            </div>
            <div className="p-3.5">
              <textarea
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask, plan, or build something..."
                className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Attach context"
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Toggle web search"
                    aria-pressed={webSearch}
                    onClick={() => setWebSearch((s) => !s)}
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-full transition-colors",
                      webSearch
                        ? "bg-sky-500/15 text-sky-400"
                        : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                    )}
                  >
                    <Globe className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModel((prev) =>
                        prev === "Sonnet 5"
                          ? "Opus 4.5"
                          : prev === "Opus 4.5"
                            ? "GPT-5"
                            : "Sonnet 5",
                      )
                    }
                    className="rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    {model}
                  </button>
                </div>

                <button
                  type="submit"
                  aria-label="Send prompt"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-sky-600 text-white transition-colors hover:bg-sky-500"
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {STARTER_PROMPTS.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSubmit(`Build a ${chip.label.toLowerCase()} template`)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTemplateBySlug(slug: StandaloneSlug) {
  switch (slug) {
    case "workflow-studio":
      return <WorkflowStudioTemplatePreview />;
    case "forecast-community":
      return <ForecastCommunityTemplatePreview />;
    case "asset-workspace":
      return <AssetWorkspaceTemplatePreview />;
    case "assistant-workspace":
      return <AssistantWorkspaceTemplatePreview />;
  }
}

export function StandaloneTemplateStage({
  slug,
  title,
}: {
  slug: StandaloneSlug;
  title: string;
}) {
  return (
    <PreviewExpand stageId={`template-stage-${slug}`}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/30 p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
            <span>{title} · Interactive preview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PreviewViewportToggle />
            <PreviewReplayToggle />
            <PreviewExpandToggle />
          </div>
        </div>
        <PreviewExpandStage>{renderTemplateBySlug(slug)}</PreviewExpandStage>
      </div>
    </PreviewExpand>
  );
}
