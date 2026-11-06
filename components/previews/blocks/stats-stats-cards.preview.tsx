"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { StatsCards, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "workflows",
    "label": "Workflows completed",
    "value": 28,
    "unit": "k+",
    "previous": 21.21,
    "description": "Approved work moved from brief to live this month."
  },
  {
    "id": "workspaces",
    "label": "Active workspaces",
    "value": 4200,
    "previous": 3559,
    "description": "Teams with at least one shared workflow in the last 30 days."
  },
  {
    "id": "delivery",
    "label": "On-time delivery",
    "value": 99,
    "unit": "%",
    "previous": 95.2,
    "description": "Projects completed on or ahead of their planned launch date."
  }
];

export function StatsCardsPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><StatsCards title="The numbers behind the work." description="A rolling view of delivery, adoption, and the pace teams sustain after launch." period="Performance brief" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
