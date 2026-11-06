"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { BarComparison } from "@/components/motion/comparison";

const benchmarks = [
  { id: "reasoning", label: "Visual reasoning", description: "Complex pattern recognition" },
  { id: "code", label: "Code repair", description: "Issues resolved successfully" },
  { id: "security", label: "Security fixes", description: "Vulnerabilities resolved" },
];
const alternatives = {
  basic: { label: "Basic", values: { reasoning: 31.1, code: 16.8, security: 22.3 } },
  enterprise: { label: "Enterprise", values: { reasoning: 34.7, code: 23.5, security: 38.1 } },
};

export function BarComparisonPreview() {
  const [workload, setWorkload] = useState(false);
  const [comparison, setComparison] = useState<keyof typeof alternatives>("basic");
  const selected = alternatives[comparison];
  return <div className="w-full"><BarComparison title="A clearer view of what’s possible." description="Compare success rates across reasoning, code, and security. Same tasks. Same scale." benchmarks={benchmarks} series={[{ id: "studio", label: "Studio", values: workload ? { reasoning: 38.2, code: 30.1, security: 62.4 } : { reasoning: 45.1, code: 39.6, security: 74.4 } }, { id: comparison, ...selected }]} comparisonControl={<label className="text-xs text-muted-foreground">Compare with<select aria-label="Compare with" value={comparison} onChange={event => setComparison(event.target.value as keyof typeof alternatives)} className="ml-3 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground">{Object.entries(alternatives).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative benchmark methodology and controls</summary><p className="mt-4 leading-6">Fictional products and scores, not measured benchmarks. Replace with verified results and your evaluation methodology.</p><Button className="mt-4" variant="outline" size="sm" aria-pressed={workload} onClick={() => setWorkload(!workload)}>{workload ? "Show standard workload" : "Show intensive workload"}</Button></details></div>;
}
