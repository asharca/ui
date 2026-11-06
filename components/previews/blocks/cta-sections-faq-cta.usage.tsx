"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsFaqCtaUsage({ primary, secondary }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="faq-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} questions={[{ id: "start", question: "How do I begin?", answer: "Start with one clear workflow and invite your team." }, { id: "control", question: "Who controls the data?", answer: "Your application owns its data and integrations." }]} />;
}
