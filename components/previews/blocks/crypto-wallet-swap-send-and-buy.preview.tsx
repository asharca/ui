"use client";

import { useState } from "react";
import { WalletTransferCard, type WalletAsset } from "@/components/motion/crypto-wallet-compositions";

export const commerceWalletAssets: WalletAsset[] = [
  { id: "nova-main", name: "Nova", symbol: "NOVA", chain: "Mainnet", balance: 24, price: 142.2, precision: 4, history: [129.26, 133.5, 138.7, 142.2] },
  { id: "usd-main", name: "Dollar unit", symbol: "USDU", chain: "Mainnet", balance: 4280.5, price: 1, precision: 2, history: [1, 1, 1, 1] },
  { id: "bitcoin-main", name: "Wrapped Bitcoin", symbol: "WBTC", chain: "Mainnet", balance: .035, price: 60000, precision: 5, history: [61800, 61000, 60500, 60000] },
  { id: "link-main", name: "Chainlink", symbol: "LINK", chain: "Mainnet", balance: 42.6, price: 14.82, precision: 3, history: [14.1, 14.35, 14.55, 14.82] },
  { id: "arb-rollup", name: "Arbitrum", symbol: "ARB", chain: "Rollup", balance: 820, price: .62, precision: 3, history: [.66, .65, .63, .62] },
].map(asset => ({ ...asset, periodHistory: Object.fromEntries(["1D", "1W", "1M", "1Y"].map((period, periodIndex) => [period, Array.from({ length: 32 }, (_, index) => {
  const start = asset.history[0]; const progress = index / 31;
  return start + (asset.price - start) * progress + Math.sin(index * 1.7 + periodIndex) * asset.price * .004 * (1 - progress);
})])) }));

export function WalletTransferCardPreview() {
  const [assets, setAssets] = useState(commerceWalletAssets);
  return <div className="w-full"><WalletTransferCard assets={assets} contacts={[{ id: "alex", name: "Alex", address: "demo:alex-mainnet", chain: "Mainnet" }, { id: "sam", name: "Sam", address: "demo:sam-mainnet", chain: "Mainnet" }]} getQuote={async request => { const from = assets.find(a => a.id === request.fromId)!; const to = assets.find(a => a.id === request.toId)!; return { id: `demo-quote-${Date.now()}`, receive: request.mode === "Buy" ? request.amount / to.price : request.mode === "Send" ? request.amount : request.amount * from.price / to.price, fee: "$0 · Local demo", expiresAt: new Date(Date.now() + 60000).toISOString() }; }} execute={async (request, quote) => { setAssets(rows => rows.map(a => ({ ...a, balance: a.balance - (request.mode !== "Buy" && a.id === request.fromId ? request.amount : 0) + (request.mode !== "Send" && a.id === request.toId ? quote.receive : 0) }))); return { id: `demo-${Date.now()}`, status: "Local sample balances updated. No funds transferred" }; }} /><p className="text-center text-[10px] text-muted-foreground">Explicit local wallet simulation. No wallet connection or payment.</p></div>;
}
