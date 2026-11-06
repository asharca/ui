"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Receipt } from "@/components/motion/receipt";

export function ReceiptPrintedPreview() {
  const [printKey, setPrintKey] = useState(0);
  const subtotal = 12900 + 2 * 7900 + 2700;
  const discount = Math.round(subtotal * .1);
  const tax = Math.round((subtotal - discount) * .08);
  return <div className="relative flex w-full flex-col items-center gap-4 px-6 py-10">
    <Receipt merchant="Harbor & Pine" address="48 Harbor Street, Portland" date="Oct 19, 2026 · 4:12 PM" reference="HP-20481" printKey={printKey} items={[{ id: "headphones", label: "Studio headphones", unitAmount: 12900, quantity: 1, description: "Graphite" }, { id: "lamp", label: "Focus desk lamp", unitAmount: 7900, quantity: 2, description: "Sand" }, { id: "wrap", label: "Linen cable wrap", unitAmount: 900, quantity: 3 }]} adjustments={[{ id: "discount", label: "WELCOME10", amount: -discount }, { id: "delivery", label: "Express delivery", amount: 1200 }, { id: "tax", label: "Tax (8%)", amount: tax }]} status="paid" payment={<dl className="space-y-1.5 font-sans">{[["Paid with", "Visa •••• 4242"], ["Arrives by", "Thu, Oct 22"], ["Ship to", "Ava Lindqvist, Portland 97201"]].map(([label,value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-mono text-foreground">{value}</dd></div>)}</dl>} barcode="HP-20481" footer="Thank you for your order" />
    <button type="button" onClick={() => setPrintKey(value => value + 1)} className="flex h-9 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium"><RotateCcw aria-hidden className="size-4" />Print again</button>
  </div>;
}
