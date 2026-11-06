"use client";

import { Team, type TeamProps } from "@/components/motion/team";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function TeamTeamMarqueeUsage({ members, hiring }: Pick<TeamProps, "members" | "hiring">) {
  return <Team variant="team-marquee" title="Meet the people behind the work." description="Different disciplines, shared curiosity." members={members} hiring={hiring} />;
}
