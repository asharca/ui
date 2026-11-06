"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, ArrowDownRight, BarChart3, CalendarDays, ChartNoAxesCombined, CheckCheck, ClipboardCheck, Clock3, ChevronDown, History, Search, Timer, Users, X } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Button } from "@/components/motion/button";
import { BarChart, BarChartLegend, BarChartPlot, BarChartTooltip } from "@/components/charts/bar-chart";
import { LineChart, LineChartLegend, LineChartPlot, LineChartTooltip } from "@/components/charts/line-chart";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { DateRangePicker, DateRangePickerCalendar, DateRangePickerClear, DateRangePickerContent, DateRangePickerFooter, DateRangePickerGrid, DateRangePickerHeader, DateRangePickerPresets, DateRangePickerSelection, DateRangePickerTrigger, type DateRange } from "@/components/motion/date-range-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { useElementWidth } from "@/components/charts/xy/use-width";
import { cn } from "@/lib/utils";

export interface PerformancePeriod {
  id: string;
  label: string;
  start: string;
  end: string;
  /** Explicit equal-length baseline, including year-over-year periods if desired. */
  comparisonPeriodId?: string;
  expectedDays: number;
}
export interface PerformanceRecord {
  id: string;
  periodId: string;
  team: string;
  member: string;
  delivered: number;
  replies: number;
  replyMinutes: number;
  reviews: number;
  reviewMinutes: number;
  /** One value per observed day. Null leaves an honest coverage gap. */
  dailyDelivered: readonly (number | null)[];
  hoursLogged?: number;
  onTimeDeliveries?: number;
  /** Major currency units, in the report's currency. */
  collectedRevenue?: number;
  onTimeReplies?: number;
  reviewsPassed?: number;
  dailyHoursLogged?: readonly (number | null)[];
  dailyOnTimeDeliveries?: readonly (number | null)[];
  dailyCollectedRevenue?: readonly (number | null)[];
  /** Counts and summed minutes are paired to calculate weighted daily means. */
  dailyReplies?: readonly (number | null)[];
  dailyReplyMinutes?: readonly (number | null)[];
}
export interface PerformanceReportProps {
  periods: readonly PerformancePeriod[];
  records: readonly PerformanceRecord[];
  variant?: "team-performance" | "period-comparison" | "team-leaderboard";
  periodId?: string;
  defaultPeriodId?: string;
  onPeriodChange?: (id: string) => void;
  team?: string;
  onTeamChange?: (team: string) => void;
  currency?: string;
  /** A real host export; failures remain visible. */
  onExport?: (records: readonly PerformanceRecord[]) => Promise<void>;
  className?: string;
}
type Metric = "delivered" | "hours" | "onTime" | "members" | "revenue" | "reply";
type RankingMetric = "delivered" | "reply" | "onTimeReplies" | "reviewsPassed";
const labels: Record<Metric, string> = { delivered: "Delivered work", hours: "Hours logged", onTime: "On-time delivery", members: "Active teammates", revenue: "Collected revenue", reply: "First reply time" };
const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);
/** Missing fields are unavailable, never assumed to be zero or inferred from another count. */
function optionalSum(rows: readonly PerformanceRecord[], key: "hoursLogged" | "onTimeDeliveries" | "collectedRevenue" | "onTimeReplies" | "reviewsPassed") {
  return rows.length && rows.every(row => row[key] !== undefined) ? sum(rows.map(row => row[key] as number)) : null;
}
function summarize(rows: readonly PerformanceRecord[]) {
  const delivered = sum(rows.map(row => row.delivered));
  const replies = sum(rows.map(row => row.replies));
  const reviews = sum(rows.map(row => row.reviews));
  const timely = optionalSum(rows, "onTimeDeliveries");
  return { delivered, hours: optionalSum(rows, "hoursLogged"), onTime: timely !== null && delivered > 0 ? timely / delivered * 100 : null, members: new Set(rows.map(row => row.member)).size, revenue: optionalSum(rows, "collectedRevenue"), reply: replies > 0 ? sum(rows.map(row => row.replyMinutes)) / replies : null, replies, reviews, onTimeReplies: optionalSum(rows, "onTimeReplies"), reviewsPassed: optionalSum(rows, "reviewsPassed") };
}
function dailyValues(rows: readonly PerformanceRecord[], days: number, metric: Metric) {
  return Array.from({ length: days }, (_, index) => {
    const dailySum = (key: "dailyDelivered" | "dailyHoursLogged" | "dailyOnTimeDeliveries" | "dailyCollectedRevenue" | "dailyReplies" | "dailyReplyMinutes") => {
      const values = rows.map(row => row[key]?.[index]);
      return values.length && values.every(value => typeof value === "number") ? sum(values as number[]) : null;
    };
    if (metric === "members") return rows.every(row => typeof row.dailyDelivered[index] === "number") ? rows.filter(row => (row.dailyDelivered[index] ?? 0) > 0).length : null;
    if (metric === "reply") { const count = dailySum("dailyReplies"); const minutes = dailySum("dailyReplyMinutes"); return count !== null && count > 0 && minutes !== null ? minutes / count : null; }
    if (metric === "onTime") { const count = dailySum("dailyDelivered"); const timely = dailySum("dailyOnTimeDeliveries"); return count !== null && count > 0 && timely !== null ? timely / count * 100 : null; }
    return dailySum(metric === "hours" ? "dailyHoursLogged" : metric === "revenue" ? "dailyCollectedRevenue" : "dailyDelivered");
  });
}
const menuTrigger = "inline-flex h-10 max-w-full items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg:last-child]:text-muted-foreground";
const shortDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const periodRange = (period: PerformancePeriod) => `${shortDate(period.start)} – ${shortDate(period.end)}, ${period.end.slice(0, 4)}`;

