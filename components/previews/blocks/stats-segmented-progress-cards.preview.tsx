"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { SegmentedProgressCards, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "resolution",
    "label": "Resolution",
    "value": 84,
    "unit": "%",
    "target": 100,
    "description": "Everyday questions answered, without another handoff."
  },
  {
    "id": "response",
    "label": "Response time",
    "value": 72,
    "unit": "%",
    "target": 100,
    "description": "Less time waiting. More time moving things forward."
  },
  {
    "id": "capacity",
    "label": "Team capacity",
    "value": 64,
    "unit": "%",
    "target": 100,
    "description": "Fewer repetitive tasks. More room for the work that matters."
  }
];

export function SegmentedProgressCardsPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><SegmentedProgressCards title="Less busywork. More progress." description="Small improvements add up to a better day for your team." period="" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
