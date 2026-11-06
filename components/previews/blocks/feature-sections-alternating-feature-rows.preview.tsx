"use client";

import { AlternatingFeatureRows, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "draft", title: "Give every idea a place to grow.", description: "Keep the first sketch, the passing thought, and the useful note together. A little structure makes it easier to return with fresh eyes.", eyebrow: "01 / Make space", visual: <FeatureScene kind="draft"/> },
  { id: "collaboration", title: "Good work is a conversation.", description: "Bring feedback next to the work. Share the full picture, discuss the small details, and find a useful next step together.", eyebrow: "02 / Find your rhythm", visual: <FeatureScene kind="collaboration"/> },
  { id: "release", title: "From almost there to out in the world.", description: "Make the final details visible, keep the people involved, and turn a finished project into the beginning of what comes next.", eyebrow: "03 / Put it out there", visual: <FeatureScene kind="release"/> },
];

export function AlternatingFeatureRowsPreview() {
  return <AlternatingFeatureRows title="From a first thought to a finished thing." description="One connected space for the way good work actually happens." features={features} />;
}
