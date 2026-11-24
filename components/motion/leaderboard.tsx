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

/** Compact leaderboard with soft gradient podium plinths, period tabs, and viewer highlight. */
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
  const totalPoints = sorted.reduce((acc, m) => acc + m.score, 0);

  const podiumSlots = [
    {
      member: second,
      rank: 2,
      heightClass: "h-20",
      plinthClass:
        "border-t-2 border-sky-400/60 bg-gradient-to-b from-sky-500/20 via-sky-500/5 to-transparent text-sky-300",
      ringClass: "ring-2 ring-sky-400/50",
    },
    {
      member: first,
      rank: 1,
      heightClass: "h-28",
      plinthClass:
        "border-t-2 border-amber-400/75 bg-gradient-to-b from-amber-500/25 via-amber-500/5 to-transparent text-amber-300",
      ringClass: "ring-2 ring-amber-400/70",
    },
    {
      member: third,
      rank: 3,
      heightClass: "h-16",
      plinthClass:
        "border-t-2 border-orange-400/60 bg-gradient-to-b from-orange-500/20 via-orange-500/5 to-transparent text-orange-300",
      ringClass: "ring-2 ring-orange-400/50",
    },
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
          className="inline-flex rounded-full border border-border bg-background/70 p-0.5"
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
                    className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                  />
                ) : null}
                <span className="relative z-10">{period.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Top 3 podium with soft downward fade */}
      <div className="mt-6 grid grid-cols-3 items-end gap-2.5 border-b border-border pb-4">
        {podiumSlots.map(({ member, rank, heightClass, plinthClass, ringClass }) =>
          member ? (
            <div key={member.id} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 place-items-center rounded-full text-xs font-semibold",
                  ringClass,
                  member.accent ?? "bg-background text-foreground",
                )}
              >
                {member.initials}
              </span>
              <p className="mt-2.5 w-full truncate text-xs font-medium text-foreground">
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
                  "mt-2.5 flex w-full items-start justify-center rounded-t-xl pt-2 font-mono text-xs font-semibold",
                  heightClass,
                  plinthClass,
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

      {/* Sleek flush ranked rows */}
      <ul className="mt-2 divide-y divide-border">
        {rest.map((member, index) => (
          <motion.li
            key={member.id}
            layout={!reduce}
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            className={cn(
              "flex items-center justify-between gap-3 px-2.5 py-2.5 text-xs",
              member.isViewer && "rounded-xl bg-foreground/[0.06]",
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
                  member.accent ?? "bg-foreground/[0.08] text-foreground",
                )}
              >
                {member.initials}
              </span>
              <span className="truncate font-medium text-foreground">
                {member.name}
              </span>
              {member.isViewer ? (
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  You
                </span>
              ) : null}
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
          className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-foreground/[0.06] px-2.5 py-2.5 text-xs"
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
              {viewer.name}
            </span>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              You
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-mono tabular-nums">
            <span className="font-semibold text-foreground">
              <NumberTicker value={viewer.score} startOnView={false} />
            </span>
          </div>
        </motion.div>
      ) : null}

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-mono tabular-nums">
          {sorted.length} ranked · {totalPoints.toLocaleString()} pts
          {viewerIndex >= 0 ? ` · you #${viewerIndex + 1}` : ""}
        </span>
        {onBoostViewer && currentPeriod ? (
          <button
            type="button"
            onClick={() => onBoostViewer(currentPeriod.id)}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-background/70 px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <Plus aria-hidden="true" className="size-3" />
            Log review (+40)
          </button>
        ) : null}
      </footer>
    </section>
  );
}
