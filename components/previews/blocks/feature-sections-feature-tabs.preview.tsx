"use client";

import { FeatureTabs, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "motion", title: "Interaction primitives that feel alive", description: "Buttons, switches, and small moments of feedback with motion already considered.", eyebrow: "Primitives", visual: <FeatureScene kind="motion"/> },
  { id: "assembly", title: "A thoughtful home for agent work", description: "Conversations, sources, and approvals stay close to the work they explain.", eyebrow: "Agent UI", visual: <FeatureScene kind="assembly"/> },
  { id: "page", title: "Sections that carry a complete story", description: "Compose a landing page without losing your own brand or source.", eyebrow: "Blocks", visual: <FeatureScene kind="page"/> },
  { id: "install", title: "A familiar installation workflow", description: "Bring the right dependencies into your repository and keep going.", eyebrow: "Tooling", visual: <FeatureScene kind="install"/> },
];

export function FeatureTabsPreview() {
  return <FeatureTabs title={"One library,\nevery layer."} description={""} features={features} />;
}
