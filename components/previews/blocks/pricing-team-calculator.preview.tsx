"use client";

import { useState } from "react";
import { TeamCalculatorPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plan: PricingPlan = { id: "team", name: "Team", description: "One shared workspace for everyone.", monthlyPrice: 2400, annualPrice: 23040, benefits: ["Unlimited projects and shared spaces", "Admin controls and member permissions", "Centralized billing for your whole team", "Priority support from real people"] };

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function TeamCalculatorPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><TeamCalculatorPricing eyebrow="Made for teams" title="Good work gets better together." description="One workspace for your whole team. Find your fit, see the full price, and leave room to grow." plans={[plan]} minSeats={2} maxSeats={100} defaultSeats={10} volumeDiscounts={[{ minSeats: 10, basisPoints: 1000 }, { minSeats: 25, basisPoints: 2000 }, { minSeats: 50, basisPoints: 2500 }]} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-6 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-6 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.quantity} seat{selection.quantity === 1 ? "" : "s"} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
