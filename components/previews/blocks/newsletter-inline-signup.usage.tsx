"use client";

import { Newsletter, type NewsletterProps } from "@/components/motion/newsletter";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function NewsletterInlineSignupUsage({ onSubscribe }: Pick<NewsletterProps, "onSubscribe">) {
  return <Newsletter variant="inline-signup" title="A thoughtful note for your inbox." description="Choose the ideas you want to hear about." issues={[{ id: "first", title: "Field notes", summary: "Ideas for thoughtful teams." }]} topics={["Design", "Engineering"]} onSubscribe={onSubscribe} />;
}
