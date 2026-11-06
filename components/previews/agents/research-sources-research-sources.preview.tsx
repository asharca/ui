"use client";
import { useState } from "react";
import { ResearchSources } from "@/components/agents/research-sources";
export function ResearchSourcesPreview() {
  const [selected, setSelected] = useState<string[]>(["aria", "motion"]);
  return <div className="mx-auto w-full max-w-2xl"><ResearchSources selected={selected} onSelectedChange={setSelected} sources={[
    { id: "aria", title: "ARIA Authoring Practices Guide", type: "Guide", publisher: "W3C", category: "Pattern library", url: "https://www.w3.org/WAI/ARIA/apg/", summary: "Patterns and working examples for building accessible widgets, with keyboard behavior spelled out for each one." },
    { id: "wcag", title: "Web Content Accessibility Guidelines 2.2", type: "Specification", publisher: "W3C", category: "W3C Recommendation", url: "https://www.w3.org/TR/WCAG22/", summary: "The success criteria most accessibility reviews are measured against, grouped by perceivable, operable, understandable, and robust." },
    { id: "focus", title: "Understanding Focus Visible", type: "Guide", publisher: "W3C", category: "Understanding WCAG", url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html", summary: "Why keyboard users need a clear focus indicator, and what counts as visible enough to pass." },
    { id: "motion", title: "prefers-reduced-motion", type: "Documentation", publisher: "MDN", category: "CSS reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", summary: "The media feature for detecting when someone has asked their system to minimize non-essential motion." },
    { id: "dialog", title: "ARIA: dialog role", type: "Documentation", publisher: "MDN", category: "ARIA reference", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role", summary: "How to label a dialog, where focus should go when it opens, and how to return it when it closes." },
    { id: "learn", title: "Learn Accessibility", type: "Guide", publisher: "web.dev", category: "Course", url: "https://web.dev/learn/accessibility", summary: "A course covering semantics, focus, color, and motion, with short exercises you can try in the browser." }
  ]} /></div>;
}
