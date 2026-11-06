"use client";

import { type ReactNode, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CircleHelp, EllipsisVertical } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { Button } from "@/components/motion/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/motion/popover";
import { Sparkline } from "@/components/charts/sparkline";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  /** Host-computed signed comparison; null means there is no baseline. */
  change?: number | null;
  favorable?: "up" | "down";
  history?: readonly (number | null)[];
  historyLabels?: readonly string[];
  note?: string;
  help?: string;
  limit?: number;
  icon?: ReactNode;
  actions?: readonly { label: string; onSelect: () => void | Promise<void> }[];
  format?: { style?: "decimal" | "currency" | "percent"; decimals?: number; currency?: string };
  changeUnit?: "%" | "pp";
  color?: string;
}
export interface KpiOverviewProps {
  metrics: readonly KpiMetric[];
  title?: string;
  period?: string;
  className?: string;
}
const card = "min-w-0 rounded-2xl border border-border bg-background p-5 text-foreground";
function formatValue(metric: KpiMetric, value: number) {
  const decimals = metric.format?.decimals;
  const number = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals ?? 2 });
  if (metric.format?.style === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: metric.format.currency ?? "USD", minimumFractionDigits: decimals ?? 0, maximumFractionDigits: decimals ?? 0 }).format(value);
  return metric.format?.style === "percent" ? `${number}%` : number;
}
function MetricValue({ metric, className, splitFraction = false }: { metric: KpiMetric; className?: string; splitFraction?: boolean }) {
  const fractionDigits = metric.format?.decimals ?? 0;
  const separateFraction = splitFraction && metric.format?.style === "currency" && fractionDigits > 0;
  return <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 text-4xl font-medium tracking-tight", className)}><span className="inline-flex items-baseline"><AnimatedNumber value={metric.value} startOnView={false} format={(value) => separateFraction ? formatValue(metric, value).slice(0, -fractionDigits - 1) : formatValue(metric, value)} />{separateFraction && <span className="text-muted-foreground"><AnimatedNumber value={metric.value} startOnView={false} format={(value) => formatValue(metric, value).slice(-fractionDigits - 1)} /></span>}</span>{metric.unit && <span className="text-sm font-normal tracking-normal text-muted-foreground">{metric.unit}</span>}</span>;
}
function MetricChange({ metric, period, decimals = 2 }: { metric: KpiMetric; period?: string; decimals?: number }) {
  const change = metric.change;
  const available = change !== undefined && change !== null;
  const favorable = available && ((change >= 0) === (metric.favorable !== "down"));
  return <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground"><span className={cn(favorable ? "text-emerald-600 dark:text-emerald-400" : available ? "text-red-500" : "")}>{available ? `${change > 0 ? "+" : ""}${change.toFixed(decimals)}${metric.changeUnit === "pp" ? "pp" : "%"}` : "No comparison"}</span>{period && <span>{period}</span>}</p>;
}
function MetricActions({ metric, helpOnly = false, align = helpOnly ? "center" : "end" }: { metric: KpiMetric; helpOnly?: boolean; align?: "start" | "center" | "end" }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  if (!metric.actions?.length && !metric.help) return null;
  if (!helpOnly && metric.actions?.length) return <div className="relative shrink-0"><AnimatedDropdown ariaLabel={`Options for ${metric.label}`} trigger={<EllipsisVertical className="size-4" />} align="end" shadow={false} menuWidth={176} triggerClassName="[&>svg:last-child]:hidden -mr-2 size-9 rounded-full border-0 bg-transparent p-0 text-muted-foreground" itemClassName="px-2.5 py-2.5 [&>span.shrink-0]:hidden" items={metric.actions.map(action => ({ id: action.label, label: action.label, textValue: action.label, disabled: pending, onSelect: () => { setPending(true); setMessage(""); setActionError(""); void Promise.resolve().then(() => action.onSelect()).then(() => setMessage(`${action.label} completed`), error => setActionError(error instanceof Error ? error.message : "Action failed")).finally(() => setPending(false)); } }))} /><p role="status" className="sr-only">{message}</p>{metric.help && <p className="sr-only">{metric.help}</p>}{actionError && <p role="alert" className="absolute right-0 top-full z-10 w-56 rounded-xl border border-border bg-background p-3 text-xs text-destructive shadow-lg">{actionError}</p>}</div>;
  return <Popover align={align}><PopoverTrigger><Button variant="ghost" size="sm" aria-label={`Options for ${metric.label}`} className="size-8 shrink-0 p-0 text-muted-foreground">{helpOnly ? <CircleHelp className="size-3.5" /> : <EllipsisVertical className="size-4" />}</Button></PopoverTrigger><PopoverContent className="w-56 space-y-2 p-3 text-xs">{metric.help && <p>{metric.help}</p>}{metric.actions?.map((action) => <Button key={action.label} size="sm" variant="ghost" disabled={pending} onClick={async () => { setPending(true); setMessage(""); try { await action.onSelect(); setMessage(`${action.label} completed`); } catch (error) { setMessage(error instanceof Error ? error.message : "Action failed"); } finally { setPending(false); } }}>{action.label}</Button>)}<p role="status">{message}</p></PopoverContent></Popover>;
}
function MetricIcon({ metric }: { metric: KpiMetric }) {
  return <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground [&>svg]:size-4">{metric.icon ?? <ArrowUpRight />}</span>;
}

