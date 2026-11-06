"use client";

import { ValueGrid } from "@/components/motion/content-sections";


export function ContentValueGridPreview() {
  return <ValueGrid {...{ "eyebrow": "", "title": "More tools create noise.\nClear systems move work.", "description": "Give every idea, decision, and handoff a clear place to move forward.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "values": [{"id": "clarity", "title": "Clarity over noise", "description": "A focused view of the context, work and decisions that matter.", "link": {"label": "Read our approach", "href": "https://example.com/values/clarity"}}, {"id": "trust", "title": "Trust through evidence", "description": "Source-linked answers and readable histories make work inspectable.", "link": {"label": "Read our approach", "href": "https://example.com/values/trust"}}, {"id": "momentum", "title": "Momentum with intention", "description": "Let useful automation support the judgment only your team can bring.", "link": {"label": "Read our approach", "href": "https://example.com/values/momentum"}}] }} />;
}
