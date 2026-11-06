"use client";

import { useState } from "react";
import { VisualPlansPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "starter", name: "Starter", badge: "Self-serve", description: "Open a workspace, invite your team, and take the core workflow live today.", monthlyPrice: 0, annualPrice: 0, actionLabel: "Create workspace", benefits: ["Up to 10 active projects", "One connected workspace", "Guided setup in under 10 minutes"] },
  { id: "pro", name: "Pro", badge: "Guided", description: "Bring in an expert to shape the rollout around your team and operating model.", monthlyPrice: 65000, annualPrice: 780000, featured: true, actionLabel: "Book a walkthrough", benefits: ["Live working session", "A rollout mapped to your use case", "Async support after launch"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function VisualPlansPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><VisualPlansPricing eyebrow="Choose your starting point" title="Start free. Bring us in when the stakes rise." description="Launch on your own today, or book a focused walkthrough when you want a rollout shaped around your team." plans={plans} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment or booking is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
