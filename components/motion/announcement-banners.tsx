"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/motion/button";
import { CenterMorphModal, CenterMorphModalTrigger, CenterMorphModalContent } from "@/components/motion/center-morph-modal";
import { ShaderBackground } from "@/components/motion/shader-background";
import { Marquee } from "@/components/motion/marquee";
import { useMarketingPlayback } from "@/components/motion/marketing-systems-playback";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface AnnouncementStory { id: string; title: string; description?: string; label?: string; href: string; actionLabel: string }
export interface AnnouncementProps { stories: AnnouncementStory[]; className?: string; interval?: number; onDismiss?: () => void; dismissed?: boolean; defaultDismissed?: boolean }

function usePlayback(interval: number, count: number) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { playbackRef, playing, interactionProps } = useMarketingPlayback<HTMLElement>();
  useEffect(() => { if (paused || !playing || reduce || count < 2) return; const timer = setInterval(() => setIndex(v => (v + 1) % count), Math.max(1000, interval)); return () => clearInterval(timer); }, [paused, playing, reduce, count, interval]);
  return { index: count ? index % count : 0, setIndex, paused, setPaused, stopped: paused || !playing || !!reduce, handlers: { ref: playbackRef, ...interactionProps } };
}
function AnnouncementFrame({ children, className, dismissed: controlled, defaultDismissed = false, onDismiss }: Omit<AnnouncementProps, "stories"> & { children: (dismiss: () => void) => ReactNode }) {
  const [internal, setInternal] = useState(defaultDismissed);
  const dismissed = controlled ?? internal;
  const ref = useRef<HTMLElement>(null);
  const pendingFocus = useRef(false);
  useEffect(() => { if (dismissed && pendingFocus.current) { ref.current?.focus(); pendingFocus.current = false; } }, [dismissed]);
  return <section ref={ref} tabIndex={-1} className={cn("w-full text-foreground focus-visible:outline-2 focus-visible:outline-ring", className)} aria-label="Announcements" >{dismissed ? <p role="status" className="p-3 text-sm text-muted-foreground">Announcements dismissed.</p> : children(() => { pendingFocus.current = true; if (controlled === undefined) setInternal(true); onDismiss?.(); })}</section>;
}

