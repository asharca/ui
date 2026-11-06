"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, FileText, MessageSquare, Rocket, ScanSearch, Users } from "lucide-react";
import { Button, ButtonLink } from "@/components/motion/button";
import { useMarketingPlayback } from "@/components/motion/marketing-systems-playback";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ProcessStep { id: string; label?: string; title: string; description: string; detail?: ReactNode; scene?: ReactNode }
export interface ProcessProps { steps: ProcessStep[]; title?: string; description?: string; eyebrow?: string; action?: { label: string; href: string }; className?: string; value?: string; defaultValue?: string; onValueChange?: (id: string) => void }
function useProcess(props: ProcessProps) {
  const [internal, setInternal] = useState(props.defaultValue ?? props.steps[0]?.id ?? "");
  const index = Math.max(0, props.steps.findIndex(step => step.id === (props.value ?? internal)));
  const select = useCallback((id: string) => { if (props.value === undefined) setInternal(id); props.onValueChange?.(id); }, [props.value, props.onValueChange]);
  return { index, current: props.steps[index], select };
}
const sectionClass = "w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28";
function ProcessHeading({ title = "A clear path from idea to outcome", description, eyebrow = "How it works", centered = false }: Pick<ProcessProps, "title" | "description" | "eyebrow"> & { centered?: boolean }) {
  return <header className={cn("max-w-3xl", centered && "mx-auto text-center")}><span className="inline-flex rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">{eyebrow}</span><h2 className="mt-9 text-balance text-4xl font-medium tracking-[-.05em]">{title}</h2>{description && <p className={cn("mt-6 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7", centered && "mx-auto")}>{description}</p>}</header>;
}
function ProcessScene({ step, index, large = false }: { step: ProcessStep; index: number; large?: boolean }) {
  const reduce = useReducedMotion();
  const { ref, playing } = useMarketingPlayback();
  return <div ref={ref} className={cn("relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_68%)] sm:h-52", large && "h-80 sm:h-96")}>
    {step.scene ?? <motion.div key={step.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease: EASE_OUT }} className="w-[78%]">
      {index % 3 === 0 ? <div className="space-y-2">{["Customer note", "Original brief"].map((label, row) => <motion.div key={label} initial={false} animate={{ x: reduce || !playing ? 0 : [0, row ? -3 : 3, 0] }} transition={{ duration: 5, repeat: reduce || !playing ? 0 : Infinity, ease: EASE_OUT }} className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/75 px-3 py-2.5 text-xs backdrop-blur-md"><span className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground">{row ? <FileText className="size-3.5" /> : <MessageSquare className="size-3.5" />}</span>{label}</motion.div>)}</div> : index % 3 === 1 ? <div className="rounded-2xl border border-border/70 bg-background/75 p-3 backdrop-blur-md"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-[.14em] text-muted-foreground">Shared brief</p><ClipboardCheck className="size-3.5 text-muted-foreground" /></div><div className="space-y-1.5">{["Outcome", "Owner", "Next move"].map(label => <div key={label} className="flex items-center gap-2 rounded-lg bg-muted/65 px-2.5 py-2 text-xs"><Check className="size-3 text-muted-foreground" />{label}</div>)}</div></div> : <div className="relative mx-auto flex size-28 items-center justify-center rounded-3xl border border-border/70 bg-background/75 backdrop-blur-md"><span className="grid size-12 place-items-center rounded-full bg-muted"><Rocket className="size-5" /></span><span className="absolute -right-2 -bottom-2 grid size-9 place-items-center rounded-full border border-border bg-background"><Check className="size-4" /></span></div>}
    </motion.div>}
  </div>;
}
function StepCopy({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = [ScanSearch, Users, Rocket][index % 3];
  return <div className="p-4 pb-5 sm:p-5 sm:pb-6"><div className="flex items-center justify-between gap-4"><p className="text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">Step {String(index + 1).padStart(2, "0")}</p><span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground"><Icon aria-hidden="true" className="size-4" /></span></div>{step.label && <p className="mt-6 text-xs font-medium uppercase tracking-[.14em] text-muted-foreground">{step.label}</p>}<h3 className={cn("text-pretty text-xl font-medium leading-tight tracking-[-.03em]", step.label ? "mt-2" : "mt-6")}>{step.title}</h3><p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">{step.description}</p>{step.detail && <details className="mt-4 text-sm"><summary className="cursor-pointer rounded text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">Step scope</summary><div className="mt-3 leading-6">{step.detail}</div></details>}</div>;
}
export function CenteredProcessCards(props: ProcessProps) {
  return <section className={cn(sectionClass, props.className)}><div className="mx-auto w-full max-w-7xl"><ProcessHeading {...props} centered /><div className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-3 lg:gap-6">{props.steps.map((step, index) => <article id={step.id} key={step.id} className="min-w-0 scroll-mt-20 rounded-3xl border border-border/70 bg-background p-3"><ProcessScene step={step} index={index} /><StepCopy step={step} index={index} /></article>)}</div>{props.action && <div className="mt-10 flex justify-center sm:mt-12"><ButtonLink href={props.action.href} variant="secondary" size="sm">{props.action.label}<ArrowRight className="size-4" aria-hidden="true" /></ButtonLink></div>}</div></section>;
}
export function CinematicProcessGrid(props: ProcessProps) {
  const { index, select } = useProcess(props);
  return <section className={cn(sectionClass, props.className)}><div className="mx-auto w-full max-w-7xl"><ProcessHeading {...props} /><div className="mt-14 grid border-y border-border md:grid-cols-3">{props.steps.map((step, position) => <article key={step.id} className="min-w-0 border-border py-6 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0"><button type="button" onClick={() => select(step.id)} aria-pressed={index === position} aria-label={`Focus ${step.title}`} className="block w-full cursor-pointer rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-ring"><ProcessScene step={step} index={position} /><span className={cn("mt-4 block h-px origin-left bg-primary transition-opacity", index === position ? "opacity-100" : "opacity-0")} /></button><StepCopy step={step} index={position} /></article>)}</div></div></section>;
}
export function EditorialStoryStack(props: ProcessProps) {
  const reduce = useReducedMotion();
  return <section className={cn(sectionClass, props.className)}><div className="mx-auto w-full max-w-7xl"><ProcessHeading {...props} centered /><ol className="mt-20 space-y-20 sm:space-y-28">{props.steps.map((step, index) => <motion.li key={step.id} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .6, ease: EASE_OUT }} className="grid items-center gap-10 md:grid-cols-2 lg:gap-20"><div className={cn(index % 2 === 1 && "md:order-2")}><span className="inline-flex size-14 items-center justify-center rounded-full border border-border text-2xl font-light">{index + 1}</span><h3 className="mt-7 text-3xl font-medium tracking-[-.04em]">{step.title}</h3><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">{step.description}</p>{step.detail && <div className="mt-4 text-sm leading-7 text-muted-foreground">{step.detail}</div>}</div><div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-muted/60 p-6"><ProcessScene step={step} index={index} large /></div></motion.li>)}</ol></div></section>;
}
export interface GuidedWalkthroughProps extends ProcessProps { autoPlay?: boolean; interval?: number }
export function GuidedWalkthrough({ autoPlay = false, interval = 6000, ...props }: GuidedWalkthroughProps) {
  const { index, current, select } = useProcess(props);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { ref, playing, interactionProps } = useMarketingPlayback();
  const id = useId();
  useEffect(() => { if (!autoPlay || paused || reduce || !playing || props.steps.length < 2) return; const timer = window.setTimeout(() => select(props.steps[(index + 1) % props.steps.length].id), Math.max(1000, interval)); return () => window.clearTimeout(timer); }, [autoPlay, paused, reduce, playing, index, interval, props.steps, select]);
  return <section className={cn(sectionClass, props.className)}><div className="mx-auto w-full max-w-7xl"><ProcessHeading {...props} /><div ref={ref} {...interactionProps} className="mt-14"><div id={`${id}-scene`} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-muted/60 p-6 sm:p-10" aria-live="off"><AnimatePresence mode="wait" initial={false}>{current && <motion.div key={current.id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2, ease: EASE_OUT }}><ProcessScene step={current} index={index} large /></motion.div>}</AnimatePresence></div><div className="mt-8 grid gap-6 md:grid-cols-3" role="tablist" aria-label="Process steps">{props.steps.map((step, position) => <button key={step.id} id={`${id}-${step.id}`} type="button" role="tab" aria-selected={index === position} aria-controls={`${id}-scene`} tabIndex={index === position ? 0 : -1} onClick={() => select(step.id)} onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? props.steps.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + props.steps.length) % props.steps.length; select(props.steps[next].id); document.getElementById(`${id}-${props.steps[next].id}`)?.focus(); }} className={cn("cursor-pointer border-t-2 pt-5 text-left focus-visible:outline-2 focus-visible:outline-ring", index === position ? "border-primary" : "border-border")}><span className="text-xs text-muted-foreground">{String(position + 1).padStart(2, "0")}</span><span className="mt-3 block text-lg font-medium">{step.title}</span><span className="mt-3 block text-sm leading-6 text-muted-foreground">{step.description}</span></button>)}</div>{autoPlay && <Button className="mt-6" size="sm" variant="ghost" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume walkthrough" : "Pause walkthrough"}</Button>}</div></div></section>;
}
export function ProgressiveCardDeck(props: ProcessProps) {
  const { index, current, select } = useProcess(props);
  const reduce = useReducedMotion();
  const row = useRef<HTMLElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const node = row.current;
    if (!node) return;
    const measure = () => setScrollable(node.scrollWidth > node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const card of node.querySelectorAll("article")) observer.observe(card);
    return () => observer.disconnect();
  });
  const move = (position: number) => { const step = props.steps[position]; if (!step) return; select(step.id); };
  return <section className={cn(sectionClass, props.className)}><div className="mx-auto w-full max-w-7xl"><ProcessHeading {...props} /><nav className="mt-6 flex items-center gap-2" aria-label="Process navigation"><Button size="icon" variant="outline" className="rounded-full" aria-label="Previous step" disabled={!current || index === 0} onClick={() => move(index - 1)}><ArrowLeft className="size-4" /></Button><Button size="icon" className="rounded-full" aria-label="Next step" disabled={!current || index === props.steps.length - 1} onClick={() => move(index + 1)}><ArrowRight className="size-4" /></Button><span role="status" className="ml-3 text-xs text-muted-foreground">Step {current ? index + 1 : 0} of {props.steps.length}</span></nav><section ref={row} className="mt-12 overflow-x-auto pb-4" aria-label="Process card deck" tabIndex={scrollable ? 0 : -1} onKeyDown={event => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); move(index + (event.key === "ArrowRight" ? 1 : -1)); }}><div className="flex min-h-80 gap-4">{props.steps.map((step, position) => <motion.article key={step.id} layout={!reduce} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className={cn("relative min-h-80 shrink-0 overflow-hidden rounded-3xl border border-border bg-muted/30 p-7", position < index ? "w-16" : "w-[min(80vw,360px)]")}><p className="whitespace-nowrap text-xs text-muted-foreground">{String(position + 1).padStart(2, "0")} / {String(props.steps.length).padStart(2, "0")}</p><div className={cn("mt-16 w-64", position < index && "invisible")}><h3 className="text-2xl font-medium tracking-tight">{step.title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{step.description}</p>{step.detail && <div className="mt-4 text-sm leading-6 text-muted-foreground">{step.detail}</div>}</div></motion.article>)}</div></section></div></section>;
}
