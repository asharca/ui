"use client";

import { useState } from "react";
import { PricingCommandDeck, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "launch", name: "Launch", description: "For small teams turning their first repeatable process live.", monthlyPrice: 2900, annualPrice: 27600, actionLabel: "Start building", benefits: ["Three active workspaces", "25k monthly runs", "Core integrations", "Seven-day activity history", "Community support"] },
  { id: "scale", name: "Scale", description: "For product teams that need more control as volume grows.", monthlyPrice: 7900, annualPrice: 75600, featured: true, actionLabel: "Choose Scale", benefits: ["Everything in Launch", "Unlimited workspaces", "500k monthly runs", "Advanced permissions", "Priority support"] },
  { id: "enterprise", name: "Enterprise", description: "For organizations with custom security and scale requirements.", monthlyPrice: 0, annualPrice: 0, priceLabel: "Custom", note: "Annual agreement", actionLabel: "Talk to sales", benefits: ["Everything in Scale", "SAML and directory sync", "Custom data retention", "Security review support", "Dedicated success lead"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment or contact sales. */
export function PricingCommandDeckPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><PricingCommandDeck eyebrow="Pricing plans" title="One plan for every stage of the work." description="Start lean, then add capacity when the signal is clear." yearlyLabel="Annual" yearlyBadge="−20%" defaultBilling="yearly" plans={plans} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {selection.custom ? "custom quote requested" : `${new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax`}.</output>}</div>;
}
