"use client";

import { useState } from "react";
import { Gauge, Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface BudgetResource {
  id: string;
  label: string;
  /** Cost/consumption in the same unit as the budget. */
  amount: number;
  color: string;
  description?: string;
}
export interface UsageBudgetProps {
  resources: readonly BudgetResource[];
  budget?: number;
  defaultBudget?: number;
  unit: string;
  period: string;
  /** Percentage notification thresholds supplied by the host. */
  thresholds: readonly number[];
  maxBudget: number;
  step?: number;
  /** Persists the budget. The uncontrolled budget commits only after this resolves. */
  onSave: (budget: number) => Promise<void>;
  onBudgetChange?: (budget: number) => void;
  className?: string;
}

const budgetSegments = Array.from({ length: 40 }, (_, index) => (index + 1) * 2.5);

/** A planning setting: the host, not this display, enforces spending limits. */
export function UsageBudget({ resources, budget, defaultBudget = 0, unit, period, thresholds, maxBudget, step = 1, onSave, onBudgetChange, className }: UsageBudgetProps) {
  const [internalBudget, setInternalBudget] = useState(defaultBudget);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const reduce = useReducedMotion();
  const current = budget ?? internalBudget;
  const used = resources.reduce((sum, resource) => sum + resource.amount, 0);
  const remaining = current - used;
  const percentage = current > 0 ? used / current * 100 : null;
  const reached = thresholds.filter((threshold) => percentage !== null && percentage >= threshold).sort((a, b) => b - a)[0];
  const format = (value: number, decimals = 0) => unit === "USD" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value) : `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${unit}`;
  const save = async (next: number) => {
    if (pending || next < 0 || next > maxBudget) return;
    setPending(true);
    setError("");
    try {
      await onSave(next);
      if (budget === undefined) setInternalBudget(next);
      onBudgetChange?.(next);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not save budget");
    } finally {
      setPending(false);
    }
  };
  return <section aria-label="Usage budget" aria-busy={pending} className={cn("w-full max-w-lg rounded-3xl border border-border bg-background p-5 text-foreground sm:p-6", className)}>
    <header className="flex items-center justify-between gap-3"><h2 className="text-xl font-medium">Usage budget</h2><span className="text-xs text-muted-foreground">{period}</span></header>
    <div className="my-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-sm text-muted-foreground">Total used</p><div className="flex flex-wrap items-center gap-2"><span className="text-4xl font-medium tracking-tight"><AnimatedNumber value={used} startOnView={false} format={(value) => format(value, 2)} /></span><span className="text-sm text-muted-foreground">/ {format(current)}</span></div></div><span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-muted/30"><Gauge className="size-5" /></span></div>
    <meter aria-label="Budget consumed" min={0} max={Math.max(current, used, 1)} value={used} aria-valuetext={`${format(used, 2)} of ${format(current)} used`} className="sr-only" /><div aria-hidden="true" className="flex h-9 gap-1">{budgetSegments.map(threshold => <motion.span key={threshold} initial={false} animate={{ opacity: percentage !== null && threshold <= Math.round(percentage / 2.5) * 2.5 ? 1 : .08 }} transition={{ duration: reduce ? 0 : .2, ease: EASE_OUT }} className="min-w-0 flex-1 rounded-full bg-primary" />)}</div>
    <p role="status" className={cn("mt-3 text-xs text-muted-foreground", remaining < 0 && "text-destructive")}>{remaining < 0 ? `${format(Math.abs(remaining), 2)} over budget` : `${format(remaining, 2)} remaining this month`}{percentage !== null ? ` · ${Math.round(percentage)}% used` : " · No positive budget set"}<span className="sr-only">{reached !== undefined ? ` · ${reached}% notification threshold reached` : ""}</span></p>
    <dl className="my-6 divide-y divide-border">{resources.map((resource) => <div key={resource.id} className="flex items-center justify-between gap-4 py-4 text-sm"><dt><span className="font-medium">{resource.label}</span>{resource.description && <span className="mt-0 block text-xs text-muted-foreground">{resource.description}</span>}</dt><dd className="shrink-0 tabular-nums">{format(resource.amount, 2)}</dd></div>)}</dl>
    {!resources.length && <p className="my-6 text-sm text-muted-foreground">No resource usage recorded.</p>}
    <footer className="flex items-center justify-between gap-4 border-t border-border pt-4"><div><p className="text-sm font-medium">Monthly limit</p><p className="text-xs text-muted-foreground">Adjust in {format(step)} increments</p></div><div className="flex items-center gap-2"><button type="button" aria-label="Decrease budget" disabled={pending || current <= 0} onClick={() => void save(Math.max(0, current - step))} className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-30"><Minus className="size-4" /></button><span className="min-w-12 text-center text-sm tabular-nums"><AnimatedNumber value={current} startOnView={false} format={(value) => format(value)} /></span><button type="button" aria-label="Increase budget" disabled={pending || current >= maxBudget} onClick={() => void save(Math.min(maxBudget, current + step))} className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-30"><Plus className="size-4" /></button></div></footer>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <p className="sr-only">Planning budget, not an enforced limit. Notification thresholds: {thresholds.join(", ")} percent.</p>
  </section>;
}