/** One wide, side-by-side area trend and two independent supporting cards. */
export function TrendKpiCards({ metrics, title = "Performance at a glance", className }: KpiOverviewProps) {
  return <section aria-label={title} className={cn("@container/metrics w-full min-w-0", className)}><div className="grid grid-cols-1 gap-4 @2xl/metrics:grid-cols-2 @5xl/metrics:grid-cols-4">{!metrics.length && <p>No metrics available.</p>}{metrics.map((metric, index) => <article key={metric.id} className={cn("@container/featured min-w-0 rounded-3xl border border-border bg-background p-6", index === 0 && "@2xl/metrics:col-span-2")}><div className={cn("w-full", index === 0 && "grid items-center gap-9 @md/featured:gap-6 @md/featured:grid-cols-2")}><div className="flex min-w-0 flex-col items-start"><div className="mb-6 flex w-full items-center justify-between"><span className="[&>span]:size-11 [&>span]:text-foreground [&_svg]:size-5"><MetricIcon metric={metric} /></span><MetricActions metric={metric} /></div><h3 className="mb-2 text-xl font-medium">{metric.label}</h3><MetricValue metric={metric} className="text-3xl" splitFraction /><p className="mt-5 text-sm text-muted-foreground">{metric.note}</p></div>{index === 0 && <div><Sparkline className="relative block [&>span]:absolute [&>span]:right-0 [&>span]:top-0 [&>span]:rounded-md [&>span]:bg-background [&>span]:p-2 [&>span[aria-hidden=true]]:hidden [&_stop:first-child]:[stop-opacity:.08] [&_circle[stroke-width='0']]:hidden [&_svg]:bg-[repeating-linear-gradient(to_top,transparent_0px,transparent_76px,var(--border)_77px,transparent_78px)]" data={metric.history ?? []} labels={metric.historyLabels} color={metric.color ?? "#008bea"} label={`${metric.label} history`} variant="area" curve="monotone" height={168} interactive formatValue={(value)=>formatValue(metric,value)} /><div aria-hidden="true" className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{metric.historyLabels?.[0]}</span><span>{metric.historyLabels?.[Math.floor(((metric.historyLabels?.length ?? 1)-1)/2)]}</span><span>{metric.historyLabels?.at(-1)}</span></div></div>}</div></article>)}</div></section>;
}

/** Compact histories stay beside values rather than becoming full chart panels. */
export function CompactKpiCards({ metrics, title = "Key metrics", period, className }: KpiOverviewProps) {
  return <section aria-label={title} className={cn("@container w-full min-w-0", className)}><div className="grid gap-3 @lg:grid-cols-2 @5xl:grid-cols-4">{!metrics.length && <p>No metrics available.</p>}{metrics.map((metric) => <article key={metric.id} className="min-w-0 rounded-2xl border border-border/60 bg-muted p-1"><div className="rounded-xl border border-border bg-background px-4 py-3"><h3 className="truncate font-mono text-xl font-medium uppercase tracking-tight text-muted-foreground" title={metric.label}>{metric.label}</h3><div className="mt-2 flex min-h-12 items-center justify-between gap-3"><MetricValue metric={metric} className={cn("font-mono text-3xl", metric.unit && "[&>span:last-child]:text-xs")} /><div aria-label={`${metric.label} history`} className="flex h-12 shrink-0 items-end gap-2" role="img">{metric.history?.map((value, index) => <span key={metric.historyLabels?.[index] ?? index} className={cn("w-0.5", index === Math.max(0, (metric.history?.length ?? 0) - 3) ? "bg-foreground" : "bg-foreground/15")} style={{ height: `${value === null ? 0 : Math.max(4, Math.abs(value) / Math.max(1, ...(metric.history ?? []).map((item) => Math.abs(item ?? 0))) * 100)}%` }} />)}</div></div></div><div className="flex min-h-10 items-center justify-between gap-2 px-2"><MetricActions metric={metric} helpOnly align="start" /><div className="ml-auto"><MetricChange metric={metric} period={period} /></div></div></article>)}</div></section>;
}

