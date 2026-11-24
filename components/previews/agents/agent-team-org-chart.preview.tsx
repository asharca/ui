"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  AgentOrgChart,
  type OrgChartAgent,
} from "@/components/agents/agent-org-chart";

const TOTAL_MS = 17_000;

function computeNodeState(
  elapsedMs: number,
  startMs: number,
  endMs: number,
  maxCost: number,
) {
  if (elapsedMs < startMs) {
    return {
      status: "queued" as const,
      progress: 0,
      cost: 0,
      elapsedSeconds: 0,
    };
  }
  const duration = endMs - startMs;
  const activeMs = Math.min(duration, elapsedMs - startMs);
  const ratio = activeMs / duration;
  const done = elapsedMs >= endMs;
  return {
    status: done ? ("done" as const) : ("running" as const),
    progress: done ? 100 : Math.min(96, Math.round(12 + ratio * 84)),
    cost: Number((maxCost * ratio).toFixed(2)),
    elapsedSeconds: Math.floor(activeMs / 1000),
  };
}

function buildSnapshot(elapsedMs: number): OrgChartAgent {
  const orchDone = elapsedMs >= TOTAL_MS;
  const orchSec = Math.floor(Math.min(TOTAL_MS, elapsedMs) / 1000);
  const orchCost = Number((0.02 + Math.min(1, elapsedMs / TOTAL_MS) * 0.32).toFixed(2));

  const res = computeNodeState(elapsedMs, 1000, 11_500, 0.23);
  const scr = computeNodeState(elapsedMs, 2200, 7200, 0.03);
  const ana = computeNodeState(elapsedMs, 3400, 11_400, 0.06);
  const wri = computeNodeState(elapsedMs, 5000, 15_000, 0.12);
  const cod = computeNodeState(elapsedMs, 6500, 15_500, 0.14);
  const tes = computeNodeState(elapsedMs, 10_500, 15_500, 0.03);

  return {
    id: "orchestrator",
    name: "Orchestrator",
    model: "Atlas 4",
    task: "Ship the annual billing toggle this week",
    status: orchDone ? "done" : "running",
    progress: orchDone ? 100 : Math.min(96, Math.round(10 + (elapsedMs / TOTAL_MS) * 86)),
    cost: orchCost,
    elapsedSeconds: orchSec,
    accent: "blue",
    icon: "network",
    tools: ["doc", "terminal", "code"],
    children: [
      {
        id: "researcher",
        name: "Researcher",
        model: "Nimbus Pro",
        task: "Compare annual discounts across six rivals",
        ...res,
        accent: "sky",
        icon: "search",
        tools: ["globe", "doc"],
        children: [
          {
            id: "scraper",
            name: "Scraper",
            model: "Nimbus Flash",
            task: "Pull the pricing tables from each rival's site",
            ...scr,
            accent: "teal",
            icon: "scan",
            tools: ["globe"],
          },
          {
            id: "analyst",
            name: "Analyst",
            model: "Nimbus Pro",
            task: "Group 140 support tickets that mention billing",
            ...ana,
            accent: "lime",
            icon: "chart",
            tools: ["terminal", "table"],
          },
        ],
      },
      {
        id: "writer",
        name: "Writer",
        model: "Atlas 4 Mini",
        task: "Draft the toggle copy and three FAQ answers",
        ...wri,
        accent: "amber",
        icon: "pen",
        tools: ["doc", "write"],
      },
      {
        id: "coder",
        name: "Coder",
        model: "Kite Pro",
        task: "Add the toggle and yearly prices to checkout",
        ...cod,
        accent: "emerald",
        icon: "code",
        tools: ["code", "terminal", "write"],
        children: [
          {
            id: "tester",
            name: "Tester",
            model: "Kite Mini",
            task: "Run checkout tests for both billing periods",
            ...tes,
            accent: "yellow",
            icon: "flask",
            tools: ["code", "terminal"],
          },
        ],
      },
    ],
  };
}

export function AgentTeamOrgChartPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (reduce) setElapsedMs(TOTAL_MS);
  }, [reduce]);

  const running = inView && !reduce && elapsedMs < TOTAL_MS;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsedMs((prev) => (prev >= TOTAL_MS ? prev : Math.min(TOTAL_MS, prev + 250)));
    }, 250);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div ref={containerRef} className="w-full">
      <AgentOrgChart
        root={buildSnapshot(elapsedMs)}
        onReplay={() => setElapsedMs(0)}
      />
    </div>
  );
}
