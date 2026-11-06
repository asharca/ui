"use client";

import { useState } from "react";
import { WalletPortfolio } from "@/components/motion/crypto-wallet-compositions";
import { CommerceDialog } from "@/components/motion/commerce-ui";
import { Button } from "@/components/motion/button";
import { commerceWalletAssets } from "./crypto-wallet-swap-send-and-buy.preview";
const assets = [commerceWalletAssets[1], commerceWalletAssets[0], ...commerceWalletAssets.slice(2)];

export function WalletPortfolioPreview() {
  const [message, setMessage] = useState(""); const [action, setAction] = useState<string | null>(null);
  return <div className="w-full"><WalletPortfolio assets={assets} periods={["1D", "1W", "1M", "1Y"]} walletAddress="demo:personal-wallet-3567" onSettings={() => setAction("Settings")} onSend={() => setAction("Send")} onReceive={() => setAction("Receive")} onAsset={asset => setMessage(`${asset.name} on ${asset.chain}: ${asset.balance} ${asset.symbol}`)} /><p role="status" className="text-center text-xs text-muted-foreground">{message || "Demo portfolio · Sample balances and prices"}</p><CommerceDialog open={action !== null} onOpenChange={open => { if (!open) setAction(null); }} label={`${action ?? "Wallet"} preview`}><h3 className="text-xl font-medium">{action} preview</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">This sample wallet lets you explore the interface. Sending and receiving become available when your app connects a wallet.</p><Button className="mt-5 rounded-full" onClick={() => setAction(null)}>Got it</Button></CommerceDialog></div>;
}
