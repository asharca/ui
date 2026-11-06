"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/motion/button";
import { Marquee } from "@/components/motion/marquee";
import { ShaderBackground } from "@/components/motion/shader-background";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface MarketingLink { label: string; href: string }
export interface MarketingHeading {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  primary: MarketingLink;
  secondary?: MarketingLink;
  className?: string;
}
export interface MarketingMark { name: string; href?: string; symbol?: string }
export interface MarketingSelectionProps { value?: string; onValueChange?: (id: string) => void }

/** Shared domain framing; headings and destinations always come from the host. */
export function MarketingFrame({ children, className, centered = false }: { children: ReactNode; className?: string; centered?: boolean }) {
  const reduce = useReducedMotion();
  return <motion.section initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, ease: EASE_OUT }} className={cn("relative isolate w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28", centered && "text-center", className)}>{children}</motion.section>;
}
export function MarketingCopy({ eyebrow, title, description, primary, secondary, className }: MarketingHeading) {
  return <div data-marketing-copy className={cn("relative z-10 space-y-5", className)}>
    {eyebrow && <p className="font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground">{eyebrow}</p>}
    <h2 className="whitespace-pre-line text-balance text-4xl font-medium leading-10 tracking-tight">{title}</h2>
    {description && <p className="text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
    <div className="flex flex-wrap gap-3 in-[.text-center]:justify-center"><ButtonLink href={primary.href}>{primary.label} <span aria-hidden="true">↗</span></ButtonLink>{secondary && <ButtonLink variant="outline" href={secondary.href}>{secondary.label}</ButtonLink>}</div>
  </div>;
}
export function MarketingNav({ brand, links = [] }: { brand: MarketingLink; links?: MarketingLink[] }) {
  const [open, setOpen] = useState(false);
  const menu = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return <nav aria-label={`${brand.label} navigation`} onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); trigger.current?.focus(); } }} className="relative z-20 mb-12 flex items-center justify-between gap-4 py-3"><a href={brand.href} className="text-sm font-medium tracking-tight">◈ {brand.label}</a>{links.length > 0 && <button ref={trigger} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls={menu} onClick={() => setOpen(current => !current)} className="grid size-11 place-items-center rounded-full text-muted-foreground focus-visible:outline-2 md:hidden"><span aria-hidden className="relative block h-3 w-4"><span className={cn("absolute left-0 top-0 block h-px w-4 bg-current transition-transform", open && "translate-y-1.5 rotate-45")}/><span className={cn("absolute bottom-0 left-0 block h-px w-4 bg-current transition-transform", open && "-translate-y-1.5 -rotate-45")}/></span></button>}<div id={menu} className={cn("absolute inset-x-0 top-full flex-col gap-1 rounded-2xl border border-border bg-background/95 p-3 text-left text-sm text-muted-foreground shadow-sm backdrop-blur-xl md:static md:flex md:flex-row md:flex-wrap md:gap-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none", open ? "flex" : "hidden")}>{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center px-3 hover:text-foreground focus-visible:outline-2 md:min-h-0 md:px-0">{link.label}</a>)}</div></nav>;
}
export function MarketingAtmosphere({ kind = "aurora", webgl = false }: { kind?: "aurora" | "ribbons" | "grain" | "spectrum"; webgl?: boolean }) {
  const reduce = useReducedMotion();
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    if (!webgl) return;
    try { const canvas = document.createElement("canvas"); const gl = canvas.getContext("webgl2"); setSupported(!!gl); gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch { setSupported(false); }
  }, [webgl]);
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <motion.div animate={reduce ? undefined : { x: ["-3%", "3%", "-3%"], rotate: [-4, 4, -4] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={cn("absolute -inset-x-20 -bottom-24 h-80 opacity-40 blur-3xl", kind === "ribbons" ? "bg-[conic-gradient(from_80deg,transparent,#e9b78e,transparent,#d9a491,transparent)]" : kind === "spectrum" ? "bg-[conic-gradient(from_30deg,#a7b4f1,#eeaf96,#c3e0b5,#a7b4f1)]" : "bg-[radial-gradient(ellipse_at_center,#9aaccf_0%,#beabc6_35%,transparent_70%)]")} />
    {kind === "grain" && <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(currentColor_0.6px,transparent_0.6px)] [background-size:3px_3px]" />}
    {webgl && supported && <div className="absolute inset-x-0 bottom-0 h-72 opacity-30"><ShaderBackground variant="mesh-gradient" colors={["#b1c4de", "#c8b8d4", "#e4d1ba", "#b7cbbd"]} speed={reduce ? 0 : 0.12} /></div>}
  </div>;
}
export function MarketingMarks({ marks, moving = false }: { marks: MarketingMark[]; moving?: boolean }) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const items = marks.map(mark => <span key={mark.name} className="inline-flex items-center gap-2 whitespace-nowrap px-5 py-4 text-lg font-semibold tracking-tight text-muted-foreground">{mark.symbol && <span aria-hidden="true">{mark.symbol}</span>}{mark.href ? <a href={mark.href}>{mark.name}</a> : mark.name}</span>);
  return <div className="relative z-10 mt-10 min-w-0 space-y-3"><p className="text-xs text-muted-foreground">Built for teams who move with intention</p>{moving && !reduce ? <div className={cn("min-w-0 focus-within:[&_.animate-marquee]:[animation-play-state:paused]", paused && "[&_.animate-marquee]:[animation-play-state:paused]")}><Marquee pauseOnHover>{items}</Marquee></div> : <div className="flex flex-wrap justify-center">{items}</div>}{moving && <Button size="sm" variant="ghost" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume marks" : "Pause marks"}</Button>}</div>;
}

/** Selection is locally owned unless the host supplies value. Native buttons retain keyboard activation. */
export function useMarketingSelection(ids: string[], value?: string, onValueChange?: (id: string) => void) {
  const [internal, setInternal] = useState(ids[0] ?? "");
  const selected = ids.includes(value ?? internal) ? (value ?? internal) : (ids[0] ?? "");
  return [selected, (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); }] as const;
}
export function MarketingChoices({ items, value, onChange, label }: { items: { id: string; label: string }[]; value: string; onChange: (id: string) => void; label: string }) {
  return <fieldset aria-label={label} className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0">{items.map(item => <Button key={item.id} size="sm" variant={item.id === value ? "primary" : "outline"} aria-pressed={item.id === value} onClick={() => onChange(item.id)}>{item.label}</Button>)}</fieldset>;
}

