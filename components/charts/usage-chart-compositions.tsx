"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BarChart, useBarChart, type BarChartSeries } from "@/components/charts/bar-chart";
import { CompositionChart, useCompositionChart } from "@/components/charts/composition-chart";
import { Tooltip } from "@/components/motion/tooltip";
import { SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface StackedUsageChartProps { series: BarChartSeries[]; periods: string[]; unit: string; max: number; target?: number; projectedPeriods?: string[]; className?: string }
export function StackedUsageChart({ series, periods, unit, max, target, projectedPeriods = [], className }: StackedUsageChartProps) {
  return <BarChart series={series} categories={periods} layout="stacked" max={max} formatValue={value=>`${value.toLocaleString()} ${unit}`} label={`Usage by period (${unit})`} className={className}><CompactStackedPlot max={max} target={target} unit={unit} projectedPeriods={projectedPeriods} /></BarChart>;
}
function CompactStackedPlot({ max, target, unit, projectedPeriods }: {max:number;target?:number;unit:string;projectedPeriods:string[]}) {
  const {categories,rows,visibleRows,totals,hidden,toggle,reduce,canHover,activeId,setActive} = useBarChart();
  return <figure className="m-0 w-full pt-6"><div className="relative h-56">
    {target !== undefined && target >= 0 && target <= max && <div aria-hidden className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-foreground/30" style={{bottom:`${target/max*100}%`}}><span className="absolute -top-6 right-0 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">Target {target>=1000?`${target/1000}k`:target}</span></div>}
    <div className="flex h-full items-end gap-1">{categories.map((period,index)=>{
      const projected=projectedPeriods.includes(period);
      const total = projected ? rows.reduce((sum,row)=>sum+(row.values[index]??0),0) : totals[index];
      return <Tooltip key={period} content={<div className="space-y-1"><p className="font-medium">{period}{projected?" · projected":""}</p>{!projected && visibleRows.map(row=><p key={row.id}>{row.name}: {(row.values[index]??0).toLocaleString()} {unit}</p>)}<p>Total: {total.toLocaleString()} {unit}</p></div>}>
        <button type="button" aria-label={`${period}${projected?", projected":""}: ${total.toLocaleString()} ${unit}`} aria-pressed={activeId===period} onPointerEnter={()=>{if(canHover)setActive(period);}} onPointerLeave={()=>setActive(null)} onFocus={()=>setActive(period)} onBlur={()=>setActive(null)} onClick={()=>setActive(activeId===period?null:period)} onKeyDown={event=>{
          if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
          event.preventDefault();
          const siblings=Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")??[]);
          siblings[Math.max(0,Math.min(siblings.length-1,index+(event.key==="ArrowRight"?1:-1)))]?.focus();
        }} className="relative flex h-full min-w-0 flex-1 items-end rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {projected ? <motion.span aria-hidden initial={reduce?false:{scaleY:0}} animate={{scaleY:1}} transition={reduce?{duration:0}:SPRING_LAYOUT} className="w-full origin-bottom rounded-md border border-dashed border-foreground/25" style={{height:`${total/max*100}%`}} /> : <motion.span aria-hidden initial={reduce?false:{scaleY:0}} animate={{scaleY:1,height:`${total/max*100}%`}} transition={reduce?{duration:0}:SPRING_LAYOUT} className="relative flex w-full origin-bottom flex-col-reverse overflow-hidden rounded-md">{visibleRows.map(row=><span key={row.id} className="block min-h-0 w-full" style={{flexGrow:Math.max(0,row.values[index]??0),flexBasis:0,backgroundColor:row.color}} />)}</motion.span>}
          {activeId===period&&<span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-foreground/15" />}
        </button>
      </Tooltip>;
    })}</div>
  </div><div className="relative mt-3 h-4 font-mono text-xs text-muted-foreground"><span className="absolute left-0">{categories[0]}</span><span className="absolute -translate-x-1/2 text-foreground" style={{left:`${(categories.reduce((last,period,index)=>projectedPeriods.includes(period)?last:index,0)+.5)/Math.max(1,categories.length)*100}%`}}>Today</span><span className="absolute right-0">{categories.at(-1)}</span></div><div className="mt-6 flex flex-wrap gap-2">{rows.map(row=><button type="button" key={row.id} aria-pressed={!hidden.includes(row.id)} onClick={()=>toggle(row.id)} className="flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs transition-opacity aria-[pressed=false]:opacity-40"><span aria-hidden className="size-2 rounded-full" style={{backgroundColor:row.color}} />{row.name}</button>)}</div></figure>;
}

export interface CapacitySegment { id: string; name: string; value: number; color: string }
export interface SegmentedCapacityMeterProps { segments: CapacitySegment[]; capacity: number; unit: string; selectedId?: string | null; defaultSelectedId?: string | null; onSelectedChange?: (id: string | null) => void; className?: string }
export function SegmentedCapacityMeter({ segments, capacity, unit, selectedId, defaultSelectedId = null, onSelectedChange, className }: SegmentedCapacityMeterProps) {
  const [internal, setInternal] = useState(defaultSelectedId);
  const selected = selectedId === undefined ? internal : selectedId;
  const valid = segments.filter(segment => Number.isFinite(segment.value) && segment.value >= 0);
  const total = valid.reduce((sum, segment) => sum + segment.value, 0);
  const free = Math.max(0, capacity - total);
  const series = [...valid.map(segment => ({ ...segment, values: [segment.value] })), ...(free ? [{ id: "__capacity_free", name: "Available", values: [free], color: "var(--muted)" }] : [])];
  return <CompositionChart periods={["Capacity"]} series={series} label={`Capacity (${unit})`} className={className}>
    <div className="flex items-baseline justify-between gap-3 text-sm"><p className="font-medium">Storage</p><p className="text-muted-foreground tabular-nums">{total.toLocaleString()} of {capacity.toLocaleString()} {unit}{total > capacity ? " · Over capacity" : ""}</p></div>
    <CapacityMeterParts selected={selected} unit={unit} free={free} onSelect={id => { const next = selected === id ? null : id; if (selectedId === undefined) setInternal(next); onSelectedChange?.(next); }} />
  </CompositionChart>;
}
function CapacityMeterParts({ selected, unit, free, onSelect }: { selected: string | null; unit: string; free:number; onSelect: (id: string) => void }) {
  const { column, highlight, setHovered, setFocused } = useCompositionChart();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  if (!column?.valid) return <p className="text-sm text-muted-foreground">No capacity data.</p>;
  return <><fieldset className="relative m-0 mt-16 flex h-2.5 min-w-0 gap-1 border-0 p-0" aria-label="Capacity segments">{column.segments.map(segment => segment.id === "__capacity_free" ? <span key={segment.id} role="img" aria-label={`${free} ${unit} free`} className="h-full rounded-full bg-muted" style={{width:`${segment.share}%`}} /> : <motion.button key={segment.id} type="button" aria-label={`${segment.name}: ${segment.value} ${unit}`} aria-pressed={selected === segment.id} onClick={() => onSelect(segment.id)} onPointerEnter={() => { if (hover) setHovered(segment.id); }} onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(segment.id)} onBlur={() => setFocused(null)} initial={false} animate={{ opacity: (highlight ?? selected) && (highlight ?? selected) !== segment.id ? 0.4 : 1 }} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="h-full min-w-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" style={{width:`${segment.share}%`,backgroundColor:segment.color}} />)}</fieldset>
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">{column.segments.filter(segment=>segment.id!=="__capacity_free").map(segment=><button key={segment.id} type="button" aria-pressed={selected===segment.id} onClick={()=>onSelect(segment.id)} onPointerEnter={()=>{if(hover)setHovered(segment.id);}} onPointerLeave={()=>setHovered(null)} onFocus={()=>setFocused(segment.id)} onBlur={()=>setFocused(null)} className="flex h-6 items-center gap-2 rounded-full px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><span aria-hidden className="size-2 rounded-full" style={{backgroundColor:segment.color}} /><span className="text-muted-foreground">{segment.name}</span><span className="font-mono text-xs">{segment.value} {unit}</span></button>)}<span className="ml-auto text-xs text-muted-foreground">{free.toLocaleString()} {unit} free</span></div>
    <p role="status" className="mt-6 text-sm text-muted-foreground">{selected ? `Selected: ${column.segments.find(segment => segment.id === selected)?.name ?? "None"}` : "Select a segment to filter"}</p></>;
}
export interface TrendMetricProps { title: string; values: (number | null)[]; labels: string[]; unit: string; color?: string; /** Period-over-period change, when it differs from the plotted sample window. */ change?: number; className?: string }
export function TrendMetric({ title, values, labels, unit, color = "var(--primary)", change, className }: TrendMetricProps) {
  const present = values.filter((value): value is number => value !== null && Number.isFinite(value));
  const current = present.at(-1);
  const delta = change ?? (present.length > 1 && present[0] !== 0 ? Math.round(((current ?? 0) - present[0]) / Math.abs(present[0]) * 100) : null);
  const low = present.length ? Math.min(...present) : 0;
  const high = present.length ? Math.max(...present) : 0;
  const stroke = 1.75;
  let connected = false;
  const path = values.map((value, index) => {
    if (value === null || !Number.isFinite(value)) { connected = false; return ""; }
    const x = values.length > 1 ? index / (values.length - 1) * 96 : 48;
    const y = high === low ? 16 : stroke + (high - value) / (high - low) * (32 - stroke * 2);
    const point = `${connected ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    connected = true;
    return point;
  }).join(" ");
  const changeLabel = delta === null ? "—" : `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${Math.abs(delta)}%`;
  return <section aria-label={title} className={cn("flex items-center gap-4 py-4", className)}><div className="min-w-0 flex-1"><h3 className="text-sm text-muted-foreground">{title}</h3><p className="mt-0.5 text-xl font-medium tabular-nums">{current?.toLocaleString() ?? "—"}{unit ? ` ${unit}` : ""}</p></div><svg role="img" aria-label={`${title} trend, ${changeLabel}`} viewBox="0 0 96 32" className="h-8 w-24 shrink-0 overflow-visible"><path d={path} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /></svg><span className="w-12 text-right font-mono text-xs text-muted-foreground">{changeLabel}</span><table className="sr-only"><caption>{title}</caption><tbody>{values.map((value, index) => <tr key={labels[index] ?? index}><th scope="row">{labels[index] ?? `Sample ${index + 1}`}</th><td>{value === null ? "No data" : `${value} ${unit}`}</td></tr>)}</tbody></table></section>;
}
