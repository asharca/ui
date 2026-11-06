"use client";

import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { useModalScope } from "@/lib/hooks/use-modal-scope";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface MorphicCardModalProps {
  /** Non-interactive card artwork/content; the entire card is an opening button. */
  card: ReactNode;
  children: ReactNode;
  title: string;
  description?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  dialogClassName?: string;
  /** Compose a continuous 3D flip with the shared card expansion. */
  flip?: boolean;
}

function CardOverlay({ id, title, description, card, children, close, className, flip, reduce }: {
  id: string; title: string; description?: ReactNode; card: ReactNode; children: ReactNode; close: () => void; className?: string; flip: boolean; reduce: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const present = useIsPresent();
  useModalScope(present, root, panel, close);
  return <PresenceGate>{({ isPresent, gate }) => <motion.div ref={root} inert={!isPresent} initial={false} exit={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.45 }} className="pointer-events-none">
    <motion.button {...gate} type="button" tabIndex={-1} aria-label={`Dismiss ${title}`} onClick={close} initial={{ "--card-backdrop-opacity": 0 }} animate={{ "--card-backdrop-opacity": 1 }} exit={{ "--card-backdrop-opacity": 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }} className="fixed inset-0 z-[90] h-full w-full cursor-default bg-black/50 backdrop-blur-md [opacity:var(--card-backdrop-opacity)]" />
    <div inert={!isPresent} className="pointer-events-none fixed inset-4 z-[91] flex items-center justify-center overflow-y-auto [perspective:1400px]">
    <motion.div {...gate} ref={panel} id={`${id}-dialog`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}
      layoutId={reduce ? undefined : `${id}-surface`} layout={!reduce}
      initial={flip && !reduce ? { rotateY: 0 } : false} animate={{ rotateY: flip && !reduce ? 180 : 0 }} exit={{ rotateY: 0 }}
      transition={reduce ? { duration: 0 } : { ...SPRING_LAYOUT, rotateY: { duration: 0.45, ease: EASE_OUT } }}
      className={cn("pointer-events-auto relative my-4 w-full max-w-sm rounded-3xl border border-border bg-card text-foreground shadow-2xl outline-none [transform-style:preserve-3d]", className)}>
      {flip && !reduce ? <div aria-hidden="true" inert className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-background [backface-visibility:hidden]">{card}</div> : null}
      <div style={{ transform: flip && !reduce ? "rotateY(180deg)" : undefined, backfaceVisibility: "hidden" }} className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-card p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><h2 id={`${id}-title`} className="text-base font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div><button type="button" onClick={close} aria-label={`Close ${title}`} className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
        {children}
      </div>
    </motion.div>
    </div>
  </motion.div>}</PresenceGate>;
}

/** Shared-layout card expansion with portal isolation, focus trap, Escape and focus return. */
export function MorphicCardModal({ card, children, title, description, open: controlled, defaultOpen = false, onOpenChange, className, dialogClassName, flip = false }: MorphicCardModalProps) {
  const id = useId();
  const reduce = useReducedMotion() ?? false;
  const hover = useHoverCapable();
  const [internal, setInternal] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const open = controlled ?? internal;
  const change = (value: boolean) => { if (controlled === undefined) setInternal(value); if (value !== open) onOpenChange?.(value); };
  useEffect(() => setMounted(true), []);
  return <LayoutGroup id={id}>
    <div className={cn("[perspective:1400px]", className)}>
      <motion.button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-dialog` : undefined} aria-label={`Open ${title}`}
        layoutId={reduce ? undefined : `${id}-surface`} animate={{ rotateY: 0, opacity: open ? 0 : 1 }}
        whileHover={flip && hover && !reduce && !open ? { y: -3 } : undefined} transition={SPRING_LAYOUT}
        onClick={() => change(true)} className="block w-full overflow-hidden rounded-3xl border border-border bg-background text-left text-foreground outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring">
        {card}
      </motion.button>
    </div>
    {mounted ? createPortal(<AnimatePresence initial={false}>{open ? <CardOverlay key="card-overlay" id={id} title={title} description={description} card={card} close={() => change(false)} className={dialogClassName} flip={flip} reduce={reduce}>{children}</CardOverlay> : null}</AnimatePresence>, document.body) : null}
  </LayoutGroup>;
}
