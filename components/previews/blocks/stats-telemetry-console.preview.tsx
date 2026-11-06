"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { TelemetryConsole, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "latency",
    "label": "Median latency",
    "value": 42,
    "unit": "ms",
    "description": "Global p50 response"
  },
  {
    "id": "regions",
    "label": "Active regions",
    "value": 18,
    "description": "No degraded zones"
  },
  {
    "id": "success",
    "label": "Success rate",
    "value": 99.94,
    "decimals": 2,
    "unit": "%",
    "description": "Rolling 30-day window"
  }
];

export function TelemetryConsolePreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><TelemetryConsole title="See every signal as it happens." description="Track throughput, latency, and regional health in one focused view." period="Live telemetry" metrics={shown} regions={period === "empty" ? [] : [{ id: "west", label: "West region", value: 842019, unit: "+", observedAt: "2026-11-04 09:42 UTC", activity: [2,4,3,7,5,9,6,8,4,7,5,9,7,6,8,10] }, { id: "east", label: "East region", value: 796480, unit: "+", observedAt: "2026-11-04 09:43 UTC", activity: [4,2,6,3,8,4,7,5,3,6,9,7,6,8,10,9] }]} status="Example snapshot" /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
