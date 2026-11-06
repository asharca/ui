"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ReceiptItem {
  id: string;
  label: string;
  /** Integer minor currency units, e.g. 1299 means $12.99 for USD. */
  unitAmount: number;
  /** Whole units only: fractional quantities should be priced by the host. */
  quantity: number;
  description?: string;
}
export interface ReceiptAdjustment {
  id: string;
  label: string;
  /** Signed integer minor units: negative for discounts, positive for tax. */
  amount: number;
}
export interface ReceiptProps {
  merchant: ReactNode;
  reference: string;
  items: ReceiptItem[];
  adjustments?: ReceiptAdjustment[];
  currency?: string;
  locale?: string;
  address?: string;
  date?: string;
  payment?: ReactNode;
  status?: "paid" | "pending" | "refunded";
  /** Code 39 value: uppercase ASCII, digits, space and -.$/+%. Not payment data. */
  barcode?: string;
  footer?: ReactNode;
  /** Change this value to replay the feed and stamp; does not alter transaction data. */
  printKey?: string | number;
  className?: string;
}

// Code 39 wide/narrow element patterns; the start/stop symbol is never data.
const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn",
  "4": "nnnwwnnnw", "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw",
  "8": "wnnwnnwnn", "9": "nnwwnnwnn", A: "wnnnnwnnw", B: "nnwnnwnnw",
  C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn", F: "nnwnwwnnn",
  G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
  K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww",
  O: "wnnnwnnwn", P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn",
  S: "nnwnnnwwn", T: "nnnnwnwwn", U: "wwnnnnnnw", V: "nwwnnnnnw",
  W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn", Z: "nwwnwnnnn",
  "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
  "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn",
};

function ReceiptBarcode({ value }: { value: string }) {
  if (!/^[A-Z0-9 .\-$/+%]+$/.test(value)) {
    return <p className="text-xs text-destructive">Barcode unavailable: use Code 39 characters (A–Z, 0–9, space, -.$/+%).</p>;
  }
  let x = 10;
  const bars: ReactNode[] = [];
  for (const [characterIndex, character] of Array.from(`*${value}*`).entries()) {
    for (const [elementIndex, element] of Array.from(CODE39[character]).entries()) {
      const width = element === "w" ? 3 : 1;
      if (elementIndex % 2 === 0) bars.push(<rect key={`${characterIndex}-${elementIndex}`} x={x} y={0} width={width} height={40} />);
      x += width;
    }
    x += 1;
  }
  return <figure className="text-center"><svg role="img" aria-label={`Code 39 barcode ${value}`} viewBox={`0 0 ${x + 10} 40`} className="mx-auto h-10 w-full max-w-56 fill-current" preserveAspectRatio="none">{bars}</svg><figcaption className="mt-1.5 break-all text-xs tracking-widest text-muted-foreground">{value}</figcaption></figure>;
}

/**
 * Amounts use integer minor currency units throughout: no floating point taxes or
 * per-render rounding. The host supplies already-rounded discount/tax amounts.
 * Intl chooses the ISO currency exponent (USD 2, JPY 0, KWD 3, etc.).
 */
