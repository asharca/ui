"use client";

import { useState } from "react";
import { PricingLedger, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "core", name: "Core", description: "For small teams getting their first workflows live.", monthlyPrice: 2400, annualPrice: 22800, includedSeats: 5, additionalSeatMonthlyPrice: 500, additionalSeatAnnualPrice: 4800, benefits: ["100k monthly events", "Seven-day history", "Community support"] },
  { id: "scale", name: "Scale", description: "For growing teams that need observability and control.", monthlyPrice: 6400, annualPrice: 61200, includedSeats: 10, additionalSeatMonthlyPrice: 500, additionalSeatAnnualPrice: 4800, benefits: ["500k monthly events", "Audit history", "Priority support"], featured: true },
  { id: "enterprise", name: "Enterprise", description: "For larger teams coordinating connected work.", monthlyPrice: 16000, annualPrice: 153600, includedSeats: 25, additionalSeatMonthlyPrice: 400, additionalSeatAnnualPrice: 3840, benefits: ["Unlimited events", "Admin controls", "Guided onboarding"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function PricingLedgerPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><PricingLedger eyebrow="Pricing" title="A price you can explain line by line." description="Pick a plan and team size. Every line of the estimate updates as you go." footnote="No setup fee. Change seats anytime." yearlyLabel="Annual" yearlyBadge="−20%" plans={plans} defaultSelectedPlan="scale" defaultBilling="yearly" defaultSeats={12} maxSeats={50} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Illustrative base-plus-seat pricing. Local selection only; no payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.quantity} seat{selection.quantity === 1 ? "" : "s"} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
