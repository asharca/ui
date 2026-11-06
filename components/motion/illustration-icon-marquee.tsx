"use client";

import { type ReactNode, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Marquee } from "@/components/motion/marquee";
import { cn } from "@/lib/utils";

export interface MarqueeIllustrationItem { id: string; label: string; icon: ReactNode }
export interface IconMarqueeIllustrationProps {
  rows: [MarqueeIllustrationItem[], MarqueeIllustrationItem[]];
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  speed?: number;
  label?: string;
  className?: string;
}
const iconTones = [["text-blue-600", "text-amber-600", "text-emerald-600", "text-violet-600", "text-cyan-600", "text-rose-600", "text-orange-600", "text-indigo-600"], ["text-violet-600", "text-blue-600", "text-cyan-600", "text-emerald-600", "text-orange-600", "text-amber-600", "text-rose-600", "text-indigo-600"]];

/** Two opposing seamless tracks. Existing Marquee owns inert, aria-hidden duplicate tracks and seam spacing. */
export function IconMarqueeIllustration({ rows, paused: controlled, defaultPaused = false, onPausedChange, speed = 20, label = "A connected toolkit", className }: IconMarqueeIllustrationProps) {
  const [internal, setInternal] = useState(defaultPaused);
  const reduce = useReducedMotion();
  const paused = controlled ?? internal;
  const stopped = paused || !!reduce;
  return <section aria-label={label} data-paused={stopped} className={cn("group relative isolate flex aspect-[4/3] w-full max-w-xl items-center overflow-hidden rounded-xl bg-muted text-foreground focus-within:[&_.animate-marquee]:[animation-play-state:paused]", stopped && "[&_.animate-marquee]:[animation-play-state:paused]", className)}>
    <header className="absolute right-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><h3 className="sr-only">{label}</h3><button type="button" disabled={!!reduce} aria-pressed={paused} onClick={() => { if (controlled === undefined) setInternal(!paused); onPausedChange?.(!paused); }} className="cursor-pointer rounded-full bg-background/90 px-3 py-2 text-xs disabled:cursor-default">{reduce ? "Motion reduced" : paused ? "Play icons" : "Pause icons"}</button></header>
    <div className="w-full space-y-4">{[{ id: "first", items: rows[0], direction: "left" as const, label: "First toolkit row" }, { id: "second", items: rows[1], direction: "right" as const, label: "Second toolkit row" }].map(({ id, items, direction, label: rowLabel }, rowIndex) => <section key={id} aria-label={rowLabel}>{items.length ? <Marquee direction={direction} speed={Math.max(1, speed + rowIndex * 2)} pauseOnHover={false} fade={false} gap="0.75rem">{items.map((item, index) => <span key={item.id} role="img" aria-label={item.label} className={cn("grid size-16 shrink-0 place-items-center rounded-xl border border-border bg-background [&_svg]:size-6", iconTones[rowIndex][index % 8])}><span aria-hidden>{item.icon}</span></span>)}</Marquee> : <p className="px-5 py-4 text-xs text-muted-foreground">No icons in this row</p>}</section>)}</div>
  </section>;
}
