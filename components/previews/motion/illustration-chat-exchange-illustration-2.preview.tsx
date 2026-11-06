"use client";

import { ResearchScene } from "@/components/motion/illustration-chat-exchange";
export function ResearchScenePreview() {
  return <ResearchScene initialQuery="Research the latest AI agent frameworks" onResearch={async (query) => {
    // Explicit sample research result with real, public references.
    await new Promise((resolve) => setTimeout(resolve, 650));
    return { summary: `Example synthesis for “${query}”: Respect user motion preferences and offer a usable static alternative.`, sources: [
      { title: "MDN: prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
      { title: "W3C: Animation from interactions", url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" },
    ] };
  }} />;
}
