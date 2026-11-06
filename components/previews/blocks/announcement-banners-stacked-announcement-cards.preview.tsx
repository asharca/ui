"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { StackedAnnouncementCards } from "@/components/motion/announcement-banners";

const stories = [
  {
    "id": "release",
    "title": "A new collection for the way your team works now",
    "description": "Explore a thoughtful set of releases shaped around clearer decisions and calmer collaboration.",
    "label": "Just launched",
    "actionLabel": "Explore the collection",
    "href": "#announcement-stacked-announcement-cards-release"
  },
  {
    "id": "event",
    "title": "An evening for people building with care",
    "description": "Join a small live conversation about the choices that make digital products feel considered.",
    "label": "Community gathering",
    "actionLabel": "Explore the gathering",
    "href": "#announcement-stacked-announcement-cards-event"
  },
  {
    "id": "gift",
    "title": "Something special for our earliest supporters",
    "description": "A limited collection is waiting for the people who helped make the first chapter possible.",
    "label": "A thank-you gift",
    "actionLabel": "Explore the collection",
    "href": "#announcement-stacked-announcement-cards-gift"
  }
];

export function StackedAnnouncementCardsPreview() {
  const [dismissed, setDismissed] = useState(false);
  return <div className="w-full bg-background"><StackedAnnouncementCards stories={stories} dismissed={dismissed} onDismiss={() => setDismissed(true)} />{dismissed && <div className="p-4"><Button size="sm" variant="outline" onClick={() => setDismissed(false)}>Show announcements</Button></div>}<details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative release notes</summary><div className="mt-4 space-y-5">{stories.map(story => <section key={story.id} id={story.href.slice(1)} className="scroll-mt-20 rounded-xl border border-border p-5"><h3 className="text-sm font-medium text-foreground">{story.title}</h3><p className="mt-3 leading-6">{story.description}</p><p className="mt-3">Local demonstration content; no external event booking or purchase is performed.</p></section>)}</div></details></div>;
}
