"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { EASE_IN_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface BarWaveItem { id: string; label: string; level: number }
export interface BarWaveProps {
  bars: readonly BarWaveItem[];
  label?: string;
  pointerResponse?: boolean;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  duration?: number;
  className?: string;
}

/** Decorative isometric ribbons. Levels and selected values remain host-owned. */
export function BarWave({ bars, label = "Activity wave", pointerResponse = true, playing, defaultPlaying = true, onPlayingChange, value, defaultValue, onValueChange, duration = 5.2, className }: BarWaveProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const gradient = useId();
  const [internalPlaying, setInternalPlaying] = useState(defaultPlaying);
  const [internal, setInternal] = useState(defaultValue ?? bars[0]?.id);
  const [hovered, setHovered] = useState<number | null>(null);
  const current = bars.find((bar) => bar.id === (value ?? internal)) ?? bars[0];
  const running = (playing ?? internalPlaying) && !reduce;
  const respond = pointerResponse && canHover && !reduce;
  const toggle = () => { const next = !(playing ?? internalPlaying); if (playing === undefined) setInternalPlaying(next); onPlayingChange?.(next); };
  const select = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  return <section aria-label={label} className={cn("group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl bg-muted text-foreground [--wave-start:#8c91ff] [--wave-mid:#6670ee] [--wave-end:#4b52c7] [--wave-stroke:#343a9b] dark:[--wave-start:oklch(0.8_0.11_282)] dark:[--wave-mid:oklch(0.7_0.16_282)] dark:[--wave-end:oklch(0.61_0.19_282)] dark:[--wave-stroke:oklch(0.78_0.08_282)]", className)} data-wave-running={running} data-pointer-active={respond && hovered !== null}>
    <h3 className="sr-only">{label}</h3>
    <svg aria-label="Isometric ribbon wave" className="absolute inset-0 size-full" viewBox={`-60 -80 ${Math.max(480, bars.length * 15 + 285)} 360`} onPointerLeave={() => setHovered(null)} onPointerCancel={() => setHovered(null)}>
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--wave-start)" /><stop offset="0.58" stopColor="var(--wave-mid)" /><stop offset="1" stopColor="var(--wave-end)" /></linearGradient></defs>
      <g transform="rotate(180 175 65)">{bars.map((bar, index) => {
        const level = Number.isFinite(bar.level) ? Math.max(0, Math.min(1, bar.level)) : 0;
        const near = respond && hovered !== null ? Math.max(0, 1 - Math.abs(index - hovered) / 4) : 0;
        return <g key={bar.id} transform={`matrix(0.866025 0.5 0 1 0.0580127 -2.88838)`}>
          <motion.rect x={index * 15 + .4} y={.75 - index * 15} width={135} height={30} rx={6.5} fill={`url(#${gradient})`} stroke="var(--wave-stroke)" strokeWidth={.8} role="button" tabIndex={0} aria-label={`${bar.label}: ${Math.round(level * 100)}%`} aria-pressed={current?.id === bar.id} onClick={() => select(bar.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(bar.id); } }} onPointerEnter={event => { if (respond && event.pointerType !== "touch") setHovered(index); }} className="cursor-pointer outline-none focus-visible:stroke-foreground focus-visible:stroke-2" style={{ filter: reduce ? "brightness(.92)" : undefined }} initial={false} animate={{ height: running ? [30 + near * 30, 30 + level * 58 + near * 30, 30 + near * 30, 30 + near * 30] : 30 + near * 30 }} transition={running ? { duration: Math.max(1, duration), delay: index * .2, times: [0, .2, .4, 1], repeat: Infinity, ease: EASE_IN_OUT } : { duration: reduce ? 0 : .2 }} />
        </g>;
      })}</g>
    </svg>
    <button type="button" onClick={toggle} disabled={!!reduce} aria-pressed={playing ?? internalPlaying} className="absolute right-3 bottom-3 rounded-full bg-background/90 px-3 py-2 text-xs opacity-0 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">{reduce ? "Motion reduced" : running ? "Pause wave" : "Play wave"}</button>
    <p className="sr-only" aria-live="polite">{current ? `${current.label} · ${Math.round(Math.max(0, Math.min(1, Number.isFinite(current.level) ? current.level : 0)) * 100)}% intensity` : "No levels supplied."}</p>
  </section>;
}
