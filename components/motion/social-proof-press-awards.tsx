"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface PressAwardBadge {
  id: string;
  rank: string;
  title: string;
  jury: string;
  accent?: "amber" | "teal" | "sky" | "orange";
}

export interface PressPublicationQuote {
  id: string;
  publication: string;
  quote: string;
  author: string;
  role: string;
}

export interface PressAwardsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  awards: PressAwardBadge[];
  quotes: PressPublicationQuote[];
  className?: string;
}

const LAUREL_COLORS = {
  amber: "text-amber-400",
  teal: "text-teal-400",
  sky: "text-sky-400",
  orange: "text-orange-400",
};

/** Press recognition section with drawing SVG laurels and auto-rotating publication quotes. */
export function PressAwards({
  eyebrow = "Press and awards",
  title = "Recognized for the details.",
  description = "What independent editors and award juries noticed after launch.",
  awards,
  quotes,
  className,
}: PressAwardsProps) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduce || quotes.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [inView, paused, quotes.length, reduce]);

  const activeQuote = quotes[activeIndex] ?? quotes[0];

  return (
    <section
      ref={rootRef}
      aria-label={title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background px-6 py-12 text-center text-foreground sm:px-10 sm:py-14",
        className,
      )}
    >
      <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        {eyebrow}
      </span>
      <h3 className="mt-4 text-2xl font-medium tracking-tight sm:text-4xl">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {/* Four animated SVG laurel wreaths */}
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {awards.map((award, idx) => (
          <div key={award.id} className="relative flex flex-col items-center px-3 py-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 180 110"
              className={cn(
                "pointer-events-none h-24 w-40",
                LAUREL_COLORS[award.accent ?? "amber"],
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <motion.path
                d="M52 94 C30 82 20 56 26 26"
                initial={reduce ? false : { pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: EASE_OUT }}
              />
              <motion.path
                d="M128 94 C150 82 160 56 154 26"
                initial={reduce ? false : { pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: EASE_OUT }}
              />
              {[32, 50, 68].map((y, li) => (
                <motion.path
                  key={`leaf-l-${y}`}
                  d={`M${24 + li * 4} ${y} l-7 -6 M${156 - li * 4} ${y} l7 -6`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={inView ? { opacity: 0.8, scale: 1 } : undefined}
                  transition={{
                    duration: 0.35,
                    delay: 0.25 + idx * 0.08 + li * 0.08,
                    ease: EASE_OUT,
                  }}
                />
              ))}
            </svg>

            <div className="-mt-20 max-w-[140px]">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {award.rank}
              </p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {award.title}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{award.jury}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rotating press quote */}
      {activeQuote ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card/60 p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeQuote.id}
              initial={
                reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduce
                  ? undefined
                  : { opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.16 } }
              }
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <blockquote className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
                &ldquo;{activeQuote.quote}&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-muted-foreground">
                <strong className="font-medium text-foreground">
                  {activeQuote.author}
                </strong>{" "}
                · {activeQuote.role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div
            role="tablist"
            aria-label="Press publications"
            className="mt-6 flex flex-wrap justify-center gap-3 border-t border-border pt-4"
          >
            {quotes.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative pb-2 text-xs font-medium transition-colors outline-none",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span>{item.publication}</span>
                  {active ? (
                    <motion.span
                      key={`bar-${activeIndex}`}
                      initial={reduce ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: reduce ? 0 : 4.2, ease: "linear" }}
                      style={{ transformOrigin: "left" }}
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
