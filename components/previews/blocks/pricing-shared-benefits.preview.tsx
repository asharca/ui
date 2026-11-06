"use client";

import { useState } from "react";
import { SharedBenefitsPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "solo", name: "Solo", description: "For your own ideas", monthlyPrice: 1600, annualPrice: 15360, note: "1 person · 10 active projects · 20 GB storage", benefits: [] },
  { id: "studio", name: "Studio", description: "For a small, focused team", monthlyPrice: 4800, annualPrice: 46080, note: "5 people · 50 active projects · 100 GB storage", benefits: [], featured: true },
  { id: "collective", name: "Collective", description: "For bigger collaborations", monthlyPrice: 9600, annualPrice: 92160, note: "15 people · Unlimited projects · 1 TB storage", benefits: [] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function SharedBenefitsPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><SharedBenefitsPricing title="The same great tools. Your kind of space." description="Every plan starts with the essentials. Choose the room you need to make something worth sharing." plans={plans} defaultSelectedPlan="studio" benefits={["All creative tools, from day one", "Unlimited guests and shared links", "Version history and automatic backups", "Export your work in original quality", "Personal support when you need it"]} banner={<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" alt="Turquoise water meeting a quiet sandy shore" className="aspect-[2/1] w-full object-cover dark:brightness-75" />} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-6 text-xs text-muted-foreground">Local selection demo. No payment is submitted. Photography from Unsplash.</p>{selection && <output className="mx-6 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
