"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsProductWindowCtaUsage({ primary, secondary }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="product-window-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} workspace={[{ id: "plan", title: "Plan", content: <p>Your next step, in focus.</p> }, { id: "notes", title: "Notes", content: <p>A shared place to think.</p> }]} />;
}
