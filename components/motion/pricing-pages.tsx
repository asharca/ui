"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useId, useRef, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { InlineSlider } from "@/components/motion/range-slider-inline";
import { SPRING_PRESS, SPRING_SWAP } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type PricingCycle = "monthly" | "annual";
export interface ExplorerPlan { id: string; name: string; description: string; monthlyPerEditor: number; annualPerEditor: number; /** Recommendation threshold, inclusive. */ maxEditors: number; features: string[]; ctaLabel?: string }
export interface PlanExplorerProps {
  plans: ExplorerPlan[];
  currency?: string;
  locale?: string;
  title?: string;
  description?: string;
  billing?: PricingCycle;
  defaultBilling?: PricingCycle;
  onBillingChange?: (billing: PricingCycle) => void;
  editors?: number;
  defaultEditors?: number;
  onEditorsChange?: (editors: number) => void;
  maxEditors?: number;
  comparison: { label: string; group?: string; values: Record<string, string | boolean> }[];
  faq: { question: string; answer: string }[];
  /** Invoke actual host checkout. Resolve with a customer-visible confirmation or redirect in the callback. */
  onChoose: (selection: { planId: string; billing: PricingCycle; editors: number; total: number; currency: string }) => Promise<string | void>;
  onContactSales?: () => Promise<void>;
  salesDocumentation?: { label: string; href: string };
  className?: string;
}

