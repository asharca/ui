"use client";

import { EvidenceBrief } from "@/components/motion/social-proof";
const sources = [
  {
    "id": "field",
    "title": "Team time diary",
    "href": "#source-time-diary",
    "publisher": "Preview research notebook",
    "publishedAt": "2026-10-21",
    "methodology": "Fictional local demonstration: three teams recorded estimated weekly coordination time. Not a published research claim."
  },
  {
    "id": "delivery",
    "title": "Milestone log",
    "href": "#source-milestones",
    "publisher": "Preview outcome register",
    "publishedAt": "2026-10-28",
    "methodology": "Fictional local demonstration: a four-week milestone sample, supplied to illustrate source attribution."
  }
];

const benchmarks = [
  {
    "id": "hours",
    "label": "Weekly time returned",
    "value": 8,
    "unit": "h",
    "context": "Per team in the demonstration diary.",
    "sourceId": "field"
  },
  {
    "id": "milestones",
    "label": "On-time milestones",
    "value": 89,
    "unit": "%",
    "context": "Across the demonstration milestone sample.",
    "sourceId": "delivery"
  }
];

/** Self-contained, original fictional demonstration; replace records with host content. */
export function EvidenceBriefPreview() {
  return <div className="w-full"><EvidenceBrief title="Less coordination. More meaningful work." narrative="This local demonstration makes every outcome inspectable. Replace these sample records with your own evidence, including the limits of what it can support." sources={sources} benchmarks={benchmarks} /><div className="mt-8 grid gap-4 sm:grid-cols-2"><p id="source-time-diary" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Sample time diary: Northline estimated 8 hours returned per week. Fictional demonstration, not an independently verified result.</p><p id="source-milestones" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Sample milestone log: 89 of 100 milestones were marked on time. Fictional demonstration, not a published benchmark.</p></div></div>;
}
