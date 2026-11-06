"use client";

import { useState } from "react";
import { AIPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "free", name: "Free", description: "Start with the essentials. Upgrade when you need more space.", monthlyPrice: 0, annualPrice: 0, actionLabel: "Start for free", benefitsLabel: "A useful place to start", benefits: ["Everyday questions and writing", "Standard model access", "Limited file and image uploads", "Saved conversations"] },
  { id: "pro", name: "Pro", description: "5× usage for everyday work. More room to write, research, and create.", monthlyPrice: 4000, annualPrice: 38400, featured: true, actionLabel: "Get Pro", benefitsLabel: "Everything in Free, plus", benefits: ["Our most capable models", "Deep research and advanced reasoning", "Larger files and longer conversations", "Projects with persistent context", "Priority access during busy hours"] },
  { id: "team", name: "Team", description: "5× usage for every person. Start with 2 or more teammates.", monthlyPrice: 3000, annualPrice: 28800, priceSuffix: "/ person / month", actionLabel: "Create a team", benefitsLabel: "Built for shared work", benefits: ["Everything in Pro at 5× usage per seat", "A shared workspace for your team", "Centralized billing and admin controls", "Team content excluded from training", "Manage members and permissions"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function AIPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4"><AIPricing eyebrow="Simple plans. More room to think." title="A little help. A bigger possibility." description="From your first question to your most ambitious work. Find the space to think, create, and go further." footnote="Usage limits apply. Allowances vary with model, message length, and tools. Taxes may apply." plans={plans} proPlanId="pro" proUsagePrices={[{ multiplier: 5, monthlyPrice: 4000, annualPrice: 38400 }, { multiplier: 20, monthlyPrice: 10000, annualPrice: 96000, description: "20× usage for your biggest ideas. Go deeper with longer, more demanding work." }]} currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p className="px-4 text-xs text-muted-foreground">Local selection demo. No payment is submitted.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId}{selection.usageMultiplier ? ` ${selection.usageMultiplier}×` : ""} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
