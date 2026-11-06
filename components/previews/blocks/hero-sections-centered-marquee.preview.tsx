"use client";

import { CenteredMarqueeHero } from "@/components/motion/hero-sections";


export function HeroCenteredMarqueePreview() {
  return <CenteredMarqueeHero {...{ "eyebrow": "Trusted by 8,000+ teams", "title": "Search that understands what you mean", "description": "Ask in plain language and Fieldwork ranks the most relevant docs, tickets, and threads — no keywords or filters required.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "marks": [{"name": "Northstar", "symbol": "✳", "href": "https://example.com/northstar"}, {"name": "Canopy", "symbol": "◇", "href": "https://example.com/canopy"}, {"name": "Outline", "symbol": "◌", "href": "https://example.com/outline"}, {"name": "Daybreak", "symbol": "↗", "href": "https://example.com/daybreak"}, {"name": "Arc Studio", "symbol": "◈", "href": "https://example.com/arc studio"}] }} />;
}