export function PlanExplorer({ plans, currency = "USD", locale = "en-US", title = "A plan for every stage", description = "Choose your team size. Find room to do your best work.", billing, defaultBilling = "monthly", onBillingChange, editors, defaultEditors = 5, onEditorsChange, maxEditors = 100, comparison, faq, onChoose, onContactSales, salesDocumentation, className }: PlanExplorerProps) {
  const [internalBilling, setInternalBilling] = useState(defaultBilling);
  const [internalEditors, setInternalEditors] = useState(defaultEditors);
  const [focus, setFocus] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const canHover = useHoverCapable();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState(""); const [error, setError] = useState(""); const lock = useRef(false);
  const reduce = useReducedMotion(); const id = useId();
  const cycle = billing ?? internalBilling;
  const size = Math.max(1, Math.min(maxEditors, Math.round(editors ?? internalEditors)));
  const recommendation = [...plans].sort((a, b) => a.maxEditors - b.maxEditors).find((plan) => size <= plan.maxEditors) ?? plans.at(-1);
  const highlighted = focus ?? recommendation?.id;
  const money = (amount: number) => new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
  const amount = (plan: ExplorerPlan) => cycle === "annual" ? plan.annualPerEditor : plan.monthlyPerEditor;
  const choose = async (plan: ExplorerPlan) => {
    if (lock.current) return;
    lock.current = true; setPending(plan.id); setError(""); setMessage("");
    try { const response = await onChoose({ planId: plan.id, billing: cycle, editors: size, total: amount(plan) * size * (cycle === "annual" ? 12 : 1), currency }); if (response) setMessage(response); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Checkout could not be opened. Please try again."); }
    finally { lock.current = false; setPending(null); }
  };
  return <section aria-label="Plan explorer" className={cn("min-h-screen w-full bg-background px-4 py-14 font-sans text-foreground sm:px-8 sm:py-20", className)}><div className="mx-auto w-full max-w-6xl">
    <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Pricing</p>
      <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-pretty leading-7 text-muted-foreground">{description}</p>
      <div className="mt-10 grid w-full gap-5 rounded-3xl border border-border p-3 text-left sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-0 sm:p-2"><fieldset aria-label="Billing cycle" className="flex gap-1 rounded-full bg-muted/30 p-1">{(["monthly", "annual"] as const).map((value) => <button key={value} type="button" aria-pressed={cycle === value} onClick={() => { if (billing === undefined) setInternalBilling(value); onBillingChange?.(value); }} className={cn("relative isolate inline-flex flex-1 cursor-pointer items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium capitalize sm:flex-none", cycle === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>{value}{value === "annual" && plans[0]?.monthlyPerEditor > 0 && <span className="ml-1.5 font-mono text-xs text-muted-foreground">−{Math.round((1 - plans[0].annualPerEditor / plans[0].monthlyPerEditor) * 100)}%</span>}</button>)}</fieldset><div className="flex min-w-0 items-center gap-4 px-1 sm:ml-3 sm:border-l sm:border-border sm:pl-5 sm:pr-2"><span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground"><Users aria-hidden="true" className="size-4" /><span className="hidden sm:inline">Team</span></span><InlineSlider appearance="plain" className="h-9 min-w-0 flex-1" label="Team size" format={(value) => `${value} editors`} value={size} min={1} max={maxEditors} step={1} onValueChange={(value) => { const next = Math.round(value); if (editors === undefined) setInternalEditors(next); onEditorsChange?.(next); setFocus(null); }} /><p className="w-20 shrink-0 text-right text-sm tabular-nums">{size} editors</p></div><p role="status" className="sr-only">{recommendation ? `Recommended for ${size} editors: ${recommendation.name}` : "No plans available."}</p></div>
    </header>
    <div className="mt-14 grid gap-4 lg:grid-cols-3">{plans.map((plan) => <article key={plan.id} className={cn("flex flex-col overflow-hidden rounded-3xl border bg-background p-2", highlighted === plan.id ? "border-foreground/40" : "border-border")}><div className={cn("rounded-2xl border border-border p-5 sm:p-6", highlighted === plan.id && "bg-muted/30")}>
      <div className="flex h-7 items-center justify-between gap-3"><h2 className="text-xl font-medium">{plan.name}</h2>{recommendation?.id === plan.id && <span className="rounded-full bg-primary px-2 py-1 text-[10px] text-primary-foreground">Recommended</span>}</div>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
      <div className="mt-6"><motion.strong key={amount(plan)} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_SWAP} className="inline-block text-5xl font-normal leading-[1.24] tracking-tight">{money(amount(plan))}</motion.strong><span className="ml-1 text-base text-muted-foreground">/ editor / mo</span></div>
      <p className="mt-2 text-sm text-muted-foreground">{money(amount(plan) * size * (cycle === "annual" ? 12 : 1))} billed {cycle === "annual" ? "yearly" : "monthly"}</p>
      <div className="mt-6"><div className="flex justify-between gap-2 text-xs text-muted-foreground"><span>Team fit</span><span>{size > plan.maxEditors ? `Up to ${plan.maxEditors} editors` : `${size} of ${plan.maxEditors} editors`}</span></div><div role="progressbar" aria-label={`${plan.name} team fit`} aria-valuenow={Math.min(size, plan.maxEditors)} aria-valuemax={plan.maxEditors} aria-valuemin={0} className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full origin-left rounded-full", size > plan.maxEditors ? "bg-foreground/25" : "bg-foreground")} style={{ width: `${Math.min(100, size / plan.maxEditors * 100)}%` }} /></div></div>
      <button type="button" disabled={pending !== null} onClick={() => void choose(plan)} className={cn("mt-6 h-9 w-full cursor-pointer rounded-full border border-border px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", highlighted === plan.id ? "bg-primary text-primary-foreground" : "bg-background text-foreground")}>{pending === plan.id ? "Opening checkout…" : plan.ctaLabel ?? "Start free trial"}</button></div>
      <ul className="space-y-3 px-5 pb-4 pt-5 text-sm leading-6 sm:px-6">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-3"><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
    </article>)}</div>
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}{message && <p role="status" className="mt-5 text-sm">{message}</p>}
    <section id={`${id}-comparison`} className="mt-24"><h2 className="text-4xl font-medium tracking-tight">Compare every plan</h2><p className="mt-3 max-w-lg leading-7 text-muted-foreground">The highlighted column follows your team size, or whichever plan you are looking at.</p>
      <div className="mt-10 hidden md:block"><table className="w-full text-left text-sm"><caption className="sr-only">Plan comparison</caption><thead><tr><th scope="col" className="px-1 py-6">Feature</th>{plans.map((plan) => <th scope="col" key={plan.id} className={cn("px-5 py-6", highlighted === plan.id && "bg-primary/10")}><button className="cursor-pointer text-left" aria-pressed={highlighted === plan.id} type="button" onClick={() => setFocus(plan.id)}>{plan.name}<span className="mt-2 block text-xs font-normal text-muted-foreground">from {money(amount(plan))} / editor</span></button></th>)}</tr></thead><tbody>{comparison.map((row, index) => <Fragment key={row.label}>{row.group && comparison[index - 1]?.group !== row.group && <tr><th colSpan={plans.length + 1} className="px-1 pb-2 pt-6 font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground">{row.group}</th></tr>}<tr className="border-t border-border"><th scope="row" className="px-1 py-4 font-normal">{row.label}</th>{plans.map((plan) => <td key={plan.id} className={cn("px-5 py-4", highlighted === plan.id && "bg-primary/10")}>{row.values[plan.id] === true ? "Included" : row.values[plan.id] === false ? "Not included" : row.values[plan.id] ?? "Not specified"}</td>)}</tr></Fragment>)}</tbody></table></div>
      <div className="mt-8 md:hidden"><fieldset aria-label="Compare plan" className="flex gap-1 rounded-full bg-muted/30 p-1">{plans.map((plan) => <button key={plan.id} type="button" aria-pressed={highlighted === plan.id} onClick={() => setFocus(plan.id)} className={cn("min-w-0 flex-1 rounded-full px-3 py-2 text-sm", highlighted === plan.id && "bg-background shadow-sm")}>{plan.name}</button>)}</fieldset><dl className="">{comparison.map((row, index) => <Fragment key={row.label}>{row.group && comparison[index - 1]?.group !== row.group && <div className="pb-2 pt-6 font-mono text-xs uppercase leading-6 tracking-widest text-muted-foreground">{row.group}</div>}<div className="flex items-center justify-between gap-4 border-t border-border min-h-12 py-3 text-sm"><dt>{row.label}</dt><dd>{row.values[highlighted ?? ""] === true ? "Included" : row.values[highlighted ?? ""] === false ? "Not included" : row.values[highlighted ?? ""] ?? "Not specified"}</dd></div></Fragment>)}</dl></div>
    </section>
    <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-x-16"><div><h2 className="text-4xl font-medium tracking-tight">Billing questions</h2><p className="mt-3 leading-7 text-muted-foreground">Straight answers on seats, trials, and switching plans.</p></div><div className="border-t border-border">{faq.map((item, index) => <div key={item.question} className="border-b border-border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-foreground">
      <motion.button type="button" whileHover={reduce || !canHover ? undefined : { scale: 1.01 }} whileTap={reduce ? undefined : { scale: 0.99 }} transition={SPRING_PRESS} id={`${id}-faq-trigger-${index}`} aria-expanded={expandedFaq === index} aria-controls={`${id}-faq-content-${index}`} onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="group flex min-h-16 w-full cursor-pointer items-start gap-4 py-5 text-left outline-none"><span className="min-w-0 flex-1 text-xl font-medium leading-7">{item.question}</span><span aria-hidden="true" className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-foreground/10 group-hover:text-foreground">{expandedFaq === index ? <Minus className="size-4" /> : <Plus className="size-4" />}</span></motion.button>
      <section id={`${id}-faq-content-${index}`} aria-labelledby={`${id}-faq-trigger-${index}`} aria-hidden={expandedFaq !== index} inert={expandedFaq !== index} className={cn("grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none", expandedFaq === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="min-h-0 overflow-hidden"><p className={cn("pb-6 text-pretty text-sm leading-6 text-muted-foreground transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none", expandedFaq === index ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0")}>{item.answer}</p></div></section>
    </div>)}</div></section>
    {onContactSales && <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border p-6 sm:flex-row sm:items-center sm:p-10"><div><h2 className="max-w-lg text-balance text-xl font-medium">Bringing more than {maxEditors} people?</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Contact the team to discuss volume pricing, invoicing, and your rollout.</p></div><div className="flex shrink-0 flex-wrap gap-2">{salesDocumentation && <a href={salesDocumentation.href} className="flex h-9 items-center rounded-full border border-border px-5 text-sm">{salesDocumentation.label}</a>}<button type="button" disabled={pending !== null} className="h-9 cursor-pointer rounded-full bg-primary px-5 text-sm text-primary-foreground disabled:opacity-50" onClick={async () => { if (lock.current) return; lock.current = true; setPending("sales"); setError(""); try { await onContactSales(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to contact sales."); } finally { lock.current = false; setPending(null); } }}>{pending === "sales" ? "Opening…" : "Talk to sales →"}</button></div></section>}
  </div></section>;
}
