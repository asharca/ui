"use client";

import { animate, type AnimationPlaybackControlsWithThen, cubicBezier, motion, type MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface HorizontalIllustrationItem { id: string; label: string; icon: ReactNode }
export interface HorizontalStackIllustrationProps { items: HorizontalIllustrationItem[]; autoPlay?: boolean; defaultIndex?: number; onActiveChange?: (id: string) => void; label?: string; className?: string }
const palette = ["bg-[oklch(0.92_0.04_250)] text-[oklch(0.55_0.15_250)] dark:bg-[oklch(0.3_0.04_250)] dark:text-[oklch(0.78_0.1_250)]", "bg-[oklch(0.93_0.045_80)] text-[oklch(0.58_0.13_70)] dark:bg-[oklch(0.31_0.04_70)] dark:text-[oklch(0.8_0.11_70)]", "bg-[oklch(0.92_0.045_150)] text-[oklch(0.52_0.12_150)] dark:bg-[oklch(0.3_0.04_150)] dark:text-[oklch(0.79_0.1_150)]", "bg-[oklch(0.91_0.055_305)] text-[oklch(0.54_0.16_305)] dark:bg-[oklch(0.3_0.045_305)] dark:text-[oklch(0.78_0.11_305)]", "bg-[oklch(0.92_0.04_220)] text-[oklch(0.53_0.12_220)] dark:bg-[oklch(0.3_0.04_220)] dark:text-[oklch(0.79_0.1_220)]", "bg-[oklch(0.93_0.045_25)] text-[oklch(0.58_0.14_25)] dark:bg-[oklch(0.3_0.04_25)] dark:text-[oklch(0.8_0.1_25)]", "bg-[oklch(0.93_0.045_85)] text-[oklch(0.59_0.13_80)] dark:bg-[oklch(0.31_0.04_80)] dark:text-[oklch(0.8_0.11_80)]"];
// Checkpoints and easing measured from the publicly running 9.8-second, seven-card animation.
const offsets = [0, .14285, .2857, .42855, .48, .52, .5714, .71425, .8571, 1];
const translations = ["0%", "108%", "208%", "300%", "340%", "-340%", "-300%", "-208%", "-108%", "0%"];
const scales = [1.08, .92, .82, .72, .68, .68, .72, .82, .92, 1.08];
const opacities = [1, .78, .48, .2, 0, 0, .2, .48, .78, 1];
const depths = [48, 24, 8, 0, 0, 0, 0, 8, 24, 48];
const rollEase = cubicBezier(.77, 0, .175, 1);

function HorizontalSlot({ item, position, count, anchor, active, progress, uid, onSelect }: { item: HorizontalIllustrationItem; position: number; count: number; anchor: number; active: number; progress: MotionValue<number>; uid: string; onSelect: () => void }) {
  const phase = useTransform(progress, value => (((position - anchor + value) % count + count) % count) / count);
  const x = useTransform(phase, offsets, translations, { ease: rollEase });
  const scale = useTransform(phase, offsets, scales, { ease: rollEase });
  const opacity = useTransform(phase, offsets, opacities, { ease: rollEase });
  const z = useTransform(phase, offsets, depths, { ease: rollEase });
  const zIndex = useTransform(z, value => Math.round(value) + 1);
  let distance = position - active;
  distance -= Math.round(distance / count) * count;
  return <motion.div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2" style={{ zIndex }}><motion.div id={`${uid}-${item.id}`} role="option" aria-selected={position === active} aria-hidden={Math.abs(distance) > 3} inert={Math.abs(distance) > 3} onClick={onSelect} style={{ x, z, scale, opacity }} className={cn("grid size-full cursor-grab place-items-center rounded-2xl border border-background/70 active:cursor-grabbing [&_svg]:size-6", palette[position % palette.length])}><span aria-hidden>{item.icon}</span><span className="sr-only">{item.label}</span></motion.div></motion.div>;
}

/** Fixed-size rolling cards cross from +340% to −340% only while fully transparent. */
export function HorizontalStackIllustration({ items, autoPlay = false, defaultIndex = 0, onActiveChange, label = "Connected capabilities", className }: HorizontalStackIllustrationProps) {
  const [index, setIndex] = useState(defaultIndex);
  const [active, setActive] = useState(items.length ? (defaultIndex % items.length + items.length) % items.length : 0);
  const activeRef = useRef(active);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const pointer = useRef<number | null>(null);
  const dragged = useRef(false);
  const lastWheel = useRef(0);
  const [controls, setControls] = useState<AnimationPlaybackControlsWithThen | null>(null);
  const uid = useId();
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const count = items.length;
  const current = count ? (active % count + count) % count : 0;
  useMotionValueEvent(progress, "change", value => {
    if (!count) return;
    const next = ((index - Math.round(value)) % count + count) % count;
    if (activeRef.current === next) return;
    activeRef.current = next;
    setActive(next);
    onActiveChange?.(items[next].id);
  });
  const change = (next: number) => { if (!count) return; const normalized = (next % count + count) % count; activeRef.current = normalized; setIndex(normalized); setActive(normalized); onActiveChange?.(items[normalized].id); };
  useEffect(() => {
    progress.set(0);
    const next = count ? (index % count + count) % count : 0;
    if (activeRef.current !== next) {
      activeRef.current = next;
      setActive(next);
    }
    if (!autoPlay || reduce || count < 2) { setControls(null); return; }
    const animation = animate(progress, count, { duration: count * 1.4, ease: "linear", repeat: Infinity });
    setControls(animation);
    return () => { animation.stop(); };
  }, [autoPlay, reduce, count, index, progress]);
  useEffect(() => { if (paused || focused) controls?.pause(); else controls?.play(); }, [paused, focused, controls]);
  return <section aria-label={label} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} className={cn("group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl bg-muted text-foreground", className)}>
    <h3 className="sr-only">{label}</h3>
    <div role="listbox" tabIndex={0} aria-label={label} aria-activedescendant={items[current] ? `${uid}-${items[current].id}` : undefined} className="absolute inset-0 touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }} onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); change(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : current + (event.key === "ArrowRight" ? 1 : -1)); }} onPointerDown={event => { pointer.current = event.clientX; dragged.current = false; }} onPointerUp={event => { if (pointer.current !== null && Math.abs(event.clientX - pointer.current) > 24) { dragged.current = true; change(current + (event.clientX < pointer.current ? 1 : -1)); } pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }} onWheel={event => { const direction = event.deltaX || event.deltaY; if (Math.abs(direction) < 12 || performance.now() - lastWheel.current < 500) return; lastWheel.current = performance.now(); change(current + (direction > 0 ? 1 : -1)); }}>
      {items.map((item, position) => <HorizontalSlot key={item.id} item={item} position={position} count={count} anchor={index} active={current} progress={progress} uid={uid} onSelect={() => change(position)} />)}
      {!count && <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">No capabilities to display</p>}
    </div>
    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><p className="rounded-full bg-background/90 px-3 py-2 text-xs" aria-live={autoPlay && !paused ? "off" : "polite"}>{items[current]?.label}<span className="sr-only"> · Drag, scroll, or use left and right arrows</span></p>{autoPlay && <button type="button" onClick={() => setPaused(value => !value)} disabled={!!reduce} className="cursor-pointer rounded-full bg-background/90 px-3 py-2 text-xs disabled:cursor-default">{reduce ? "Motion reduced" : paused ? "Play stack" : "Pause stack"}</button>}</div>
  </section>;
}
