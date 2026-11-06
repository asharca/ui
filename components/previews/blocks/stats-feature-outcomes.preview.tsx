"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { FeatureOutcomes, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "teams",
    "label": "Teams launched sooner",
    "value": 1.8,
    "decimals": 1,
    "unit": "k+",
    "description": "Reusable workflows turn repeat setup into a focused first-day launch."
  },
  {
    "id": "hours",
    "label": "Saved every month",
    "value": 62,
    "unit": "hrs",
    "description": "Approvals, handoffs, and routine follow-ups keep moving without busywork."
  }
];

export function FeatureOutcomesPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><FeatureOutcomes title="Everything your team needs to keep work moving." description="Build a dependable operating rhythm once, then let every project inherit it." period="Workflow outcomes" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
