"use client";

import { ShaderLaunchModal } from "@/components/motion/announcement-banners";
import { ChromaticTextReveal } from "@/components/motion/chromatic-text-reveal";

export function ShaderLaunchModalPreview() {
  return <div className="w-full"><ShaderLaunchModal presentation="inline" defaultOpen headline={<ChromaticTextReveal prefix="Made to" words={["connect.", "create.", "launch."]} className="block" />} secondaryAction={{ label: "Read the story", href: "#shader-launch-story" }} story={{ id: "release", title: "Made to connect.", description: "Meet a considered collection shaped for teams who want the work to feel clearer, calmer, and more distinctly their own.", label: "The new collection", href: "#shader-launch-details", actionLabel: "Explore the release" }} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative release notes</summary><section id="shader-launch-details" className="mt-5 rounded-xl border border-border p-6"><h3 className="text-base font-medium text-foreground">The new collection</h3><p className="mt-3 leading-6">A collection of workflows for a clearer brief, shared review, and a considered release.</p></section><section id="shader-launch-story" className="mt-4 rounded-xl border border-border p-6"><h3 className="text-base font-medium text-foreground">Made for considered collaboration</h3><p className="mt-3 leading-6">This local demonstration story explains the launch announcement. It does not represent an external product release.</p></section></details></div>;
}
