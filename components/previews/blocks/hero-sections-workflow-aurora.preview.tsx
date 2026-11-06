"use client";

import { WorkflowAuroraHero } from "@/components/motion/hero-sections";


export function HeroWorkflowAuroraPreview() {
  return <WorkflowAuroraHero {...{ "eyebrow": "", "title": "Projects move faster.\nTeams stay in sync.", "description": "Fieldwork brings projects, docs, and automated handoffs into one shared workspace, so every team knows what is moving and what needs attention.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "navigation": {"brand": {"label": "Fieldwork", "href": "https://example.com"}, "links": [{"label": "Platform", "href": "https://example.com/platform"}, {"label": "Resources", "href": "https://example.com/guide"}]}, "marks": [{"name": "Northstar", "symbol": "✳", "href": "https://example.com/northstar"}, {"name": "Canopy", "symbol": "◇", "href": "https://example.com/canopy"}, {"name": "Outline", "symbol": "◌", "href": "https://example.com/outline"}, {"name": "Daybreak", "symbol": "↗", "href": "https://example.com/daybreak"}, {"name": "Arc Studio", "symbol": "◈", "href": "https://example.com/arc studio"}], "announcement": {"label": "Introducing shared workflows", "href": "https://example.com/updates"} }} />;
}
