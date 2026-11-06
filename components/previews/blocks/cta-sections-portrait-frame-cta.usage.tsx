"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsPortraitFrameCtaUsage({ primary, secondary }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="portrait-frame-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} media={[{ id: "studio", src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80", alt: "The studio" }]} />;
}