/** Offscreen and reduced-motion paths do not advance. A visible explicit Play still works with reduced motion. */
export function useMarketingPlayback(length: number, interval = 1800) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => { if (!playing || !inView || length < 1) return; const timer = window.setInterval(() => setIndex(i => (i + 1) % length), interval); return () => window.clearInterval(timer); }, [playing, inView, length, interval]);
  useEffect(() => { if (reduce) setPlaying(false); }, [reduce]);
  return { ref, index: Math.min(index, Math.max(0, length - 1)), playing, setPlaying, select: (next: number) => { setIndex(next); setPlaying(false); } };
}
export function PlaybackButtons({ playing, onToggle, onRestart, onNext }: { playing: boolean; onToggle: () => void; onRestart: () => void; onNext: () => void }) {
  return <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" aria-pressed={playing} onClick={onToggle}>{playing ? "Pause playback" : "Play sample"}</Button><Button size="sm" variant="ghost" onClick={onNext}>Next step</Button><Button size="sm" variant="ghost" onClick={onRestart}>Restart</Button></div>;
}
export function MarketingEmailCapture({ onSubmit, label = "Request access" }: { onSubmit: (email: string) => Promise<void>; label?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const busy = useRef(false);
  return <form className="relative z-10 mt-6 space-y-2" onSubmit={async event => { event.preventDefault(); if (busy.current) return; busy.current = true; setState("pending"); try { await onSubmit(email); setState("success"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not submit. Please try again."); setState("error"); } finally { busy.current = false; } }}>
    <label htmlFor={id} className="block text-xs font-medium">Work email</label><div className="flex flex-wrap gap-2"><input id={id} required type="email" autoComplete="email" value={email} onChange={event => { setEmail(event.target.value); if (state !== "pending") setState("idle"); }} disabled={state === "pending"} className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm" /><Button type="submit" disabled={state === "pending"}>{state === "pending" ? "Submitting…" : label}</Button></div>
    <p role={state === "error" ? "alert" : "status"} className="min-h-5 text-xs text-muted-foreground">{state === "success" ? "Your request has been received." : state === "error" ? error : ""}</p>
  </form>;
}

/** Original vector artwork remains legible without remote images or a GPU. */
export function MarketingArtwork({ motif = "network", label, active = false, className }: { motif?: "network" | "mountain" | "orbit" | "journey" | "layers"; label: string; active?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  return <svg ref={ref} role="img" aria-label={label} viewBox="0 0 320 180" className={cn("h-40 w-full rounded-2xl bg-muted/40 text-foreground", className)}>
    <defs><linearGradient id={uid} x2="1" y2="1"><stop stopColor="currentColor" stopOpacity="0.03"/><stop offset="1" stopColor="currentColor" stopOpacity="0.2"/></linearGradient><pattern id={`${uid}-dots`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.5" fill="currentColor" opacity="0.25"/></pattern></defs>
    <rect width="320" height="180" fill={`url(#${uid})`}/><rect width="320" height="180" fill={`url(#${uid}-dots)`}/>
    {motif === "mountain" ? <g fill="currentColor"><path d="M0 160 75 38 128 115 192 18 320 160Z" opacity="0.13"/><path d="m0 170 112-95 37 45 80-65 91 115Z" opacity="0.25"/><path d="m75 38 20 30-22-6-18 9Z" opacity="0.45"/></g> : motif === "layers" ? <g stroke="currentColor" fill={`url(#${uid})`}>{[0, 1, 2].map(i => <path key={i} d={`m60 ${70 + i * 25} 100-45 100 45-100 45Z`} strokeOpacity={0.3 + i * 0.2}/>)}</g> : motif === "journey" ? <g fill="none" stroke="currentColor"><path d="M20 130C90 130 60 40 140 60S220 150 300 40" strokeWidth="22" opacity="0.08"/><path d="M20 130C90 130 60 40 140 60S220 150 300 40" strokeDasharray="4 6" opacity="0.5"/>{[[30,128],[140,60],[280,65]].map(([x,y], i) => <circle key={x} cx={x} cy={y} r={i === 1 && active ? 13 : 8} fill="currentColor" opacity="0.6"/>)}</g> : <g fill="none" stroke="currentColor" strokeOpacity="0.45"><ellipse cx="160" cy="90" rx="105" ry="42" transform="rotate(-25 160 90)"/>{motif === "network" && <><path d="M65 50 160 90 255 45M160 90 240 140M160 90 70 145"/>{[[65,50],[255,45],[240,140],[70,145]].map(([x,y]) => <rect key={x} x={x - 15} y={y - 12} width="30" height="24" rx="7" fill="var(--background)"/>)}</>}<motion.circle cx="160" cy="90" r="20" fill="currentColor" fillOpacity="0.15" animate={reduce || !visible ? undefined : { r: active ? [20, 25, 20] : [20, 22, 20] }} transition={{ duration: 3, repeat: Infinity }}/><circle cx="160" cy="90" r="5" fill="currentColor"/></g>}
  </svg>;
}