/** Small right-aligned gauges use host limits, including honest overage text. */
export function GaugeKpiCards({ metrics, title = "Capacity", className }: KpiOverviewProps) {
  const reduce = useReducedMotion();
  return <section aria-label={title} className={cn("@container w-full min-w-0", className)}><div className="grid gap-4 @lg:grid-cols-2 @5xl:grid-cols-3">{!metrics.length && <p>No metrics available.</p>}{metrics.map((metric) => { const ratio = metric.limit && metric.limit > 0 ? metric.value / metric.limit : null; return <article key={metric.id} className={card}><div className="flex min-h-9 items-center justify-between gap-3"><h3 className="text-xl font-medium">{metric.label}</h3><MetricActions metric={metric} /></div><div className="mt-4 flex items-end justify-between gap-4"><div><MetricValue metric={metric} className={cn("flex items-center", metric.unit && "leading-[1.1] [&>span:last-child]:text-base")} /><p className="mt-2 text-sm text-muted-foreground">{metric.note}</p></div><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" role="img" aria-label={ratio === null ? "No positive limit" : `${(ratio * 100).toFixed(1)}% of limit`}><circle cx="32" cy="32" r="24" fill={`color-mix(in srgb, ${metric.color ?? "var(--primary)"} 6%, transparent)`} /><circle cx="32" cy="32" r="29" fill="none" stroke={`color-mix(in srgb, ${metric.color ?? "var(--primary)"} 15%, transparent)`} strokeWidth="2" /><motion.circle cx="32" cy="32" r="29" fill="none" stroke={metric.color ?? "var(--primary)"} strokeWidth="2" strokeLinecap="round" pathLength={1} initial={false} animate={{ pathLength: Math.max(0, Math.min(1, ratio ?? 0)) }} transition={{ duration: reduce ? 0 : .3, ease: EASE_OUT }} /></svg><span className="text-sm font-medium tabular-nums">{ratio === null ? "—" : `${Math.round(ratio * 100)}%`}</span></div></div></article>; })}</div></section>;
}

export function ConnectedSupportKpiCards({ metrics, title = "Support health", period, className }: KpiOverviewProps) {
  return <section aria-label={title} className={cn("@container w-full min-w-0", className)}><div className="overflow-x-auto rounded-2xl border border-border"><div className="flex flex-col gap-px bg-border @lg:w-max @lg:min-w-full @lg:flex-row">{!metrics.length && <p className="p-5">No metrics available.</p>}{metrics.map((metric) => <article key={metric.id} className="flex min-w-0 flex-col justify-between gap-8 bg-background p-4 @lg:min-w-80 @lg:flex-1 @lg:p-5"><div className="flex items-center gap-2"><MetricIcon metric={metric} /><h3 className="flex-1 font-mono text-xl uppercase tracking-tight text-muted-foreground">{metric.label}</h3><MetricActions metric={metric} /></div><div><MetricValue metric={metric} className="text-3xl" /><div className="mt-3"><MetricChange metric={metric} period={period} decimals={1} /></div></div></article>)}</div></div></section>;
}

export function SummaryKpiCard({ metrics, title = "Account overview", period, className }: KpiOverviewProps) {
  return <section aria-label={title} className={cn("@container w-full rounded-2xl border border-border bg-background p-5 text-foreground sm:p-6", className)}><header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"><div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground"><BriefcaseBusiness className="size-4" /></span><h2 className="text-xl font-medium">{title}</h2></div><span className="text-xs text-muted-foreground">{period}</span></header><div className="mt-5 grid gap-5 @2xl:grid-cols-4">{!metrics.length && <p>No metrics available.</p>}{metrics.map((metric, index) => <article key={metric.id} className={cn("min-w-0 border-t border-border pt-5 first:border-0 first:pt-0 @2xl:border-t-0 @2xl:border-l @2xl:pl-5 @2xl:pt-0", index === 0 && "@2xl:col-span-2 @2xl:border-l-0 @2xl:pl-0")}><div className="flex min-h-9 items-center gap-1"><h3 className="text-sm text-muted-foreground">{metric.label}</h3><MetricActions metric={metric} helpOnly /></div><div className="mt-1 flex min-h-7 flex-wrap items-center gap-2"><MetricValue metric={metric} className="text-xl" />{metric.limit !== undefined && <span className="text-sm text-muted-foreground">/ {formatValue(metric, metric.limit)}</span>}</div></article>)}</div></section>;
}

export function HeaderKpiCards({ metrics, title = "Workspace metrics", period, className }: KpiOverviewProps) {
  return <section aria-label={title} className={cn("@container w-full min-w-0", className)}><div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @4xl:grid-cols-4">{!metrics.length && <p>No metrics available.</p>}{metrics.map((metric) => <article key={metric.id} className="flex min-w-0 flex-col rounded-3xl border border-border bg-muted p-1.5"><header className="flex items-center gap-3 px-4 py-3 text-muted-foreground"><MetricIcon metric={metric} /><h3 className="flex-1 font-mono text-xl uppercase tracking-tight">{metric.label}</h3><MetricActions metric={metric} /></header><div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl bg-background p-4"><MetricValue metric={metric} className="text-3xl" /><MetricChange metric={metric} period={period} decimals={1} /></div></article>)}</div></section>;
}