export function GradientMarqueeStrip({ stories, interval = 5000, ...props }: AnnouncementProps) {
  const reduce = useReducedMotion();
  const playback = usePlayback(interval, stories.length);
  if (!stories.length) return null;
  return <AnnouncementFrame {...props}>{dismiss => <section {...playback.handlers} className="relative flex min-h-14 items-center gap-3 overflow-hidden bg-gradient-to-r from-primary/15 via-background to-primary/10 px-3 sm:px-4"><div className={cn("min-w-0 flex-1", playback.stopped && "[&_.animate-marquee]:[animation-play-state:paused]")}>{reduce ? <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">{stories.map(story => <li key={story.id}><strong className="mr-2">{story.label ?? "News"}</strong>{story.title}</li>)}</ul> : <Marquee fade={false} speed={28}>{stories.map(story => <span key={story.id} className="inline-flex items-center gap-3 text-sm"><strong>{story.label ?? "News"}</strong>{story.title}<span aria-hidden="true">✦</span></span>)}</Marquee>}</div><ButtonLink href={stories[0].href} size="sm">{stories[0].actionLabel}</ButtonLink><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" onClick={() => playback.setPaused(!playback.paused)} aria-pressed={playback.paused}>{playback.paused ? "Play" : "Pause"}</Button><Button variant="ghost" size="sm" onClick={dismiss} aria-label="Dismiss announcements">×</Button></section>}</AnnouncementFrame>;
}

export interface ShaderLaunchModalProps { story: AnnouncementStory; artwork?: ReactNode; headline?: ReactNode; secondaryAction?: { label: string; href: string }; presentation?: "dialog" | "inline"; className?: string; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; triggerLabel?: string }
export function ShaderLaunchModal({ story, artwork, headline, secondaryAction, presentation = "dialog", className, triggerLabel = "See what’s new", open: controlled, defaultOpen, onOpenChange }: ShaderLaunchModalProps) {
  const reduce = useReducedMotion();
  const [internal, setInternal] = useState(defaultOpen ?? presentation === "inline");
  const open = controlled ?? internal;
  const changeOpen = (next: boolean) => { if (controlled === undefined) setInternal(next); onOpenChange?.(next); };
  const content = <><div className="relative h-64 overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/25 via-muted to-background sm:h-72">
    {!reduce && <ShaderBackground variant="mesh-gradient" className="absolute inset-0" />}
    <div aria-hidden="true" className="absolute top-1/2 left-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 -rotate-12 place-items-center rounded-[2rem] border border-white/30 bg-background/15 text-6xl shadow-xl backdrop-blur-xl">{artwork ?? "✦"}</div><div aria-hidden="true" className="absolute top-1/2 left-1/2 size-36 -translate-x-1/3 -translate-y-1/3 rotate-12 rounded-[2rem] border border-white/20 bg-background/10 backdrop-blur-sm" />
    <Button variant="ghost" size="icon" aria-label="Dismiss launch announcement" className="absolute top-4 right-4 rounded-full border border-border/55 bg-background/60 backdrop-blur-xl" onClick={() => changeOpen(false)}>×</Button>
  </div><div className="p-6 sm:p-8"><p className="text-xs font-medium text-muted-foreground">{story.label ?? "New release"}</p><h2 className="mt-4 text-4xl font-medium tracking-[-.05em]">{headline ?? story.title}</h2>{story.description && <p className="mt-5 text-sm leading-7 text-muted-foreground">{story.description}</p>}<div className="mt-7 flex flex-col gap-2.5 sm:flex-row"><ButtonLink href={story.href} className="flex-1" onClick={() => changeOpen(false)}>{story.actionLabel}</ButtonLink>{secondaryAction ? <ButtonLink href={secondaryAction.href} variant="outline" className="flex-1" onClick={() => changeOpen(false)}>{secondaryAction.label}</ButtonLink> : <Button variant="outline" className="flex-1" onClick={() => changeOpen(false)}>Maybe later</Button>}</div></div></>;
  if (presentation === "inline") return <div className="w-full bg-background px-4 py-14 sm:px-6 lg:px-8"><AnimatePresence mode="wait" initial={false}>{open ? <motion.article key="announcement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2, ease: EASE_OUT }} className={cn("relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-sm", className)} aria-label={story.title}>{content}</motion.article> : <motion.div key="trigger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md text-center"><Button autoFocus onClick={() => changeOpen(true)}>{triggerLabel}</Button></motion.div>}</AnimatePresence></div>;
  return <CenterMorphModal open={open} onOpenChange={changeOpen}><CenterMorphModalTrigger><Button>{triggerLabel}</Button></CenterMorphModalTrigger><CenterMorphModalContent ariaLabel={story.title} className={cn("max-w-md overflow-hidden p-0", className)}>{content}</CenterMorphModalContent></CenterMorphModal>;
}

export function RotatingAnnouncementRibbon({ stories, interval = 5000, ...props }: AnnouncementProps) {
  const playback = usePlayback(interval, stories.length);
  const reduce = useReducedMotion();
  const story = stories[playback.index];
  if (!story) return null;
  return <AnnouncementFrame {...props}>{dismiss => <section {...playback.handlers} className="relative isolate mx-auto flex min-h-16 w-full max-w-7xl items-center justify-center gap-3 overflow-hidden bg-primary px-4 py-3 pr-14 text-primary-foreground sm:px-6 sm:pr-16 lg:px-8"><motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -z-10 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent" initial={false} animate={{ x: playback.stopped ? "-150%" : ["-150%", "450%"] }} transition={playback.stopped ? { duration: 0 } : { duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: EASE_OUT }} /><motion.div key={story.id} initial={reduce ? false : { y: 12, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: reduce ? 0 : .35, ease: EASE_OUT }} className="min-w-0 text-center sm:flex sm:items-center sm:gap-3 sm:text-left"><span className="mr-3 rounded-full bg-primary-foreground/10 px-2 py-1 text-xs">{story.label ?? "Update"}</span><span className="text-sm">{story.title}</span></motion.div><ButtonLink href={story.href} variant="ghost" size="sm">{story.actionLabel} →</ButtonLink><Button size="sm" variant="ghost" className="sr-only focus:not-sr-only" aria-label="Next announcement" onClick={() => playback.setIndex(v => v + 1)}>Next</Button><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" aria-pressed={playback.paused} onClick={() => playback.setPaused(!playback.paused)}>{playback.paused ? "Play" : "Pause"}</Button><Button size="sm" variant="ghost" className="absolute right-3 rounded-full text-primary-foreground/70 sm:right-5" aria-label="Dismiss announcements" onClick={dismiss}>×</Button><span className="sr-only" aria-live={playback.stopped ? "polite" : "off"}>{playback.index + 1} of {stories.length}: {story.title}</span></section>}</AnnouncementFrame>;
}

export function StackedAnnouncementCards({ stories, interval = 6500, ...props }: AnnouncementProps) {
  const playback = usePlayback(interval, stories.length);
  const reduce = useReducedMotion();
  if (!stories.length) return null;
  return <AnnouncementFrame {...props}>{dismiss => <section {...playback.handlers} className="w-full bg-background px-4 py-14 sm:px-6 lg:px-8"><div className="relative mx-auto h-80 max-w-4xl sm:h-60">{[...stories.keys()].slice(0, 3).reverse().map(offset => { const story = stories[(playback.index + offset) % stories.length]; return <motion.article key={story.id} layout={!reduce} animate={{ y: offset * 20, scale: 1 - offset * .035 }} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="absolute inset-x-0 top-0 min-h-70 origin-top overflow-hidden rounded-3xl border border-border/70 bg-background p-5 sm:min-h-48 sm:p-6" style={{ zIndex: 3 - offset }}>{offset ? <button type="button" aria-label={`Show ${story.title}`} className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring" onClick={() => playback.setIndex(v => (v + offset) % stories.length)}><span className="sr-only">{story.title}</span></button> : <div className="relative flex min-h-54 flex-col sm:min-h-36"><div className="flex items-center gap-3 pr-12"><span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-muted">✦</span><p className="text-xs text-muted-foreground">{story.label ?? "From the studio"}</p><span className="ml-auto text-xs text-muted-foreground">{playback.index + 1} of {stories.length}</span></div><div className="mt-5 min-w-0 flex-1 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8"><div><h3 className="text-lg font-medium tracking-tight">{story.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{story.description}</p></div><div className="mt-5 flex shrink-0 items-center gap-2 sm:mt-0"><ButtonLink href={story.href} variant="outline" size="sm">{story.actionLabel} ↗</ButtonLink><Button variant="ghost" size="icon" aria-label="Previous announcement" onClick={() => playback.setIndex(v => (v - 1 + stories.length) % stories.length)}>←</Button><Button variant="ghost" size="icon" aria-label="Next announcement" onClick={() => playback.setIndex(v => (v + 1) % stories.length)}>→</Button></div></div><Button variant="ghost" size="icon" className="absolute -top-1 -right-1 rounded-full" aria-label="Dismiss announcements" onClick={dismiss}>×</Button><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" aria-pressed={playback.paused} onClick={() => playback.setPaused(!playback.paused)}>{playback.paused ? "Play" : "Pause"}</Button></div>}</motion.article>; })}</div></section>}</AnnouncementFrame>;
}
