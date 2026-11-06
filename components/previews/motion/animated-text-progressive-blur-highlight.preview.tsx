"use client";

import { ProgressiveBlurHighlight } from "@/components/motion/animated-text-treatments";

export function ProgressiveBlurHighlightPreview() {
  return <div className="flex min-h-96 w-full items-center justify-center px-6 py-16 sm:px-12"><ProgressiveBlurHighlight segments={[{text:"Great products emerge when "},{text:"clear thinking",highlight:true},{text:" meets "},{text:"careful details,",highlight:true},{text:" confident motion, and the patience to "},{text:"refine what matters.",highlight:true}]} /></div>;
}
