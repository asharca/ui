"use client";

import { FeatureStageTabs, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "workspace", title: "Unified workspace", description: "Every conversation stays in context. The request, the source, and the next useful action share a home.", visual: <FeatureScene kind="workspace"/> },
  { id: "handoff", title: "Automated handoffs", description: "Carry the owner, decisions, and useful background into every next step.", visual: <FeatureScene kind="handoff"/> },
  { id: "insights", title: "Live insights", description: "Understand the shape of the work, without losing the context behind each number.", visual: <FeatureScene kind="insights"/> },
  { id: "learning", title: "Always improving", description: "Turn useful decisions into knowledge the whole team can return to.", visual: <FeatureScene kind="learning"/> },
];

export function FeatureStageTabsPreview() {
  return <FeatureStageTabs title="One workspace, with the full picture." description="Explore each stage of a locally illustrated workspace." features={features}/>;
}
