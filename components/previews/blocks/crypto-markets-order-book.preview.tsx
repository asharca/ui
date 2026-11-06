"use client";

import { useEffect, useState } from "react";
import { MarketOrderBook, type MarketFill } from "@/components/motion/crypto-markets";
import { Button } from "@/components/motion/button";

export function MarketOrderBookPreview() {
  const [message, setMessage] = useState(""); const [snapshot, setSnapshot] = useState(0); const [playing, setPlaying] = useState(true);
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setSnapshot(value => value + 1), 3500); return () => window.clearInterval(timer); }, [playing]);
  const bids = Array.from({ length: 11 }, (_, index) => ({ price: 142.2 - index * .1, size: Math.max(.1, 3 + Math.sin(index * 3 + snapshot) * 2.5 + (index === 10 ? 35 : 0)) }));
  const asks = Array.from({ length: 11 }, (_, index) => ({ price: 142.3 + index * .1, size: Math.max(.1, 3 + Math.cos(index * 2 + snapshot) * 2.5 + (index === 2 ? 10 : 0)) }));
  const fills: MarketFill[] = Array.from({ length: 18 }, (_, index) => ({ id: `fill-${snapshot - index}`, side: (snapshot + index) % 3 ? "buy" : "sell", price: 142.2 + Math.sin(snapshot + index) * .2, size: .25 + Math.abs(Math.sin(snapshot + index * 2)) * 3, time: new Date(Date.UTC(2026, 10, 4, 12, 4, 59 + snapshot * 3 - index * 3)).toISOString() }));
  return <div className="w-full"><MarketOrderBook baseSymbol="NOVA" quoteSymbol="USDU" precision={1} bids={bids} asks={asks} fills={fills} onPriceSelect={(price, side) => setMessage(`Selected ${side} limit price: $${price.toFixed(1)}`)} /><p role="status" className="text-center text-xs text-muted-foreground">{message || "Simulated order flow for demonstration. Not market data."}</p><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Sample flow controls</summary><Button size="sm" variant="outline" className="mt-3 rounded-full" onClick={() => setPlaying(!playing)}>{playing ? "Pause sample flow" : "Resume sample flow"}</Button></details></div>;
}
