"use client";

import { FeatureList, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "files", title: "Copy-paste source", description: "Keep the component in your repository, with every detail open to inspection and change.", visual: <FeatureScene kind="files"/> },
  { id: "install", title: "Private registry", description: "Bring source and dependencies into the project through the same shadcn workflow.", visual: <FeatureScene kind="install"/> },
  { id: "motion", title: "Motion built-in", description: "Considered springs, shared-layout transitions, and reduced-motion alternatives are part of the component.", visual: <FeatureScene kind="motion"/> },
  { id: "theme", title: "Theme-aware", description: "Work from your semantic tokens, in light and dark, without rebuilding the visual system.", visual: <FeatureScene kind="theme"/> },
];

export function FeatureListPreview() {
  return <FeatureList title={"Everything you need to ship\npremium UI, nothing in your way."} description={"From primitive to shipped block in minutes — polished, animated, and ready to publish."} features={features} />;
}
