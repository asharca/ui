"use client";

import { useState } from "react";
import { PortfolioTable, type PortfolioRow } from "@/components/motion/commerce-data-tables";
import { CommerceDialog, commerceInput } from "@/components/motion/commerce-ui";
import { Button } from "@/components/motion/button";

const samplePositions: PortfolioRow[] = [
  { id: "nvda", asset: "NVIDIA", symbol: "NVDA", quantity: 1022.1045, price: 182.37, cost: 150000, history: [170, 174, 172, 182.37] },
  { id: "msft", asset: "Microsoft", symbol: "MSFT", quantity: 264, price: 517.91, cost: 112000, history: [500, 510, 507, 517.91] },
  { id: "asml", asset: "ASML Holding", symbol: "ASML", quantity: 107.11, price: 1094.2, cost: 98000, history: [1010, 1042, 1033, 1094.2] },
  { id: "amzn", asset: "Amazon", symbol: "AMZN", quantity: 422.06, price: 238.55, cost: 82000, history: [218, 224, 220, 238.55] },
  { id: "crm", asset: "Salesforce", symbol: "CRM", quantity: 259.57, price: 312.64, cost: 68000, history: [291, 304, 300, 312.64] },
  { id: "spot", asset: "Spotify", symbol: "SPOT", quantity: 92.27, price: 741.18, cost: 55000, history: [680, 703, 695, 741.18] },
  { id: "usd", asset: "Cash reserve", symbol: "USD", quantity: 60884, price: 1, cost: 60884, history: [1, 1, 1, 1] },
];

export function PortfolioTablePreview() {
  const [message, setMessage] = useState(""); const [positions, setPositions] = useState(samplePositions); const [adding, setAdding] = useState(false); const [quantity, setQuantity] = useState("1");
  return <div className="w-full"><PortfolioTable periods={["1D", "1W", "1M", "1Y"]} positions={positions} onAsset={asset => setMessage(`${asset.asset}: ${asset.quantity} units at $${asset.price}, cost basis $${asset.cost}. Sample data only.`)} onStatement={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(positions, null, 2)], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "sample-portfolio.json"; anchor.click(); URL.revokeObjectURL(url); }} onAddAsset={() => setAdding(true)} /><p role="status" className="text-center text-xs text-muted-foreground">{message}</p><CommerceDialog open={adding} onOpenChange={setAdding} label="Add sample holding"><form onSubmit={event => { event.preventDefault(); const units = Number(quantity); if (!Number.isFinite(units) || units <= 0) return; setPositions(rows => rows.map(row => row.id === "nvda" ? { ...row, quantity: row.quantity + units, cost: row.cost + units * row.price } : row)); setAdding(false); }}><h3 className="text-xl font-medium">Add sample NVIDIA shares</h3><p className="my-4 text-xs text-muted-foreground">Changes only this local portfolio. No trade is placed.</p><label className="grid gap-2 text-sm">Quantity<input className={commerceInput} type="number" min="0.01" step="0.01" value={quantity} onChange={event => setQuantity(event.target.value)} required /></label><Button type="submit" className="mt-5 w-full rounded-full">Add holding</Button></form></CommerceDialog></div>;
}
