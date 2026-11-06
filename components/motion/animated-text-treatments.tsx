"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface AlternatingTextSwapProps {
  text: string;
  alternateText?: string;
  active?: boolean;
  paused?: boolean;
  className?: string;
}

/** A fixed-width motion label; focus, activation and pointer hover roll alternate letters. */
export function AlternatingTextSwap({ text, alternateText = text, active, paused = false, className }: AlternatingTextSwapProps) {
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const [engaged, setEngaged] = useState(false);
  const rolled = !paused && !reduce && (active ?? engaged);
  const occurrences = new Map<string, number>();
  const alternateOccurrences = new Map<string, number>();
  return <button type="button" tabIndex={0} onClick={() => setEngaged(true)} className={cn("m-0 border-0 bg-transparent p-0 text-inherit inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    onPointerEnter={() => { if (hover) setEngaged(true); }} onPointerLeave={() => setEngaged(false)}
    onFocus={() => setEngaged(true)} onBlur={() => setEngaged(false)}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" className="inline-grid whitespace-pre">
      <span className="col-start-1 row-start-1 inline-flex whitespace-pre">{Array.from(text).map((letter, index) => {
        const occurrence = occurrences.get(letter) ?? 0;
        occurrences.set(letter, occurrence + 1);
        return <span key={JSON.stringify([letter, occurrence])} className="inline-grid overflow-hidden py-0.5"><motion.span className="block" animate={{ y: rolled ? `${index % 2 ? 110 : -110}%` : "0%", opacity: rolled ? 0 : 1 }} transition={{ duration: 0.3, delay: index * 0.015, ease: EASE_OUT }}>{letter}</motion.span></span>;
      })}</span>
      <span className="col-start-1 row-start-1 inline-flex whitespace-pre">{Array.from(alternateText).map((letter, index) => {
        const occurrence = alternateOccurrences.get(letter) ?? 0;
        alternateOccurrences.set(letter, occurrence + 1);
        return <span key={JSON.stringify([letter, occurrence])} className="inline-grid overflow-hidden py-0.5"><motion.span initial={false} className="block" animate={{ y: rolled ? "0%" : `${index % 2 ? -110 : 110}%`, opacity: rolled ? 1 : 0 }} transition={{ duration: 0.3, delay: index * 0.015, ease: EASE_OUT }}>{letter}</motion.span></span>;
      })}</span>
    </span>
  </button>;
}

export interface HighlightTextSegment { text: string; highlight?: boolean }
export interface BlurHighlightProps {
  segments: HighlightTextSegment[];
  /** Hold the current phrase marker. */
  paused?: boolean;
  /** Cycling cadence: 1800 ms for a single marker, 900 ms for progressive markers. */
  interval?: number;
  className?: string;
}

function HighlightParagraph({ segments, paused = false, interval, className, progressive }: BlurHighlightProps & { progressive: boolean }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLParagraphElement>(null);
  const inView = useInView(root, { once: true, amount: .4 });
  const count = segments.reduce((total, segment) => total + Number(Boolean(segment.highlight)), 0);
  const [step, setStep] = useState(progressive ? -1 : 0);
  useEffect(() => {
    if (!inView || paused || count < 1 || (progressive ? reduce || step >= count - 1 : count < 2)) return;
    const timer = setTimeout(() => setStep(value => progressive ? Math.min(value + 1, count - 1) : (value + 1) % count), progressive && step < 0 ? 140 : Math.max(100, interval ?? (progressive ? 900 : 1800)));
    return () => clearTimeout(timer);
  }, [inView, reduce, paused, count, progressive, step, interval]);
  let phrase = -1;
  let word = 0;
  const occurrences = new Map<string, number>();
  return <p ref={root} className={cn("text-pretty max-w-4xl font-medium text-3xl text-foreground leading-[1.18] tracking-[-0.04em] sm:text-5xl lg:text-6xl", className)} data-highlight-mode={progressive ? "progressive" : "hover"}>
    {segments.map(segment => {
      if (segment.highlight) phrase += 1;
      const highlighted = Boolean(segment.highlight && (progressive ? reduce || phrase <= step : phrase === step));
      const identity = JSON.stringify([segment.text, Boolean(segment.highlight)]);
      const occurrence = occurrences.get(identity) ?? 0;
      occurrences.set(identity, occurrence + 1);
      const tokens = segment.text.split(/(\s+)/u);
      const tokenOccurrences = new Map<string, number>();
      const lastWord = tokens.findLastIndex(token => /\S/u.test(token));
      return <span key={JSON.stringify([identity, occurrence])}>
        {tokens.map((token, tokenIndex) => {
          if (!/\S/u.test(token)) return token;
          const tokenOccurrence = tokenOccurrences.get(token) ?? 0;
          tokenOccurrences.set(token, tokenOccurrence + 1);
          const delay = word++ * .035;
          return <motion.span key={JSON.stringify([token, tokenOccurrence])} initial={reduce ? false : { opacity: 0, filter: "blur(5px)" }} animate={reduce || inView ? { opacity: 1, filter: "blur(0px)" } : undefined} transition={{ duration: reduce ? 0 : .2, delay: reduce ? 0 : delay, ease: EASE_OUT }} className={cn("relative isolate inline-block transition-colors duration-200 motion-reduce:transition-none", highlighted && "text-orange-950")}>
            {segment.highlight && <motion.span aria-hidden="true" initial={false} animate={{ opacity: highlighted ? 1 : 0 }} transition={{ duration: reduce ? 0 : .18, ease: EASE_OUT }} className={cn("absolute inset-y-[0.03em] -left-[0.12em] -z-10 bg-orange-200", tokenIndex === lastWord ? "-right-[0.12em]" : "-right-[0.3em]")} />}
            {token}
          </motion.span>;
        })}
      </span>;
    })}
  </p>;
}

/** One phrase marker cycles at the observed cadence; reduced motion removes its transition. */
export function BlurHighlight(props: BlurHighlightProps) { return <HighlightParagraph {...props} progressive={false} />; }
/** Phrase markers accumulate and stop once all selected phrases are marked. */
export function ProgressiveBlurHighlight(props: BlurHighlightProps) { return <HighlightParagraph {...props} progressive />; }
