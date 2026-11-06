"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { CommerceChoices, decimal } from "./commerce-ui";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ConversionStage { id: string; label: string; count: number | null; detail: string; }
export interface ConversionPeriod { id: string; stages: readonly ConversionStage[]; }
const stageColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa"];
const validCount = (count: number | null | undefined): count is number => count != null && Number.isFinite(count) && count >= 0;

/** Missing counts remain unknown. Periods and inspected stages retain the host's controlled contract. */
export function ConversionFunnel({ periods, period, defaultPeriod, onPeriodChange, stage, onStageChange, className }: { periods: readonly ConversionPeriod[]; period?: string; defaultPeriod?: string; onPeriodChange?: (id: string) => void; stage?: string; onStageChange?: (id: string) => void; className?: string }) {
  const reduce = useReducedMotion();
  const [internalPeriod, setPeriod] = useState(defaultPeriod ?? periods[0]?.id);
  const [internalStage, setStage] = useState("");
  const current = periods.find(p => p.id === (period ?? internalPeriod)) ?? periods[0];
  const selected = current?.stages.find(s => s.id === (stage ?? internalStage)) ?? current?.stages.at(-1);
  const first = current?.stages[0]?.count;
  const last = current?.stages.at(-1)?.count;
  const index = current?.stages.findIndex(s => s.id === selected?.id) ?? -1;
  const previous = current?.stages[index - 1]?.count;
  const conversion = validCount(first) && first > 0 && validCount(last) ? last / first * 100 : null;
  const dropoff = selected && validCount(selected.count) && validCount(previous) && previous > 0 ? (1 - selected.count / previous) * 100 : null;
  const inspect = (id: string) => { if (stage === undefined) setStage(id); onStageChange?.(id); };
  return <section aria-label="Conversion funnel" className={cn("w-full max-w-2xl rounded-3xl border border-border bg-background p-5 text-foreground sm:p-6", className)}>
    <header className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium">Conversion funnel</h2><CommerceChoices label="Funnel period" options={periods.map(p => p.id)} value={current?.id ?? ""} onChange={id => { if (period === undefined) setPeriod(id); onPeriodChange?.(id); }} /></header>
    {!current ? <p className="py-12 text-sm text-muted-foreground">No periods available.</p> : <>
      <div className="my-6"><p className="text-sm text-muted-foreground">Visitor to customer</p><div className="mt-1 flex items-end justify-between gap-3"><strong className="flex items-center text-4xl font-medium tabular-nums">{conversion === null ? "—" : <NumberTicker value={conversion} decimals={1} format={n => n.toFixed(1)} suffix="%" startOnView={false} />}</strong><span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowUpRight className="size-3.5" />{validCount(last) ? decimal(last, 0) : "Unknown"} conversions</span></div></div>
      {current.stages.every(s => validCount(s.count)) ? <div className="relative h-56 w-full sm:h-64"><svg viewBox="0 0 622 256" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full">{current.stages.map((s, i) => {
        const width = 606 / current.stages.length; const x = 10 + width * i;
        const ratio = first && validCount(s.count) ? Math.min(1, s.count / first) : 0;
        const next = current.stages[i + 1]; const nextRatio = next && first && validCount(next.count) ? Math.min(1, next.count / first) : ratio;
        const height = 24 + 194.56 * ratio; const nextHeight = 24 + 194.56 * nextRatio;
        return [0, 6, 12].map((inset, layer) => {
          const top = 128 - height / 2 + inset; const endTop = 128 - nextHeight / 2 + inset;
          const end = x + width - 3.5; const shoulder = x + width * .41;
          const path = `M${x},${top} H${shoulder} C${x + width * .72},${top} ${x + width * .72},${endTop} ${end},${endTop} V${256 - endTop} C${x + width * .72},${256 - endTop} ${x + width * .72},${256 - top} ${shoulder},${256 - top} H${x} Z`;
          return <motion.path key={`${s.id}-${inset}`} fill={stageColors[Math.min(i, stageColors.length - 1)]} opacity={layer === 2 ? 1 : layer === 1 ? .24 : .1} initial={false} animate={{ d: path }} transition={{ duration: reduce ? 0 : .28, ease: EASE_OUT }} />;
        });
      })}</svg><div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${current.stages.length},minmax(0,1fr))` }}>{current.stages.map(s => <button key={s.id} type="button" onClick={() => inspect(s.id)} onFocus={() => inspect(s.id)} aria-label={`${s.label}: ${decimal(s.count ?? 0, 0)}`} className="flex items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium tabular-nums">{first ? Math.round((s.count ?? 0) / first * 100) : 0}%</span></button>)}</div></div> : <p className="flex h-56 items-center justify-center rounded-2xl bg-muted p-5 text-sm text-muted-foreground">Some stage counts are unknown. Awaiting complete period data.</p>}
      <fieldset aria-label="Inspect stage" className="m-0 mt-3 flex min-w-0 flex-wrap gap-1.5 border-0 p-0">{current.stages.map((s, i) => <button key={s.id} type="button" aria-pressed={selected?.id === s.id} onClick={() => inspect(s.id)} className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring", selected?.id === s.id ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground")}><span className="size-2 rounded-full" style={{ background: stageColors[Math.min(i, stageColors.length - 1)] }} />{s.label}</button>)}</fieldset>
      {selected && <section aria-label="Stage details" className="mt-5 border-t border-border pt-5 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-medium">{selected.label}<span className="ml-2 font-normal text-muted-foreground">{validCount(selected.count) ? decimal(selected.count, 0) : "Unknown"}</span></h3><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowDown className="size-3.5" />{dropoff === null ? "—" : `${dropoff.toFixed(1)}%`} drop-off</span></div><p className="mt-2 text-xs text-muted-foreground">{selected.detail}</p></section>}
    </>}
  </section>;
}
