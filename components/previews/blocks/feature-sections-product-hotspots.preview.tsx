"use client";

import { ProductHotspots, type ProductHotspot } from "@/components/motion/marketing-feature-sections";
import { FeatureScene } from "./feature-sections-scenes";

const features: ProductHotspot[] = [
  { id: "arrive", title: "Room to find your focus", description: "A considered place to begin, with the tools and the useful details already close at hand.", x: 26, y: 44, visual: <FeatureScene kind="workspace"/>, href: "/docs", linkLabel: "Explore the workspace guide" },
  { id: "connect", title: "A shared point of view", description: "Keep the conversation next to the work, and make every new perspective part of the picture.", x: 58, y: 30, visual: <FeatureScene kind="collaboration"/>, href: "/docs", linkLabel: "Explore connected work" },
  { id: "make", title: "A little space for what comes next", description: "Bring your next idea to a calmer setting, with room for the small details that make it your own.", x: 78, y: 68, visual: <FeatureScene kind="draft"/>, href: "/docs", linkLabel: "Read the product guide" },
];

export function ProductHotspotsPreview() {
  return <ProductHotspots title={"Get to know your next workspace."} description={"A place for the plan, the people, and the little details. Pick a marker to take a closer look."} features={features} image={{ src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80", alt: "A bright collaborative workspace, legally available replacement photography for this tour" }} />;
}
