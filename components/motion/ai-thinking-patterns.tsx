"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ThinkingPattern = "pixel-orbit" | "grid-scan" | "diagonal-wave" | "assembling-tiles" | "diamond-loop" | "connected-nodes";
export type ThinkingState = "thinking" | "complete" | "stopped";
export interface AIThinkingLoaderProps {
  pattern?: ThinkingPattern;
  state?: ThinkingState;
  /** Host-owned semantic messages; animation frames never update the live region. */
  labels?: Partial<Record<ThinkingState, string>>;
  size?: number;
  className?: string;
}
const PATTERN_LABELS: Record<ThinkingPattern, string> = { "pixel-orbit": "Thinking…", "grid-scan": "Analyzing…", "diagonal-wave": "Creating…", "assembling-tiles": "Processing…", "diamond-loop": "Reasoning…", "connected-nodes": "Reading docs…" };
const COLORS: Record<ThinkingPattern, string> = { "pixel-orbit": "text-emerald-600 dark:text-emerald-400", "grid-scan": "text-blue-600 dark:text-blue-400", "diagonal-wave": "text-pink-600 dark:text-pink-400", "assembling-tiles": "text-orange-600 dark:text-orange-400", "diamond-loop": "text-cyan-600 dark:text-cyan-400", "connected-nodes": "text-rose-600 dark:text-rose-400" };
const ORBIT = [[14, 2], [20, 2], [26, 8], [26, 14], [26, 20], [20, 26], [14, 26], [8, 26], [2, 20], [2, 14], [2, 8], [8, 2]];
const DIAMOND = [[14, 2], [20, 8], [26, 14], [20, 20], [14, 26], [8, 20], [2, 14], [8, 8]];
const GRID = Array.from({ length: 25 }, (_, i) => [2 + i % 5 * 6, 2 + Math.floor(i / 5) * 6]);
const TILES = Array.from({ length: 9 }, (_, i) => [8 + i % 3 * 6, 8 + Math.floor(i / 3) * 6]);
const NODES = [[7, 22], [18, 5], [27, 25]];

/** Compact pixel signals; terminal states and reduced motion stop all loops. */
export function AIThinkingLoader({ pattern = "pixel-orbit", state = "thinking", labels, size = 28, className }: AIThinkingLoaderProps) {
  const reduce = useReducedMotion();
  const running = state === "thinking" && !reduce;
  const label = labels?.[state] ?? (state === "thinking" ? PATTERN_LABELS[pattern] : state === "complete" ? "Complete" : "Stopped");
  const points = pattern === "pixel-orbit" ? ORBIT : pattern === "diamond-loop" ? DIAMOND : pattern === "assembling-tiles" ? TILES : GRID;
  return <span className={cn("inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-sm font-medium text-muted-foreground", className)} data-pattern={pattern} data-state={state} data-running={running}>
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="currentColor" className={cn("shrink-0 overflow-visible", COLORS[pattern])}>
      {state === "complete" ? <path d="m7 16 6 6 13-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : state === "stopped" ? <><rect x="10" y="8" width="4" height="16" rx="1" /><rect x="18" y="8" width="4" height="16" rx="1" /></> : pattern === "connected-nodes" ? <>
        <path d="M7 22 18 5 27 25Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".2" strokeLinejoin="round" />
        {running && <motion.g animate={{ x: [7, 18, 27, 7], y: [22, 5, 25, 22] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}><circle r="3" opacity=".14" /><circle r="1.5" /></motion.g>}
        {NODES.map(([x, y], i) => <motion.g key={`${x}:${y}`} animate={{ opacity: running ? [1, .35, .35, 1] : .7 }} transition={{ duration: 2.4, repeat: running ? Infinity : 0, ease: "linear", delay: -i * .8 }}><circle cx={x} cy={y} r="5" opacity=".1" /><circle cx={x} cy={y} r="3.75" fill="none" stroke="currentColor" strokeWidth=".75" opacity=".3" /><circle cx={x} cy={y} r="2.5" /></motion.g>)}
      </> : points.map(([x, y], i) => {
        const assemble = pattern === "assembling-tiles";
        const delay = pattern === "grid-scan" ? -Math.floor(i / 5) * .18 : pattern === "diagonal-wave" ? -(i % 5 + 4 - Math.floor(i / 5)) * .13 : pattern === "diamond-loop" ? -i * .225 : -i * (assemble ? .16 : .15);
        return <motion.rect key={`${x}:${y}`} x={x} y={y} width="4" height="4" rx="1" animate={running ? { opacity: assemble ? [.18, 1, 1, .18] : [.12, 1, 1, .12, .12], y: assemble ? [2, 0, 0, 2] : 0 } : { opacity: .7, y: 0 }} transition={{ duration: assemble ? 2.4 : 1.8, repeat: running ? Infinity : 0, ease: "linear", delay, times: assemble ? [0, .35, .65, 1] : [0, .22, .34, .65, 1] }} />;
      })}
    </svg>
    <span role="status" aria-live="polite" aria-atomic="true">{label}</span>
  </span>;
}
