"use client";

import { type ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/motion/number-ticker";

/** Shared presentation only; all business records and actions belong to the host. */
export function OperationsPage({ eyebrow, title, description, actions, children, className }: { eyebrow: string; title: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.section initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: EASE_OUT }} className={cn("@container/operations w-full min-w-0 space-y-5 bg-muted/30 px-4 py-6 text-foreground sm:px-6 sm:py-8", className)}><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-3 text-xs text-muted-foreground">{eyebrow}</p><h2 className="text-2xl font-normal tracking-tight sm:text-3xl">{title}</h2>{description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>}</div>{actions}</header>{children}</motion.section>;
}
export function OperationsPanel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return <section className={cn("min-w-0 space-y-4 rounded-2xl border border-border bg-background p-5 sm:p-6", className)}><h3 className="text-xl font-medium">{title}</h3>{children}</section>;
}
export function OperationsMetric({ label, value, detail, icon }: { label: string; value: ReactNode; detail?: string; icon?: ReactNode }) {
  return <div className="flex min-w-0 flex-col rounded-3xl border border-border/60 bg-muted/40 p-1.5"><p className="flex items-center gap-3 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{icon && <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-border/50 bg-background [&>svg]:size-3.5">{icon}</span>}{label}</p><div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl border border-border/50 bg-background p-4"><p className="text-3xl font-medium tracking-tight tabular-nums">{value}</p>{detail && <p className="text-[10px] leading-relaxed text-muted-foreground">{detail}</p>}</div></div>;
}
export const operationsField = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50";
export const operationsRow = "border-b border-border/60 px-3 py-3 text-left text-sm";
export const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
export function actionError(error: unknown) { return error instanceof Error ? error.message : "The host could not complete this request."; }
/** A display clock, never a source of chain state. Explicit now supports server rendering and deterministic hosts. */
export function useOperationsClock(now?: number) {
  const [clock, setClock] = useState<number | null>(now ?? null);
  useEffect(() => { if (now !== undefined) return; setClock(Date.now()); const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer); }, [now]);
  return now ?? clock;
}
export function remainingTime(deadline: string, now: number | null) {
  const end = Date.parse(deadline);
  if (!Number.isFinite(end)) return "Deadline unavailable";
  if (now === null) return "Calculating deadline";
  const seconds = Math.max(0, Math.ceil((end - now) / 1000));
  return seconds === 0 ? "Closed" : `${Math.floor(seconds / 86400)}d ${Math.floor(seconds / 3600) % 24}h ${Math.floor(seconds / 60) % 60}m ${seconds % 60}s remaining`;
}

/** Presentation of an explicit host deadline; never advances a sale or proposal. */
export function OperationsCountdown({ deadline, now, className }: { deadline: string; now: number | null; className?: string }) {
  const end = Date.parse(deadline);
  const seconds = now === null || !Number.isFinite(end) ? null : Math.max(0, Math.floor((end - now) / 1000));
  const values = seconds === null ? [null, null, null, null] : [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <div role="timer" aria-label={remainingTime(deadline, now)} className={cn("grid grid-cols-4 gap-3", className)}>{values.map((value, index) => <div key={["Days", "Hours", "Min", "Sec"][index]} className="min-w-0"><span className="font-mono text-3xl font-medium tabular-nums">{value === null ? "—" : <NumberTicker value={value} format={() => String(value).padStart(2, "0")} startOnView={false} duration={.2} stagger={0} />}</span><span className="mt-1 block text-xs text-muted-foreground">{["Days", "Hours", "Min", "Sec"][index]}</span></div>)}</div>;
}
