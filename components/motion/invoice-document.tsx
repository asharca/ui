"use client";

import { Check, Copy, Download, FileCheck2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface InvoiceDocumentParty {
  name: string;
  email: string;
  addressLines: string[];
  taxId?: string;
}

export interface InvoiceDocumentLineItem {
  id: string;
  description: string;
  detail?: string;
  qty: number;
  rate: number;
}

export interface InvoiceDocumentProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  from: InvoiceDocumentParty;
  billTo: InvoiceDocumentParty;
  items: InvoiceDocumentLineItem[];
  taxRatePercent?: number;
  notes?: string;
  shareUrl?: string;
  onDownload?: () => void;
  className?: string;
}

/** Full-page invoice sheet under a drifting art band with staggered line reveals and rolling totals. */
export function InvoiceDocument({
  invoiceNumber,
  issueDate,
  dueDate,
  from,
  billTo,
  items,
  taxRatePercent = 10,
  notes = "Payment due within 30 days via wire transfer or corporate card.",
  shareUrl = "https://billing.example.com/invoices/FF-2026-0418",
  onDownload,
  className,
}: InvoiceDocumentProps) {
  const reduce = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const tax = Number(((subtotal * taxRatePercent) / 100).toFixed(2));
  const total = subtotal + tax;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleDownload = () => {
    onDownload?.();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl space-y-3", className)}>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => void copyLink()}
          aria-label="Copy invoice link"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
              Link copied
            </>
          ) : (
            <>
              <Copy aria-hidden="true" className="size-3.5" />
              Copy link
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {downloaded ? (
            <>
              <FileCheck2 aria-hidden="true" className="size-3.5 text-emerald-500" />
              Ready
            </>
          ) : (
            <>
              <span>Download PDF</span>
              <Download aria-hidden="true" className="size-3.5" />
            </>
          )}
        </button>
      </div>

      <article className="overflow-hidden rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm sm:p-8">
        {/* Drifting atmospheric header band */}
        <div
          aria-hidden="true"
          className="relative h-28 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#3b2019] via-[#5e382b] to-[#1a343b]"
        >
          <motion.div
            animate={reduce ? undefined : { x: ["-6%", "6%", "-6%"], y: ["-4%", "4%", "-4%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 bg-[radial-gradient(60%_70%_at_30%_35%,rgba(224,132,96,0.45),transparent_70%),radial-gradient(50%_60%_at_75%_60%,rgba(64,185,204,0.35),transparent_70%)] blur-xl"
          />
        </div>

        <header className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Invoice
            </p>
            <h3 className="mt-1 font-mono text-lg font-semibold text-foreground">
              {invoiceNumber}
            </h3>
          </div>
          <div
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-foreground text-background"
          >
            <span className="size-4 rounded-[4px] border-2 border-background" />
          </div>
        </header>

        <dl className="mt-6 grid gap-6 border-y border-border py-5 text-xs sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              From
            </dt>
            <dd className="mt-1.5 space-y-0.5 text-foreground">
              <p className="font-medium">{from.name}</p>
              <p className="text-muted-foreground">{from.email}</p>
              {from.addressLines.map((line) => (
                <p key={line} className="text-muted-foreground">
                  {line}
                </p>
              ))}
              {from.taxId ? (
                <p className="pt-1 font-mono text-[11px] text-muted-foreground">
                  {from.taxId}
                </p>
              ) : null}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Bill to
            </dt>
            <dd className="mt-1.5 space-y-0.5 text-foreground">
              <p className="font-medium">{billTo.name}</p>
              <p className="text-muted-foreground">{billTo.email}</p>
              {billTo.addressLines.map((line) => (
                <p key={line} className="text-muted-foreground">
                  {line}
                </p>
              ))}
            </dd>
          </div>

          <div className="space-y-3 sm:text-right">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Issue date
              </dt>
              <dd className="mt-1 font-medium text-foreground">{issueDate}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Due date
              </dt>
              <dd className="mt-1 font-medium text-foreground">{dueDate}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-6">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 text-[11px] font-medium text-muted-foreground">
            <span>Description</span>
            <span className="text-right">Qty × Rate</span>
            <span className="w-20 text-right">Amount</span>
          </div>
          <ul>
            {items.map((item, idx) => (
              <motion.li
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: reduce ? 0 : idx * 0.06, ease: EASE_OUT }}
                className="relative py-3"
              >
                <motion.span
                  aria-hidden="true"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : idx * 0.06, ease: EASE_OUT }}
                  style={{ transformOrigin: "left" }}
                  className="absolute inset-x-0 top-0 h-px bg-border"
                />
                <div className="grid grid-cols-[1fr_auto_auto] items-start gap-4 text-xs">
                  <div>
                    <p className="font-medium text-foreground">{item.description}</p>
                    {item.detail ? (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.detail}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {item.qty} × ${item.rate.toLocaleString()}
                  </span>
                  <span className="w-20 text-right font-mono font-medium text-foreground tabular-nums">
                    ${(item.qty * item.rate).toLocaleString()}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <dl className="mt-4 ml-auto max-w-xs space-y-2 border-t border-border pt-4 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd className="font-mono tabular-nums">
              <NumberTicker value={subtotal} prefix="$" locale startOnView={false} />
            </dd>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <dt>Tax ({taxRatePercent}%)</dt>
            <dd className="font-mono tabular-nums">
              <NumberTicker
                value={tax}
                decimals={2}
                prefix="$"
                locale
                startOnView={false}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2.5 text-sm font-semibold text-foreground">
            <dt>Total due</dt>
            <dd className="font-mono tabular-nums">
              <NumberTicker
                value={total}
                decimals={2}
                prefix="$"
                locale
                startOnView={false}
              />
            </dd>
          </div>
        </dl>

        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          {notes}
        </p>
      </article>
    </div>
  );
}
