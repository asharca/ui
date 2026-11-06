"use client";

import { useState } from "react";
import { AuroraDuoPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "free", name: "Free", description: "For small launches and the first workflows that prove the idea.", monthlyPrice: 0, annualPrice: 0, actionLabel: "Start with Free", benefits: ["One active workspace", "Core building blocks", "Community templates", "Standard exports", "Community support"] },
  { id: "pro", name: "Pro", description: "For products ready to move faster without trading away finish.", monthlyPrice: 2400, annualPrice: 23040, featured: true, actionLabel: "Continue with Pro", benefits: ["Everything in Free", "Unlimited workspaces", "Premium building blocks", "Production-ready exports", "Priority support"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function AuroraDuoPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><AuroraDuoPricing eyebrow="Plans for every stage" title="Start simple. Upgrade when the work earns it." description="Choose the room you need today. Keep every path open for tomorrow." yearlyLabel="Annual" yearlyBadge="Save 20%" plans={plans} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
