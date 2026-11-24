"use client";

import { useState } from "react";
import {
  Leaderboard,
  type LeaderboardPeriodData,
} from "@/components/motion/leaderboard";

const INITIAL_PERIODS: LeaderboardPeriodData[] = [
  {
    id: "today",
    label: "Today",
    members: [
      { id: "mira", name: "Mira Okafor", initials: "MO", accent: "bg-amber-500/15 text-amber-400", score: 412, delta: 1 },
      { id: "jonas", name: "Jonas Hale", initials: "JH", accent: "bg-sky-500/15 text-sky-400", score: 388, delta: -1 },
      { id: "amara", name: "Amara Diallo", initials: "AD", accent: "bg-orange-500/15 text-orange-400", score: 344, delta: 2 },
      { id: "liam", name: "Liam Novak", initials: "LN", score: 298, delta: 0 },
      { id: "soren", name: "Soren Lind", initials: "SL", score: 264, delta: 1 },
      { id: "tessa", name: "Tessa Cho", initials: "TC", score: 242, delta: -1 },
      { id: "you", name: "Elena Vance", initials: "EV", score: 230, delta: 1, isViewer: true },
    ],
  },
  {
    id: "week",
    label: "Week",
    members: [
      { id: "jonas", name: "Jonas Hale", initials: "JH", accent: "bg-amber-500/15 text-amber-400", score: 1940, delta: 2 },
      { id: "mira", name: "Mira Okafor", initials: "MO", accent: "bg-sky-500/15 text-sky-400", score: 1875, delta: -1 },
      { id: "tessa", name: "Tessa Cho", initials: "TC", accent: "bg-orange-500/15 text-orange-400", score: 1620, delta: 1 },
      { id: "amara", name: "Amara Diallo", initials: "AD", score: 1490, delta: 0 },
      { id: "liam", name: "Liam Novak", initials: "LN", score: 1320, delta: -1 },
      { id: "soren", name: "Soren Lind", initials: "SL", score: 1180, delta: 0 },
      { id: "you", name: "Elena Vance", initials: "EV", score: 1110, delta: 2, isViewer: true },
    ],
  },
  {
    id: "all",
    label: "All time",
    members: [
      { id: "amara", name: "Amara Diallo", initials: "AD", accent: "bg-amber-500/15 text-amber-400", score: 14820, delta: 1 },
      { id: "mira", name: "Mira Okafor", initials: "MO", accent: "bg-sky-500/15 text-sky-400", score: 14210, delta: -1 },
      { id: "jonas", name: "Jonas Hale", initials: "JH", accent: "bg-orange-500/15 text-orange-400", score: 13540, delta: 0 },
      { id: "tessa", name: "Tessa Cho", initials: "TC", score: 11290, delta: 1 },
      { id: "soren", name: "Soren Lind", initials: "SL", score: 10840, delta: 0 },
      { id: "liam", name: "Liam Novak", initials: "LN", score: 9740, delta: -1 },
      { id: "you", name: "Elena Vance", initials: "EV", score: 9520, delta: 2, isViewer: true },
    ],
  },
];

export function LeaderboardPreview() {
  const [periods, setPeriods] = useState(INITIAL_PERIODS);

  const boostViewer = (periodId: string) => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === periodId
          ? {
              ...period,
              members: period.members.map((m) =>
                m.isViewer
                  ? { ...m, score: m.score + 40, delta: (m.delta ?? 0) + 1 }
                  : m,
              ),
            }
          : period,
      ),
    );
  };

  return <Leaderboard periods={periods} onBoostViewer={boostViewer} />;
}
