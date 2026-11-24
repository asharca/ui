"use client";

import { useEffect, useState } from "react";
import {
  AgentOrgChart,
  type OrgChartAgent,
} from "@/components/agents/agent-org-chart";

function buildSnapshot(tick: number): OrgChartAgent {
  const s1 = tick >= 1 ? (tick >= 4 ? "done" : "running") : "queued";
  const s2 = tick >= 1 ? (tick >= 4 ? "done" : "running") : "queued";
  const s3 = tick >= 2 ? (tick >= 5 ? "done" : "running") : "queued";
  const sub1 = tick >= 2 ? (tick >= 5 ? "done" : "running") : "queued";
  const sub2 = tick >= 3 ? (tick >= 6 ? "done" : "running") : "queued";
  const sub3 = tick >= 3 ? (tick >= 6 ? "done" : "running") : "queued";

  return {
    id: "orchestrator",
    name: "Orchestrator",
    model: "Atlas 4",
    task: "Ship the annual billing toggle this week",
    status: tick >= 6 ? "done" : "running",
    progress: tick >= 6 ? 100 : 35 + tick * 10,
    cost: 0.03 + tick * 0.02,
    elapsedSeconds: 3 + tick * 2,
    accent: "sky",
    tools: ["search", "doc", "code"],
    children: [
      {
        id: "researcher",
        name: "Researcher",
        model: "Nimbus Pro",
        task: "Compare annual discounts across six rivals",
        status: s1,
        progress: s1 === "done" ? 100 : s1 === "running" ? 68 : 0,
        cost: s1 === "queued" ? 0 : 0.04 + tick * 0.01,
        elapsedSeconds: s1 === "queued" ? 0 : 5,
        accent: "sky",
        tools: ["search", "doc"],
        children: [
          {
            id: "scraper",
            name: "Scraper",
            model: "Nimbus Flash",
            task: "Pull the pricing tables from each rival's site",
            status: sub1,
            progress: sub1 === "done" ? 100 : sub1 === "running" ? 72 : 0,
            cost: sub1 === "queued" ? 0 : 0.03,
            elapsedSeconds: sub1 === "queued" ? 0 : 5,
            accent: "sky",
            tools: ["doc"],
          },
          {
            id: "analyst",
            name: "Analyst",
            model: "Nimbus Pro",
            task: "Group 14 pricing rows into three clean tiers",
            status: sub2,
            progress: sub2 === "done" ? 100 : sub2 === "running" ? 62 : 0,
            cost: sub2 === "queued" ? 0 : 0.02,
            elapsedSeconds: sub2 === "queued" ? 0 : 4,
            accent: "sky",
            tools: ["doc"],
          },
        ],
      },
      {
        id: "writer",
        name: "Writer",
        model: "Atlas 4 Mini",
        task: "Draft the toggle copy and three FAQ answers",
        status: s2,
        progress: s2 === "done" ? 100 : s2 === "running" ? 54 : 0,
        cost: s2 === "queued" ? 0 : 0.02,
        elapsedSeconds: s2 === "queued" ? 0 : 5,
        accent: "amber",
        tools: ["write", "doc"],
      },
      {
        id: "coder",
        name: "Coder",
        model: "Kite Pro",
        task: "Add the toggle and yearly prices to checkout",
        status: s3,
        progress: s3 === "done" ? 100 : s3 === "running" ? 74 : 0,
        cost: s3 === "queued" ? 0 : 0.04,
        elapsedSeconds: s3 === "queued" ? 0 : 6,
        accent: "emerald",
        tools: ["code", "terminal"],
        children: [
          {
            id: "tester",
            name: "Tester",
            model: "Kite Mini",
            task: "Run checkout tax and proration tests across tiers",
            status: sub3,
            progress: sub3 === "done" ? 100 : sub3 === "running" ? 78 : 0,
            cost: sub3 === "queued" ? 0 : 0.02,
            elapsedSeconds: sub3 === "queued" ? 0 : 3,
            accent: "emerald",
            tools: ["terminal"],
          },
        ],
      },
    ],
  };
}

export function AgentTeamOrgChartPreview() {
  const [tick, setTick] = useState(3);

  useEffect(() => {
    if (tick >= 6) return;
    const timer = window.setTimeout(() => {
      setTick((prev) => prev + 1);
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [tick]);

  return (
    <AgentOrgChart
      root={buildSnapshot(tick)}
      onReplay={() => setTick(0)}
    />
  );
}
