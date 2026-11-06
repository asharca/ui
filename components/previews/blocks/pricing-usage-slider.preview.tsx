"use client";

import { useState } from "react";
import { UsageSliderPricing, type PricingQuote, type UsagePricingTier } from "@/components/motion/pricing";

const tiers: UsagePricingTier[] = ([[3, 1900], [5, 2900], [10, 4900], [25, 8900], [50, 14900], [100, 24900], [250, 44900], [500, 74900], [1000, 129000]] as const).map(([units, monthlyPrice]) => ({ id: `seats-${units}`, units, label: `${units} seats`, monthlyPrice, annualPrice: monthlyPrice * 11 }));

/** Copyable host composition. This preview records selection locally; it does not start a trial or payment. */
export function UsageSliderPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4 py-8"><UsageSliderPricing tiers={tiers} defaultTier="seats-50" unitLabel="seats" yearlyBadge="1 month free" actionLabel="Start 3-day free trial" footnote="No credit card required. Cancel anytime." benefits={["All components & blocks", "Copy-paste source access", "Private registry access", "New components every month", "Figma kit & design tokens", "TypeScript & Tailwind v4 ready", "Priority email support"]} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-center text-xs text-muted-foreground">Local selection demo. No trial or payment is started.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
