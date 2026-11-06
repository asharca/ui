"use client";

import { SignalAuroraHero } from "@/components/motion/hero-sections";


export function HeroSignalAuroraPreview() {
  return <SignalAuroraHero {...{ "eyebrow": "Product intelligence, without the guesswork", "title": "Turn customer signals into your next clear move", "description": "Bring product usage, revenue, support, and feedback into one calm view — then see what deserves your attention next.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "navigation": {"brand": {"label": "Fieldwork", "href": "https://example.com"}, "links": [{"label": "Platform", "href": "https://example.com/platform"}, {"label": "Resources", "href": "https://example.com/guide"}]}, "marks": [{"name": "Northstar", "symbol": "✳", "href": "https://example.com/northstar"}, {"name": "Canopy", "symbol": "◇", "href": "https://example.com/canopy"}, {"name": "Outline", "symbol": "◌", "href": "https://example.com/outline"}, {"name": "Daybreak", "symbol": "↗", "href": "https://example.com/daybreak"}, {"name": "Arc Studio", "symbol": "◈", "href": "https://example.com/arc studio"}], "signal": {"label": "Research coverage", "value": "94%", "detail": "Every insight stays connected to its source, so your next decision starts with context."} }} />;
}
