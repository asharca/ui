"use client";

import { Contact, type ContactProps } from "@/components/motion/contact";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function ContactOfficeSplitUsage({ onSubmit, lanes, office, booking }: Pick<ContactProps, "onSubmit" | "lanes" | "office" | "booking">) {
  return <Contact variant="office-split" title="Start the right conversation." description="Choose a topic to reach our team." lanes={lanes} office={office} booking={booking} onSubmit={onSubmit} />;
}
