"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { Button, ButtonLink } from "@/components/motion/button";
import { LandingConversion, LandingFeatures, LandingFrame, LandingReveal, LandingSection, type LandingSiteProps } from "@/components/motion/landing-templates/shared";
import { withOccurrenceKeys } from "@/lib/collection-keys";

export interface AnalyticsLandingPeriod { id: string; label: string; series: number[]; labels: string[]; funnel: { name: string; count: number }[]; revenue: number }
export interface AnalyticsLandingAnswer { summary: string; sources: { label: string; href?: string }[] }
export interface AnalyticsLandingProps extends LandingSiteProps { periods: AnalyticsLandingPeriod[]; dataLabel: string; questions: string[]; onAnalyze: (question: string, context: { period: AnalyticsLandingPeriod; signal: AbortSignal }) => Promise<AnalyticsLandingAnswer>; period?: string; defaultPeriod?: string; onPeriodChange?: (period: string) => void }

const ANALYTICS_AUDIENCES = ["operators.", "builders.", "analysts."];

function AnalyticsAudience() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % ANALYTICS_AUDIENCES.length), 3400);
    return () => window.clearInterval(timer);
  }, [reduce]);
  const word = ANALYTICS_AUDIENCES[index];
  return <span className="relative inline-grid overflow-hidden whitespace-nowrap align-baseline text-primary"><span className="invisible col-start-1 row-start-1" aria-hidden="true">{word}</span><span className="sr-only">operators.</span><AnimatePresence initial={false}><motion.span key={word} aria-hidden="true" className="absolute inset-0 whitespace-nowrap" exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }}>{withOccurrenceKeys(word.split(""), letter => letter).map(({ item: letter, key }, position) => <motion.span key={key} className="inline-block" initial={reduce ? false : { opacity: 0, y: "90%", filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: "-90%", filter: "blur(5px)" }} transition={{ duration: reduce ? 0 : 0.38, delay: reduce ? 0 : position * 0.018, ease: [0.16, 1, 0.3, 1] }}>{letter}</motion.span>)}</motion.span></AnimatePresence></span>;
}

