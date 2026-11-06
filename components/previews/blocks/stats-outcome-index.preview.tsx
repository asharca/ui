"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { OutcomeIndex, type StatMetric } from "@/components/motion/stats";

const metrics: StatMetric[] = [
  {
    "id": "handoffs",
    "label": "Fewer manual handoffs",
    "value": 72,
    "unit": "%",
    "description": "Routine approvals move forward without another meeting or status check."
  },
  {
    "id": "launches",
    "label": "More launches per quarter",
    "value": 3.4,
    "decimals": 1,
    "unit": "×",
    "description": "A shared operating rhythm keeps good work moving from decision to delivery."
  },
  {
    "id": "hours",
    "label": "Returned to every team",
    "value": 84,
    "unit": "h",
    "description": "Less coordination overhead gives each team more time for focused work."
  }
];

export function OutcomeIndexPreview() {
  const [period, setPeriod] = useState<"current" | "previous" | "empty">("current");
  const shown = period === "empty" ? [] : period === "previous" ? metrics.map(metric => ({ ...metric, value: metric.previous ?? null, previous: null })) : metrics;
  return <div className="w-full"><OutcomeIndex title="Results that change the rhythm of work." description="Three measures that show what happens when momentum becomes part of the system." period="Operational outcomes" metrics={shown} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative reporting data and states</summary><p className="mt-4 leading-6">These fictional reporting snapshots are not measured beUI performance, uptime, environmental impact, or customer outcomes.</p><fieldset className="m-0 mt-4 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="Metric period">{(["current", "previous", "empty"] as const).map(value => <Button key={value} size="sm" variant={value === period ? "primary" : "outline"} aria-pressed={value === period} onClick={() => setPeriod(value)}>{value === "empty" ? "No data" : value === "current" ? "This month" : "Previous month"}</Button>)}</fieldset></details></div>;
}
