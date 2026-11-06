"use client";

import { useState } from "react";
import { UpgradePanelPricing, type PricingPlan, type PricingQuote } from "@/components/motion/pricing";

const plans: PricingPlan[] = [
  { id: "pro", name: "Pro", description: "For individuals and indie hackers.", note: "Ship faster with every library component.", monthlyPrice: 1100, annualPrice: 9600, benefits: ["Everything in Free", "All library components", "Copy-paste source", "Private registry access", "New components monthly", "Standard support"] },
  { id: "max", name: "Max", description: "For studios shipping client work.", note: "More seats, shared libraries, and faster help.", monthlyPrice: 2400, annualPrice: 21000, benefits: ["Everything in Pro", "Shared team libraries", "Client project license", "Design tokens", "Early access releases", "Priority support"] },
  { id: "ultra", name: "Ultra", description: "For product teams at scale.", note: "Governance and guidance for larger rollouts.", monthlyPrice: 4800, annualPrice: 42000, benefits: ["Everything in Max", "Single sign-on", "Usage reporting", "Custom onboarding", "Roadmap sessions", "Dedicated support"] },
];

/** Copyable host composition. This preview records selection locally; it does not simulate payment. */
export function UpgradePanelPricingPreview() {
  const [selection, setSelection] = useState<PricingQuote | null>(null);
  return <div className="w-full space-y-4 py-8"><UpgradePanelPricing title="Upgrade to Asharca" plans={plans} defaultBilling="yearly" seatLabel="editor" minSeats={1} defaultSeats={1} maxSeats={50} helpHref="#pricing-help" currency="USD" locale="en-US" onChoose={(quote) => setSelection(quote)} /><p id="pricing-help" className="px-4 text-center text-xs text-muted-foreground">Local selection demo. No payment is submitted. Plan help would open your own support route.</p>{selection && <output className="mx-4 block rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">Selected {selection.planId} · {selection.quantity} editor{selection.quantity === 1 ? "" : "s"} · {selection.period} · {new Intl.NumberFormat("en-US", { style: "currency", currency: selection.currency }).format(selection.total / 100)} before tax.</output>}</div>;
}
