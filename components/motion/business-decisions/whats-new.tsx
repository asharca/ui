"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/motion/button";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import { DecisionDialog, DecisionFeedback, useDecisionAction } from "./decision-support";

export interface ReleaseFeature { id: string; kind?: "feature" | "improvement"; title: string; description: string; highlights?: string[]; image?: { src: string; alt: string }; media?: ReactNode; thumbnail?: ReactNode; action?: { label: string; href: string } }
export interface ProductRelease { version: string; title: string; date: string; features: ReleaseFeature[]; changelogHref: string }
export interface WhatsNewProps {
  releases: ProductRelease[]; readVersions: string[];
  onMarkRead: (version: string) => void | Promise<void>;
  onDismiss?: (version: string) => void | Promise<void>;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string;
}
/** Version/read persistence is exclusively host-owned. Closing does not silently mark a release read. */
export function WhatsNew({ releases, readVersions, onMarkRead, onDismiss, open, defaultOpen = false, onOpenChange, className }: WhatsNewProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [version, setVersion] = useState(releases[0]?.version ?? "");
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<number | null>(null);
  const walkthrough = useRef<HTMLElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const action = useDecisionAction();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const release = releases.find(item => item.version === version) ?? releases[0];
  const shown = open ?? internalOpen;
  const setOpen = (next: boolean) => { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); };
  const count = release?.features.length ?? 0;
  const position = Math.min(slide, Math.max(0, count - 1));
  const feature = release?.features[position];
  const move = (next: number) => setSlide(Math.max(0, Math.min(Math.max(0, count - 1), next)));
  async function dismiss() { if (!release || action.busy) return; if (!onDismiss || await action.run(() => onDismiss(release.version))) setOpen(false); }
  async function dismissAnnouncement() {
    if (!release || action.busy) return;
    if (!onDismiss || await action.run(() => onDismiss(release.version))) { setOpen(false); setDismissed(true); }
  }
  async function finish() { if (release && await action.run(() => onMarkRead(release.version))) setOpen(false); }
  useEffect(() => {
    if (!shown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !walkthrough.current?.closest('[role="dialog"]')?.contains(document.activeElement) || /INPUT|SELECT|TEXTAREA/.test((event.target as HTMLElement).tagName)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setSlide(previous => Math.max(0, Math.min(Math.max(0, count - 1), previous + (event.key === "ArrowRight" ? 1 : -1))));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shown, count]);
  if (!release) return <p className={cn("text-sm text-muted-foreground", className)}>No releases to show.</p>;
  return <div className={cn("relative flex min-h-[34rem] w-full items-end justify-end p-4", className)}>
    {!dismissed && <aside className="relative z-10 w-80 max-w-full rounded-3xl border border-border bg-background p-3 text-foreground"><div className="flex items-start gap-3 p-1"><div aria-hidden="true" className="relative mt-0.5 h-12 w-20 shrink-0">{release.features.slice(0, 3).map((item, index) => <motion.span key={item.id} whileHover={hover && !reduce ? { y: -4, rotate: 0 } : undefined} style={{ left: index * 16, rotate: (index - 1) * 10 }} className="absolute top-0 grid size-12 place-items-center overflow-hidden rounded-xl border-2 border-background bg-muted shadow-sm">{item.thumbnail ? item.thumbnail : item.image ? <img src={item.image.src} alt="" className="size-full object-cover" /> : item.media ? <span className="pointer-events-none grid size-full place-items-center overflow-hidden [&>*]:min-w-40 [&>*]:scale-[0.3]">{item.media}</span> : <Sparkles className="size-5 text-muted-foreground" />}</motion.span>)}</div><div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-xs font-medium"><span aria-hidden className={cn("size-2 shrink-0 rounded-full", readVersions.includes(release.version) ? "bg-muted-foreground" : "bg-teal-500")} />New in {release.version}</p><p className="mt-1 line-clamp-2 text-pretty text-sm">{release.title}</p></div><Button size="icon" variant="ghost" className="-mr-1 -mt-1 size-9 shrink-0" disabled={action.busy} aria-label="Dismiss release announcement" onClick={() => { void dismissAnnouncement(); }}><X className="size-4" /></Button></div><Button size="sm" className="mt-2 h-9 w-full" onClick={() => { action.clearError(); setSlide(0); setOpen(true); }} aria-haspopup="dialog" aria-expanded={shown}>See what's new</Button><DecisionFeedback {...action} /></aside>}
    <DecisionDialog className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl rounded-3xl p-2" initialFocus="panel" radius={24} showCloseButton={false} backdropClassName="bg-foreground/10 backdrop-blur-xl" open={shown} onOpenChange={next => { if (!next) void dismiss(); else setOpen(true); }} title={`What's new: ${release.title}`} busy={action.busy}>
      <section ref={walkthrough} aria-label="Release walkthrough" onPointerDown={event => { if (event.pointerType === "touch") touchStart.current = event.clientX; }} onPointerUp={event => { if (touchStart.current !== null) { const distance = event.clientX - touchStart.current; if (Math.abs(distance) > 50) move(position + (distance < 0 ? 1 : -1)); touchStart.current = null; } }} onPointerCancel={() => { touchStart.current = null; }}><motion.div key={`media:${release.version}:${position}`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.25 }} className="relative grid aspect-video w-full place-items-center overflow-clip rounded-2xl border border-border bg-muted"><Button size="icon" variant="secondary" className="absolute right-3 top-3 z-10 size-9 rounded-full bg-background/80 backdrop-blur" aria-label="Close release notes" disabled={action.busy} onClick={() => { void dismiss(); }}><X className="size-4" /></Button><div className="absolute inset-0 grid place-items-center overflow-hidden [&>div]:h-full [&>div]:w-full">{feature?.media ?? (feature?.image ? <img src={feature.image.src} alt={feature.image.alt} className="size-full object-contain" /> : <Sparkles aria-hidden className="size-20 text-muted-foreground" />)}</div></motion.div><div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
      <motion.div className="relative min-h-60 space-y-3 overflow-clip sm:min-h-52" key={`${release.version}-${position}`} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}><header className="flex flex-wrap items-center gap-2"><span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", feature?.kind === "improvement" ? "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300" : "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300")}>{feature?.kind === "improvement" ? "Improvement" : "New feature"}</span><p className="text-xs text-muted-foreground">New in {release.version} · {release.date}</p>{releases.length > 1 && <label className="sr-only focus-within:not-sr-only">Release <select aria-label="Release version" value={release.version} onChange={event => { setVersion(event.target.value); setSlide(0); action.clearError(); }} className="rounded-lg border border-border bg-background p-2">{releases.map(item => <option key={item.version} value={item.version}>{item.version}</option>)}</select></label>}</header>
        {feature ? <><h2 className="text-xl font-medium text-balance">{feature.title}</h2><p className="text-sm text-pretty text-muted-foreground">{feature.description}</p>{feature.highlights && <ul className="space-y-1.5 text-sm">{feature.highlights.map(item => <li key={item} className="flex items-start gap-2"><span aria-hidden className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-muted/50"><Check className="size-3" /></span><span>{item}</span></li>)}</ul>}{feature.action && <ButtonLink href={feature.action.href} variant="outline" className="h-9 gap-1.5 px-4 text-sm">{feature.action.label}<ArrowUpRight className="size-4" /></ButtonLink>}</> : <div className="py-8"><h2 className="text-xl font-medium">{release.title}</h2><p className="mt-3 text-sm text-muted-foreground">Read the complete release notes for all changes.</p><ButtonLink href={release.changelogHref} variant="outline" className="mt-5">Read full changelog</ButtonLink></div>}
      </motion.div>
      <p className="sr-only">{count ? `Slide ${position + 1} of ${count}` : "Release overview"}</p><nav className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" aria-label="Release slides"><div className="flex justify-center sm:justify-start"><div className="flex items-center">{release.features.map((item, index) => <button type="button" key={item.id} className="group flex h-10 items-center justify-center rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Go to slide ${index + 1}: ${item.title}`} aria-current={index === position ? "step" : undefined} disabled={action.busy} onClick={() => move(index)}><span className={cn("block h-2 rounded-full transition-colors", index === position ? "w-6 bg-foreground" : "w-2 bg-foreground/20 group-hover:bg-foreground/40")} /></button>)}</div></div><div className="flex items-center justify-end gap-2">{position === count - 1 && <ButtonLink href={release.changelogHref} variant="ghost" className="h-9 gap-2 px-3 text-sm text-muted-foreground hover:text-foreground">View full changelog</ButtonLink>}<Button size="sm" className="h-9 gap-1.5 px-3 text-sm sm:px-4" variant={position === 0 ? "ghost" : "outline"} aria-label="Back" disabled={position === 0 || action.busy} onClick={() => move(position - 1)}><ArrowLeft className="size-4" /><span className="hidden sm:inline">Back</span></Button><Button size="sm" className="h-9 min-w-24 gap-1.5 px-4 text-sm" disabled={action.busy} onClick={() => { if (position < count - 1) move(position + 1); else void finish(); }}>{position < count - 1 ? "Next" : "Got it"}{position < count - 1 && <ArrowRight className="size-4" />}</Button></div></nav>
      <DecisionFeedback {...action} /></div></section>
    </DecisionDialog>
  </div>;
}
