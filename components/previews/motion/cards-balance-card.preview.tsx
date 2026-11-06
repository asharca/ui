"use client";
import { useState } from "react";
import { BalanceSummaryCard } from "@/components/motion/purposeful-cards";
export function BalanceCardPreview() {
  const [flow, setFlow] = useState<string | null>(null);
  const [balance, setBalance] = useState(12000);
  const [amount, setAmount] = useState("25");
  return <div className="flex w-full flex-col items-center gap-4 px-4 py-10 sm:px-8 sm:py-16"><BalanceSummaryCard account="Total balance" balance={balance} change="+ $45.32 today" marks={[<span key="bitcoin" className="text-amber-500">₿</span>,<span key="ethereum" className="text-indigo-400">Ξ</span>,<span key="solana" className="text-emerald-400">≋</span>,<span key="tether" className="text-emerald-600">₮</span>]} onSend={() => setFlow("send")} onAdd={() => setFlow("add")} />{flow ? <form className="w-full max-w-sm space-y-3 rounded-xl border border-border p-4" onSubmit={event => { event.preventDefault(); const value = Number(amount); if (value > 0 && (flow === "add" || value <= balance)) { setBalance(balance + (flow === "send" ? -value : value)); setFlow(null); } }}><p className="text-sm">Local demo: {flow === "send" ? "send" : "add"} funds. No money moves.</p><label className="block text-sm">Amount (USD)<input aria-label="Amount USD" type="number" required min="0.01" step="0.01" max={flow === "send" ? balance : undefined} value={amount} onChange={event => setAmount(event.target.value)} className="mt-2 w-full rounded border border-border bg-background p-2" /></label><button type="submit" className="rounded-full bg-foreground px-3 py-2 text-sm text-background">Confirm local adjustment</button><button type="button" onClick={() => setFlow(null)} className="ml-3 text-sm">Cancel</button></form> : null}</div>;
}
