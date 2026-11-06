"use client";

import { FeatureShowcase, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "assembly", title: "Assemble a page in minutes", description: "Bring the hero, pricing, footer, and next step together from source you can understand.", visual: <FeatureScene kind="assembly"/> },
  { id: "files", title: "Source files, fully yours", description: "Every piece lives in your repository. Read it, shape it, and keep control of the details.", visual: <FeatureScene kind="files"/> },
  { id: "install", title: "Install in one command", description: "Use the beUI registry to bring a component and its dependencies into your project.", visual: <FeatureScene kind="install"/> },
];

export function FeatureShowcasePreview() {
  return <FeatureShowcase title={"One library.\nEvery layer covered."} description={"beUI gives you the motion, polish, and structure to ship premium interfaces faster — without rebuilding the basics."} features={features} />;
}
