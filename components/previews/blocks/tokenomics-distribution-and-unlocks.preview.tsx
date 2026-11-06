"use client";

import { Tokenomics, type TokenAllocation } from "@/components/motion/tokenomics";

const allocation = (id: string, name: string, tokens: number, color: string, terms: string, launch: number, cliff: number, duration: number): TokenAllocation => ({
  id, name, tokens, color, terms,
  unlocks: [
    { at: "2026-01-01T00:00:00Z", tokens: tokens * launch },
    ...Array.from({ length: duration }, (_, index) => ({ at: new Date(Date.UTC(2026, cliff + index + 1, 1)).toISOString(), tokens: tokens * (1 - launch) / duration })),
  ],
});

export function TokenomicsPreview() {
  return <Tokenomics symbol="NOVA" asOf="2026-11-04T12:00:00Z" allocations={[
    allocation("community", "Community and ecosystem", 340000000, "#60a5fa", "8% at launch, 48 months linear", .08, 0, 48),
    allocation("team", "Core contributors", 200000000, "#818cf8", "12-month cliff, 36 months linear", 0, 12, 36),
    allocation("backers", "Early backers", 170000000, "#a78bfa", "12-month cliff, 24 months linear", 0, 12, 24),
    allocation("treasury", "Foundation treasury", 150000000, "#c4b5fd", "5% at launch, 48 months linear", .05, 0, 48),
    allocation("airdrop", "Launch airdrop", 80000000, "#2dd4bf", "50% at launch, 6 months linear", .5, 0, 6),
    allocation("liquidity", "Market liquidity", 60000000, "#a3e635", "Fully unlocked at launch", 1, 0, 0),
  ]} />;
}
