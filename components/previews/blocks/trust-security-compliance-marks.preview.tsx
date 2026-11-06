"use client";

import { useId } from "react";
import { ComplianceMarks } from "@/components/motion/trust-security";

const claims = [
  {
    "id": "soc2",
    "title": "SOC 2",
    "status": "Type II",
    "description": "Independent controls reviewed across security, availability, and confidentiality."
  },
  {
    "id": "iso",
    "title": "ISO",
    "status": "27001",
    "description": "A documented security program shaped around continuous risk management."
  },
  {
    "id": "gdpr",
    "title": "GDPR",
    "status": "Ready",
    "description": "Clear data rights, regional processing choices, and practical privacy controls."
  },
  {
    "id": "hipaa",
    "title": "HIPAA",
    "status": "Ready",
    "description": "Safeguards and agreements available for teams handling protected health data."
  }
];

export function ComplianceMarksPreview() {
  const id = useId();
  return <div className="w-full"><ComplianceMarks title="Proof you can share with every stakeholder." description="Clear standards make security easier to evaluate. Give legal, procurement, and leadership the evidence they need without slowing the work down." disclosure="Illustrative example only. No certification, support guarantee, or service-level commitment for beUI or any deployed service is represented." claims={claims} trustCenter={{ label: "Visit the illustrative trust center", href: `#${id}-evidence` }} /><details id={`${id}-evidence`} className="mx-6 mb-6 scroll-mt-20 text-xs text-muted-foreground"><summary className="cursor-pointer">Example evidence and contact policy</summary><p className="mt-4 rounded-xl border border-border p-5 leading-6">These fictional controls and observations demonstrate the composition. In production, supply reviewed policies, verified audits and status history, and actual support channels. No authorization, certification, or external contact is performed by this example.</p></details></div>;
}
