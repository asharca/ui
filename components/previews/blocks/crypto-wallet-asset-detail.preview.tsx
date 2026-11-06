"use client";

import { useState } from "react";
import { WalletAssetDetail, WalletTransferCard, type WalletRequest } from "@/components/motion/crypto-wallet-compositions";
import { CommerceDialog } from "@/components/motion/commerce-ui";
import { commerceWalletAssets } from "./crypto-wallet-swap-send-and-buy.preview";

export function WalletAssetDetailPreview() {
  const [action, setAction] = useState<WalletRequest["mode"] | null>(null); const [asset, setAsset] = useState(commerceWalletAssets[0]);
  return <div className="w-full"><WalletAssetDetail asset={asset} periods={["1D", "1W", "1M", "1Y"]} stats={{ marketCap: 1422000000, volume24h: 76000000, circulating: 10000000, costBasis: 2986.8, fullyDiluted: 1848600000, allTimeHigh: 198.4, realizedReturn: 185.5, description: "Nova is the sample network used throughout this beUI wallet preview. These balances and prices are illustrative and are not live market data." }} onSend={() => setAction("Send")} onBuy={() => setAction("Buy")} /><p className="text-center text-[10px] text-muted-foreground">Demo asset · Sample prices and balance</p><CommerceDialog open={action !== null} onOpenChange={open => { if (!open) setAction(null); }} label={`Local ${action ?? "asset"} action`}>{action && <><p className="text-xs text-muted-foreground">Explicit local {action.toLowerCase()} simulation. No real funds are transferred.</p><WalletTransferCard key={action} className="px-0 py-5 sm:px-0 sm:py-5" defaultMode={action} assets={[asset]} getQuote={async request => ({ id: "detail-quote", receive: request.mode === "Buy" ? request.amount / asset.price : request.amount, fee: "$0 · Local demo", expiresAt: new Date(Date.now() + 60000).toISOString() })} execute={async (request, quote) => { setAsset(current => ({ ...current, balance: current.balance + (request.mode === "Buy" ? quote.receive : -request.amount) })); return { id: "local-asset-action", status: "Local sample balance updated. No real funds transferred" }; }} /></>}</CommerceDialog></div>;
}
