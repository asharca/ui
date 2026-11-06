"use client";

import { PortfolioPhone } from "@/components/motion/illustration-app-preview";
export function PortfolioPhonePreview() {
  return <PortfolioPhone total="$24,860.42" totalChange="4.8%" assets={[
    { id: "btc", symbol: "BTC", name: "Bitcoin", balance: "$12,420", change: "+3.8%", history: [12, 15, 13, 18, 16, 19, 20] },
    { id: "eth", symbol: "ETH", name: "Ethereum", balance: "$8,280", change: "+2.1%", history: [12, 10, 16, 15, 21, 19, 24] },
    { id: "sol", symbol: "SOL", name: "Solana", balance: "$4,160", change: "+6.4%", history: [8, 12, 10, 16, 14, 19, 22] },
  ]} />;
}
