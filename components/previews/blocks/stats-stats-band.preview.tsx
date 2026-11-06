"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { StatsBand, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "workflows",
    "label": "Workflows completed",
    "value": 28,
    "unit": "k+",
    "description": "this quarter"
  },
  {
    "id": "uptime",
    "label": "Platform uptime",
    "value": 99.99,
    "decimals": 2,
    "unit": "%",
    "description": "rolling 90 days"
  },
  {
    "id": "delivery",
    "label": "Faster delivery",
    "value": 42,
    "unit": "%",
    "description": "from brief to launch"
  },
  {
    "id": "regions",
    "label": "Regions online",
    "value": 18,
    "description": "no degraded zones"
  }
];

export function StatsBandPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><StatsBand title="Momentum you can measure." description="A clear view of the pace, reliability, and reach behind every release." period="Quarterly signal" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
