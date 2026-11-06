"use client";

import { useEffect, useState } from "react";
import { PerpsPositions, type PerpPosition } from "@/components/motion/crypto-markets";
import { Button } from "@/components/motion/button";

export function PerpsPositionsPreview() {
  const [playing, setPlaying] = useState(true);
  const [positions, setPositions] = useState<PerpPosition[]>([
    { id: "position-1", pair: "NOVA-PERP", side: "long", size: 100, entry: 138, mark: 142.2, liquidation: 128.1, leverage: 10, collateral: 2694, precision: 2, takeProfit: 150 },
    { id: "position-2", pair: "TIDE-PERP", side: "short", size: 50000, entry: .04, mark: .0342, liquidation: .045, leverage: 5, collateral: 3200, precision: 4, stopLoss: .042 },
    { id: "position-3", pair: "ARB-PERP", side: "long", size: 2600, entry: .66, mark: .62, liquidation: .49, leverage: 3, collateral: 917.68, precision: 3 },
  ]);
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setPositions(rows => rows.map((position, index) => ({ ...position, mark: position.mark * (index % 2 ? 1.0002 : .9998) }))), 4000); return () => window.clearInterval(timer); }, [playing]);
  return <div className="w-full"><PerpsPositions positions={positions} equity={18442.18} onAction={async request => { setPositions(rows => rows.flatMap(p => { if (p.id !== request.id) return [p]; if (request.type === "close") return request.size >= p.size ? [] : [{ ...p, size: p.size - request.size, collateral: p.collateral * (1 - request.size / p.size) }]; if (request.type === "leverage") return [{ ...p, leverage: request.leverage }]; return [{ ...p, takeProfit: request.takeProfit ?? undefined, stopLoss: request.stopLoss ?? undefined }]; })); }} /><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Local position simulation controls</summary><p className="my-3">Local position simulation. No real orders are placed.</p><Button size="sm" variant="outline" className="rounded-full" onClick={() => setPlaying(!playing)}>{playing ? "Pause sample marks" : "Resume sample marks"}</Button></details></div>;
}
