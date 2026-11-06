"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUp, Bot, CalendarDays, Check, ExternalLink, FileText, Globe, ListChecks, Mic, Paperclip, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { SceneError, useProductRequest } from "./illustration-product-scene";

const canvas = "@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground";
export interface ChatExchangeProps { title?: string; initialPrompt?: string; onSend: (prompt: string) => Promise<string>; className?: string; demo?: { response: string; steps: readonly string[]; artifacts: readonly string[] } }
/** Demo copy is presentation-only. Sending a message always calls the host. */
export function ChatExchange({ title = "AI conversation", initialPrompt = "", onSend, className, demo }: ChatExchangeProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [sent, setSent] = useState("");
  const request = useProductRequest<string>();
  const reduce = useReducedMotion();
  const demoPlaying = !sent && !!demo && !reduce;
  const demoWords = useMemo(() => {
    const occurrences = new Map<string, number>();
    return demo?.response.split(/\s+/).map(word => {
      const occurrence = (occurrences.get(word) ?? 0) + 1;
      occurrences.set(word, occurrence);
      return { word, id: `${word}:${occurrence}` };
    }) ?? [];
  }, [demo?.response]);
  return <section aria-label={title} className={cn(canvas, className)}>
    <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-[10%] text-xs leading-[1.5]" aria-live="polite" aria-busy={request.pending}>
      <div className="flex flex-col gap-2.5">
        <p className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-[oklch(0.58_0.18_250)] px-3.5 py-2.5 font-medium leading-[1.45] text-[oklch(0.98_0_0)] dark:bg-[oklch(0.64_0.16_250)]">{sent || initialPrompt || "What would you like to explore?"}</p>
        <div className="relative min-h-36 w-[88%]">
          {request.pending && <p className="absolute left-0 top-0 flex items-center gap-2 text-xs text-muted-foreground"><Bot className="size-3" aria-hidden />Thinking through the brief…</p>}
          {(request.result !== null || (!sent && demo)) && <motion.div initial={false} animate={{ opacity: demoPlaying ? [0, 0, 1, 1, 0] : 1 }} transition={demoPlaying ? { duration: 5.8, times: [0, .38, .4, .98, 1], repeat: Infinity, ease: "linear" } : { duration: reduce ? 0 : .3 }}><p className="mb-1.5 text-[10.24px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Assistant</p><p>{!sent && demo ? demoWords.map(({ word, id }, index, words) => <motion.span key={id} className="inline-block" initial={false} animate={{opacity: demoPlaying ? [0, 0, 1, 1, 0] : 1}} transition={demoPlaying ? {duration:5.8,times:[0,Math.min(.8,.38+index*.06/5.8),Math.min(.84,.4+index*.06/5.8),.98,1],repeat:Infinity,ease:"linear"} : {duration:0}}>{word}{index < words.length - 1 ? "\u00a0" : ""}</motion.span>) : request.result}</p>{!sent && demo && <ul className="mt-2.5 flex flex-col gap-1.5 text-[11.2px]">{demo.steps.map((step, index) => <motion.li className="flex items-center gap-2" key={step} initial={false} animate={{opacity:demoPlaying ? [0,0,1,1,0] : 1}} transition={demoPlaying ? {duration:5.8,times:[0,Math.min(.85,(3.2+index*.16)/5.8),Math.min(.9,(3.45+index*.16)/5.8),.98,1],repeat:Infinity,ease:EASE_OUT} : {duration:0}}><span aria-hidden className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[oklch(0.58_0.18_250)] text-[oklch(0.98_0_0)] dark:bg-[oklch(0.64_0.16_250)]"><Check className="size-2" strokeWidth={2.4} /></span>{step}</motion.li>)}</ul>}</motion.div>}
        </div>
      </div>
      {!sent && demo && <motion.div initial={false} animate={{opacity:demoPlaying ? [0,0,1,1,0] : 1}} transition={demoPlaying ? {duration:5.8,times:[0,.68,.73,.98,1],repeat:Infinity,ease:EASE_OUT} : {duration:0}} className="flex flex-wrap gap-1.5">{demo.artifacts.map((artifact, index) => { const Icon = [FileText, ListChecks, CalendarDays][index % 3]; return <span key={artifact} className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[10.24px]"><Icon className="size-2.5 text-muted-foreground" strokeWidth={1.8} aria-hidden />{artifact}</span>; })}</motion.div>}
      <SceneError message={request.error} />
    </div>
    <form className="absolute inset-x-[8%] bottom-3 flex gap-2 rounded-xl border border-border bg-background p-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100" onSubmit={event => { event.preventDefault(); if (prompt.trim() && !request.pending) { setSent(prompt.trim()); void request.run(() => onSend(prompt.trim())); } }}><input aria-label="Message" value={prompt} onChange={event => setPrompt(event.target.value)} disabled={request.pending} className="min-w-0 flex-1 bg-transparent text-xs outline-none" /><button type="submit" aria-label="Send message" disabled={!prompt.trim() || request.pending} className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-40"><ArrowUp className="size-3" /></button></form>
  </section>;
}

export interface ResearchResult { summary: string; sources: { title: string; url: string }[] }
export interface ResearchSceneProps { onResearch: (query: string) => Promise<ResearchResult>; initialQuery?: string; title?: string; className?: string }
/** Compact AI composer. Existing research callback still supplies genuine user-request results. */
export function ResearchScene({ onResearch, initialQuery = "", title = "Message your AI assistant", className }: ResearchSceneProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSources, setShowSources] = useState(true);
  const request = useProductRequest<ResearchResult>();
  const sourceOccurrences = new Map<string, number>();
  return <section aria-label="AI composer" className={cn(canvas, className)}>
    <form className="absolute left-[10%] top-[38%] w-[128%] rounded-[5cqw] border-[3px] border-primary/30 bg-background px-[max(12px,3.2cqw)] pt-[max(16px,4cqw)] pb-[max(12px,2.5cqw)]" onSubmit={event => { event.preventDefault(); if (query.trim() && !request.pending) void request.run(() => onResearch(query.trim())); }}>
      <textarea aria-label="Message your AI assistant" placeholder={title} value={query} onChange={event => setQuery(event.target.value)} disabled={request.pending} rows={2} className="block h-12 min-h-12 w-full resize-none bg-transparent px-1 text-[max(12.8px,3cqw)] font-medium tracking-tight outline-none placeholder:text-muted-foreground" />
      <div className="flex h-8 w-[80cqw] items-center gap-[4%] text-muted-foreground"><Paperclip aria-hidden className="size-4" /><Mic aria-hidden className="size-4" /><button type="button" aria-pressed={showSources} onClick={() => setShowSources(value => !value)} className={cn("flex cursor-pointer items-center gap-2 rounded-full px-[3%] py-[2%] text-xs", showSources && "bg-primary/10 text-primary")}><Globe className="size-[3cqw]" aria-hidden />Search</button><Bot className="size-4" aria-hidden /><button type="submit" aria-label="Send research request" disabled={!query.trim() || request.pending} className="ml-auto grid size-[8cqw] place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"><ArrowUp className="size-[4cqw]" /></button></div>
    </form>
    <div className="absolute inset-x-[7%] bottom-[5%] max-h-[28%] overflow-y-auto text-[2.3cqw]" aria-live="polite" aria-busy={request.pending}>{request.pending && <p>Reviewing sources…</p>}{request.result && <div className="rounded-xl border border-border bg-background p-3"><p>{request.result.summary}</p>{showSources && <ul className="mt-2 space-y-1">{request.result.sources.map(source => {
      const identity = JSON.stringify([source.url, source.title]);
      const occurrence = sourceOccurrences.get(identity) ?? 0;
      sourceOccurrences.set(identity, occurrence + 1);
      return <li key={JSON.stringify([identity, occurrence])}><a href={/^https?:\/\//i.test(source.url) ? source.url : undefined} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline underline-offset-2"><ExternalLink className="size-3" />{source.title}</a></li>;
    })}</ul>}</div>}<SceneError message={request.error} /></div>
  </section>;
}

export interface GeneratedConcept { id: string; title: string; description: string; artwork?: ReactNode }
export interface GenerationSceneProps { onGenerate: (brief: string) => Promise<GeneratedConcept[]>; onSelect?: (concept: GeneratedConcept) => void; initialBrief?: string; className?: string; prompts?: readonly string[]; autoPlay?: boolean }
const defaultPrompts = ["Analyze onchain data", "Compare token metrics", "Review governance votes", "Summarize market news", "Track wallet activity", "Forecast treasury runway", "Monitor protocol risk"];
/** Passive prompt rotation never invokes the host. Activating a prompt does. */
export function GenerationScene({ onGenerate, onSelect, initialBrief = "", className, prompts = defaultPrompts, autoPlay = true }: GenerationSceneProps) {
  const [active, setActive] = useState(3);
  const [engaged, setEngaged] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const request = useProductRequest<GeneratedConcept[]>();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!autoPlay || reduce || engaged || request.pending || request.result || prompts.length < 2) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % prompts.length), 1400);
    return () => window.clearInterval(timer);
  }, [autoPlay, reduce, engaged, request.pending, request.result, prompts.length]);
  return <section aria-label="AI prompt roller" className={cn(canvas, className)} onFocusCapture={() => setEngaged(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }}>
    {!request.result && <div className="absolute inset-0 [perspective:900px] [transform-style:preserve-3d]" aria-busy={request.pending}><div aria-hidden className="absolute left-[7%] top-1/2 h-[clamp(3rem,14cqw,4.75rem)] w-[86%] -translate-y-1/2 rounded-full border border-border bg-background flex items-center px-[3.5cqw]"><span aria-hidden className="flex size-[10cqw] shrink-0 items-center justify-between rounded-full bg-primary px-[2cqw] text-primary-foreground"><span className="size-[1cqw] rounded-full bg-current" /><span className="size-[1cqw] rounded-full bg-current" /></span></div>{prompts.map((prompt, index) => { let offset = index - active; if (prompts.length > 3) offset -= Math.round(offset / prompts.length) * prompts.length; const selected = index === active; return <motion.button type="button" key={prompt} aria-label={`Use prompt: ${prompt}`} aria-pressed={selected} tabIndex={selected ? 0 : -1} onClick={() => { setActive(index); setSelected(null); void request.run(() => onGenerate(prompt || initialBrief)); }} disabled={request.pending} initial={false} animate={{ y: `calc(-50% + ${offset * 142}%)`, x: selected ? 0 : -28, z: selected ? 54 : 20, rotate: offset * -7, opacity: Math.abs(offset) > 1 ? 0 : selected ? 1 : .32, scale: selected ? 1 : .92 }} transition={reduce ? { duration: 0 } : { duration: .6, ease: EASE_OUT }} className={cn("absolute left-[7%] top-1/2 flex h-[clamp(3rem,14cqw,4.75rem)] w-[86%] cursor-pointer items-center rounded-full text-left tracking-[-0.035em]", selected ? "gap-[5%] px-[3.5cqw] text-[clamp(1.125rem,5.5cqw,2rem)] font-semibold" : "justify-center whitespace-nowrap text-[clamp(1rem,5cqw,1.75rem)] font-medium text-muted-foreground")} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setActive((active + (event.key === "ArrowDown" ? 1 : -1) + prompts.length) % prompts.length); } }}>{selected && <span aria-hidden className="size-[10cqw] shrink-0" />}<span className={selected ? "truncate tracking-[-0.04em]" : undefined}>{prompt}</span></motion.button>; })}<div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[16%] bg-gradient-to-b from-muted to-transparent" /><div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[16%] bg-gradient-to-t from-muted to-transparent" /></div>}
    {request.result && <div className="absolute inset-[8%] overflow-y-auto"><div className="grid grid-cols-2 gap-2">{request.result.map(concept => <button type="button" key={concept.id} aria-pressed={selected === concept.id} onClick={() => { setSelected(concept.id); onSelect?.(concept); }} className={cn("rounded-xl border border-border bg-background p-3 text-left text-xs", selected === concept.id && "ring-2 ring-primary")}><span className="mb-2 grid h-16 place-items-center rounded-lg bg-muted">{concept.artwork ?? <Sparkles className="size-6" />}</span><strong>{concept.title}</strong><span className="mt-1 block text-muted-foreground">{concept.description}</span></button>)}</div>{request.result.length === 0 && <p className="text-sm">No directions returned.</p>}</div>}
    <div className="absolute inset-x-[8%] bottom-2 text-xs" aria-live="polite">{request.pending && <p className="rounded-full bg-background px-3 py-2">Creating directions from the selected prompt…</p>}<SceneError message={request.error} /></div>
  </section>;
}