export function Receipt({ merchant, reference, items, adjustments = [], currency = "USD", locale = "en-US", address, date, payment, status, barcode, footer, printKey = 0, className }: ReceiptProps) {
  const reduce = useReducedMotion();
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
  const divisor = 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2);
  const subtotal = items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
  const total = subtotal + adjustments.reduce((sum, adjustment) => sum + adjustment.amount, 0);
  const valid = items.every(item => Number.isSafeInteger(item.unitAmount) && Number.isSafeInteger(item.quantity) && item.quantity >= 0) && adjustments.every(adjustment => Number.isSafeInteger(adjustment.amount)) && Number.isSafeInteger(subtotal) && Number.isSafeInteger(total);
  if (!valid) throw new RangeError("Receipt amounts and quantities must be safe integers in minor currency units; quantities cannot be negative.");
  const money = (amount: number) => formatter.format(amount / divisor);
  return <div className={cn("w-full max-w-sm", className)}>
    <div aria-hidden="true" className="relative z-10 -mx-3 h-4 rounded-full border border-border bg-muted"><div className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-foreground/70" /></div>
    <div className="-mt-2 overflow-hidden px-1 pb-3">
      <motion.article key={printKey} data-print-key={printKey} aria-label={`Receipt ${reference}`} initial={reduce ? false : { y: "-102%" }} animate={reduce ? { y: "0%" } : { y: ["-102%", "-76%", "-76%", "-49%", "-49%", "-22%", "-22%", "0%"] }} transition={reduce ? { duration: 0 } : { duration: 1.35, ease: EASE_OUT, times: [0, .18, .25, .43, .5, .68, .75, 1] }} className="relative border-x border-border bg-background px-6 pb-[30px] pt-7 font-mono text-xs text-foreground shadow-md" style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),96% 100%,92% calc(100% - 10px),88% 100%,84% calc(100% - 10px),80% 100%,76% calc(100% - 10px),72% 100%,68% calc(100% - 10px),64% 100%,60% calc(100% - 10px),56% 100%,52% calc(100% - 10px),48% 100%,44% calc(100% - 10px),40% 100%,36% calc(100% - 10px),32% 100%,28% calc(100% - 10px),24% 100%,20% calc(100% - 10px),16% 100%,12% calc(100% - 10px),8% 100%,4% calc(100% - 10px),0 100%)" }}>
        <header className="text-center font-sans"><div className="text-base font-medium tracking-tight">{merchant}</div>{address && <p className="mt-0.5 text-xs text-muted-foreground">{address}</p>}{date && <p className="mt-3 font-mono text-xs text-muted-foreground">{date}</p>}<p className="break-all font-mono text-xs text-muted-foreground">#{reference}</p></header>
        <hr className="my-4 border-0 border-t border-dashed border-border" />
        <table className="w-full text-left font-sans"><caption className="sr-only">Purchased items</caption><thead className="sr-only"><tr><th>Item</th><th>Amount</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td className={cn("pr-3 text-sm", index > 0 && "pt-3")}>{item.label}<span className="block font-mono text-xs text-muted-foreground">{item.quantity} × {money(item.unitAmount)}{item.description ? ` · ${item.description}` : ""}</span></td><td className={cn("text-right align-top font-mono text-sm tabular-nums", index > 0 && "pt-3")}>{money(item.unitAmount * item.quantity)}</td></tr>)}</tbody></table>
        {items.length === 0 && <p className="py-3 text-muted-foreground">No line items</p>}
        <hr className="my-4 border-0 border-t border-dashed border-border" />
        <dl className="space-y-1.5 font-mono text-xs"><div className="flex justify-between gap-3"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>{adjustments.map(adjustment => <div key={adjustment.id} className="flex justify-between gap-3 text-muted-foreground"><dt>{adjustment.label}</dt><dd className={adjustment.amount < 0 ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}>{money(adjustment.amount)}</dd></div>)}</dl>
        <div className="relative mt-4 flex items-baseline justify-between gap-4 border-t border-dashed border-border pt-4"><span className="font-sans text-sm font-medium">Total</span><span data-receipt-total="" className="font-mono text-2xl font-medium tracking-tight tabular-nums">{money(total)}</span>
        {status && <motion.p initial={reduce ? false : { opacity: 0, scale: 1.7, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -10 }} transition={reduce ? { duration: 0 } : { ...SPRING_PANEL, delay: 1.4 }} className={cn("pointer-events-none absolute left-[46%] top-1/2 grid h-12 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded border-2 font-mono text-lg font-bold uppercase tracking-[0.16em] outline outline-1 outline-offset-[-5px]", status === "paid" ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400" : status === "refunded" ? "border-destructive text-destructive" : "border-foreground/60 text-foreground")}>{status}</motion.p>}</div>
        {payment && <div className="mt-4 text-xs text-muted-foreground">{payment}</div>}
        {barcode && <><hr className="my-4 border-0 border-t border-dashed border-border" /><ReceiptBarcode value={barcode} /></>}
        {footer && <footer className="mt-4 text-center font-sans text-xs text-muted-foreground">{footer}</footer>}
      </motion.article>
    </div>
  </div>;
}
