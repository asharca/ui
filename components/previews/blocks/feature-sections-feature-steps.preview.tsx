"use client";

import { FeatureSteps, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "prompt", title: "Describe what you need", description: "Start with the page and the story you want to tell. A useful brief gives every section a clear role.", visual: <FeatureScene kind="prompt"/> },
  { id: "blocks", title: "Drop in the blocks", description: "Choose the sections and bring their source into your project.", visual: <FeatureScene kind="blocks"/> },
  { id: "page", title: "Ship the page", description: "Put your own content and brand in place, then review the complete experience.", visual: <FeatureScene kind="page"/> },
];

export function FeatureStepsPreview() {
  return <FeatureSteps title={"From idea to shipped UI in three steps"} description={"Turn a single prompt into a finished interface — compose premium blocks and own the source, all from one workflow."} features={features} />;
}
