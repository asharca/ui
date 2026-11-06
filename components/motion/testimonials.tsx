"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/motion/button";
import { Marquee } from "@/components/motion/marquee";
import { StoryMedia, StoryPlayback, StoryReveal, useStorySelection, type StorySelectionProps } from "@/components/motion/marketing-stories-shared";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  href?: string;
  outcome?: string;
  note?: string;
  reference?: string;
}
export interface TestimonialWallProps {
  items: readonly Testimonial[];
  title?: string;
  className?: string;
  speed?: number;
}

export function TestimonialQuote({ item, featured = false, archive = false, dispatch = false }: { item: Testimonial; featured?: boolean; archive?: boolean; dispatch?: boolean }) {
  return <figure className={cn("relative h-full rounded-2xl border border-border/60 bg-background p-5 text-foreground", featured && "border-primary/40", archive && "rounded border-border/70 bg-muted/40", dispatch && "rounded-none", dispatch && item.outcome && "bg-primary/5")}>
    {archive && <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><span>REF {item.reference ?? item.id}</span><span aria-hidden="true">↗</span></div>}
    {item.outcome && <p className={dispatch ? "mb-8 font-mono text-xs uppercase tracking-[0.14em] text-primary" : "sr-only"}>{item.outcome}</p>}
    <blockquote className={cn("text-pretty text-sm leading-6", featured && "text-base leading-normal sm:text-lg", archive && "mt-7 max-w-[15rem] font-mono", dispatch && "font-sans text-lg leading-7")}>{archive ? item.quote : `“${item.quote}”`}</blockquote><figcaption className={cn("mt-4 flex items-center gap-3", archive && "mt-5 items-end justify-between border-t border-dashed border-border/70 pt-3", dispatch && "mt-8")}>
      {!dispatch && (archive ? <div className="absolute -top-8 right-4 w-20 rotate-3"><div className="rounded-sm border border-border/60 bg-background p-1.5">{item.avatar ? <StoryMedia src={item.avatar} alt={`Portrait of ${item.name}`} className="aspect-square w-full rounded-sm" /> : <span aria-hidden="true" className="flex aspect-square items-center justify-center bg-primary/10 text-2xl">{item.name.slice(0, 1)}</span>}</div><span aria-hidden="true" className="mt-1 block text-center text-[10px] italic text-muted-foreground">FIG. {item.name.slice(0, 1)}</span></div> : item.avatar ? <StoryMedia src={item.avatar} alt={`Portrait of ${item.name}`} className="size-9 shrink-0 rounded-full border border-border/60" /> : <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm">{item.name.slice(0, 1)}</span>)}
      <div className="min-w-0"><p className={cn("text-sm font-medium", archive && "font-normal italic", dispatch && "text-xs uppercase tracking-wider")}>{item.href ? <a href={item.href} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">{item.name}</a> : item.name}</p><p className={cn("mt-1 text-xs text-muted-foreground", archive && "font-mono text-[10px] uppercase tracking-[0.12em]", dispatch && "font-mono text-[10px] uppercase tracking-wider")}>{[item.role, item.company].filter(Boolean).join(archive ? " @ " : ", ")}</p></div>
    </figcaption>{item.note && <p className="sr-only">{item.note}</p>}
  </figure>;
}

const pausedTracks = "[&_.animate-marquee]:[animation-play-state:paused] [&_.animate-marquee-vertical]:[animation-play-state:paused]";

export function TestimonialMarqueeWall({ items, title = "Good work travels.", className, speed = 45 }: TestimonialWallProps) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const heading = useId();
  const split = Math.floor(items.length / 2);
  const first = items.slice(0, split);
  const second = items.slice(split);
  return <section aria-labelledby={heading} className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-8", className)}><header className="mx-auto max-w-2xl text-center"><p className="mx-auto w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Loved by builders</p><h2 id={heading} className="mt-5 text-balance text-4xl font-medium">{title}</h2><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">From solo founders to platform teams — thoughtful interfaces, considered motion, and source you own.</p><div className="sr-only focus-within:not-sr-only">{!reduce && items.length > 0 && <StoryPlayback paused={paused} toggle={() => setPaused(!paused)} />}</div></header>
    {!items.length ? <p role="status">No testimonials yet.</p> : reduce ? <div className="mt-14 grid gap-4 sm:grid-cols-2">{items.map(item => <TestimonialQuote key={item.id} item={item} />)}</div> : <div className={cn("relative mt-14 space-y-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] focus-within:[&_.animate-marquee]:[animation-play-state:paused]", paused && pausedTracks)}>{[first, second].map((row, index) => row.length > 0 && <Marquee key={row[0].id} direction={index === 0 ? "left" : "right"} speed={Math.max(5, speed)}>{row.map(item => <div key={item.id} className="w-80"><TestimonialQuote item={item} /></div>)}</Marquee>)}</div>}
  </section>;
}

export interface TestimonialSpotlightProps extends TestimonialWallProps, StorySelectionProps {}
export function TestimonialSpotlight({ items, title = "In their own words.", className, ...props }: TestimonialSpotlightProps) {
  const selection = useStorySelection(items.map((item) => item.id), props);
  const active = items.find((item) => item.id === selection.selected);
  const heading = useId();
  return <section aria-labelledby={heading} aria-roledescription="carousel" className={cn("w-full bg-background px-4 py-20 text-center text-foreground sm:px-8", className)} {...selection.pauseProps}><div className="mx-auto max-w-3xl"><header><h2 id={heading} className="mx-auto w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{title}</h2><div className="sr-only focus-within:not-sr-only">{props.autoPlay && <StoryPlayback paused={selection.paused} toggle={selection.toggle} />}</div></header>{active ? <><StoryReveal identity={active.id} className="mt-8"><figure><div className="flex min-h-48 items-center justify-center"><blockquote className="text-2xl font-medium leading-9 tracking-tight">“{active.quote}”</blockquote></div><figcaption className="mt-8 min-h-12"><p className="text-sm font-medium">{active.href ? <a href={active.href} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">{active.name}</a> : active.name}</p><p className="mt-1 text-xs text-muted-foreground">{[active.role, active.company].filter(Boolean).join(", ")}</p></figcaption></figure></StoryReveal><fieldset aria-label="Choose testimonial" className="m-0 mt-10 flex min-w-0 items-end justify-center border-0 p-0">{items.map(item => <motion.button type="button" key={item.id} aria-label={`Show testimonial from ${item.name}`} aria-pressed={item.id === active.id} onClick={() => selection.select(item.id)} animate={{ scale: item.id === active.id ? 1.18 : 1, y: item.id === active.id ? -5 : 0, opacity: item.id === active.id ? 1 : .6 }} transition={selection.reduce ? { duration: 0 } : { duration: .25, ease: EASE_OUT }} className="relative mx-0.5 overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.avatar ? <StoryMedia src={item.avatar} alt={item.name} className="h-16 w-14 grayscale" /> : <span aria-hidden="true" className="flex h-16 w-14 items-center justify-center bg-muted text-xl">{item.name.slice(0, 1)}</span>}</motion.button>)}</fieldset><div className="sr-only focus-within:not-sr-only"><Button variant="ghost" size="sm" aria-label="Previous testimonial" disabled={items.length < 2} onClick={() => selection.move(-1)}>←</Button><span>{selection.index + 1} / {items.length}</span><Button variant="ghost" size="sm" aria-label="Next testimonial" disabled={items.length < 2} onClick={() => selection.move(1)}>→</Button></div></> : <p role="status">No testimonials yet.</p>}</div></section>;
}

export function TestimonialMasonryGrid({ items, title = "A thousand different paths. Shared progress.", className }: TestimonialWallProps) {
  const reduce = useReducedMotion();
  const heading = useId();
  return <section aria-labelledby={heading} className={cn("w-full bg-background px-4 py-20 text-foreground sm:px-8", className)}><div className="mx-auto max-w-6xl"><header className="max-w-2xl"><p className="text-xs text-muted-foreground">Wall of love</p><h2 id={heading} className="mt-5 text-balance text-4xl font-medium">{title}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Trusted by independent builders and teams who sweat the details.</p></header>{!items.length && <p role="status">No testimonials yet.</p>}<div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">{items.map((item, index) => <motion.div key={item.id} className="mb-4 break-inside-avoid" initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: .35, delay: reduce ? 0 : index % 3 * .06, ease: EASE_OUT }}><TestimonialQuote item={item} featured={index === 0} /></motion.div>)}</div></div></section>;
}

export interface TestimonialArchiveWallProps extends TestimonialWallProps { joinHref?: string; joinLabel?: string; }
export function TestimonialArchiveWall({ items, title = "The customer archive.", joinHref, joinLabel = "Join the archive", className }: TestimonialArchiveWallProps) {
  const heading = useId();
  return <section aria-labelledby={heading} className={cn("w-full bg-background px-4 py-20 text-foreground sm:px-8", className)}><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hall of fame</p><h2 id={heading} className="mt-5 max-w-md text-balance text-4xl font-medium leading-[1.05]">{title}</h2></div><div className="sm:text-right"><p className="font-mono text-xs text-muted-foreground">Field notes from teams building in the open.</p>{joinHref && <ButtonLink href={joinHref} variant="ghost" size="sm" className="mt-3">{joinLabel} ↗</ButtonLink>}</div></header>{!items.length && <p role="status">The archive is awaiting its first account.</p>}<div className="mt-20 grid items-start gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <div key={item.id} className={index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}><TestimonialQuote item={item} archive /></div>)}</div></div></section>;
}

export function TestimonialVerticalDispatch({ items, title = "Dispatches from the field.", className, speed = 50 }: TestimonialWallProps) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const heading = useId();
  const columns = [0, 1, 2].map((column) => items.filter((_, index) => index % 3 === column));
  return <section aria-labelledby={heading} className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-8", className)}><div className="mx-auto grid max-w-6xl gap-10 border-y border-border py-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-0 lg:py-0"><header className="flex flex-col justify-between border-border lg:border-r lg:py-10 lg:pr-10"><div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Field notes</p><h2 id={heading} className="mt-5 max-w-sm text-balance text-4xl font-medium leading-tight tracking-[-0.03em]">{title}</h2></div><div className="mt-8"><p className="font-mono text-xs text-muted-foreground">{items.length} dispatches</p><p className="mt-3 text-xs text-muted-foreground">Continuous signal</p>{!reduce && items.length > 0 && <div className="mt-5"><StoryPlayback paused={paused} toggle={() => setPaused(!paused)} /></div>}</div></header>{!items.length ? <p role="status">No dispatches yet.</p> : reduce ? <div className="grid gap-4 sm:grid-cols-2 lg:py-5 lg:pl-5">{items.map(item => <TestimonialQuote key={item.id} item={item} dispatch />)}</div> : <div className={cn("grid h-[38rem] grid-cols-2 gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] focus-within:[&_.animate-marquee-vertical]:[animation-play-state:paused] lg:grid-cols-3 lg:pl-5", paused && pausedTracks)}>{columns.map((column, index) => column.length > 0 && <Marquee key={column[0].id} direction={index % 2 === 0 ? "up" : "down"} speed={Math.max(5, speed + index * 9)} className={cn("h-full [&_.animate-marquee-vertical]:w-full [&_.animate-marquee-vertical>div]:w-full", index === 2 && "hidden lg:flex")}>{column.map(item => <TestimonialQuote key={item.id} item={item} dispatch />)}</Marquee>)}</div>}</div></section>;
}
