"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/motion/button";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { StoryMedia, StoryPlayback, StoryReveal, useStorySelection, type StorySelectionProps } from "@/components/motion/marketing-stories-shared";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface CustomerOutcome {
  label: string;
  before: number;
  after: number;
  unit?: string;
  description?: string;
}
export interface CustomerStory {
  id: string;
  customer: string;
  industry: string;
  title: string;
  summary: string;
  quote: string;
  person: string;
  role?: string;
  href: string;
  image?: { src: string; alt: string };
  outcomes: readonly CustomerOutcome[];
}
export interface CaseStudyProps extends StorySelectionProps {
  stories: readonly CustomerStory[];
  title?: string;
  className?: string;
}

export function CustomerStoryMetrics({ story }: { story: CustomerStory }) {
  return <dl className="grid grid-cols-2 gap-5 border-y border-border py-5 sm:grid-cols-[repeat(auto-fit,minmax(5rem,1fr))]">{story.outcomes.map((outcome) => <div key={outcome.label}><dd className="text-3xl font-medium tracking-tight"><AnimatedNumber key={story.id} value={outcome.after} startOnView={false} />{outcome.unit}</dd><dt className="mt-2 text-xs leading-5 text-muted-foreground">{outcome.label}</dt></div>)}</dl>;
}

