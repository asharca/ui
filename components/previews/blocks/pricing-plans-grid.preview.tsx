"use client";

import { useState } from "react";
import { PlansGridPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "starter", name: "Starter", description: "Everything to ship your first agent.", monthlyPrice: 0, annualPrice: 0, note: "No card required", actionLabel: "Start free", benefits: ["1 project", "Community models", "5k requests / month", "Community support"] },
  { id: "pro", name: "Pro", badge: "Best value", description: "For teams building production agents.", monthlyPrice: 3000, annualPrice: 28800, featured: true, actionLabel: "Get started", benefits: ["Unlimited projects", "Frontier models", "250k requests / month", "Priority support", "Usage analytics"] },
  { id: "enterprise", name: "Enterprise", description: "Security, scale, and dedicated help.", monthlyPrice: 0, annualPrice: 0, priceLabel: "Custom", note: "Volume pricing for your org", actionLabel: "Contact sales", benefits: ["Everything in Pro", "SSO & SCIM", "Dedicated infra", "SLA & onboarding"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment or contact sales. */
export function PlansGridPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><PlansGridPricing eyebrow="Pricing" title="Pricing that scales with your agents" description="Start free, then pay only for the throughput you ship. Switch billing anytime." footnote="Prices in USD. Annual billing is charged yearly." yearlyLabel="Annual" yearlyBadge="Save 20%" defaultBilling="yearly" plans={plans} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {selection.custom ? "custom quote requested" : `${new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax`}.</output>}</div>;
}
