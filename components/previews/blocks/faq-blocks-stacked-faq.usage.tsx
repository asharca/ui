"use client";

import { FaqBlocks, type FaqBlocksProps } from "@/components/motion/faq-blocks";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function FaqBlocksStackedFaqUsage({ questions, support }: Pick<FaqBlocksProps, "questions" | "support">) {
  return <FaqBlocks variant="stacked-faq" title="Good questions, clear answers." description="Find the detail you need." questions={questions} support={support} />;
}
