"use client";

import { useState } from "react";
import { AuroraFlowPricing, type PricingQuote } from "@/components/motion/pricing";

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function AuroraFlowPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><AuroraFlowPricing eyebrow="All-access membership" title="Own the source. Keep every update." tagline="Pay once · use in unlimited projects" plan={{ id: "lifetime", name: "Lifetime", badge: "Full source", description: "One payment unlocks the complete library and every new release that follows.", actionLabel: "Get instant access", benefits: ["Every component in the library", "New releases from day one", "Request the block you need", "Lifetime source updates", "Commercial project license"] }} lifetimePrice={12900} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
