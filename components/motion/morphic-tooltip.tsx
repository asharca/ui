"use client";

import { autoUpdate, computePosition, flip, hide, offset, shift } from "@floating-ui/dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentProps, type ReactNode, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TooltipSurface } from "@/components/motion/tooltip-surface";
import { SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

type Target = { id: string; element: HTMLButtonElement; content: ReactNode };
type Group = { active: string | null; tooltipId: string; hover: boolean; register: (target: Target) => () => void; enter: (id: string, immediate: boolean) => void; leave: () => void; close: () => void };
const Context = createContext<Group | null>(null);

export interface MorphicTooltipProps {
  children: ReactNode;
  delay?: number;
  closeDelay?: number;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  className?: string;
}

/** One persistent surface moves and resizes between all triggers in this group. */
export function MorphicTooltip({ children, delay = 180, closeDelay = 120, activeId: controlled, defaultActiveId = null, onActiveIdChange, className }: MorphicTooltipProps) {
  const [internal, setInternal] = useState<string | null>(defaultActiveId);
  const [, setRevision] = useState(0);
  const active = controlled === undefined ? internal : controlled;
  const activeRef = useRef(active);
  const targets = useRef(new Map<string, Target>());
  const timer = useRef<number | undefined>(undefined);
  const id = useId();
  const hover = useHoverCapable();
  const latest = useRef({ controlled, onActiveIdChange });
  useLayoutEffect(() => {
    activeRef.current = active;
    latest.current = { controlled, onActiveIdChange };
  }, [active, controlled, onActiveIdChange]);
  const cancel = useCallback(() => { window.clearTimeout(timer.current); timer.current = undefined; }, []);
  const change = useCallback((next: string | null) => {
    if (next === activeRef.current) return;
    if (latest.current.controlled === undefined) setInternal(next);
    latest.current.onActiveIdChange?.(next);
  }, []);
  const close = useCallback(() => { cancel(); change(null); }, [cancel, change]);
  const enter = useCallback((target: string, immediate: boolean) => {
    cancel();
    if (immediate || activeRef.current || delay <= 0) change(target);
    else timer.current = window.setTimeout(() => change(target), delay);
  }, [cancel, change, delay]);
  const leave = useCallback(() => { cancel(); timer.current = window.setTimeout(() => change(null), Math.max(0, closeDelay)); }, [cancel, change, closeDelay]);
  const register = useCallback((target: Target) => {
    targets.current.set(target.id, target); setRevision(value => value + 1);
    return () => { targets.current.delete(target.id); setRevision(value => value + 1); };
  }, []);
  useEffect(() => cancel, [cancel]);
  useEffect(() => {
    if (!active) return;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(); } };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [active, close]);
  const target = targets.current.get(active ?? "");
  return <Context.Provider value={{ active, tooltipId: id, hover, register, enter, leave, close }}>
    <div className={cn("inline-flex flex-wrap items-center gap-2", className)}>{children}</div>
    {typeof document !== "undefined" ? createPortal(<AnimatePresence>{target ? <MovingHint key="shared-hint" target={target} id={id} keep={() => enter(target.id, true)} leave={leave} close={close} /> : null}</AnimatePresence>, document.body) : null}
  </Context.Provider>;
}

function MovingHint({ target, id, keep, leave, close }: { target: Target; id: string; keep: () => void; leave: () => void; close: () => void }) {
  const floating = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const element = floating.current;
    if (!element) return;
    let valid = true;
    let sequence = 0;
    const update = () => {
      const current = ++sequence;
      void computePosition(target.element, element, { strategy: "fixed", placement: "top", middleware: [offset(9), flip({ padding: 8 }), shift({ padding: 8 }), hide()] }).then(result => {
        if (!valid || current !== sequence) return;
        if (result.middlewareData.hide?.referenceHidden && target.element.getBoundingClientRect().width > 0) { close(); return; }
        setPoint({ x: result.x, y: result.y });
      });
    };
    const stop = autoUpdate(target.element, element, update);
    return () => { valid = false; stop(); };
  }, [target, close]);
  return <PresenceGate>{({ gate }) => <motion.span {...gate} ref={floating} initial={false} animate={point ?? { x: 0, y: 0 }} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="fixed left-0 top-0 z-[9999] w-max max-w-[calc(100vw-16px)]" style={{ ...gate.style, visibility: point ? "visible" : "hidden" }} onPointerEnter={keep} onPointerLeave={leave}>
    <TooltipSurface id={id} layout={!reduce} ready={Boolean(point)} className="max-w-[min(20rem,calc(100vw-16px))] whitespace-normal break-words">{target.content}</TooltipSurface>
  </motion.span>}</PresenceGate>;
}

export interface MorphicTooltipTriggerProps extends ComponentProps<"button"> {
  tooltip: ReactNode;
  /** Stable host id is useful for a controlled group. */
  tooltipKey?: string;
}
export function MorphicTooltipTrigger({ tooltip, tooltipKey, className, children, onFocus, onBlur, onPointerEnter, onPointerLeave, onClick, ...props }: MorphicTooltipTriggerProps) {
  const context = useContext(Context);
  if (!context) throw new Error("MorphicTooltipTrigger requires MorphicTooltip");
  const generated = useId();
  const id = tooltipKey ?? generated;
  const ref = useRef<HTMLButtonElement>(null);
  const { register } = context;
  useLayoutEffect(() => { if (ref.current) return register({ id, element: ref.current, content: tooltip }); }, [id, register, tooltip]);
  return <button {...props} ref={ref} type={props.type ?? "button"} aria-describedby={[props["aria-describedby"], context.active === id ? context.tooltipId : undefined].filter(Boolean).join(" ") || undefined}
    onFocus={event => { onFocus?.(event); if (!event.defaultPrevented) context.enter(id, true); }} onBlur={event => { onBlur?.(event); context.leave(); }}
    onPointerEnter={event => { onPointerEnter?.(event); if (context.hover && event.pointerType !== "touch") context.enter(id, false); }}
    onPointerLeave={event => { onPointerLeave?.(event); if (document.activeElement !== ref.current) context.leave(); }}
    onClick={event => { onClick?.(event); context.close(); }}
    className={cn("rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>{children}</button>;
}