export function CustomerStoryDialog({ story, onClose }: { story: CustomerStory | undefined; onClose: () => void }) {
  const reduce = useReducedMotion();
  return <MorphingModal viewId={story?.id ?? null} onClose={onClose} placement="center" ariaLabel={story ? `${story.customer} customer story` : undefined} className="max-w-3xl [&>div]:p-0">
    {story && <div className="max-h-[92dvh] overflow-y-auto p-2"><div className="relative"><StoryMedia src={story.image?.src} alt={story.image?.alt ?? story.customer} className="h-48 rounded-2xl sm:h-72" /><button type="button" onClick={onClose} aria-label="Close story" className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/85 text-2xl text-foreground backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-ring">×</button></div><div className="space-y-8 px-4 py-7 sm:px-8 sm:py-9"><header><div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">{story.customer}</span><span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{story.industry}</span></div><h2 className="mt-3 text-balance text-xl font-medium leading-snug sm:text-2xl">{story.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{story.summary}</p></header>
      <div className="space-y-6">{story.outcomes.map(outcome => {
        const max = Math.max(Math.abs(outcome.before), Math.abs(outcome.after), 1);
        return <section key={outcome.label}><h3 className="text-sm">{outcome.label}</h3>{[{ label: "Before", value: outcome.before }, { label: "After", value: outcome.after }].map(bar => <div key={bar.label} className="mt-2 grid grid-cols-[3rem_1fr_4rem] items-center gap-3 text-xs"><span className="text-muted-foreground">{bar.label}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><motion.div initial={reduce ? false : { width: 0 }} animate={{ width: `${Math.abs(bar.value) / max * 100}%` }} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className={cn("h-full rounded-full", bar.label === "After" ? "bg-primary" : "bg-muted-foreground/35")} /></div><span className="text-right font-mono tabular-nums">{bar.value}{outcome.unit}</span></div>)}{outcome.description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{outcome.description}</p>}</section>;
      })}</div><figure className="border-t border-border pt-7"><blockquote className="text-pretty text-base leading-7">“{story.quote}”</blockquote><figcaption className="mt-5 text-xs text-muted-foreground">{story.person}{story.role && ` · ${story.role}`}</figcaption></figure><ButtonLink href={story.href} variant="outline">Read full case study ↗</ButtonLink></div></div>}
  </MorphingModal>;
}

function StoryHeader({ title, heading, children }: { title: string; heading: string; children: ReactNode }) {
  return <header className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between"><div className="max-w-xl"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Customer stories</p><h2 id={heading} className="mt-4 text-balance text-4xl font-medium tracking-tight">{title}</h2><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Real results from independent teams. Pick a story to see what changed and what they learned.</p></div>{children}</header>;
}
function IndustryFilters({ stories, current, onChange }: { stories: readonly CustomerStory[]; current: string; onChange: (value: string) => void }) {
  const rail = useRef<HTMLFieldSetElement>(null);
  const reduce = useReducedMotion();
  const scroll = (direction: -1 | 1) => rail.current?.scrollBy({ left: direction * 200, behavior: reduce ? "instant" : "smooth" });
  const industries = ["All", ...new Set(stories.map(story => story.industry).filter(item => item !== "All"))];
  return <div className="flex min-w-0 items-center gap-1"><button type="button" aria-label="Scroll tabs left" onClick={() => scroll(-1)} className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring xl:hidden">‹</button><fieldset ref={rail} aria-label="Filter by industry" className="m-0 flex min-w-0 gap-1 overflow-x-auto rounded-full border-0 bg-muted/40 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{industries.map(item => <button type="button" key={item} aria-pressed={current === item} onClick={() => onChange(item)} className={cn("shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring", current === item ? "bg-background font-medium shadow-sm" : "text-muted-foreground")}>{item === "All" ? "All stories" : item}<span className="ml-2 text-[10px] text-muted-foreground">{item === "All" ? stories.length : stories.filter(story => story.industry === item).length}</span></button>)}</fieldset><button type="button" aria-label="Scroll tabs right" onClick={() => scroll(1)} className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring xl:hidden">›</button></div>;
}
export function CaseStudySpotlight({ stories, title = "Teams that changed how they work, in their own numbers.", className, ...selectionProps }: CaseStudyProps) {
  const [industry, setIndustry] = useState("All");
  const filtered = stories.filter(story => industry === "All" || story.industry === industry);
  const selection = useStorySelection(filtered.map(story => story.id), selectionProps);
  const active = filtered.find(story => story.id === selection.selected);
  const [detail, setDetail] = useState<string>();
  const heading = useId();
  return <section aria-labelledby={heading} className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8 sm:py-24", className)} {...selection.pauseProps}><div className="mx-auto max-w-6xl"><StoryHeader title={title} heading={heading}><IndustryFilters stories={stories} current={industry} onChange={setIndustry} /></StoryHeader>
    {!active ? <p role="status" className="p-8 text-muted-foreground">No customer stories yet.</p> : <div className="mt-12 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-6"><fieldset aria-label="Choose customer" className="m-0 flex min-w-0 gap-2 overflow-x-auto border-0 p-0 lg:flex-col">{filtered.map(story => <button type="button" key={story.id} aria-pressed={active.id === story.id} onClick={() => selection.select(story.id)} className={cn("h-auto shrink-0 rounded-2xl p-4 text-left text-sm", active.id === story.id && "border border-border bg-background shadow-sm")}><span className="mr-2 text-primary">●</span>{story.customer}<span className="mt-2 block text-xs text-muted-foreground">{story.outcomes[0]?.after}{story.outcomes[0]?.unit} {story.outcomes[0]?.label}</span></button>)}</fieldset><StoryReveal identity={active.id} className="overflow-hidden rounded-3xl border border-border bg-background p-2"><div className="grid md:grid-cols-2"><div className="relative min-h-80 overflow-hidden rounded-2xl md:min-h-[36rem]"><StoryMedia src={active.image?.src} alt={active.image?.alt ?? active.customer} className="absolute inset-0" /><span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" /><p className="absolute bottom-5 left-5 font-medium text-white">{active.customer}</p></div><div className="space-y-6 p-6 sm:p-8"><p className="w-fit rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] text-primary">{active.industry}</p><h3 className="text-xl font-medium leading-snug tracking-tight">{active.title}</h3><p className="text-sm leading-6 text-muted-foreground">{active.summary}</p><CustomerStoryMetrics story={active} /><blockquote><p className="text-sm leading-7">“{active.quote}”</p><footer className="mt-3 text-xs text-muted-foreground">{active.person}{active.role && ` · ${active.role}`}</footer></blockquote><Button variant="secondary" size="sm" onClick={() => setDetail(active.id)}>Read the story ↗</Button></div></div></StoryReveal></div>}
    {selectionProps.autoPlay && <div className="mt-5"><StoryPlayback paused={selection.paused} toggle={selection.toggle} /></div>}<CustomerStoryDialog story={stories.find(story => story.id === detail)} onClose={() => setDetail(undefined)} /></div></section>;
}

export interface CaseStudyGridProps extends Pick<CaseStudyProps, "stories" | "title" | "className"> {
  industry?: string;
  defaultIndustry?: string;
  onIndustryChange?: (industry: string) => void;
}
export function CaseStudyGrid({ stories, title = "Small teams. Remarkable outcomes.", className, industry, defaultIndustry = "All", onIndustryChange }: CaseStudyGridProps) {
  const [localIndustry, setLocalIndustry] = useState(defaultIndustry);
  const [detail, setDetail] = useState<string>();
  const current = industry ?? localIndustry;
  const filtered = stories.filter((story) => current === "All" || story.industry === current);
  const reduce = useReducedMotion();
  const heading = useId();
  return <section aria-labelledby={heading} className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8 sm:py-24", className)}><div className="mx-auto max-w-6xl"><StoryHeader title={title} heading={heading}><IndustryFilters stories={stories} current={current} onChange={next => { if (industry === undefined) setLocalIndustry(next); onIndustryChange?.(next); }} /></StoryHeader>
    <p className="sr-only" role="status">{filtered.length} customer stories</p>
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((story, index) => <motion.article key={story.id} layout={!reduce} transition={SPRING_LAYOUT} className={cn("overflow-hidden rounded-3xl border border-border bg-background p-2", index === 0 && "sm:col-span-2")}><button type="button" onClick={() => setDetail(story.id)} className="block w-full overflow-hidden rounded-2xl text-left" aria-label={story.title}><StoryMedia src={story.image?.src} alt={story.image?.alt ?? story.customer} className={index === 0 ? "h-72 sm:h-96" : "h-56"} /></button><div className="space-y-4 p-5"><p className="text-xs text-muted-foreground">{story.customer} / {story.industry}</p><h3 className="text-xl font-medium leading-snug tracking-tight">{story.title}</h3>{index === 0 && <p className="text-sm leading-7 text-muted-foreground">{story.summary}</p>}<CustomerStoryMetrics story={index === 0 ? story : { ...story, outcomes: story.outcomes.slice(0, 1) }} /><Button variant="ghost" size="sm" onClick={() => setDetail(story.id)}>Read the story ↗</Button></div></motion.article>)}</div>
    {!filtered.length && <p className="p-10 text-center text-muted-foreground">No stories in this industry yet.</p>}
    <CustomerStoryDialog story={stories.find(story => story.id === detail)} onClose={() => setDetail(undefined)} /></div>
  </section>;
}
