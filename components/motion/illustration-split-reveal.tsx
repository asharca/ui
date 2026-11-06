"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { EASE_IN_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SplitRevealIllustrationProps {
  /** Non-interactive visual content; both layers occupy the same grid cell. */
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

/** A native keyboard-operable comparison slider. Fix either endpoint to inspect a complete state. */
export function SplitRevealIllustration({ before, after, beforeLabel = "Before", afterLabel = "After", value: controlled, defaultValue = 50, onValueChange, autoPlay = false, interval = 2000, className }: SplitRevealIllustrationProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const value = Math.max(0, Math.min(100, controlled ?? internal));
  const change = (next: number) => { if (controlled === undefined) setInternal(next); onValueChange?.(next); };
  useEffect(() => {
    if (!autoPlay || paused || reduce) return;
    const timer = window.setTimeout(() => { const next = value >= 100 ? 0 : Math.min(100, value + 25); if (controlled === undefined) setInternal(next); onValueChange?.(next); }, Math.max(300, interval));
    return () => window.clearTimeout(timer);
  }, [autoPlay, paused, reduce, controlled, interval, value, onValueChange]);
  const fix = (next: number) => { setPaused(true); change(next); };
  return <section aria-label="Before and after comparison" className={cn("@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl bg-muted text-foreground", className)}>
    <div aria-hidden className="absolute inset-x-[8%] bottom-[17%] top-[24%] opacity-50 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:10px_10px]" />
    <fieldset aria-label={beforeLabel} className="absolute inset-0 m-0 min-w-0 border-0 p-0">{before}</fieldset>
    <motion.fieldset aria-label={afterLabel} className="absolute inset-0 m-0 min-w-0 border-0 p-0" initial={false} animate={{ clipPath: `inset(0 0 0 ${100 - value}%)` }} transition={{ duration: reduce || paused ? 0 : Math.max(.3, interval / 1000), ease: EASE_IN_OUT }}>{after}</motion.fieldset>
    <motion.div aria-hidden className="pointer-events-none absolute bottom-[17%] top-[16%] w-px bg-sky-400/30" initial={false} animate={{ left: `${100 - value}%` }} transition={{ duration: reduce || paused ? 0 : Math.max(.3, interval / 1000), ease: EASE_IN_OUT }}><span className="absolute inset-y-0 right-0 w-[14cqw] bg-gradient-to-l from-sky-400/20 to-transparent" /><span className="absolute -top-[6cqw] left-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/90 px-[3cqw] py-[1.5cqw] text-[2.3cqw]"><span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-500/30" />Context refined</span><span className="absolute -bottom-[10cqw] left-0 grid size-[6cqw] -translate-x-1/2 place-items-center rounded-xl bg-background text-[3cqw]">▣</span></motion.div>
    <label htmlFor={id} className="sr-only">Reveal {afterLabel}: {value}%</label>
    <input id={id} aria-valuetext={`${value}% ${afterLabel}`} type="range" min={0} max={100} value={value} onChange={event => { setPaused(true); change(Number(event.target.value)); }} className="absolute inset-x-[8%] bottom-2 w-[84%] cursor-ew-resize accent-primary opacity-0 focus-visible:opacity-100 group-hover:opacity-100" />
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:inset-x-2 focus-within:bottom-1 focus-within:z-20 focus-within:flex focus-within:gap-1">{[0, 50, 100].map(next => <button type="button" key={next} onClick={() => fix(next)} aria-pressed={value === next} className="rounded-full bg-background px-3 py-1 text-xs">{next === 0 ? beforeLabel : next === 100 ? afterLabel : "Compare"}</button>)}{autoPlay && <button type="button" disabled={!!reduce} onClick={() => setPaused(current => !current)} className="rounded-full bg-background px-3 py-1 text-xs">{reduce ? "Motion reduced" : paused ? "Play reveal" : "Pause reveal"}</button>}</div>
  </section>;
}
