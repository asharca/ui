"use client";

import { LayeredCards } from "@/components/motion/illustration-layered-cards";

export function LayeredCardsIllustration1Preview() {
  return <LayeredCards variant={1} autoPlay label="Asset wallet" total="$42,436" totalChange="+3.1%" items={[
    { id: "btc", name: "Bitcoin", symbol: "BTC", balance: "$12,860", quantity: "0.184 BTC", change: "+3.8%", direction: "up", history: [.1, .3, .25, .5, .4, .65, .6, .9] },
    { id: "eth", name: "Ethereum", symbol: "ETH", balance: "$8,932", quantity: "3.24 ETH", change: "+2.4%", direction: "up", history: [.2, .3, .1, .4, .35, .6, .5, .75] },
    { id: "sol", name: "Solana", symbol: "SOL", balance: "$7,214", quantity: "48.6 SOL", change: "+5.1%", direction: "up", history: [.1, .2, .4, .35, .6, .5, .8, .95] },
    { id: "bnb", name: "BNB", symbol: "BNB", balance: "$7,010", quantity: "12.8 BNB", change: "+1.7%", direction: "up", history: [.2, .25, .35, .3, .5, .45, .6, .7] },
    { id: "usdt", name: "Tether", symbol: "USDT", balance: "$6,420", quantity: "6,420 USDT", change: "0.0%", direction: "up", history: [.5, .5, .5, .5, .5] },
  ]} />;
}
