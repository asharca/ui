"use client";

import { Team, type TeamProps } from "@/components/motion/team";

/** Supply your real content and host callbacks; no demo backend is bundled. */
export function TeamTeamGridUsage({ members, hiring }: Pick<TeamProps, "members" | "hiring">) {
  return <Team variant="team-grid" title="Meet the people behind the work." description="Different disciplines, shared curiosity." members={members} hiring={hiring} />;
}
