"use client";

import { useId, useState } from "react";
import { FeatureComparison } from "@/components/motion/comparison";

const features = [
  { id: "launch", label: "Ready to launch", description: "Typical time from setup to your first live workflow.", values: { studio: "18 minutes", basic: "2–3 days", enterprise: "2–4 weeks" } },
  { id: "source", label: "Your source code", description: "Keep the complete implementation in your repository.", values: { studio: true, basic: true, enterprise: false } },
  { id: "motion", label: "Motion included", description: "Polished transitions with accessible reduced-motion states.", values: { studio: true, basic: "Some", enterprise: false } },
  { id: "themes", label: "Light and dark themes", description: "Both appearances are considered from the beginning.", values: { studio: "Included", basic: "Manual setup", enterprise: "Add-on" } },
  { id: "updates", label: "Future updates", description: "How new improvements make their way to your project.", values: { studio: "Always included", basic: "Per release", enterprise: "By contract" } },
  { id: "governance", label: "Hosted runtime required", description: "Whether your product depends on another hosted service.", values: { studio: false, basic: false, enterprise: true } },
];

export function FeatureComparisonPreview() {
  const id = useId();
  const [includeGovernance, setIncludeGovernance] = useState(true);
  const products = [
    { id: "studio", name: "Studio", description: "The complete experience", action: { label: "Choose Studio", href: `#${id}-studio` } },
    { id: "basic", name: "Basic", description: "A flexible starting point", action: { label: "Choose Basic", href: `#${id}-basic` } },
    { id: "enterprise", name: "Enterprise", description: "The traditional route", action: { label: "Choose Enterprise", href: `#${id}-enterprise` } },
  ];
  return <div className="w-full"><FeatureComparison title="Choose the way you want to build." description="A thoughtful look at the details that matter after launch—not a wall of features designed to overwhelm you." products={products} features={features.filter(feature => includeGovernance || feature.id !== "governance")} featuredId="studio" /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative plans and comparison controls</summary><p className="mt-4 leading-6">Fictional product examples, not purchase offers or verified vendor claims.</p><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={includeGovernance} onChange={event => setIncludeGovernance(event.target.checked)} />Include governance features</label></details><div className="mx-6 space-y-3">{products.map(product => <section key={product.id} id={`${id}-${product.id}`} className="scroll-mt-20 rounded-xl border border-border p-4 text-sm"><h3 className="font-medium">{product.name} example plan</h3><p className="mt-2 text-xs text-muted-foreground">{product.description}. Local plan information only; no checkout or account creation occurs.</p></section>)}</div></div>;
}
