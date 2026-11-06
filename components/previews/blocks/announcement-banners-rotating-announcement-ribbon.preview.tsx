"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { RotatingAnnouncementRibbon } from "@/components/motion/announcement-banners";

const stories = [
  {
    "id": "release",
    "title": "The summer collection is ready to explore",
    "description": "Thoughtful releases for clearer collaboration.",
    "label": "New release",
    "actionLabel": "See what is new",
    "href": "#announcement-rotating-announcement-ribbon-release"
  },
  {
    "id": "guide",
    "title": "Small teams, ambitious work",
    "description": "A practical guide to lighter review rituals.",
    "label": "Field guide",
    "actionLabel": "Read the guide",
    "href": "#announcement-rotating-announcement-ribbon-guide"
  },
  {
    "id": "event",
    "title": "Meet the makers",
    "description": "A conversation about considered product decisions.",
    "label": "Community",
    "actionLabel": "Explore the event",
    "href": "#announcement-rotating-announcement-ribbon-event"
  }
];

export function RotatingAnnouncementRibbonPreview() {
  const [dismissed, setDismissed] = useState(false);
  return <div className="w-full bg-background"><RotatingAnnouncementRibbon stories={stories} dismissed={dismissed} onDismiss={() => setDismissed(true)} />{dismissed && <div className="p-4"><Button size="sm" variant="outline" onClick={() => setDismissed(false)}>Show announcements</Button></div>}<details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative release notes</summary><div className="mt-4 space-y-5">{stories.map(story => <section key={story.id} id={story.href.slice(1)} className="scroll-mt-20 rounded-xl border border-border p-5"><h3 className="text-sm font-medium text-foreground">{story.title}</h3><p className="mt-3 leading-6">{story.description}</p><p className="mt-3">Local demonstration content; no external event booking or purchase is performed.</p></section>)}</div></details></div>;
}
