"use client";

import { Check, Link2, Share2, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface StickyScrollFeatureStep {
  id: string;
  number: string;
  title: string;
  description: string;
  statusText: string;
  highlights: string[];
}

export interface StickyScrollFeaturesProps {
  eyebrow?: string;
  title: string;
  description: string;
  boardTitle?: string;
  steps: StickyScrollFeatureStep[];
  className?: string;
}

/** Two-column workflow showcase pairing numbered steps with a persistent morphing product board. */
export function StickyScrollFeatures({
  eyebrow = "How it works",
  title,
  description,
  boardTitle = "Weekly revenue sync",
  steps,
  className,
}: StickyScrollFeaturesProps) {
  const reduce = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const current = steps[activeIndex] ?? steps[0];

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div>
          <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            {eyebrow}
          </span>
          <h3 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <ol className="mt-8 space-y-3">
            {steps.map((step, index) => {
              const active = index === activeIndex;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative w-full rounded-2xl border p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-border-strong bg-card shadow-xs"
                        : "border-transparent bg-card/40 text-muted-foreground hover:border-border hover:bg-card/70",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Sticky stage */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#203349] via-[#34495e] to-[#715a4a] p-6 text-white lg:sticky lg:top-20">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-xs backdrop-blur-md">
            <Link2 aria-hidden="true" className="size-3.5 text-sky-300" />
            <span className="font-medium">{boardTitle}</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">
              {current?.statusText ?? "Draft"}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className="mt-6 rounded-2xl border border-white/15 bg-neutral-950/85 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>
                    Stage {current.number} · {current.title}
                  </span>
                  {activeIndex === steps.length - 1 ? (
                    <Share2 aria-hidden="true" className="size-3.5 text-emerald-400" />
                  ) : (
                    <Sparkles aria-hidden="true" className="size-3.5 text-sky-400" />
                  )}
                </div>

                <ul className="mt-4 space-y-2.5">
                  {current.highlights.map((item, idx) => (
                    <motion.li
                      key={item}
                      layout={!reduce}
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs"
                    >
                      <span className="flex items-center gap-2.5 text-white/90">
                        <span
                          aria-hidden="true"
                          className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400"
                        >
                          <Check className="size-3" />
                        </span>
                        {item}
                      </span>
                      <span className="font-mono text-[10px] text-white/50">
                        0{idx + 1}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
