"use client";

import { CapabilityShowcase } from "@/components/motion/content-sections";


export function ContentCapabilityShowcasePreview() {
  return <CapabilityShowcase {...{ "eyebrow": "One connected system", "title": "Made for the way\nyour team works.", "description": "", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "proofPoints": ["Evidence stays attached to the story.", "The team decides what happens next.", "Every workflow has a clear owner."], "capabilities": [{"id": "discover", "title": "Room to discover", "description": "Bring scattered context into a view that rewards curiosity.", "link": {"label": "Explore discovery", "href": "https://example.com/discover"}}, {"id": "decide", "title": "Clarity to decide", "description": "Move from a promising signal to a decision you can explain.", "link": {"label": "Explore decisions", "href": "https://example.com/decide"}}] }} />;
}
