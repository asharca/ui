"use client";

import { useState } from "react";
import { StakingVaults, type StakingVault, type WalletAsset } from "@/components/motion/crypto-wallet-compositions";
import { commerceWalletAssets } from "./crypto-wallet-swap-send-and-buy.preview";
const sampleAssets: WalletAsset[] = [...commerceWalletAssets, { id: "op-rollup", name: "Optimism", symbol: "OP", chain: "Rollup", balance: 400, price: 1.48, precision: 3, history: [1.4, 1.42, 1.45, 1.48] }];

export function StakingVaultsPreview() {
  const [assets, setAssets] = useState(sampleAssets);
  const [vaults, setVaults] = useState<StakingVault[]>([
    { id: "nova-vault", name: "Nova staking", assetId: "nova-main", apy: 3.82, deposited: 12.5, claimable: .08421337, lockDays: 0, history: [3.7, 3.9, 3.75, 3.82], tvl: 1200000000, risk: "Low risk", description: "Liquid staking" },
    { id: "usd-vault", name: "Stable yield", assetId: "usd-main", apy: 6.41, deposited: 2500, claimable: 18.42651, lockDays: 0, history: [6.1, 6.3, 6.2, 6.41], tvl: 812000000, risk: "Low risk", description: "Overcollateralized lending" },
    { id: "arb-vault", name: "Arbitrum delegation", assetId: "arb-rollup", apy: 7.24, deposited: 0, claimable: 0, lockDays: 21, history: [7, 7.2, 7.1, 7.24], tvl: 96400000, risk: "Medium risk", description: "Governance staking" },
    { id: "link-vault", name: "Chainlink pool", assetId: "link-main", apy: 4.5, deposited: 0, claimable: 0, lockDays: 28, history: [4.2, 4.4, 4.3, 4.5], tvl: 638000000, risk: "Medium risk", description: "Oracle network staking" },
    { id: "bitcoin-vault", name: "Bitcoin basis vault", assetId: "bitcoin-main", apy: 9.86, deposited: 0, claimable: 0, lockDays: 7, history: [9.5, 9.7, 9.6, 9.86], tvl: 58200000, risk: "High risk", description: "Delta-neutral basis trade" },
    { id: "op-vault", name: "Optimism staking", assetId: "op-rollup", apy: 5.12, deposited: 0, claimable: 0, lockDays: 14, history: [4.9, 5, 4.98, 5.12], tvl: 41700000, risk: "Medium risk", description: "Sequencer rewards" },
  ]);
  return <div className="w-full"><StakingVaults assets={assets} vaults={vaults} onStake={async (id, amount) => { const vault = vaults.find(v => v.id === id)!; setAssets(rows => rows.map(a => a.id === vault.assetId ? { ...a, balance: a.balance - amount } : a)); setVaults(rows => rows.map(v => v.id === id ? { ...v, deposited: v.deposited + amount } : v)); }} onClaim={async id => { const vault = vaults.find(v => v.id === id)!; setAssets(rows => rows.map(a => a.id === vault.assetId ? { ...a, balance: a.balance + vault.claimable } : a)); setVaults(rows => rows.map(v => v.id === id ? { ...v, claimable: 0 } : v)); }} /><p className="text-center text-[10px] text-muted-foreground">Local staking simulation. No real funds move; projections are not guaranteed.</p></div>;
}
