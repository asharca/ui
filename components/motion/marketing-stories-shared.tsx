"use client";

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

/** Domain media: an absent or failed image keeps its footprint and accessible description. */
export function StoryMedia({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState<string>();
  return <div className={cn("relative overflow-hidden bg-muted", className)}>
    {src && failed !== src ? <img src={src} alt={alt} loading="lazy" onError={() => setFailed(src)} className="h-full w-full object-cover" /> : <div role="img" aria-label={alt} className="flex h-full min-h-28 items-center justify-center bg-gradient-to-br from-primary/15 via-card to-accent/15 p-6 text-center text-xs text-muted-foreground"><span>{alt}<span className="mt-2 block font-mono text-[10px] uppercase tracking-widest">Image unavailable</span></span></div>}
  </div>;
}

/** Shared editorial reveal; not a replacement for a library animation primitive. */
export function StoryReveal({ children, className, identity, direction }: { children: ReactNode; className?: string; identity?: string; direction?: -1 | 1 }) {
  const reduce = useReducedMotion();
  return <motion.div key={identity} initial={reduce ? false : { opacity: 0, y: direction ? 0 : 10, x: direction ? direction * 24 : 0 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }} className={className}>{children}</motion.div>;
}

export interface StorySelectionProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Automatic rotation is opt-in and always pauses for focus, hover, hidden pages and reduced motion. */
  autoPlay?: boolean;
  interval?: number;
}

export function useStorySelection(ids: readonly string[], { value, defaultValue, onValueChange, autoPlay = false, interval = 6000 }: StorySelectionProps) {
  const [internal, setInternal] = useState(defaultValue ?? ids[0]);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const requested = value ?? internal;
  const selected = requested !== undefined && ids.includes(requested) ? requested : ids[0];
  const index = ids.indexOf(selected);
  const select = (id: string) => {
    if (!ids.includes(id)) return;
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };
  const latest = useRef({ ids, select });
  useEffect(() => { latest.current = { ids, select }; });
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const playing = autoPlay && !paused && !reduce && !hovered && !focused && visible && ids.length > 1;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const state = latest.current;
      const currentIndex = state.ids.indexOf(selected);
      state.select(state.ids[(currentIndex + 1) % state.ids.length]);
    }, Math.max(1000, interval));
    return () => window.clearInterval(timer);
  }, [playing, interval, selected]);
  return { selected, index, select, paused, playing, reduce, canHover,
    toggle: () => setPaused((current) => !current),
    move: (direction: number) => select(ids[(index + direction + ids.length) % ids.length]),
    pauseProps: {
      onMouseEnter: () => { if (canHover) setHovered(true); },
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
    },
  };
}

export function StoryPlayback({ paused, toggle }: { paused: boolean; toggle: () => void }) {
  return <Button variant="outline" size="sm" aria-pressed={paused} onClick={toggle}>{paused ? "Resume motion" : "Pause motion"}</Button>;
}

export const storyLinkClass = "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
