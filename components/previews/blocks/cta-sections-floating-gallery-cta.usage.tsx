"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsFloatingGalleryCtaUsage({ primary, secondary, downloads }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="floating-gallery-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} downloads={downloads} media={[{ id: "studio", src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80", alt: "A light-filled studio" }, { id: "landscape", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80", alt: "An open landscape" }]} stats={[{ label: "Open projects", value: "12" }]} />;
}
