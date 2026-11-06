"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { MorphicCardModal, type MorphicCardModalProps } from "@/components/motion/morphic-card-modal";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ImageFlipCardProps {
  front: ReactNode;
  back: ReactNode;
  label: string;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
  className?: string;
}

/** Independent, host-provided faces. Hidden controls are inert immediately, not after the turn. */
export function ImageFlipCard({ front, back, label, flipped: controlled, defaultFlipped = false, onFlippedChange, className }: ImageFlipCardProps) {
  const [internal, setInternal] = useState(defaultFlipped);
  const flipped = controlled ?? internal;
  const reduce = useReducedMotion();
  const id = useId();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const hidden = flipped ? frontRef.current : backRef.current;
    if (hidden?.contains(document.activeElement)) toggleRef.current?.focus();
  }, [flipped]);
  const toggle = () => { if (controlled === undefined) setInternal(!flipped); onFlippedChange?.(!flipped); };
  return <article className={cn("relative aspect-[4/5] w-full text-foreground [perspective:1400px]", className)} data-flipped={flipped}>
    <motion.div id={id} onClick={event => { if (!(event.target as HTMLElement).closest("a,button,input,select,textarea,[role=button]")) toggle(); }}
      animate={{ rotateY: reduce ? 0 : flipped ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.55, ease: EASE_OUT }}
      className="absolute inset-0 grid rounded-[1.75rem] border border-border bg-background [transform-style:preserve-3d]">
      <div ref={frontRef} inert={flipped} aria-hidden={flipped} style={{ visibility: reduce && flipped ? "hidden" : undefined }} className="col-start-1 row-start-1 h-full overflow-hidden rounded-[1.75rem] [backface-visibility:hidden]">{front}</div>
      <div ref={backRef} inert={!flipped} aria-hidden={!flipped} style={{ transform: reduce ? undefined : "rotateY(180deg)", visibility: reduce && !flipped ? "hidden" : undefined }} className="col-start-1 row-start-1 h-full overflow-hidden rounded-[1.75rem] [backface-visibility:hidden]">{back}</div>
    </motion.div>
    <button ref={toggleRef} type="button" aria-label={flipped ? `Show front of ${label}` : `Flip ${label}`} aria-controls={id} aria-pressed={flipped} onClick={toggle} className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-ring"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5v5h5M5 10a7 7 0 1 1 0 4" /></svg></button>
  </article>;
}

/** Reuses the same portal, shared layout surface and focus scope as the expansion card. */
export function ModalFlipCard(props: Omit<MorphicCardModalProps, "flip">) {
  return <MorphicCardModal {...props} flip />;
}
