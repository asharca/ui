"use client";

import { VisualBenefits, type MarketingFeature } from "@/components/motion/marketing-feature-sections";
import { LayeredFeatureArtwork } from "./feature-sections-scenes";

const features: MarketingFeature[] = [
  { id: "connected", title: "Your work, on your terms", description: "Keep ownership of your data and decisions. Build a workspace that fits the way your team thinks.", visual: null },
  { id: "clear", title: "Everything in the right place", description: "Bring your notes, tools, and projects together, so a good idea never gets lost between tabs.", visual: null },
  { id: "yours", title: "Less setup. More progress.", description: "Turn everyday routines into repeatable workflows and give your team time for the work that matters.", visual: null },
];

export function VisualBenefitsPreview() {
  return <VisualBenefits title="A clearer way to move forward." features={features} artwork={<LayeredFeatureArtwork/>} cta={{ label: "Find your flow", href: "/components" }}/>;
}
