"use client";

import { useState } from "react";
import { WalletTransactionActivity, type WalletTransaction } from "@/components/motion/crypto-wallet-compositions";
import { Button } from "@/components/motion/button";

const initialTransactions: WalletTransaction[] = [
  { id: "demo-swap", type: "swap", status: "pending", asset: "NOVA", amount: 2.524, toAsset: "USDU", toAmount: 358.92, chain: "Mainnet", at: "2026-11-04T08:42:00Z", steps: [{ label: "Signed", status: "complete" }, { label: "Included", status: "pending" }] },
  { id: "demo-buy", type: "buy", status: "confirmed", asset: "USDU", amount: 500, chain: "Mainnet", at: "2026-11-04T07:15:00Z", steps: [{ label: "Payment", status: "complete" }, { label: "Settlement", status: "complete" }] },
  { id: "demo-send", type: "send", status: "confirmed", asset: "NOVA", amount: .5, chain: "Rollup", at: "2026-11-03T09:00:00Z", steps: [{ label: "Signed", status: "complete" }, { label: "Included", status: "complete" }] },
  { id: "demo-bridge", type: "bridge", status: "confirmed", asset: "USDU", amount: 250, chain: "Rollup", at: "2026-11-03T08:00:00Z", steps: [{ label: "Source confirmed", status: "complete" }, { label: "Destination settled", status: "complete" }] },
  { id: "demo-stake", type: "stake", status: "confirmed", asset: "NOVA", amount: 2, chain: "Mainnet", at: "2026-11-02T12:00:00Z", steps: [{ label: "Deposit", status: "complete" }] },
  { id: "demo-failed", type: "send", status: "failed", asset: "USDU", amount: 200, chain: "Mainnet", at: "2026-11-02T08:00:00Z", steps: [{ label: "Signature", status: "complete" }, { label: "Execution", status: "failed" }] },
  { id: "demo-swap-old", type: "swap", status: "confirmed", asset: "LINK", amount: 20, toAsset: "USDU", toAmount: 296.4, chain: "Mainnet", at: "2026-10-25T12:00:00Z", steps: [{ label: "Signed", status: "complete" }, { label: "Settled", status: "complete" }] },
  { id: "demo-buy-old", type: "buy", status: "confirmed", asset: "NOVA", amount: 3, chain: "Mainnet", at: "2026-10-25T09:00:00Z", steps: [{ label: "Payment", status: "complete" }, { label: "Settlement", status: "complete" }] },
];

export function WalletTransactionActivityPreview() {
  const [transactions, setTransactions] = useState(initialTransactions);
  return <div className="w-full"><WalletTransactionActivity transactions={transactions} /><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Local activity simulation controls</summary><Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={() => setTransactions(rows => rows.map(t => t.status === "pending" ? { ...t, status: "confirmed", steps: t.steps.map(s => ({ ...s, status: "complete" })) } : t))}>Confirm pending local sample</Button></details></div>;
}
