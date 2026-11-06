"use client";

import { BenefitsTriptych, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "blocks", title: "Start with the right block", description: "Find a considered starting point for the section you need.", visual: <FeatureScene kind="blocks"/> },
  { id: "page", title: "Compose a complete page", description: "Keep the story clear as the sections come together.", visual: <FeatureScene kind="page"/> },
  { id: "theme", title: "Make every detail yours", description: "Use your colors, your source, and your own point of view.", visual: <FeatureScene kind="theme"/> },
];

export function BenefitsTriptychPreview() {
  return <BenefitsTriptych title={"From first section to finished page."} description={"A premium component system for teams that want to move quickly without giving up ownership or polish."} features={features} />;
}
