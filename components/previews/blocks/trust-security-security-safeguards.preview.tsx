"use client";

import { useId } from "react";
import { SecuritySafeguards } from "@/components/motion/trust-security";

const claims = [
  {
    "id": "privacy",
    "title": "Private by default",
    "description": "Access stays scoped to the people and services that genuinely need it."
  },
  {
    "id": "identity",
    "title": "Strong identity controls",
    "description": "Single sign-on, multi-factor authentication, and clear session policies."
  },
  {
    "id": "encryption",
    "title": "Managed encryption",
    "description": "Modern encryption protects data while it moves and while it is stored."
  },
  {
    "id": "recovery",
    "title": "Recoverable by design",
    "description": "Regular backups and tested recovery plans keep important work available."
  }
];

export function SecuritySafeguardsPreview() {
  const id = useId();
  return <div className="w-full"><SecuritySafeguards title="Protection that stays quietly in the background." description="Security should support the work, not interrupt it. Every layer is designed to reduce risk while keeping ordinary moments simple." disclosure="Illustrative example only. No certification, support guarantee, or service-level commitment for beUI or any deployed service is represented." claims={claims} /><details id={`${id}-evidence`} className="mx-6 mb-6 scroll-mt-20 text-xs text-muted-foreground"><summary className="cursor-pointer">Example evidence and contact policy</summary><p className="mt-4 rounded-xl border border-border p-5 leading-6">These fictional controls and observations demonstrate the composition. In production, supply reviewed policies, verified audits and status history, and actual support channels. No authorization, certification, or external contact is performed by this example.</p></details></div>;
}
