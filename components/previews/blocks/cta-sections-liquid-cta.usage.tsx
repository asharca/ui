"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsLiquidCtaUsage({ primary, secondary }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="liquid-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} />;
}
