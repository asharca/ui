"use client";

import { BlurHighlight } from "@/components/motion/animated-text-treatments";

export function BlurHighlightPreview() {
  return <div className="flex min-h-96 w-full items-center justify-center px-6 py-16 sm:px-12"><BlurHighlight segments={[{text:"We turn "},{text:"ideas into interfaces",highlight:true},{text:" where "},{text:"movement creates clarity,",highlight:true},{text:" rhythm builds trust, and every interaction "},{text:"carries meaning.",highlight:true}]} /></div>;
}
