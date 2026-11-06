"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface RollingIllustrationItem { id: string; label: string; description?: string; icon?: ReactNode }
export interface RollingStackIllustrationProps { items: RollingIllustrationItem[]; variant?: "cards" | "timeline"; activeId?: string; defaultActiveId?: string; onActiveChange?: (id: string) => void; autoPlay?: boolean; interval?: number; loop?: boolean; label?: string; className?: string; suffix?: string }
/** Presentation rotation pauses on focus/hover; intentional selection retains stable host identities. */
export function RollingStackIllustration({ items, variant = "cards", activeId, defaultActiveId, onActiveChange, autoPlay = false, interval = 1400, loop = true, label = "Workflow stack", className, suffix = "in one wallet" }: RollingStackIllustrationProps) {
  const [internal, setInternal] = useState(defaultActiveId ?? items[0]?.id);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const uid = useId();
  const index = Math.max(0, items.findIndex(item => item.id === (activeId ?? internal)));
  const change = (next: number) => { const item = items[next]; if (!item) return; if (activeId === undefined) setInternal(item.id); onActiveChange?.(item.id); };
  const move = (direction: number) => { const next = index + direction; change(loop ? (next + items.length) % items.length : Math.max(0, Math.min(items.length - 1, next))); };
  useEffect(() => {
    if (!autoPlay || paused || engaged || hovered || reduce || items.length < 2 || (!loop && index === items.length - 1)) return;
    const timer = window.setTimeout(() => { const next = (index + 1) % items.length; if (activeId === undefined) setInternal(items[next].id); onActiveChange?.(items[next].id); }, Math.max(300, interval));
    return () => window.clearTimeout(timer);
  }, [autoPlay, paused, engaged, hovered, reduce, items, index, loop, interval, activeId, onActiveChange]);
  return <section aria-label={label} onFocusCapture={() => setEngaged(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }} onMouseEnter={() => { if (canHover) setHovered(true); }} onMouseLeave={() => setHovered(false)} className={cn("@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground", className)}>
    <div role="listbox" aria-label={label} aria-activedescendant={items[index] ? `${uid}-${items[index].id}` : undefined} tabIndex={0} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); move(event.key === "ArrowDown" ? 1 : -1); } if (event.key === "Home" || event.key === "End") { event.preventDefault(); change(event.key === "Home" ? 0 : items.length - 1); } }} className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
      {items.map((item, position) => { let delta = position - index; if (loop && items.length > 3) delta -= Math.round(delta / items.length) * items.length; const distance = Math.abs(delta); const visible = distance <= (variant === "cards" ? 3 : 2); return <motion.div key={item.id} id={`${uid}-${item.id}`} role="option" aria-selected={index === position} aria-hidden={!visible} inert={!visible} onClick={() => change(position)} initial={false} animate={{ y: `${delta * (variant === "cards" ? 84 : 140)}%`, x: variant === "timeline" ? `${distance * 8}%` : 0, scale: variant === "cards" ? Math.max(.7, 1 - distance * .08) : 1, opacity: visible ? Math.max(0, 1 - distance * (variant === "cards" ? .29 : .68)) : 0 }} transition={reduce ? { duration: 0 } : { duration: .7, ease: EASE_OUT }} style={{ zIndex: items.length - distance }} className={cn("absolute top-[42%] flex h-[12cqw] cursor-pointer items-center gap-[3cqw] bg-background text-[16px]", variant === "cards" ? "left-[9%] w-[82%] rounded-2xl px-[4cqw]" : "left-[11%] w-[36%] text-[4cqw] rounded-full border border-border px-[3cqw]", index === position && "font-medium")}>
        <span aria-hidden className={cn("grid size-[8cqw] shrink-0 place-items-center rounded-full [&_svg]:size-[4cqw]", variant === "cards" && ["bg-blue-100 text-blue-500", "bg-cyan-100 text-cyan-600", "bg-amber-100 text-amber-600", "bg-purple-200 text-purple-600", "bg-teal-100 text-teal-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-500"][position % 7])}>{item.icon ?? position + 1}</span><span>{item.label}<span className="sr-only">{item.description}</span></span>
      </motion.div>; })}
      {!items.length && <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">No items in this stack</p>}
    </div>
    {variant === "timeline" && <p className="pointer-events-none absolute left-[52%] top-[45%] text-[5.8cqw] font-semibold tracking-tight">{suffix}</p>}
    <footer className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><button type="button" aria-label="Previous item" disabled={items.length < 2 || (!loop && index === 0)} onClick={() => move(-1)} className="grid size-8 cursor-pointer place-items-center rounded-full bg-background/90 disabled:opacity-40"><ChevronUp aria-hidden className="size-4" /></button><button type="button" aria-label="Next item" disabled={items.length < 2 || (!loop && index === items.length - 1)} onClick={() => move(1)} className="grid size-8 cursor-pointer place-items-center rounded-full bg-background/90 disabled:opacity-40"><ChevronDown aria-hidden className="size-4" /></button>{autoPlay && <button type="button" disabled={!!reduce} onClick={() => setPaused(current => !current)} className="cursor-pointer rounded-full bg-background/90 px-3 py-2 text-xs">{reduce ? "Motion reduced" : paused ? "Play stack" : "Pause stack"}</button>}</footer>
  </section>;
}
