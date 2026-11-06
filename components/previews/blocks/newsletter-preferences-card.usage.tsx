"use client";

import { Newsletter, type NewsletterProps } from "@/components/motion/newsletter";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function NewsletterPreferencesCardUsage({ onSubscribe }: Pick<NewsletterProps, "onSubscribe">) {
  return <Newsletter variant="preferences-card" title="A thoughtful note for your inbox." description="Choose the ideas you want to hear about." issues={[{ id: "design", title: "Field notes on design", summary: "Ideas for thoughtful teams.", topic: "Design" }, { id: "engineering", title: "Notes from the workshop", summary: "A closer look at building accessible interfaces.", topic: "Engineering" }]} topics={["Design", "Engineering"]} onSubscribe={onSubscribe} />;
}
