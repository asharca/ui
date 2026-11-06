"use client";

import { ArrowUpRight } from "lucide-react";
import { AlternatingTextSwap } from "@/components/motion/animated-text-treatments";

export function AlternatingTextSwapPreview() {
  return <div className="flex min-h-72 w-full items-center justify-center px-6 py-14"><div className="flex items-center gap-3 border-b border-border pb-2 text-3xl font-medium tracking-[-0.04em] sm:text-5xl"><AlternatingTextSwap text="Explore work" alternateText="View projects" /><ArrowUpRight aria-hidden className="size-5 text-muted-foreground sm:size-6" /></div></div>;
}
