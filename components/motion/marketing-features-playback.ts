"use client";

import { useEffect, useRef, useState, type FocusEvent, type RefObject, type Dispatch, type SetStateAction } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";

export interface MarketingPlaybackState {
  ref: RefObject<HTMLElement | null>;
  active: number;
  select: (index: number) => void;
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
  running: boolean;
  reduced: boolean | null;
  canHover: boolean;
  bindings: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocusCapture: () => void;
    onBlurCapture: (event: FocusEvent<HTMLElement>) => void;
  };
}
/** Shared lifecycle only; each marketing composition owns its own structure. */
export function useMarketingPlayback({ count, value, defaultValue = 0, onValueChange, autoplay = false, interval = 6000 }: {
  count: number; value?: number; defaultValue?: number; onValueChange?: (value: number) => void; autoplay?: boolean; interval?: number;
}): MarketingPlaybackState {
  const [internal, setInternal] = useState(defaultValue);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduced = useReducedMotion();
  const canHover = useHoverCapable();
  const active = Math.max(0, Math.min(count - 1, value ?? internal));
  const select = (index: number) => {
    if (!count) return;
    const next = (index + count) % count;
    if (value === undefined) setInternal(next);
    if (next !== active) onValueChange?.(next);
  };
  const selectRef = useRef(select);
  selectRef.current = select;
  const running = autoplay && count > 1 && !paused && !hovered && !focused && inView && visible && !reduced;
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => selectRef.current(active + 1), Math.max(1000, interval));
    return () => window.clearInterval(timer);
  }, [running, active, interval]);
  return { ref, active, select, paused, setPaused, running, reduced, canHover, bindings: {
    onMouseEnter: () => { if (canHover) setHovered(true); },
    onMouseLeave: () => setHovered(false),
    onFocusCapture: () => setFocused(true),
    onBlurCapture: (event: FocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
  } };
}
