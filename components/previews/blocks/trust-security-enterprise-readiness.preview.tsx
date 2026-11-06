"use client";

import { useId } from "react";
import { EnterpriseReadiness } from "@/components/motion/trust-security";

const claims = [
  {
    "id": "sso",
    "title": "Single sign-on",
    "description": "Example identity control."
  },
  {
    "id": "roles",
    "title": "Role-based access",
    "description": "Example access policy."
  },
  {
    "id": "audit",
    "title": "Audit history",
    "description": "Example activity record."
  },
  {
    "id": "residency",
    "title": "Data residency",
    "description": "Example processing boundary."
  },
  {
    "id": "encryption",
    "title": "Encryption",
    "description": "Example protection scope."
  },
  {
    "id": "networking",
    "title": "Private networking",
    "description": "Example network boundary."
  }
];

export function EnterpriseReadinessPreview() {
  const id = useId();
  return <div className="w-full"><EnterpriseReadiness title="Ready for the bigger picture." description="The support, flexibility, and control your next chapter needs." disclosure="Illustrative example only. No certification, support guarantee, or service-level commitment for beUI or any deployed service is represented." claims={claims} support={{ id: "support", title: "A team in your corner.", description: "From the first conversation to your next milestone, work with people who understand your setup and stay close to the details.", detail: <ul className="space-y-3">{["A dedicated implementation partner", "A rollout shaped around your team", "Practical guidance as your needs change", "A clear path for priority support"].map(label => <li key={label}>✓ {label}</li>)}</ul> }} deployment={{ id: "deployment", title: "Fits the way you operate.", description: "Choose where your work runs and how your systems connect. Keep the tools you trust, with room to change direction later.", detail: <ul className="space-y-3">{["Cloud, private, or hybrid deployment", "Connect your existing tools and services", "Flexible identity and access policies", "A migration plan that keeps work moving"].map(label => <li key={label}>✓ {label}</li>)}</ul> }} contact={{ label: "Let’s talk through your needs", href: `#${id}-evidence` }} /><details id={`${id}-evidence`} className="mx-6 mb-6 scroll-mt-20 text-xs text-muted-foreground"><summary className="cursor-pointer">Example evidence and contact policy</summary><p className="mt-4 rounded-xl border border-border p-5 leading-6">These fictional controls and observations demonstrate the composition. In production, supply reviewed policies, verified audits and status history, and actual support channels. No authorization, certification, or external contact is performed by this example.</p></details></div>;
}
