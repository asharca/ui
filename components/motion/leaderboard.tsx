"use client";

import { ArrowDown, ArrowUp, Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface LeaderboardMember {
  id: string;
  name: string;
  initials: string;
  accent?: string;
  score: number;
  delta?: number;
  isViewer?: boolean;
}

export interface LeaderboardPeriodData {
  id: string;
  label: string;
  members: LeaderboardMember[];
}

export interface LeaderboardProps {
  title?: string;
  subtitle?: string;
  periods: LeaderboardPeriodData[];
  defaultPeriod?: string;
  onBoostViewer?: (periodId: string) => void;
  className?: string;
}

function DeltaBadge({ delta = 0 }: { delta?: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
        <ArrowUp aria-hidden="true" className="size-2.5" />
        {delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-rose-400">
        <ArrowDown aria-hidden="true" className="size-2.5" />
        {Math.abs(delta)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] text-muted-foreground">
      <Minus aria-hidden="true" className="size-2.5" />
    </span>
  );
}

/** Compact leaderboard with animated podium plinths, period tabs, layout re-sorting, and pinned viewer row. */
export function Leaderboard({
  title = "Leaderboard",
  subtitle = "Points from merged reviews",
  periods,
  defaultPeriod,
  onBoostViewer,
  className,
}: LeaderboardProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [periodId, setPeriodId] = useState(defaultPeriod ?? periods[0]?.id ?? "");

  const currentPeriod =
    periods.find((p) => p.id === periodId) ?? periods[0];

  const sorted = [...(currentPeriod?.members ?? [])].sort(
    (a, b) => b.score - a.score,
  );
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const rest = sorted.slice(3, 6);
  const viewerIndex = sorted.findIndex((m) => m.isViewer);
  const viewer = viewerIndex >= 0 ? sorted[viewerIndex] : null;
  const showPinnedViewer = Boolean(viewer && viewerIndex >= 6);

  const podiumSlots = [
    { member: second, rank: 2, heightClass: "h-20", tone: "border-sky-500/30 bg-sky-500/10" },
    { member: first, rank: 1, heightClass: "h-28", tone: "border-amber-500/40 bg-amber-500/15" },
    { member: third, rank: 3, heightClass: "h-16", tone: "border-orange-500/30 bg-orange-500/10" },
  ];

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div
          role="tablist"
          aria-label="Leaderboard timeframe"
          className="inline-flex rounded-full border border-border bg-background p-0.5"
        >
          {periods.map((period) => {
            const active = period.id === currentPeriod?.id;
            return (
              <button
                key={period.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPeriodId(period.id)}
                className={cn(
                  "relative rounded-full px-2.5 py-1 text-xs font-medium transition-colors outline-none",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={`${uid}-period`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="absolute inset-0 rounded-full bg-card shadow-xs"
                  />
                ) : null}
                <span className="relative z-10">{period.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Top 3 podium */}
      <div className="mt-6 grid grid-cols-3 items-end gap-2.5 border-b border-border pb-4">
        {podiumSlots.map(({ member, rank, heightClass, tone }) =>
          member ? (
            <div key={member.id} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 place-items-center rounded-full border border-border text-xs font-semibold",
                  member.accent ?? "bg-background text-foreground",
                )}
              >
                {member.initials}
              </span>
              <p className="mt-2 w-full truncate text-xs font-medium text-foreground">
                {member.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                <NumberTicker value={member.score} startOnView={false} />
                <DeltaBadge delta={member.delta} />
              </div>
              <motion.div
                layout={!reduce}
                initial={reduce ? false : { scaleY: 0.35, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                style={{ transformOrigin: "bottom" }}
                className={cn(
                  "mt-2.5 flex w-full items-start justify-center rounded-t-2xl border border-b-0 pt-2 font-mono text-xs font-semibold",
                  heightClass,
                  tone,
                )}
              >
                {rank}
              </motion.div>
            </div>
          ) : (
            <div key={rank} />
          ),
        )}
      </div>

      {/* Ranked rows */}
      <ul className="mt-3 space-y-1.5">
        {rest.map((member, index) => (
          <motion.li
            key={member.id}
            layout={!reduce}
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-xs",
              member.isViewer
                ? "border-primary/40 bg-primary/10"
                : "border-border bg-background",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="w-4 font-mono text-muted-foreground tabular-nums">
                {index + 4}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                  member.accent ?? "bg-muted text-foreground",
                )}
              >
                {member.initials}
              </span>
              <span className="truncate font-medium text-foreground">
                {member.name}
                {member.isViewer ? " (You)" : ""}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2 font-mono tabular-nums">
              <DeltaBadge delta={member.delta} />
              <span className="font-semibold text-foreground">
                <NumberTicker value={member.score} startOnView={false} />
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      {showPinnedViewer && viewer ? (
        <motion.div
          layout={!reduce}
          className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-xs"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="w-4 font-mono text-primary tabular-nums">
              {viewerIndex + 1}
            </span>
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
            >
              {viewer.initials}
            </span>
            <span className="truncate font-medium text-foreground">
              {viewer.name} (You)
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-mono tabular-nums">
            <span className="font-semibold text-foreground">
              <NumberTicker value={viewer.score} startOnView={false} />
            </span>
          </div>
        </motion.div>
      ) : null}

      {onBoostViewer && currentPeriod ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onBoostViewer(currentPeriod.id)}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-background px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus aria-hidden="true" className="size-3" />
            Log review (+40 pts)
          </button>
        </div>
      ) : null}
    </section>
  );
}
