"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  AgentRunTimeline,
  type AgentRunStep,
  type AgentRunSubagent,
} from "@/components/agents/agent-run-timeline";

function subagentProgress(
  id: string,
  name: string,
  stepElapsed: number,
  delayMs: number,
  durationMs: number,
): AgentRunSubagent {
  if (stepElapsed < delayMs) {
    return { id, name, status: "queued" };
  }
  const activeMs = Math.min(durationMs, stepElapsed - delayMs);
  const done = stepElapsed >= delayMs + durationMs;
  return {
    id,
    name,
    status: done ? "completed" : "running",
    elapsedSeconds: Math.floor(activeMs / 1000),
  };
}

function stepTiming(elapsedMs: number, startMs: number, durationMs: number) {
  if (elapsedMs < startMs) {
    return { status: "pending" as const, progress: 0, elapsedSeconds: undefined };
  }
  if (elapsedMs >= startMs + durationMs) {
    return {
      status: "completed" as const,
      progress: 100,
      elapsedSeconds: Math.round(durationMs / 1000),
    };
  }
  const activeMs = elapsedMs - startMs;
  return {
    status: "running" as const,
    progress: Math.max(4, Math.min(98, (activeMs / durationMs) * 100)),
    elapsedSeconds: Math.floor(activeMs / 1000),
  };
}

function createSteps(
  elapsedMs: number,
  approvedAtMs: number | null,
): AgentRunStep[] {
  const s1 = stepTiming(elapsedMs, 0, 2000);
  const s2 = stepTiming(elapsedMs, 2000, 5000);
  const s3 = stepTiming(elapsedMs, 7000, 2000);
  const s4 = stepTiming(elapsedMs, 9000, 4000);
  const s5 = stepTiming(elapsedMs, 13_000, 2000);

  const s2Elapsed = Math.max(0, elapsedMs - 2000);
  const s4Elapsed = Math.max(0, elapsedMs - 9000);

  let s6: Pick<AgentRunStep, "status" | "progress" | "elapsedSeconds">;
  if (elapsedMs < 15_000) {
    s6 = { status: "pending", progress: 0, elapsedSeconds: undefined };
  } else if (approvedAtMs === null) {
    s6 = { status: "blocked", progress: 0, elapsedSeconds: undefined };
  } else {
    s6 = stepTiming(elapsedMs, approvedAtMs, 2000);
  }

  return [
    {
      id: "spec",
      label: "Read the product spec",
      ...s1,
    },
    {
      id: "research",
      label: "Send out researchers",
      ...s2,
      subagents: [
        subagentProgress("r1", "Scan competitor pricing", s2Elapsed, 250, 3000),
        subagentProgress("r2", "Pull support tickets", s2Elapsed, 1000, 2500),
        subagentProgress("r3", "Skim user interviews", s2Elapsed, 1750, 2000),
      ],
    },
    {
      id: "merge",
      label: "Merge what came back",
      ...s3,
    },
    {
      id: "draft",
      label: "Write the brief",
      ...s4,
      subagents: [
        subagentProgress("w1", "Draft three headlines", s4Elapsed, 250, 2400),
        subagentProgress("w2", "Cite every source", s4Elapsed, 950, 2000),
      ],
    },
    {
      id: "tighten",
      label: "Tighten the copy",
      ...s5,
    },
    {
      id: "post",
      label: "Post to #launch",
      requiresApproval: true,
      ...s6,
    },
  ];
}

export function AgentTeamRunStepsPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const [elapsedMs, setElapsedMs] = useState(0);
  const [approvedAtMs, setApprovedAtMs] = useState<number | null>(null);

  const stopTargetMs = approvedAtMs === null ? 15_000 : approvedAtMs + 2000;

  useEffect(() => {
    if (reduce) setElapsedMs(15_000);
  }, [reduce]);

  const running = inView && !reduce && elapsedMs < stopTargetMs;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsedMs((prev) => Math.min(stopTargetMs, prev + 100));
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, stopTargetMs]);

  return (
    <div ref={containerRef} className="w-full">
      <AgentRunTimeline
        title="Launch brief"
        steps={createSteps(elapsedMs, approvedAtMs)}
        onApprove={() => {
          const start = Math.max(15_000, elapsedMs);
          setApprovedAtMs(start);
          if (reduce) {
            setElapsedMs(start + 2000);
          } else {
            setElapsedMs(start + 100);
          }
        }}
        onReplay={() => {
          setApprovedAtMs(null);
          setElapsedMs(0);
        }}
      />
    </div>
  );
}
