"use client";

import { Check, CreditCard, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface InvoicePayLineItem {
  id: string;
  description: string;
  detail?: string;
  qty: number;
  rate: number;
}

export interface InvoicePayProps {
  issuerName: string;
  issuerEmail: string;
  invoiceNumber: string;
  billToName: string;
  billToCompany: string;
  billToAddress: string;
  issuedDate: string;
  dueDate: string;
  items: InvoicePayLineItem[];
  taxRatePercent?: number;
  paid?: boolean;
  paidDate?: string;
  onPay?: (paymentMethod: string) => void;
  onReset?: () => void;
  className?: string;
}

const METHODS = [
  { id: "card", label: "Visa ending in 4821", meta: "Instant settlement" },
  { id: "ach", label: "Mercury Checking ••9014", meta: "Zero fee ACH" },
];

/** Payable invoice card with rolling totals, confirmation modal, hairline sweep, and paid status morph. */
export function InvoicePay({
  issuerName,
  issuerEmail,
  invoiceNumber,
  billToName,
  billToCompany,
  billToAddress,
  issuedDate,
  dueDate,
  items,
  taxRatePercent = 8,
  paid = false,
  paidDate = "Nov 24, 2026",
  onPay,
  onReset,
  className,
}: InvoicePayProps) {
  const reduce = useReducedMotion() ?? false;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [method, setMethod] = useState("card");

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const tax = Number(((subtotal * taxRatePercent) / 100).toFixed(2));
  const total = subtotal + tax;

  const confirmPayment = () => {
    onPay?.(method);
    setConfirmOpen(false);
  };

  return (
    <article
      aria-label={`Invoice ${invoiceNumber}`}
      className={cn(
        "relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 text-foreground",
        className,
      )}
    >
      {/* Hairline settlement sweep across top border */}
      <AnimatePresence>
        {paid ? (
          <motion.span
            key="paid-hairline"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500"
          />
        ) : null}
      </AnimatePresence>

      <header className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{issuerName}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{issuerEmail}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
              paid
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-amber-500/15 text-amber-500",
            )}
          >
            {paid ? <Check aria-hidden="true" className="size-3" /> : null}
            <span>{paid ? "Paid" : "Due"}</span>
          </span>
          {paid && onReset ? (
            <button
              type="button"
              onClick={onReset}
              aria-label="Reset invoice demo"
              className="grid size-7 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
            >
              <RotateCcw aria-hidden="true" className="size-3" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-muted-foreground">Invoice</p>
          <p className="mt-0.5 font-mono font-semibold text-foreground">
            {invoiceNumber}
          </p>
          <p className="mt-3 text-muted-foreground">Bill to</p>
          <p className="mt-0.5 font-medium text-foreground">{billToCompany}</p>
          <p className="text-muted-foreground">{billToName}</p>
          <p className="text-muted-foreground">{billToAddress}</p>
        </div>
        <div className="space-y-3 text-right">
          <div>
            <p className="text-muted-foreground">Issued</p>
            <p className="mt-0.5 font-medium text-foreground">{issuedDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due</p>
            <p className="mt-0.5 font-medium text-foreground">{dueDate}</p>
          </div>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-border border-y border-border">
        {items.map((item, idx) => (
          <motion.li
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: reduce ? 0 : idx * 0.05 }}
            className="flex items-start justify-between gap-4 py-3 text-xs"
          >
            <div>
              <p className="font-medium text-foreground">{item.description}</p>
              {item.detail ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.detail}
                </p>
              ) : null}
            </div>
            <div className="text-right font-mono tabular-nums">
              <p className="text-foreground">
                ${(item.qty * item.rate).toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {item.qty} × ${item.rate.toLocaleString()}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <dt>Subtotal</dt>
          <dd className="font-mono tabular-nums">
            <NumberTicker value={subtotal} prefix="$" locale startOnView={false} />
          </dd>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <dt>Tax ({taxRatePercent}%)</dt>
          <dd className="font-mono tabular-nums">
            <NumberTicker value={tax} decimals={2} prefix="$" locale startOnView={false} />
          </dd>
        </div>
        <div className="flex justify-between pt-2 text-sm font-semibold text-foreground">
          <dt>{paid ? "Amount paid" : "Total due"}</dt>
          <dd className="font-mono tabular-nums">
            <NumberTicker value={total} decimals={2} prefix="$" locale startOnView={false} />
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {paid ? (
            <motion.div
              key="paid-note"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-500"
            >
              <span className="flex items-center gap-2 font-medium">
                <Check aria-hidden="true" className="size-4" />
                Payment settled on {paidDate}
              </span>
              <span className="font-mono">Receipt #9104</span>
            </motion.div>
          ) : (
            <motion.div
              key="pay-cta"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <Button
                className="w-full"
                onClick={() => setConfirmOpen(true)}
              >
                <CreditCard aria-hidden="true" className="size-4" />
                Pay ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MorphingModal
        viewId={confirmOpen ? "confirm-invoice" : null}
        onClose={() => setConfirmOpen(false)}
        placement="center"
        ariaLabel={`Pay invoice ${invoiceNumber}`}
        className="max-w-md"
      >
        <div className="space-y-4 p-1">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{invoiceNumber}</p>
            <h4 className="mt-1 text-base font-semibold text-foreground">
              Confirm invoice payment
            </h4>
          </div>

          <div className="space-y-2">
            {METHODS.map((item) => {
              const selected = method === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span>{item.meta}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={confirmPayment}>
              Confirm ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Button>
          </div>
        </div>
      </MorphingModal>
    </article>
  );
}
