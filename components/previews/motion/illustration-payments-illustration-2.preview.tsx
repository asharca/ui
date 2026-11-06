"use client";

import { useState } from "react";
import { RevenueStream, type IncomingPayment, type RevenuePresentationFrame } from "@/components/motion/illustration-payments";
import { Button } from "@/components/motion/button";

const samples: IncomingPayment[] = [
  { id: "nora", sender: "Nora Diaz", amount: "$32.00", date: "Just now", status: "settled", method: "Card" },
  { id: "jon", sender: "Jon Avery", amount: "$86.00", date: "2m ago", status: "settled", method: "Link" },
  { id: "lena", sender: "Lena Ortiz", amount: "$1,200.00", date: "4m ago", status: "settled", method: "Bank" },
  { id: "theo", sender: "Theo Park", amount: "$48.50", date: "6m ago", status: "settled", method: "Wallet" },
  { id: "ana", sender: "Ana Ruiz", amount: "$120.00", date: "8m ago", status: "settled", method: "Card" },
];
const arrivals = samples.slice(0, 3).map((sample, index) => ({ ...sample, id: `sample-arrival-${index}`, date: "Just now" }));
const frames: RevenuePresentationFrame[] = [
  { balance: 12480, payments: samples },
  { balance: 12512, payments: [arrivals[0], ...samples].slice(0, 5) },
  { balance: 12598, payments: [arrivals[1], arrivals[0], ...samples].slice(0, 5) },
  { balance: 13798, payments: [arrivals[2], arrivals[1], arrivals[0], ...samples].slice(0, 5) },
];
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatBalance = (value: number) => currency.format(value);
const demonstration = { frames, formatBalance, interval: 2600 };
export function RevenueStreamPreview() {
  const [count, setCount] = useState(0);
  const [playback, setPlayback] = useState(true);
  const payments: IncomingPayment[] = [
    ...Array.from({ length: count }, (_, index) => ({ id: `demo-${index}`, sender: `Sample customer ${index + 1}`, amount: "$48.00", date: "Sample frame", status: "settled" as const, method: "Card" })),
    ...samples,
  ];
  return <div className="w-full max-w-xl"><RevenueStream balance={formatBalance(12480 + count * 48)} payments={payments.slice(0, 5)} demonstration={playback ? demonstration : undefined} /><div className="sr-only focus-within:not-sr-only"><Button size="sm" onClick={() => { setPlayback(false); setCount(value => value + 1); }}>Add sample payment frame</Button><Button size="sm" variant="ghost" onClick={() => { setCount(0); setPlayback(true); }}>Replay sample arrivals</Button></div><p className="sr-only">These are explicitly supplied sample frames, not payment events from a connected financial service.</p></div>;
}
