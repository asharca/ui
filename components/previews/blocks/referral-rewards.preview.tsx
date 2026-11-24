"use client";

import { useState } from "react";
import {
  ReferralRewards,
  type ReferralFriendItem,
} from "@/components/motion/referral-rewards";

const TIERS = [
  { count: 1, rewardLabel: "$10" },
  { count: 3, rewardLabel: "$25" },
  { count: 5, rewardLabel: "1 mo" },
  { count: 10, rewardLabel: "1 yr" },
];

const INITIAL_FRIENDS: ReferralFriendItem[] = [
  {
    id: "rafael",
    name: "Rafael Costa",
    initials: "RC",
    accent: "bg-sky-500/15 text-sky-400",
    subtitle: "Joined 2h ago",
    status: "Joined",
  },
  {
    id: "clara",
    name: "Clara Webb",
    initials: "CW",
    accent: "bg-amber-500/15 text-amber-400",
    subtitle: "Invited yesterday",
    status: "Invited",
  },
  {
    id: "elise",
    name: "Elise Varga",
    initials: "EV",
    accent: "bg-emerald-500/15 text-emerald-500",
    subtitle: "Active 12d ago",
    status: "Rewarded",
  },
  {
    id: "devon",
    name: "Devon Park",
    initials: "DP",
    accent: "bg-violet-500/15 text-violet-400",
    subtitle: "Active 3w ago",
    status: "Rewarded",
  },
];

const EXTRA_NAMES = [
  { name: "Nadia Kim", initials: "NK", accent: "bg-rose-500/15 text-rose-400" },
  { name: "Theo Silva", initials: "TS", accent: "bg-cyan-500/15 text-cyan-400" },
  { name: "Mina Patel", initials: "MP", accent: "bg-emerald-500/15 text-emerald-500" },
];

export function ReferralRewardsPreview() {
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [referralsCount, setReferralsCount] = useState(3);
  const [idx, setIdx] = useState(0);

  const inviteNext = () => {
    const candidate = EXTRA_NAMES[idx % EXTRA_NAMES.length];
    if (!candidate) return;
    setIdx((prev) => prev + 1);
    setReferralsCount((prev) => Math.min(10, prev + 1));
    setFriends((prev) => [
      {
        id: `${candidate.initials}-${Date.now()}`,
        name: candidate.name,
        initials: candidate.initials,
        accent: candidate.accent,
        subtitle: "Joined just now",
        status: "Rewarded",
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <ReferralRewards
      inviteUrl="app.example.com/r/ana-k7f2"
      referralsCount={referralsCount}
      earnedAmount={referralsCount * 10}
      tiers={TIERS}
      friends={friends}
      onInvite={inviteNext}
    />
  );
}
