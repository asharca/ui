"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ArcIllustrationItem = { id: string; label: string; description?: string } & ({ image: { src: string; alt: string }; icon?: never } | { icon: ReactNode; image?: never });
export interface ArcStackIllustrationProps {
  items: ArcIllustrationItem[];
  variant: "images" | "connectors";
  autoPlay?: boolean;
  defaultIndex?: number;
  onActiveChange?: (id: string) => void;
  label?: string;
  className?: string;
}

/** A semicircular, rotating collection. Artwork is provided by the consumer. */
export function ArcStackIllustration({ items, variant, autoPlay = false, defaultIndex = 0, onActiveChange, label = "Explore collection", className }: ArcStackIllustrationProps) {
  const [index, setIndex] = useState(defaultIndex);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const pointer = useRef<number | null>(null);
  const dragged = useRef(false);
  const uid = useId();
  const wheelTime = useRef(0);
  const reduce = useReducedMotion();
  const count = items.length;
  const currentIndex = count ? ((index % count) + count) % count : 0;
  const current = items[currentIndex];
  const move = (direction: number) => {
    if (!count) return;
    const next = (currentIndex + direction + count) % count;
    setIndex(next);
    onActiveChange?.(items[next].id);
  };
  useEffect(() => {
    if (!autoPlay || paused || focused || reduce || count < 2) return;
    const timer = window.setTimeout(() => {
      const next = (currentIndex + 1) % count;
      setIndex(next);
      onActiveChange?.(items[next].id);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [autoPlay, paused, focused, reduce, count, currentIndex, items, onActiveChange]);
  return <section aria-label={label} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} className={cn("group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground", className)}>
    <h3 className="sr-only">{label}</h3>
    <div role="listbox" tabIndex={0} aria-label={label} aria-activedescendant={current ? `${uid}-${current.id}` : undefined} className="absolute inset-0 touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } if (event.key === "Home" || event.key === "End") { event.preventDefault(); const next = event.key === "Home" ? 0 : count - 1; if (items[next]) { setIndex(next); onActiveChange?.(items[next].id); } } }} onPointerDown={event => { pointer.current = event.clientX; dragged.current = false; }} onPointerUp={event => { if (pointer.current !== null && Math.abs(event.clientX - pointer.current) > 24) { dragged.current = true; move(event.clientX < pointer.current ? 1 : -1); } pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }} onWheel={event => { if (performance.now() - wheelTime.current < 500 || Math.abs(event.deltaX || event.deltaY) < 12) return; wheelTime.current = performance.now(); move((event.deltaX || event.deltaY) > 0 ? 1 : -1); }}>
      {items.map((item, position) => {
        let delta = position - currentIndex;
        if (count > 3) delta -= Math.round(delta / count) * count;
        const distance = Math.abs(delta);
        return <div key={item.id} className={cn("absolute left-1/2 -translate-x-1/2 -translate-y-1/2", variant === "images" ? "top-[42%] aspect-[4/5] h-[54%]" : "top-[46%] aspect-square w-[20%]")} style={{ zIndex: count - distance }}>
          <motion.div id={`${uid}-${item.id}`} role="option" aria-selected={position === currentIndex} aria-hidden={distance > 3} inert={distance > 3} onClick={() => { setIndex(position); onActiveChange?.(item.id); }} initial={false} animate={{ x: `${delta * (variant === "images" ? 103 : 90)}%`, y: `${distance * distance * 20}%`, rotate: delta * (variant === "images" ? 9 : 0), scale: Math.max(.45, 1 - distance * .15), opacity: Math.max(0, 1 - distance * .24) }} transition={reduce ? { duration: 0 } : { duration: .7, ease: EASE_OUT }} className={cn("size-full cursor-grab overflow-hidden border border-background/80 bg-background active:cursor-grabbing", variant === "images" ? "rounded-xl" : "grid place-items-center rounded-full bg-[#f4f4f4] text-[#242424] [&_svg]:size-9")}>
            {item.image ? <img src={item.image.src} alt={item.image.alt} draggable={false} className="size-full object-cover" /> : <span role="img" aria-label={item.label}>{item.icon}</span>}
          </motion.div>
        </div>;
      })}
      {!count && <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">No items supplied.</p>}
    </div>
    <footer className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><div aria-live={autoPlay && !paused ? "off" : "polite"} className="rounded-full bg-background/90 px-3 py-2 text-xs">{current?.label}<span className="sr-only">{current?.description} · Drag, scroll, or use left and right arrows.</span></div>{autoPlay && <button type="button" onClick={() => setPaused(value => !value)} disabled={!!reduce} className="cursor-pointer rounded-full bg-background/90 px-3 py-2 text-xs disabled:cursor-default">{reduce ? "Motion reduced" : paused ? "Play collection" : "Pause collection"}</button>}</footer>
  </section>;
}
