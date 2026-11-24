"use client";

import { Check, Download, FileText, Link2, RotateCcw } from "lucide-react";
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
  discountLabel?: string;
  discountAmount?: number;
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

/** Payable invoice sheet with itemized table, confirmation modal, hairline sweep, and Paid transition. */
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
  discountLabel,
  discountAmount = 0,
  taxRatePercent = 8.25,
  paid = false,
  paidDate = "Nov 24, 2026",
  onPay,
  onReset,
  className,
}: InvoicePayProps) {
  const reduce = useReducedMotion() ?? false;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [method, setMethod] = useState("card");
  const [copiedLink, setCopiedLink] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Number(((discountedSubtotal * taxRatePercent) / 100).toFixed(2));
  const total = Number((discountedSubtotal + tax).toFixed(2));

  const confirmPayment = () => {
    onPay?.(method);
    setConfirmOpen(false);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://pay.beui.dev/i/${invoiceNumber}`);
    } catch {
      // Ignore clipboard unavailability
    }
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 1600);
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

      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground text-background"
          >
            <FileText className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{issuerName}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{issuerEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              paid
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400",
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
              className="grid size-7 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw aria-hidden="true" className="size-3" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold tracking-tight text-foreground">Invoice</p>
        <p className="font-mono text-xs text-muted-foreground">{invoiceNumber}</p>
      </div>

      <div className="mt-4 grid divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background/50 text-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-3.5">
          <p className="text-[11px] text-muted-foreground">Bill to</p>
          <p className="mt-1 font-medium text-foreground">{billToCompany}</p>
          <p className="text-muted-foreground">{billToName}</p>
          <p className="mt-0.5 leading-snug text-muted-foreground">{billToAddress}</p>
        </div>
        <div className="p-3.5">
          <p className="text-[11px] text-muted-foreground">Issued</p>
          <p className="mt-1 font-medium text-foreground">{issuedDate}</p>
        </div>
        <div className="p-3.5">
          <p className="text-[11px] text-muted-foreground">Due</p>
          <p className="mt-1 font-medium text-foreground">{dueDate}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-[minmax(0,1fr)_2.25rem_4.5rem_5.25rem] gap-2 border-b border-border pb-2 text-[11px] text-muted-foreground">
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Amount</span>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item, idx) => (
            <motion.li
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reduce ? 0 : idx * 0.05 }}
              className="grid grid-cols-[minmax(0,1fr)_2.25rem_4.5rem_5.25rem] items-start gap-2 py-3 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.description}</p>
                {item.detail ? (
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {item.detail}
                  </p>
                ) : null}
              </div>
              <span className="text-right font-mono text-muted-foreground tabular-nums">
                {item.qty}
              </span>
              <span className="text-right font-mono text-muted-foreground tabular-nums">
                ${item.rate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-right font-mono font-medium text-foreground tabular-nums">
                ${(item.qty * item.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid items-end gap-4 border-t border-border pt-4 sm:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-[11px] text-muted-foreground">
            {paid ? "Amount paid" : "Amount due"}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            <NumberTicker value={total} decimals={2} prefix="$" locale startOnView={false} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {paid ? `Paid ${paidDate}` : `Due ${dueDate}`}
          </p>
        </div>

        <dl className="space-y-1.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd className="font-mono text-foreground/90 tabular-nums">
              ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </dd>
          </div>
          {discountAmount > 0 && discountLabel ? (
            <div className="flex justify-between text-muted-foreground">
              <dt>{discountLabel}</dt>
              <dd className="font-mono text-emerald-500 tabular-nums">
                -${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between text-muted-foreground">
            <dt>Tax {taxRatePercent}%</dt>
            <dd className="font-mono text-foreground/90 tabular-nums">
              ${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <dt>Total</dt>
            <dd className="font-mono tabular-nums">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
        Payment due within 30 days. Thanks for another great quarter.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {paid ? (
              <motion.span
                key="paid-note"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 text-xs font-medium text-emerald-500"
              >
                <Check aria-hidden="true" className="size-3.5" />
                Settled
              </motion.span>
            ) : (
              <motion.button
                key="pay-btn"
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Pay now
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => void copyShareLink()}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
          >
            <Download aria-hidden="true" className="size-3.5" />
            Download PDF
          </button>
        </div>

        <button
          type="button"
          onClick={() => void copyShareLink()}
          aria-label="Copy invoice link"
          className="grid size-8 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          {copiedLink ? (
            <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
          ) : (
            <Link2 aria-hidden="true" className="size-3.5" />
          )}
        </button>
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
