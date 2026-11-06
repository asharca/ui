"use client";

import { useId } from "react";
import { ReliabilityAndSupport } from "@/components/motion/trust-security";

const claims = [
  {
    "id": "response",
    "title": "Under five minutes",
    "description": "A real person joins urgent conversations without a long queue."
  },
  {
    "id": "monitoring",
    "title": "Every hour of every day",
    "description": "Availability and critical paths are watched continuously."
  },
  {
    "id": "incidents",
    "title": "Clear and accountable",
    "description": "Meaningful incidents receive a plain-language review and next steps."
  }
];

export function ReliabilityAndSupportPreview() {
  const id = useId();
  return <div className="w-full"><ReliabilityAndSupport title="Steady when it matters. Human when you need help." description="Dependable infrastructure is only half the promise. Clear communication and thoughtful support keep your team moving when something needs attention." disclosure="Illustrative example only. No certification, support guarantee, or service-level commitment for beUI or any deployed service is represented." claims={claims} uptime={{ value: 99.99, decimals: 2, label: "Service availability", period: "Illustrative 30-day window, not an SLA", evidenceHref: `#${id}-evidence` }} availability={[{ label: "30 days ago", value: 99.98 }, { label: "25 days ago", value: 100 }, { label: "20 days ago", value: 99.99 }, { label: "15 days ago", value: 100 }, { label: "10 days ago", value: 99.97 }, { label: "Today", value: 100 }]} statusLink={{ label: "View illustrative status", href: `#${id}-evidence` }} /><details id={`${id}-evidence`} className="mx-6 mb-6 scroll-mt-20 text-xs text-muted-foreground"><summary className="cursor-pointer">Example evidence and contact policy</summary><p className="mt-4 rounded-xl border border-border p-5 leading-6">These fictional controls and observations demonstrate the composition. In production, supply reviewed policies, verified audits and status history, and actual support channels. No authorization, certification, or external contact is performed by this example.</p></details></div>;
}
