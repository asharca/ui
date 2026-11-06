"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { ImpactDashboard, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "reach",
    "label": "People reached",
    "value": 84,
    "unit": "M",
    "description": "Communities with reliable access to clean infrastructure."
  },
  {
    "id": "progress",
    "label": "Progress deployed",
    "value": 72,
    "unit": "%",
    "target": 100,
    "description": "2030 target"
  },
  {
    "id": "emissions",
    "label": "Emissions avoided",
    "value": 12,
    "unit": "M",
    "description": "Tons of CO2"
  },
  {
    "id": "partners",
    "label": "Local partners",
    "value": 180,
    "unit": "+",
    "description": "Across 28 regions"
  }
];

export function ImpactDashboardPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><ImpactDashboard title="Every milestone moves the mission forward." description="Track the reach, progress, and partnerships behind work that lasts." period="Impact overview" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
