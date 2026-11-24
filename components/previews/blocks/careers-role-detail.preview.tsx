"use client";

import { CareersRoleDetail } from "@/components/motion/careers-role-detail";

export function CareersRoleDetailPreview() {
  return (
    <CareersRoleDetail
      role={{
        department: "Engineering",
        title: "Senior Motion Engineer",
        location: "Remote, global",
        employment: "Full-time",
        compensation: "$170k to $210k",
        about:
          "Own the animation layer end to end, from the spring under a single button press to the choreography of a full page reveal.",
        responsibilities: [
          "Build and refine accessible UI primitives with tuned springs and reduced-motion fallbacks.",
          "Collaborate closely with product designers to simplify interactive flows down to essentials.",
          "Audit runtime performance and layout stability across desktop and mobile viewports.",
        ],
        requirements: [
          "Deep mastery of React, TypeScript, CSS transforms, and Motion/Framer physics.",
          "Proven eye for pacing, typography, and tactile micro-interactions.",
          "Comfort writing clean self-contained components teams can paste directly.",
        ],
        teamSummary:
          "You will work alongside four staff engineers and two design engineers across Madrid, San Francisco, and Tokyo in an async-first studio.",
        hiringProcess: [
          {
            step: "01",
            title: "Async intro review",
            duration: "20 mins",
            detail: "Share two interactive components or links you are proud of.",
          },
          {
            step: "02",
            title: "Practical craft session",
            duration: "60 mins",
            detail: "Pair on a real motion and accessibility challenge instead of whiteboard puzzles.",
          },
          {
            step: "03",
            title: "Founder & team chat",
            duration: "45 mins",
            detail: "Discuss product direction, compensation expectations, and start timeline.",
          },
        ],
      }}
    />
  );
}
