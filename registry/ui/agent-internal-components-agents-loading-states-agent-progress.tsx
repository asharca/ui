/*
 * Adapted from beUI (1e23f4b10a404c17d9649086cf561e152527e2de).
 * Upstream path: components/agents/loading-states/agent-progress.tsx
 *
 * MIT License
 *
 * Copyright (c) 2026 Saurabh Chauhan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT } from "./agent-internal-lib-ease";
import { cn } from "./utils";

const GRID_CELLS = [
  { id: "top-left", delay: 0 },
  { id: "top-center", delay: 0.14 },
  { id: "top-right", delay: 0.28 },
  { id: "middle-left", delay: 0.42 },
  { id: "middle-center", delay: 0.56 },
  { id: "middle-right", delay: 0.7 },
  { id: "bottom-left", delay: 0.84 },
  { id: "bottom-center", delay: 0.98 },
  { id: "bottom-right", delay: 1.12 },
];

export interface AgentProgressProps {
  /** Verb describing the agent's current activity. */
  label?: string;
  /** Controlled elapsed time in seconds. */
  elapsedSeconds?: number;
  /** Starting time for the internal timer, in seconds. */
  initialSeconds?: number;
  /** Whether the internal timer should advance. Ignored when elapsedSeconds is provided. */
  running?: boolean;
  className?: string;
}

function formatElapsed(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = (safeSeconds % 60).toFixed(1);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function AgentProgress({
  label = "Churning",
  elapsedSeconds,
  initialSeconds = 0,
  running = true,
  className,
}: AgentProgressProps) {
  const reduce = useReducedMotion() ?? false;
  const [internalSeconds, setInternalSeconds] = useState(initialSeconds);
  const accumulated = useRef(initialSeconds);
  const origin = useRef(initialSeconds);

  useEffect(() => {
    if (origin.current !== initialSeconds) {
      origin.current = initialSeconds;
      accumulated.current = initialSeconds;
      setInternalSeconds(initialSeconds);
    }
    if (elapsedSeconds !== undefined) {
      accumulated.current = elapsedSeconds;
      return;
    }
    if (!running) return;
    const startedAt = performance.now() - accumulated.current * 1000;
    const timer = window.setInterval(() => {
      accumulated.current = (performance.now() - startedAt) / 1000;
      setInternalSeconds(accumulated.current);
    }, 100);
    return () => {
      accumulated.current = (performance.now() - startedAt) / 1000;
      window.clearInterval(timer);
    };
  }, [elapsedSeconds, initialSeconds, running]);

  const elapsed = elapsedSeconds ?? internalSeconds;

  return (
    <span
      role="status"
      aria-label={`${label}, in progress`}
      className={cn(
        "inline-flex items-center gap-3 font-mono text-sm text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 grid-cols-3 gap-[2px]"
      >
        {GRID_CELLS.map(({ id, delay }) => (
          <motion.span
            key={id}
            className="rounded-[1px] bg-current"
            animate={
              reduce
                ? { opacity: 0.65 }
                : {
                    opacity: [0.28, 1, 0.28],
                    scale: [0.72, 1, 0.72],
                  }
            }
            transition={{
              duration: 1.55,
              ease: EASE_IN_OUT,
              repeat: reduce ? 0 : Infinity,
              delay,
            }}
          />
        ))}
      </span>
      <span className="font-sans font-medium">{label}</span>
      <span
        aria-hidden="true"
        className="tabular-nums text-muted-foreground/70"
      >
        {formatElapsed(elapsed)}
      </span>
    </span>
  );
}
