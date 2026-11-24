"use client";

import { useEffect, useState } from "react";
import {
  AirdropClaim,
  type AirdropCriterionItem,
} from "@/components/motion/airdrop-claim";

const BASE_CRITERIA = [
  {
    id: "early",
    label: "Early user",
    detail: "First transaction in March 2026",
    rewardAmount: 1200,
    eligible: true,
  },
  {
    id: "bridge",
    label: "Bridged assets",
    detail: "3 bridges over $500",
    rewardAmount: 800,
    eligible: true,
  },
  {
    id: "gov",
    label: "Governance votes",
    detail: "Voted on 6 proposals",
    rewardAmount: 450,
    eligible: true,
  },
  {
    id: "testnet",
    label: "Testnet tasks",
    detail: "No testnet activity found",
    rewardAmount: 600,
    eligible: false,
  },
  {
    id: "lp",
    label: "Liquidity provider",
    detail: "Provided liquidity for 42 days",
    rewardAmount: 550,
    eligible: true,
  },
];

export function AirdropClaimPreview() {
  const [step, setStep] = useState(2);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (step >= BASE_CRITERIA.length) return;
    const timer = window.setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [step]);

  const criteria: AirdropCriterionItem[] = BASE_CRITERIA.map((item, idx) => ({
    id: item.id,
    label: item.label,
    detail: item.detail,
    rewardAmount: item.rewardAmount,
    status:
      idx < step
        ? item.eligible
          ? "eligible"
          : "ineligible"
        : "checking",
  }));

  return (
    <AirdropClaim
      seasonTitle="Season 1 airdrop"
      protocolLine="Orbit · Closes in 13 days"
      tokenSymbol="ORB"
      walletAddress="0x8f3a…c21e"
      networkName="Base"
      criteria={criteria}
      claimedTxHash={txHash}
      onClaim={() => setTxHash("0x7c14…92b8")}
      onReplay={() => {
        setTxHash(null);
        setStep(0);
      }}
    />
  );
}