/** A calendar never invents observations for a range absent from the host contract. */
function ReportPeriodPicker({ periods, selected, onChange, label }: { periods: readonly PerformancePeriod[]; selected: PerformancePeriod | undefined; onChange: (id: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | null>(null);
  const [rangeError, setRangeError] = useState("");
  return <DateRangePicker value={draft} onValueChange={range => { setDraft(range); setRangeError(""); }} open={open} onOpenChange={next => { if (next) { setDraft(selected ? { from: selected.start, to: selected.end } : null); setRangeError(""); } setOpen(next); }} defaultMonth={selected?.start} label={label} showSummary={false} presets={periods.map(period => ({ label: period.label, value: { from: period.start, to: period.end } }))}>
    <DateRangePickerTrigger disabled={!periods.length} aria-label={`${label}: ${selected ? periodRange(selected) : "No periods"}`} className="h-10 rounded-full text-sm" style={{ borderRadius: 999 }}><CalendarDays className={cn("shrink-0 text-muted-foreground", label === "Reporting period" ? "size-[15px]" : "size-4")} /><span className="min-w-0 truncate tabular-nums">{selected ? periodRange(selected) : "No periods"}</span><ChevronDown className={cn("shrink-0 text-muted-foreground", label === "Reporting period" ? "size-[13px]" : "size-3.5")} /></DateRangePickerTrigger>
    <DateRangePickerContent className="w-80 max-w-[calc(100vw-1.5rem)]" radius={16}>
      <DateRangePickerCalendar className="w-full border-0">
        <DateRangePickerHeader /><DateRangePickerGrid />
        <DateRangePickerFooter><div className="flex items-center justify-between gap-2"><DateRangePickerSelection /><DateRangePickerClear /></div><DateRangePickerPresets />
          {rangeError && <p role="alert" className="mt-3 text-xs text-destructive">{rangeError}</p>}
          <div className="mt-3 flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button size="sm" disabled={!draft?.to} onClick={() => { const match = periods.find(period => period.start === draft?.from && period.end === draft?.to); if (!match) { setRangeError("No observations are supplied for this range. Choose an available reporting period above."); return; } onChange(match.id); setOpen(false); }}>Apply range</Button></div>
        </DateRangePickerFooter>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePicker>;
}

function PerformanceDetails({ row, prior, period, priorPeriod, width, ticks, onClose }: { row: PerformanceRecord | undefined; prior: PerformanceRecord | undefined; period: PerformancePeriod | undefined; priorPeriod: PerformancePeriod | undefined; width: number; ticks: readonly number[]; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowId = row?.id;
  useEffect(() => {
    if (rowId === undefined) return;
    const frame = requestAnimationFrame(() => headingRef.current?.closest<HTMLElement>('[role="dialog"]')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [rowId]);
  const days = period?.expectedDays ?? 0;
  const categories = Array.from({ length: days }, (_, index) => `Day ${index + 1}`);
  const values = Array.from({ length: days }, (_, index) => row?.dailyDelivered[index] ?? null);
  const before = Array.from({ length: days }, (_, index) => prior?.dailyDelivered[index] ?? null);
  const series = [{ id: "current", name: "Current", color: "#008bea", values }, ...(prior && priorPeriod?.expectedDays === days ? [{ id: "previous", name: "Previous", color: "var(--muted-foreground)", values: before }] : [])];
  const rate = (count: number | undefined, total: number) => count !== undefined && total > 0 ? `${(count / total * 100).toFixed(1)}%` : "Unavailable";
  return <MorphingModal viewId={row?.id ?? null} onClose={onClose} placement="center" ariaLabel={row ? `${row.member}’s performance` : "Teammate performance"} className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto rounded-2xl shadow-none sm:[&>div]:p-6" backdropClassName="bg-foreground/10 [backdrop-filter:blur(24px)]">
    {row && <>
      <div className="flex items-start justify-between gap-4"><div><h2 ref={headingRef} className="text-xl font-medium">{row.member}’s performance</h2><p className="mt-2 text-sm text-muted-foreground">{row.team}{period && ` · ${periodRange(period)}`}</p></div><Button size="sm" variant="ghost" className="size-9 shrink-0 p-0" aria-label="Close teammate details" onClick={onClose}><X className="size-4" /></Button></div>
      <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">{[{ label: "Delivered", value: row.delivered.toLocaleString() }, { label: "First reply", value: row.replies > 0 ? `${(row.replyMinutes / row.replies).toFixed(1)} min` : "Unavailable" }, { label: "On-time replies", value: rate(row.onTimeReplies, row.replies) }, { label: "Reviews passed", value: rate(row.reviewsPassed, row.reviews) }].map(item => <div key={item.label}><dt className="text-xs text-muted-foreground">{item.label}</dt><dd className="mt-2 text-xl font-medium tabular-nums">{item.value}</dd></div>)}</dl>
      <div className="mt-6 border-t border-border pt-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-normal text-muted-foreground">Delivered work by day</h3><div className="flex gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-primary" />Current</span>{prior && <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="w-3 border-t border-dashed border-muted-foreground" />Previous</span>}</div></div><LineChart className="space-y-0" variant="area" curve="linear" label={`${row.member} delivered work by day`} categories={categories} series={series}><LineChartPlot height={width >= 640 ? 260 : 228} fadeEdges={false} strokeWidth={1.5} categoryTickIndices={ticks} className="[&_path[stroke='var(--muted-foreground)']]:[stroke-dasharray:4_5] [&_g:has(>path[stroke='var(--muted-foreground)'])>path:not([stroke])]:opacity-0 [&_line]:[stroke-dasharray:2_5]" /><LineChartTooltip /></LineChart></div>
      <div className="mt-4 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">{[{ label: "Reply targets", count: row.onTimeReplies, total: row.replies, detail: "Replies within the configured response target" }, { label: "Review checks", count: row.reviewsPassed, total: row.reviews, detail: "Delivered items that passed review" }].map(item => <div key={item.label}><div className="mb-2 flex justify-between gap-3 text-xs"><span>{item.label}</span><span className="tabular-nums text-muted-foreground">{item.count === undefined ? "Unavailable" : `${item.count} / ${item.total}`}</span></div>{item.count !== undefined && item.total > 0 && <div role="progressbar" aria-label={item.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.count / item.total * 100} className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${item.count / item.total * 100}%` }} /></div>}<p className="mt-2 text-xs text-muted-foreground">{item.detail}</p></div>)}</div>
      <p className="mt-5 text-xs text-muted-foreground">Coverage: {values.filter(value => value !== null).length}/{days} days{prior ? ` · previous ${before.filter(value => value !== null).length}/${days}` : " · No comparison baseline"}. Missing days remain gaps.</p>
    </>}
  </MorphingModal>;
}

export function PerformanceReport({ periods, records, variant = "team-performance", periodId, defaultPeriodId, onPeriodChange, team, onTeamChange, currency = "USD", onExport, className }: PerformanceReportProps) {
  const [internalPeriod, setInternalPeriod] = useState(defaultPeriodId ?? periods[0]?.id ?? "");
  const [internalTeam, setInternalTeam] = useState("");
  const [metric, setMetric] = useState<Metric>(variant === "period-comparison" ? "revenue" : "delivered");
  const [chartStyle, setChartStyle] = useState<"line" | "bars">(variant === "team-performance" ? "bars" : "line");
  const [compare, setCompare] = useState(true);
  const [comparisonId, setComparisonId] = useState<string | null | undefined>(undefined);
  const { ref: reportRef, width: reportWidth } = useElementWidth<HTMLElement>();
  const [sort, setSort] = useState<RankingMetric | "member">("delivered");
  const [ascending, setAscending] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const selected = periods.find(period => period.id === (periodId ?? internalPeriod));
  const chosenTeam = team ?? internalTeam;
  const rows = records.filter(row => row.periodId === selected?.id && (!chosenTeam || row.team === chosenTeam));
  const baselinePeriod = comparisonId === null ? undefined : periods.find(period => period.id === (comparisonId ?? selected?.comparisonPeriodId));
  const baseline = records.filter(row => row.periodId === baselinePeriod?.id && (!chosenTeam || row.team === chosenTeam));
  const current = summarize(rows);
  const previous = baseline.length ? summarize(baseline) : null;
  const days = selected?.expectedDays ?? 0;
  const equalPeriods = Boolean(baselinePeriod && baselinePeriod.expectedDays === days);
  const currentDaily = dailyValues(rows, days, metric);
  const priorDaily = dailyValues(baseline, days, metric);
  const format = (value: number, key: Metric = metric) => key === "revenue" ? new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value) : key === "onTime" ? `${value.toFixed(1)}%` : key === "reply" ? `${value.toFixed(1)} min` : `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}${key === "hours" ? " h" : ""}`;
  const delta = (value: number | null, before: number | null | undefined) => value !== null && before !== null && before !== undefined && before !== 0 ? (value - before) / Math.abs(before) * 100 : null;
  const metrics: Metric[] = variant === "team-performance" ? ["delivered", "hours", "onTime", "members"] : ["revenue", "delivered", "reply"];
  const chartCategories = Array.from({ length: days }, (_, index) => variant === "team-performance" && selected ? shortDate(new Date(Date.parse(`${selected.start}T00:00:00Z`) + index * 86400000).toISOString().slice(0, 10)) : `Day ${index + 1}`);
  const categoryStep = Math.max(1, Math.ceil(days / 5));
  const desktopTicks = days ? [...Array.from({ length: Math.ceil(days / categoryStep) }, (_, index) => index * categoryStep).filter(index => index < days - 1 - categoryStep / 2), days - 1] : [];
  const categoryTickIndices = reportWidth >= 640 ? desktopTicks : [...new Set(days ? [0, desktopTicks[Math.floor((desktopTicks.length - 1) / 2)], days - 1] : [])];
  const chartSeries = [{ id: "current", name: "Current period", color: "#008bea", values: currentDaily }, ...(compare && equalPeriods ? [{ id: "previous", name: "Previous period", color: chartStyle === "bars" ? "color-mix(in srgb, var(--muted-foreground) 40%, transparent)" : "var(--muted-foreground)", values: priorDaily }] : [])];
  const observedDaily = [...currentDaily, ...(compare && equalPeriods ? priorDaily : [])].filter((value): value is number => value !== null);
  const dailyMaximum = Math.max(0, ...observedDaily);
  const tickPower = dailyMaximum > 0 ? 10 ** Math.floor(Math.log10(dailyMaximum / 3)) : 1;
  const tickStep = ([1, 1.5, 2, 2.5, 3.5, 5, 7, 10].find(step => step * tickPower >= dailyMaximum / 3) ?? 10) * tickPower;
  const lineMaximum = metric === "onTime" ? 100 : tickStep * 3;
  const lineDomain: readonly [number, number] | undefined = observedDaily.every(value => value >= 0) ? [0, lineMaximum] : undefined;
  const selectedChange = delta(current[metric], previous?.[metric]);
  const rankingValue = (row: PerformanceRecord, key: RankingMetric): number | null => key === "delivered" ? row.delivered : key === "reply" ? row.replies > 0 ? row.replyMinutes / row.replies : null : key === "onTimeReplies" ? row.onTimeReplies !== undefined && row.replies > 0 ? row.onTimeReplies / row.replies * 100 : null : row.reviewsPassed !== undefined && row.reviews > 0 ? row.reviewsPassed / row.reviews * 100 : null;
  const ranked = rows.filter(row => row.member.toLowerCase().includes(query.toLowerCase())).sort((a, b) => { if (sort === "member") return (ascending ? 1 : -1) * a.member.localeCompare(b.member); const x = rankingValue(a, sort); const y = rankingValue(b, sort); return x === null ? y === null ? a.member.localeCompare(b.member) : 1 : y === null ? -1 : (ascending ? x - y : y - x) || a.member.localeCompare(b.member); });
  const rankingMetric = sort === "member" ? "delivered" : sort;
  const rankOrder = sort === "member" ? [...ranked].sort((a, b) => b.delivered - a.delivered) : ranked;
  const changePeriod = (id: string) => { setInternalPeriod(id); setComparisonId(undefined); setExpanded(null); onPeriodChange?.(id); };
  const changeTeam = (name: string) => { setInternalTeam(name); setExpanded(null); onTeamChange?.(name); };
  const expandedRow = rows.find(row => row.id === expanded);
  const teamMenu = <AnimatedDropdown ariaLabel={`Report team: ${chosenTeam || "All teams"}`} trigger={<><Users className="size-4 text-muted-foreground" /><span className="truncate">{chosenTeam || "All teams"}</span></>} triggerClassName={menuTrigger} value={chosenTeam} onValueChange={changeTeam} indicatorPosition="end" itemClassName="min-h-10 rounded-lg px-2.5 [&>span:first-child]:hidden" items={[{ id: "all", kind: "option", value: "", label: "All teams", textValue: "All teams" }, ...[...new Set(records.map(row => row.team))].map(name => ({ id: name, kind: "option" as const, value: name, label: name, textValue: name }))]} />;
  return <section ref={reportRef} aria-label={variant.replaceAll("-", " ")} className={cn("@container/report w-full min-w-0 text-foreground", variant === "team-performance" ? "space-y-4" : "space-y-5", className)}>
    <header className={cn("flex flex-wrap items-end justify-between", variant === "team-performance" ? "gap-5" : "gap-4")}>
      <div><h2 className="text-2xl font-normal tracking-tight text-muted-foreground">{variant === "team-performance" ? "Overview" : variant === "period-comparison" ? "Period comparison" : "Team performance"}</h2><p className="mt-2 text-sm text-muted-foreground">{variant === "team-performance" ? "A closer look at your team's daily activity." : variant === "team-leaderboard" ? "A shared view of delivery, response, and review quality." : "See what changed, one period at a time."}</p></div>
      <fieldset aria-label="Reporting controls" className="flex min-w-0 flex-wrap items-center gap-2">
        {variant === "team-leaderboard" ? <>{teamMenu}<AnimatedDropdown ariaLabel={`Reporting period: ${selected?.label ?? "No periods"}`} disabled={!periods.length} trigger={<><CalendarDays className="size-4 text-muted-foreground" /><span className="truncate">{selected?.label ?? "No periods"}</span></>} triggerClassName={menuTrigger} value={selected?.id} onValueChange={changePeriod} indicatorPosition="end" itemClassName="min-h-10 rounded-lg px-2.5 [&>span:first-child]:hidden" items={periods.map(period => ({ id: period.id, kind: "option", value: period.id, label: period.label, textValue: period.label }))} /></> : <>
          <ReportPeriodPicker key={selected?.id ?? "empty"} periods={periods} selected={selected} onChange={changePeriod} label={variant === "period-comparison" ? "Current period" : "Reporting period"} />
          {variant === "team-performance" ? teamMenu : <AnimatedDropdown ariaLabel={`Compare with: ${baselinePeriod?.label ?? "No comparison"}`} trigger={<><History className="size-4 text-muted-foreground" /><span>{baselinePeriod?.label ?? "No comparison"}</span></>} triggerClassName={menuTrigger} value={baselinePeriod ? `period:${baselinePeriod.id}` : "none"} onValueChange={value => setComparisonId(value === "none" ? null : value.slice(7))} indicatorPosition="end" itemClassName="min-h-10 rounded-lg px-2.5 [&>span:first-child]:hidden" items={[...periods.filter(period => period.id !== selected?.id && period.expectedDays === days).map(period => ({ id: `period:${period.id}`, kind: "option" as const, value: `period:${period.id}`, label: period.label, textValue: period.label })), { id: "none", kind: "option", value: "none", label: "No comparison", textValue: "No comparison" }]} />}
        </>}
        {variant === "team-performance" && equalPeriods && <label className="inline-flex items-center gap-2 px-2 text-sm"><input type="checkbox" role="switch" aria-checked={compare} aria-label="Compare previous period" checked={compare} onChange={event => setCompare(event.target.checked)} className="relative h-6 w-10 shrink-0 appearance-none rounded-full bg-muted before:absolute before:top-1 before:left-1 before:size-4 before:rounded-full before:bg-background before:shadow-md before:transition-transform checked:bg-primary checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-ring" />Compare</label>}
        {onExport && <Button aria-label="Export CSV" variant="outline" size="sm" className="h-9 px-4" disabled={exporting} onClick={async () => { setExporting(true); setError(""); try { await onExport(rows); } catch (failure) { setError(failure instanceof Error ? failure.message : "Export failed"); } finally { setExporting(false); } }}><ArrowDownToLine className="size-4" /><span>{exporting ? "Exporting…" : "Export CSV"}</span></Button>}
      </fieldset>
    </header>
    {!rows.length ? <p role="status" className="rounded-xl bg-muted p-8 text-center text-sm">No observations for this period and team.</p> : variant === "team-leaderboard" ? <>
      <div className="grid overflow-hidden rounded-2xl border border-border @lg/report:grid-cols-3">{[{ label: "Work delivered", value: current.delivered, detail: "vs. previous period", change: delta(current.delivered, previous?.delivered) }, { label: "Replies on time", value: current.onTimeReplies, detail: current.onTimeReplies !== null && current.replies > 0 ? `${(current.onTimeReplies / current.replies * 100).toFixed(1)}% of ${current.replies.toLocaleString()} replies` : "No matching observations", change: null }, { label: "Reviews passed", value: current.reviewsPassed, detail: current.reviewsPassed !== null && current.reviews > 0 ? `${(current.reviewsPassed / current.reviews * 100).toFixed(1)}% of ${current.reviews.toLocaleString()} reviews` : "No matching observations", change: null }].map(item => <div key={item.label} className="flex min-w-0 flex-col gap-5 border-b border-border bg-background p-4 last:border-0 @lg/report:border-r @lg/report:border-b-0"><div className="flex items-center gap-2"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground">{item.label === "Work delivered" ? <CheckCheck className="size-4" /> : item.label === "Replies on time" ? <Clock3 className="size-4" /> : <ClipboardCheck className="size-4" />}</span><p className="whitespace-nowrap font-mono text-sm uppercase tracking-tight text-muted-foreground">{item.label}</p></div><div><p className="flex min-h-9 items-center text-3xl font-medium tracking-tight">{item.value === null ? "Unavailable" : <AnimatedNumber value={item.value} startOnView={false} />}</p><p className="mt-2 text-sm text-muted-foreground">{item.change !== null && <span className={cn("mr-2 font-mono font-medium", item.change > 0 ? "text-emerald-600 dark:text-emerald-400" : item.change < 0 ? "text-destructive" : "text-muted-foreground")}>{item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%</span>}{item.detail}</p></div></div>)}</div>
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <header className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h3 className="text-base text-muted-foreground">Delivery leaderboard</h3><p className="mt-1 text-xs text-muted-foreground">{selected && periodRange(selected)} · {rows.length} teammates</p></div><label className="flex h-10 w-full max-w-64 items-center gap-2 rounded-full border border-border px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring"><Search className="size-4 shrink-0" /><input aria-label="Find a teammate" placeholder="Find a teammate…" value={query} onChange={event => setQuery(event.target.value)} className="w-full min-w-0 bg-transparent text-sm outline-none" /></label></header>
        <div className="overflow-auto border-t border-border pb-5 [scrollbar-gutter:stable]">
          <table aria-label="Team ranking with tied ranks and individual trends" className="w-full min-w-5xl table-fixed border-collapse text-left text-sm">
            <colgroup><col style={{ width: 56 }} /><col /><col style={{ width: 135 }} /><col style={{ width: 140 }} /><col style={{ width: 170 }} /><col style={{ width: 180 }} /><col style={{ width: 80 }} /></colgroup>
            <thead className="bg-muted text-xs text-muted-foreground [&_th]:border-b [&_th]:border-border"><tr className="h-11"><th className="px-4 font-normal"><span className="sr-only">Delivery rank</span></th>{(["member", "delivered", "reply", "onTimeReplies", "reviewsPassed"] as const).map(key => <th key={key} className="px-4 font-normal" aria-sort={sort === key ? ascending ? "ascending" : "descending" : "none"}><button type="button" className="inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setSort(key); setAscending(sort === key ? !ascending : key === "reply" || key === "member"); }}>{key === "member" ? "Teammate" : key === "delivered" ? "Delivered" : key === "reply" ? "First reply" : key === "onTimeReplies" ? "On-time replies" : "Reviews passed"}<ChevronDown className="size-3.5 opacity-45" /></button></th>)}<th><span className="sr-only">Teammate details</span></th></tr></thead>
            <tbody>{ranked.map(row => { const value = rankingValue(row, rankingMetric); const rank = rankOrder.findIndex(item => rankingValue(item, rankingMetric) === value) + 1; const prior = baseline.find(item => item.member === row.member && item.team === row.team); const deliveryChange = delta(row.delivered, prior?.delivered); return <tr key={row.id} className="h-16 border-b border-border last:border-b-0 hover:bg-muted/45"><td className="px-4 text-xs tabular-nums text-muted-foreground">{value === null ? "—" : String(rank).padStart(2, "0")}</td><th scope="row" className="px-4 py-2 font-normal"><div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-muted text-xs text-muted-foreground">{row.member.split(" ").map(word => word[0]).join("")}</span><span className="min-w-0"><span className="block truncate">{row.member}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{row.team}</span></span></div></th>{(["delivered", "reply", "onTimeReplies", "reviewsPassed"] as const).map(key => { const number = rankingValue(row, key); return <td key={key} className={cn("px-4 py-2 tabular-nums", key !== "delivered" && "text-muted-foreground")}>{number === null ? "Unavailable" : key === "delivered" ? <><span>{number.toLocaleString()}</span>{deliveryChange !== null && <span className="mt-1 block text-xs text-muted-foreground">{deliveryChange > 0 ? "+" : ""}{deliveryChange.toFixed(1)}%</span>}</> : key === "reply" ? `${number.toFixed(1)} min` : <><span className={key === "onTimeReplies" ? "text-xs text-foreground" : undefined}>{number.toFixed(1)}%</span>{key === "onTimeReplies" && <div className="mt-2 h-1.5 w-32 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${number}%` }} /></div>}</>}</td>; })}<td className="px-4 text-right"><Button variant="ghost" size="sm" className="ml-auto size-9 p-0" aria-label={`View performance for ${row.member}`} aria-haspopup="dialog" onClick={() => setExpanded(row.id)}><ArrowUpRight className="size-4" /></Button></td></tr>; })}</tbody>
          </table>
        </div>
        <footer className="flex flex-wrap justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Rank is based on {sort === "delivered" || sort === "member" ? "delivered work" : "the selected metric"}. Reply and review rates use their own sample counts.</span><span>{ranked.length} shown</span></footer>
      </div>
      <p className="text-xs text-muted-foreground">{baselinePeriod ? `Delivery changes compare with ${periodRange(baselinePeriod)}. Missing days have no percentage baseline.` : "No comparison baseline. Missing days have no percentage baseline."}</p>
      <PerformanceDetails row={expandedRow} prior={expandedRow ? baseline.find(row => row.member === expandedRow.member && row.team === expandedRow.team) : undefined} period={selected} priorPeriod={baselinePeriod} width={reportWidth} ticks={categoryTickIndices} onClose={() => setExpanded(null)} />
    </> : <>
      <div className={cn("grid gap-3", variant === "team-performance" ? "@lg/report:grid-cols-2 @3xl/report:grid-cols-4" : "@lg/report:grid-cols-2 @3xl/report:grid-cols-3")}>{metrics.map(key => { const value = current[key]; const before = previous?.[key]; const change = key === "onTime" && value !== null && before !== null && before !== undefined ? value - before : delta(value, before); return <button type="button" key={key} aria-pressed={metric === key} onClick={() => setMetric(key)} className={cn("flex min-w-0 flex-col rounded-2xl border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-ring", variant === "team-performance" ? "gap-2" : "gap-3", metric === key ? "border-primary" : "border-border")}><span className={cn("flex w-full items-center justify-between gap-2", variant === "team-performance" && "min-h-9")}><span className="text-sm leading-tight text-muted-foreground">{variant === "team-performance" && key === "delivered" ? "Completed tasks" : labels[key]}</span><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">{variant !== "team-performance" ? <ChartNoAxesCombined className="size-3.5" /> : key === "delivered" ? <CheckCheck className="size-3.5" /> : key === "hours" ? <Timer className="size-3.5" /> : key === "members" ? <Users className="size-3.5" /> : key === "onTime" ? <Clock3 className="size-3.5" /> : <ChartNoAxesCombined className="size-3.5" />}</span></span><span className="flex min-h-9 items-center text-3xl font-medium tabular-nums tracking-tight">{value === null ? "Unavailable" : <AnimatedNumber value={value} startOnView={false} format={value => format(value, key)} />}</span><span className="text-xs text-muted-foreground">{change === null ? "No comparison baseline" : <><span className={cn("mr-2 font-medium tabular-nums", (key === "reply" ? change < 0 : change > 0) && "text-emerald-600 dark:text-emerald-400", (key === "reply" ? change > 0 : change < 0) && "text-destructive")}>{change > 0 ? "+" : ""}{change.toFixed(1)}{key === "onTime" ? " pp" : "%"}</span>vs. previous period</>}</span></button>; })}</div>
      <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background">
        <header className={cn("flex flex-wrap items-center justify-between gap-3", variant === "team-performance" ? "p-4 sm:p-5" : "border-b border-border px-5 py-4")}><div><h3 className="text-base font-normal text-muted-foreground">{variant === "team-performance" && metric === "delivered" ? "Completed tasks" : labels[metric]} over time</h3><p className="mt-1 text-xs text-muted-foreground">{variant === "team-performance" ? "Daily activity for the selected period" : `${days} days · ${metric === "reply" ? "Weighted mean" : metric === "onTime" ? "Delivery rate" : "Period total"}`}</p></div><Tabs value={chartStyle} onValueChange={value => setChartStyle(value as "bars" | "line")}><TabsList aria-label="Chart style" className={cn("w-fit rounded-full [&_[data-tabs-label]]:text-foreground", variant === "team-performance" ? "bg-muted p-0.5" : "border border-border bg-background p-1")}>{(variant === "team-performance" ? ["bars", "line"] as const : ["line", "bars"] as const).map(style => <TabsTrigger key={style} value={style} aria-label={style === "bars" ? "Bar chart" : "Line chart"} icon={variant === "period-comparison" ? undefined : style === "bars" ? <BarChart3 className="size-3.5" /> : <ChartNoAxesCombined className="size-3.5" />} className={cn("gap-1.5 rounded-full px-3 py-0 text-xs font-normal", variant === "team-performance" ? "h-8" : "h-9")} indicatorClassName="rounded-full bg-background">{style === "bars" ? "Bars" : "Line"}</TabsTrigger>)}</TabsList></Tabs></header>
        <div className={cn("grid", variant === "period-comparison" && "@3xl/report:grid-cols-[minmax(0,1fr)_240px]")}>
          <div className={cn("min-w-0", variant === "team-performance" ? "px-3 pb-5 sm:px-4 sm:pb-4" : "p-4 sm:p-5")}>
            {currentDaily.some(value => value !== null) ? chartStyle === "line" ? <LineChart className="space-y-0" variant="area" curve="linear" domain={lineDomain} label={`${labels[metric]} by relative day`} categories={chartCategories} series={chartSeries} formatValue={value => format(value)} formatTick={value => metric === "revenue" ? new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(value) : String(value)}><LineChartLegend className={variant === "team-performance" ? "gap-x-3 pb-2 [&_button]:min-h-8 [&_button]:rounded-full" : "gap-x-5 pb-5 [&_button]:min-h-4 [&_button]:p-0 [&_button]:rounded-full [&_button>span:first-child]:h-px [&_button>span:first-child]:w-4 [&_button>span:first-child]:rounded-none [&_button>span:first-child]:border-0"} /><LineChartPlot className="[&_path[stroke='var(--muted-foreground)']]:[stroke-dasharray:4_5] [&_g:has(>path[stroke='var(--muted-foreground)'])>path:not([stroke])]:opacity-0 [&_line]:[stroke-dasharray:2_5]" fadeEdges={false} strokeWidth={1.5} valueTicks={lineDomain ? [0, lineMaximum / 3, lineMaximum * 2 / 3, lineMaximum] : undefined} height={variant === "team-performance" ? reportWidth >= 640 ? 228 : 196 : reportWidth >= 640 ? 260 : 228} categoryTickIndices={categoryTickIndices} /><LineChartTooltip /></LineChart> : <BarChart className="space-y-0" label={`${labels[metric]} by relative day`} categories={chartCategories} series={chartSeries} formatValue={value => format(value)}><BarChartLegend className={variant === "team-performance" ? "gap-x-3 pb-2 [&_button]:min-h-8 [&_button]:rounded-full" : "gap-x-5 pb-5 [&_button]:min-h-4 [&_button]:p-0 [&_button]:rounded-full"} /><BarChartPlot height={variant === "team-performance" ? reportWidth >= 640 ? 232 : 200 : reportWidth >= 640 ? 264 : 232} categoryTickIndices={categoryTickIndices} /><BarChartTooltip /></BarChart> : <p role="status" className="grid min-h-48 place-items-center text-sm text-muted-foreground">Daily observations unavailable for this metric.</p>}
          </div>
          {variant === "period-comparison" && <aside className="flex flex-col gap-5 border-t border-border p-5 @3xl/report:border-t-0 @3xl/report:border-l"><div><p className="text-xs text-muted-foreground">Current period</p><p className="mt-1 text-xs text-muted-foreground">{selected && periodRange(selected)}</p><p className="mt-3 text-2xl font-medium">{current[metric] === null ? "Unavailable" : format(current[metric])}</p></div><div><p className="text-xs text-muted-foreground">Previous period</p><p className="mt-1 text-xs text-muted-foreground">{baselinePeriod ? periodRange(baselinePeriod) : "No comparison selected"}</p><p className="mt-3 text-2xl font-medium text-muted-foreground">{equalPeriods && previous?.[metric] !== null && previous?.[metric] !== undefined ? format(previous[metric]) : "Unavailable"}</p></div><div className="border-t border-border pt-4"><p className="text-xs text-muted-foreground">Change</p><p className={cn("mt-2 flex items-center gap-1 text-xl font-medium tabular-nums", selectedChange !== null && (metric === "reply" ? selectedChange < 0 : selectedChange > 0) && "text-emerald-600 dark:text-emerald-400")}>{selectedChange === null ? "No comparison baseline" : <>{selectedChange >= 0 ? <ArrowUpRight aria-hidden="true" className="size-4" /> : <ArrowDownRight aria-hidden="true" className="size-4" />}{selectedChange > 0 ? "+" : ""}{selectedChange.toFixed(1)}%</>}</p></div></aside>}
        </div>
        {variant === "period-comparison" && <footer className="flex flex-wrap justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Periods align by day, using equal day counts.</span><span>Coverage: {currentDaily.filter(value => value !== null).length}/{days} days{equalPeriods ? ` · comparison ${priorDaily.filter(value => value !== null).length}/${days}` : " · No equal-length baseline"}</span></footer>}
      </div>
      {variant === "period-comparison" && <p role="status" className="sr-only">Showing {labels[metric]}{selected ? `, ${periodRange(selected)}` : ""}. {equalPeriods ? "Equal-length comparison selected." : "No comparison baseline."}</p>}
    </>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </section>;
}
