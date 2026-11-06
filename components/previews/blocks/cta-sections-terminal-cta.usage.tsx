"use client";

import { CtaSections, type CtaSectionsProps } from "@/components/motion/cta-sections";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function CtaSectionsTerminalCtaUsage({ primary, secondary, onRunCommand }: Pick<CtaSectionsProps, "primary" | "secondary" | "downloads" | "onRunCommand">) {
  return <CtaSections variant="terminal-cta" title="Make room for your next good idea." description="A calmer workspace for thoughtful teams." primary={primary} secondary={secondary} command="bun add motion" onRunCommand={onRunCommand} />;
}
