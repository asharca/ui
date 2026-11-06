"use client";

import { useEffect, useState } from "react";
import { LivePriceTable, type MarketQuote } from "@/components/motion/crypto-markets";
import { Button } from "@/components/motion/button";

const samples: [string, string, string, number, number, number, number, number][] = [
  ["Nova", "NOVA", "Layer 1", 142.24, 2.34, 1450000000, 76000000, 2],
  ["Tide", "TIDE", "DeFi", .0342, -1.2, 34000000, 2100000, 4],
  ["Tether", "USDT", "Stablecoins", 1, -.02, 118600000000, 41700000000, 2],
  ["BNB", "BNB", "Layer 1", 548.2, -.84, 80100000000, 1600000000, 2],
  ["Solana", "SOL", "Layer 1", 142.65, 4.37, 66800000000, 3900000000, 2],
  ["Dollar unit", "USDU", "Stablecoins", 1, .01, 35200000000, 6800000000, 2],
  ["XRP", "XRP", "Layer 1", .5421, -1.66, 30700000000, 1200000000, 4],
  ["Dogecoin", "DOGE", "Memes", .1123, 6.82, 16400000000, 1400000000, 4],
  ["Toncoin", "TON", "Layer 1", 5.42, -2.94, 13800000000, 310000000, 2],
  ["Cardano", "ADA", "Layer 1", .3618, .73, 12900000000, 290000000, 4],
  ["Avalanche", "AVAX", "Layer 1", 26.14, 3.18, 10600000000, 420000000, 2],
  ["Chainlink", "LINK", "DeFi", 14.82, -1.84, 9000000000, 380000000, 2],
  ["Dai", "DAI", "Stablecoins", 1, 0, 5300000000, 210000000, 2],
  ["Uniswap", "UNI", "DeFi", 8.41, 3.67, 5000000000, 160000000, 2],
  ["Pepe", "PEPE", "Memes", .0000094, 8.15, 3900000000, 820000000, 7],
  ["Polygon", "POL", "Layer 2", .38, -.54, 2900000000, 120000000, 2],
  ["Arbitrum", "ARB", "Layer 2", .62, -2.37, 2500000000, 240000000, 2],
  ["Aave", "AAVE", "DeFi", 162.5, -.92, 2400000000, 190000000, 2],
  ["Optimism", "OP", "Layer 2", 1.48, 4.06, 1900000000, 150000000, 2],
];

export function LivePriceTablePreview() {
  const [snapshot, setSnapshot] = useState(0); const [playing, setPlaying] = useState(true); const [watchlist, setWatchlist] = useState(["NOVA", "SOL", "LINK"]);
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setSnapshot(value => value + 1), 4000); return () => window.clearInterval(timer); }, [playing]);
  const markets: MarketQuote[] = samples.map(([name, symbol, category, price, change, marketCap, volume, precision], index) => ({ id: symbol, name, symbol, category, price: price * (1 + Math.sin(snapshot + index) * .0003), change, marketCap, volume, precision, history: Array.from({ length: 36 }, (_, point) => price * (1 - change / 100 * (1 - point / 35) + Math.sin(point * 1.8 + index) * .004)) }));
  return <div className="w-full"><LivePriceTable markets={markets} updatedAt={`Local sample ${snapshot}`} watchlist={watchlist} onWatchlistChange={setWatchlist} /><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Sample feed controls</summary><p className="my-3">Simulated sample prices. Not live market data.</p><Button size="sm" className="rounded-full" variant="outline" onClick={() => setPlaying(!playing)}>{playing ? "Pause sample feed" : "Resume sample feed"}</Button></details></div>;
}
