"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsProofOrbitCtaUsage({ primary, secondary }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="proof-orbit-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} proof={[{ id: "mara", name: "Mara", role: "Design", quote: "More room for good work." }, { id: "eli", name: "Eli", role: "Engineering", quote: "A clear next step." }]} reassurance="Explore at your own pace." />;
}
