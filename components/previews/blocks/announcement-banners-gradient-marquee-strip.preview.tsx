"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { GradientMarqueeStrip } from "@/components/motion/announcement-banners";

const stories = [
  {
    "id": "collection",
    "title": "Meet the August collection",
    "description": "New blocks for brighter launches",
    "label": "Collection",
    "actionLabel": "View the collection",
    "href": "#announcement-gradient-marquee-strip-collection"
  },
  {
    "id": "blocks",
    "title": "New blocks for brighter launches",
    "description": "Every release is ready to explore",
    "label": "Release",
    "actionLabel": "View the collection",
    "href": "#announcement-gradient-marquee-strip-blocks"
  },
  {
    "id": "release",
    "title": "Every release is ready to explore",
    "description": "A considered collection for your next launch.",
    "label": "Explore",
    "actionLabel": "View the collection",
    "href": "#announcement-gradient-marquee-strip-release"
  }
];

export function GradientMarqueeStripPreview() {
  const [dismissed, setDismissed] = useState(false);
  return <div className="w-full bg-background"><GradientMarqueeStrip stories={stories} dismissed={dismissed} onDismiss={() => setDismissed(true)} />{dismissed && <div className="p-4"><Button size="sm" variant="outline" onClick={() => setDismissed(false)}>Show announcements</Button></div>}<details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative release notes</summary><div className="mt-4 space-y-5">{stories.map(story => <section key={story.id} id={story.href.slice(1)} className="scroll-mt-20 rounded-xl border border-border p-5"><h3 className="text-sm font-medium text-foreground">{story.title}</h3><p className="mt-3 leading-6">{story.description}</p><p className="mt-3">Local demonstration content; no external event booking or purchase is performed.</p></section>)}</div></details></div>;
}
