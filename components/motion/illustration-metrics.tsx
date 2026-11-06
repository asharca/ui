"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { TrendingUp } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Sparkline } from "@/components/charts/sparkline";
import { useElementWidth } from "@/components/charts/xy/use-width";
import { buildFunnel, type FunnelStage } from "@/components/charts/funnel-chart/model";
import { cn } from "@/lib/utils";
import { NumberTicker } from "./number-ticker";
import { IllustrationPlaybackControl, useIllustrationSequence } from "./illustration-product-scene";

const canvas = "@container relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground";
export interface MetricRange { id: string; label: string; values: readonly (number | null)[]; labels?: readonly string[]; axisLabels?: readonly string[]; total?: string | number; change?: string }
export interface TrendMetricsSceneProps { title: string; ranges: readonly MetricRange[]; rangeId?: string; defaultRangeId?: string; onRangeChange?: (id: string) => void; formatValue?: (value: number) => string; className?: string; presentationPlaying?: boolean }
/** Range changes and accessible scrubbing use supplied samples only. */
export function TrendMetricsScene({ title, ranges, rangeId, defaultRangeId, onRangeChange, formatValue = value => value.toLocaleString("en-US"), className, presentationPlaying = false }: TrendMetricsSceneProps) {
  const [internal, setInternal] = useState(defaultRangeId ?? ranges[0]?.id);
  const [inspection, setInspection] = useState<{ rangeId: string; index: number | null } | null>(null);
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const reduce = useReducedMotion();
  const running = presentationPlaying && playing && !interacted && rangeId === undefined && !reduce;
  const checkpoints = useMemo(() => Array.from({ length: Math.max(1, ranges.length) * 12 }, (_, index) => index * (3860 / 12)), [ranges.length]);
  const frame = useIllustrationSequence(running, checkpoints, Math.max(1, ranges.length) * 3860);
  const { ref, width } = useElementWidth<HTMLElement>();
  const range = ranges.find(item => item.id === (rangeId ?? (running ? ranges[Math.floor(frame / 12) % ranges.length]?.id : internal))) ?? ranges[0];
  const last = range?.values.findLast((value): value is number => typeof value === "number" && Number.isFinite(value));
  let defaultInspection: number | null = null;
  let low = Infinity;
  let high = -Infinity;
  const targetInspection = ((range?.values.length ?? 1) - 1) * .72;
  range?.values.forEach((value, index) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return;
    low = Math.min(low, value);
    high = Math.max(high, value);
    if (defaultInspection === null || Math.abs(index - targetInspection) < Math.abs(defaultInspection - targetInspection)) defaultInspection = index;
  });
  const presentedInspection = range?.values.length ? Math.round(((frame % 12) / 11) * (range.values.length - 1)) : null;
  const inspectedIndex = running ? presentedInspection : inspection?.rangeId === range?.id ? inspection?.index ?? null : defaultInspection;
  const inspectedValue = inspectedIndex === null ? null : range?.values[inspectedIndex];
  const inspectedX = inspectedIndex === null ? 0 : (range?.values.length ?? 0) > 1 ? inspectedIndex / (range!.values.length - 1) : .5;
  const inspectedY = typeof inspectedValue === "number" && Number.isFinite(inspectedValue) ? (high === low ? .5 : .125 + .725 * (high - inspectedValue) / (high - low)) : null;
  const plotHeight = Math.max(1, width * .26);
  const axisLabels = useMemo(() => {
    const labels = range?.axisLabels ?? (range?.labels?.length ? [range.labels[0], range.labels[Math.floor((range.labels.length - 1) / 2)], range.labels.at(-1)] : []);
    const occurrences = new Map<string | undefined, number>();
    return labels.map(label => {
      const occurrence = (occurrences.get(label) ?? 0) + 1;
      occurrences.set(label, occurrence);
      return { label, id: `${label ?? ""}:${occurrence}` };
    });
  }, [range]);
  return <section data-trend-frame={running ? frame : undefined} ref={ref} aria-label={title} className={cn(canvas, "group", className)}>
    <div aria-hidden className="absolute inset-0 opacity-65 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:clamp(1.25rem,5cqw,1.75rem)_clamp(1.25rem,5cqw,1.75rem)]" />
    <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[4.4cqw] border border-border bg-background p-[3.4%]">
      <header className="flex items-start justify-between gap-[clamp(.4rem,2cqw,.75rem)]"><div className="min-w-0"><h3 className="text-[clamp(.45rem,2cqw,.75rem)] text-muted-foreground">{title}</h3><div className="mt-[.1em] flex items-center gap-[clamp(.3rem,1.4cqw,.55rem)]"><p aria-live="polite" className="text-[clamp(1.1rem,5.6cqw,2.1rem)] font-semibold tabular-nums tracking-[-.045em]">{typeof range?.total === "number" ? <NumberTicker value={range.total} format={formatValue} startOnView={false} duration={.52} stagger={0} digitClassName="!w-auto" /> : range?.total ?? (last === undefined ? "—" : formatValue(last))}</p>{range?.change && <span className="inline-flex items-center gap-[.3em] whitespace-nowrap rounded-full border border-emerald-500/25 bg-emerald-500/10 px-[.6em] py-[.15em] text-[clamp(.45rem,1.9cqw,.7rem)] font-medium tabular-nums text-emerald-700 dark:text-emerald-300"><TrendingUp aria-hidden className="size-[1.1em]" />{range.change}</span>}</div></div><fieldset aria-label="Metric time range" className="m-0 grid shrink-0 auto-cols-fr grid-flow-col rounded-full border-0 bg-muted p-[clamp(.15rem,.6cqw,.25rem)] text-[clamp(.45rem,1.9cqw,.7rem)]">{ranges.map(item => <button type="button" key={item.id} aria-pressed={item.id === range?.id} onClick={() => { setInteracted(true); if (rangeId === undefined) setInternal(item.id); onRangeChange?.(item.id); }} className={cn("cursor-pointer rounded-full px-[.9em] py-[.3em] text-center font-medium text-muted-foreground", item.id === range?.id && "bg-background text-foreground shadow-[inset_0_0_0_1px_var(--border)]")}>{item.label}</button>)}</fieldset></header>
      <div className="relative mt-[clamp(.75rem,3.4cqw,1.3rem)] h-[26cqw]">
        <svg aria-hidden="true" viewBox="0 0 200 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">{[20, 40, 60].map(y => <line key={y} x1={0} x2={200} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />)}</svg>
        {range ? <Sparkline key={range.id} data={range.values} labels={range.labels} label={`${title} trend`} curve="flat" activeIndex={inspectedIndex} onActiveIndexChange={index => { setInteracted(true); if (rangeId === undefined) setInternal(range.id); setInspection({ rangeId: range.id, index }); }} formatValue={formatValue} height={plotHeight} padding={{ top: plotHeight * .125, bottom: plotHeight * .15, left: 0, right: 0 }} variant="area" interactive color="var(--color-emerald-500)" strokeWidth={2.4} className="relative h-full [&>span]:sr-only [&_circle]:opacity-0 [&_stop:first-child]:[stop-opacity:.24]" /> : <p className="text-xs text-muted-foreground">No ranges supplied.</p>}
        {inspectedY !== null && typeof inspectedValue === "number" && <span aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-foreground/20" style={{ left: `${inspectedX * 100}%` }}><span className="absolute left-0 size-[clamp(.5rem,2.2cqw,.85rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-emerald-500" style={{ top: `${inspectedY * 100}%` }} /><span className={cn("absolute flex -translate-y-[135%] items-center gap-[.4em] whitespace-nowrap rounded-full border border-border bg-background px-[.7em] py-[.25em] text-[clamp(.45rem,1.9cqw,.7rem)]", inspectedX < .25 ? "left-[.6em]" : "right-[.6em]")} style={{ top: `${inspectedY * 100}%` }}><span className="size-[.55em] rounded-full bg-emerald-500" /><span className="font-medium tabular-nums">{formatValue(inspectedValue)}</span></span></span>}
      </div>
      {axisLabels.length ? <div aria-hidden className="mt-[clamp(.35rem,1.6cqw,.6rem)] flex justify-between text-[clamp(.4rem,1.7cqw,.65rem)] text-muted-foreground">{axisLabels.map(({ label, id }) => <span key={id}>{label}</span>)}</div> : null}
    </div>
    {presentationPlaying && rangeId === undefined && <IllustrationPlaybackControl playing={running} onPlayingChange={next => { if (range) { setInternal(range.id); setInspection({ rangeId: range.id, index: inspectedIndex }); } setPlaying(next); if (next) setInteracted(false); }} reduced={reduce} label="revenue presentation" />}
  </section>;
}

export interface ConversionFlowSceneProps { stages: readonly FunnelStage[]; title?: string; unit?: string; selectedStageId?: string; defaultSelectedStageId?: string; onStageChange?: (id: string) => void; className?: string }
const funnelColors = ["#0ea5e9", "#3b82f6", "#14b8a6", "#10b981"];
const funnelWidths = [200, 140, 96, 64, 44];
const funnelParticles = [
  { x: -.7, exit: 1 }, { x: .2, exit: 0 }, { x: .75, exit: 1 }, { x: -.25, exit: 2 },
  { x: .5, exit: 1 }, { x: -.55, exit: 3 }, { x: .05, exit: 2 }, { x: -.85, exit: 1 },
  { x: .6, exit: 3 }, { x: -.1, exit: 0 }, { x: .9, exit: 1 }, { x: -.4, exit: 2 },
  { x: .35, exit: 1 }, { x: -.65, exit: 0 }, { x: .15, exit: 2 }, { x: -.3, exit: 1 },
];
const funnelMotionStyles = `
@keyframes illustration-funnel-exit-1{0%{transform:translate(calc(-50% + var(--x)*16cqw),0);opacity:0}4%{opacity:1}22%{transform:translate(calc(-50% + var(--x)*11.2cqw),11.2cqw);opacity:1}38%,100%{transform:translate(calc(-50% + var(--dir)*19cqw),14.56cqw);opacity:0}}
@keyframes illustration-funnel-exit-2{0%{transform:translate(calc(-50% + var(--x)*16cqw),0);opacity:0}4%{opacity:1}22%{transform:translate(calc(-50% + var(--x)*11.2cqw),11.2cqw)}44%{transform:translate(calc(-50% + var(--x)*7.6cqw),22.4cqw);opacity:1}60%,100%{transform:translate(calc(-50% + var(--dir)*16cqw),25.76cqw);opacity:0}}
@keyframes illustration-funnel-exit-3{0%{transform:translate(calc(-50% + var(--x)*16cqw),0);opacity:0}4%{opacity:1}22%{transform:translate(calc(-50% + var(--x)*11.2cqw),11.2cqw)}44%{transform:translate(calc(-50% + var(--x)*7.6cqw),22.4cqw)}66%{transform:translate(calc(-50% + var(--x)*5.2cqw),33.6cqw);opacity:1}82%,100%{transform:translate(calc(-50% + var(--dir)*13.2cqw),36.96cqw);opacity:0}}
@keyframes illustration-funnel-convert{0%{transform:translate(calc(-50% + var(--x)*16cqw),0);opacity:0;background:var(--foreground)}4%{opacity:1}22%{transform:translate(calc(-50% + var(--x)*11.2cqw),11.2cqw)}44%{transform:translate(calc(-50% + var(--x)*7.6cqw),22.4cqw)}66%{transform:translate(calc(-50% + var(--x)*5.2cqw),33.6cqw);background:var(--foreground)}80%{background:var(--color-emerald-500)}90%{transform:translate(calc(-50% + var(--x)*3.2cqw),43.12cqw);opacity:1;background:var(--color-emerald-500)}100%{transform:translate(calc(-50% + var(--x)*2.4cqw),45.92cqw);opacity:0;background:var(--color-emerald-500)}}
@media(prefers-reduced-motion:reduce){[data-illustration-funnel-particle]{display:none;animation:none!important}}
`;
/** Uses the existing funnel model for counts and conversion; each segment remains inspectable. */
export function ConversionFlowScene({ stages, title = "Conversion funnel", unit = "visitors", selectedStageId, defaultSelectedStageId, onStageChange, className }: ConversionFlowSceneProps) {
  const [internal, setInternal] = useState(defaultSelectedStageId ?? stages[0]?.id);
  const reduce = useReducedMotion();
  const { rows } = buildFunnel(stages);
  const selected = rows.find(stage => stage.id === (selectedStageId ?? internal)) ?? rows[0];
  const first = rows[0]?.value ?? 0;
  const overall = first > 0 ? `${(((rows.at(-1)?.value ?? 0) / first) * 100).toFixed(1)}%` : "—";
  const select = (id: string) => { if (selectedStageId === undefined) setInternal(id); onStageChange?.(id); };
  return <section aria-label={title} className={cn(canvas, className)}>
    <div aria-hidden className="absolute inset-0 opacity-65 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:clamp(1.25rem,5cqw,1.75rem)_clamp(1.25rem,5cqw,1.75rem)]" />
    <div className="absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-[4.4cqw] border border-border bg-background p-[3.4%]">
      <header className="flex items-baseline justify-between gap-2"><h3 className="text-[clamp(.6rem,2.7cqw,1rem)] font-medium tracking-tight">{title}</h3><span className="text-[clamp(.45rem,2cqw,.75rem)] text-muted-foreground">Last 30 days</span></header>
      <div className="mt-[clamp(.6rem,2.8cqw,1.05rem)] flex gap-[4cqw]">
        <div className="relative h-[43.2cqw] w-[40cqw] shrink-0"><svg viewBox={`0 0 200 ${Math.max(1, rows.length) * 56 - 6}`} className="absolute inset-0 size-full overflow-visible" role="img" aria-label={`${title}: ${rows.map(row => `${row.label} ${row.value} ${unit}`).join(", ")}`}>
          {rows.map((row, index) => {
            const width = funnelWidths[index] ?? 44 * .69 ** (index - 4);
            const bottom = funnelWidths[index + 1] ?? width * .69;
            const y = index * 56;
            const color = row.color ?? funnelColors[index % funnelColors.length];
            return <g key={row.id}><path d={`M${100 - width / 2} ${y}h${width}L${100 + bottom / 2} ${y + 50}H${100 - bottom / 2}Z`} fill={color} fillOpacity={.16} stroke={color} strokeOpacity={.16} strokeWidth={8} strokeLinejoin="round" /><line x1={103 - width / 2} x2={97 + width / 2} y1={y} y2={y} stroke={color} strokeWidth={2.5} strokeLinecap="round" /></g>;
          })}
        </svg>{!reduce && funnelParticles.map((particle, index) => <span key={particle.x} aria-hidden data-illustration-funnel-particle className="absolute left-1/2 top-0 size-[1.3cqw] rounded-full bg-foreground/55" style={{ "--x": particle.x, "--dir": Math.sign(particle.x), animation: `illustration-funnel-${particle.exit ? `exit-${particle.exit}` : "convert"} 4.8s linear ${index * -.3}s infinite` } as CSSProperties} />)}</div>
        <div className="flex min-w-0 flex-1 flex-col">{rows.map((stage, index) => <button type="button" key={stage.id} aria-pressed={selected?.id === stage.id} aria-label={`${stage.label}: ${stage.value} ${unit}`} onClick={() => select(stage.id)} className="flex h-[10.8cqw] shrink-0 cursor-pointer items-center gap-[clamp(.4rem,1.8cqw,.7rem)] text-left focus-visible:outline-2 focus-visible:outline-ring" style={{ marginTop: index ? ".32cqw" : 0 }}><span aria-hidden className="size-[clamp(.4rem,1.6cqw,.6rem)] shrink-0 rounded-full" style={{ background: stage.color ?? funnelColors[index % funnelColors.length] }} /><span className="min-w-0 flex-1"><span className="block truncate text-[clamp(.45rem,2cqw,.75rem)] text-muted-foreground">{stage.label}</span><strong className="block text-[clamp(.7rem,3.2cqw,1.2rem)] font-semibold tabular-nums tracking-tight">{Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(stage.value)}</strong></span>{index > 0 && <span className="rounded-full border border-border px-[.6em] py-[.1em] font-mono text-[clamp(.4rem,1.7cqw,.65rem)] tabular-nums text-muted-foreground">{stage.stepConversion === null ? "—" : `${Math.round(stage.stepConversion)}%`}</span>}</button>)}<div className="mt-auto flex items-center justify-between border-t border-border pt-[clamp(.35rem,1.6cqw,.6rem)] text-[clamp(.45rem,2cqw,.75rem)] text-muted-foreground"><span>Overall</span><span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-[.7em] py-[.15em] font-medium tabular-nums text-emerald-700 dark:text-emerald-300">{overall}</span></div></div>
      </div>
      <p className="sr-only" aria-live="polite">{selected ? `${selected.label}: ${selected.value} ${unit}` : "No stages supplied."}</p>
    </div>
    <style>{funnelMotionStyles}</style>
  </section>;
}