export function AnalyticsLanding({ periods, dataLabel, questions, onAnalyze, period: controlledPeriod, defaultPeriod, onPeriodChange, ...site }: AnalyticsLandingProps) {
  const id = useId();
  const [internalPeriod, setInternalPeriod] = useState(defaultPeriod ?? periods[0]?.id ?? "");
  const selected = controlledPeriod ?? internalPeriod;
  const period = periods.find(item => item.id === selected) ?? periods[0];
  const [question, setQuestion] = useState(questions[0] ?? "");
  const [answer, setAnswer] = useState<AnalyticsLandingAnswer | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const previousPeriod = useRef(period?.id);
  useEffect(() => { if (previousPeriod.current !== period?.id) { previousPeriod.current = period?.id; controller.current?.abort(); controller.current = null; setPending(false); setAnswer(null); setError(""); } return () => controller.current?.abort(); }, [period?.id]);
  const analyze = async () => {
    if (!period || !question.trim()) return;
    controller.current?.abort();
    const request = new AbortController(); controller.current = request;
    setPending(true); setError(""); setAnswer(null);
    try { const result = await onAnalyze(question.trim(), { period, signal: request.signal }); if (!request.signal.aborted) setAnswer(result); }
    catch (cause) { if (!request.signal.aborted) setError(cause instanceof Error ? cause.message : "Analysis failed. Please try again."); }
    finally { if (controller.current === request) setPending(false); }
  };
  const first = period?.funnel[0]?.count ?? 0;
  const last = period?.funnel.at(-1)?.count ?? 0;
  const conversion = first > 0 ? last / first * 100 : 0;
  const max = Math.max(1, ...(period?.funnel.map(item => item.count) ?? []));
  const sourceOccurrences = new Map<string, number>();
  return <LandingFrame {...site} appearance="analytics" groups={[{ label: "Product", links: [{ label: "Funnels", description: "Follow conversion from the first event", href: `#${id}-dashboard` }, { label: "Ask your data", description: "Ground an answer in its sources", href: `#${id}-analysis` }] }, { label: "Resources", links: [{ label: "Data sources", href: `#${id}-sources` }, { label: "Questions and answers", href: `#${id}-faq` }] }]} links={[{ label: "Pricing", href: `#${id}-pricing` }]}><main className="landing-analytics-main">
    <section className="landing-analytics-hero"><div className="landing-checker" aria-hidden="true"/><LandingReveal className="landing-analytics-copy"><p className="landing-eyebrow inline-flex items-center gap-2 border border-border bg-background px-2 py-1"><span className="bg-primary px-1.5 font-mono text-[9px] text-primary-foreground">LIVE</span>One view of your product journey ↗</p><h1>Decision-grade analytics for <AnalyticsAudience /></h1><p>Turn raw product data into grounded decisions — funnels, trends, and source-linked answers your whole team can understand.</p><div className="landing-hero-actions"><ButtonLink href={site.action.href} size="lg">{site.action.label} →</ButtonLink><ButtonLink href={`#${id}-pricing`} variant="outline" size="lg">View pricing</ButtonLink></div><div className="landing-analytics-badges">YOUR EVENTS　·　YOUR DEFINITIONS　·　SOURCE-LINKED</div></LandingReveal>
      <div id={`${id}-dashboard`} className="landing-analytics-dashboard scroll-mt-6"><div className="landing-demo-title"><span><span className="text-primary">■ LIVE</span> / FUNNELS / ACTIVATION</span><label className="text-[10px] text-muted-foreground">Period <select value={period?.id ?? ""} disabled={!periods.length} className="ml-2 border border-border bg-background px-2 py-1" onChange={event => { if (controlledPeriod === undefined) setInternalPeriod(event.target.value); onPeriodChange?.(event.target.value); }}>{periods.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>
        <div className="landing-wallet-body"><nav className="landing-wallet-sidebar" aria-label="Analytics preview sections"><a href={`#${id}-dashboard`}>⌂　Overview</a><a href={`#${id}-funnel`}>▥　Funnels</a><a href={`#${id}-analysis`}>⌕　Analysis</a><a href={`#${id}-sources`}>◇　Sources</a></nav><div className="landing-wallet-content">
          {period ? <><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[{ label: "Visitors", value: first.toLocaleString("en") }, { label: "Last-step events", value: last.toLocaleString("en") }, { label: "Conversion", value: `${conversion.toFixed(1)}%` }, { label: "Revenue", value: new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(period.revenue) }].map(item => <div key={item.label} className="min-w-0 border border-border p-4"><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{item.label}</p><p className="mt-4 text-2xl font-medium tracking-tight tabular-nums">{item.value}</p><p className="mt-2 font-mono text-[9px] text-muted-foreground">{period.label}</p></div>)}</div><div className="mt-4 border border-border p-4"><div className="mb-5 flex items-center justify-between"><h2 className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Sessions over time</h2><span className="font-mono text-[10px] text-primary">{period.label}</span></div><Sparkline data={period.series} labels={period.labels} label={`Visitors, ${period.label}`} height={180} interactive variant="area" showDelta /></div><div id={`${id}-funnel`} className="mt-4 grid gap-4 sm:grid-cols-2"><div className="border border-border p-4"><h2 className="mb-6 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Activation funnel</h2><ol className="space-y-4" aria-label={`Funnel, ${period.label}`}>{period.funnel.map(item => <li key={item.name}><div className="mb-2 flex justify-between gap-3 text-xs"><span>{item.name}</span><span className="font-mono tabular-nums">{item.count.toLocaleString("en")}</span></div><div className="h-5 overflow-hidden bg-muted"><div className="h-full origin-left bg-primary/75 motion-safe:transition-transform motion-safe:duration-300" style={{ transform: `scaleX(${Math.max(0, item.count / max)})` }}/></div></li>)}</ol>{!period.funnel.length && <p className="text-sm text-muted-foreground">No funnel events in this period.</p>}</div><div className="border border-border p-4"><h2 className="mb-6 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Conversion by step</h2><table className="w-full text-xs"><thead className="border-b border-border text-left font-mono text-[9px] text-muted-foreground"><tr><th className="pb-3 font-normal">STEP</th><th className="pb-3 text-right font-normal">FROM FIRST</th></tr></thead><tbody>{period.funnel.map(item => <tr key={item.name} className="border-b border-border"><td className="py-3">{item.name}</td><td className="text-right tabular-nums">{first ? (item.count / first * 100).toFixed(1) : "0.0"}%</td></tr>)}</tbody></table></div></div></> : <p className="p-10 text-muted-foreground">No data periods are available.</p>}<p id={`${id}-sources`} className="mt-4 font-mono text-[10px] text-muted-foreground">{dataLabel}</p>
        </div></div>
      </div>
    </section>
    <LandingSection id={`${id}-analysis`} eyebrow="A question is a good starting point" title="Ask the next question, not for the next report."><div className="grid gap-8 md:grid-cols-2"><div><p className="mb-6 leading-8 text-muted-foreground">An answer is useful when you can trace it back. Send your question to the analysis service you configure and keep its sources alongside the result.</p><div className="flex flex-wrap gap-2">{questions.map(item => <Button key={item} className="h-auto whitespace-normal py-2 text-left" variant="outline" size="sm" onClick={() => setQuestion(item)}>{item}</Button>)}</div></div><div className="rounded-2xl border border-border bg-card p-6"><form onSubmit={event => { event.preventDefault(); void analyze(); }}><label htmlFor={`${id}-question`} className="text-sm font-medium">Ask about {period?.label ?? "your data"}</label><textarea id={`${id}-question`} className="mt-3 min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm" value={question} onChange={event => setQuestion(event.target.value)} required /><Button type="submit" disabled={pending || !period || !question.trim()} className="mt-3">{pending ? "Analyzing…" : "Analyze question"}</Button>{pending && <Button className="ml-2" variant="ghost" onClick={() => { controller.current?.abort(); setPending(false); }}>Cancel</Button>}</form><div aria-live="polite" aria-busy={pending} className="mt-6">{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{answer && <><p className="leading-7">{answer.summary}</p><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{answer.sources.map((source) => { const identity = JSON.stringify([source.label, source.href]); const occurrence = sourceOccurrences.get(identity) ?? 0; sourceOccurrences.set(identity, occurrence + 1); return <li key={`${identity}:${occurrence}`}>{source.href ? <a className="underline" href={source.href}>{source.label} ↗</a> : source.label}</li>; })}</ul></>}{!pending && !answer && !error && <p className="text-sm text-muted-foreground">Your answer and its supporting sources will appear here.</p>}</div></div></div></LandingSection>
    <LandingSection title="A shared language for your numbers." eyebrow="From instrumentation to decision"><LandingFeatures items={[{ title: "Follow the whole journey", description: "Put visits, sign-ups, and outcomes in one funnel so teams agree on where the friction starts." }, { title: "Keep the source close", description: "Use answers with references, not a confident sentence detached from the data behind it." }, { title: "Build on your definitions", description: "Bring your own events and periods. The visual story updates from the same input as your report." }]} /></LandingSection>
    <LandingConversion {...site} id={id}/>
  </main></LandingFrame>;
}
