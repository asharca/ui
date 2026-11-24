"use client";

import { Pause, Play, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface VideoShowcaseChapter {
  id: string;
  label: string;
  headline: string;
  metricLabel: string;
  metricValue: number;
  rows: string[];
}

export interface VideoShowcaseHeroProps {
  brandName: string;
  navLinks: { label: string; href: string }[];
  eyebrow?: string;
  titleLead: string;
  titleMuted: string;
  primaryCtaLabel: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  footnote?: string;
  browserHost?: string;
  chapters: VideoShowcaseChapter[];
  className?: string;
}

/** Split-headline hero above a live looping product showcase that expands into an interactive tour modal. */
export function VideoShowcaseHero({
  brandName,
  navLinks,
  eyebrow = "Product tour",
  titleLead,
  titleMuted,
  primaryCtaLabel,
  primaryCtaHref = "#start",
  secondaryCtaLabel = "Watch the tour",
  footnote = "No card needed",
  browserHost = "workspace.basalt.app",
  chapters,
  className,
}: VideoShowcaseHeroProps) {
  const reduce = useReducedMotion() ?? false;
  const [chapterIndex, setChapterIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!playing || reduce || chapters.length <= 1) return;
    const timer = window.setInterval(() => {
      setChapterIndex((prev) => (prev + 1) % chapters.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [chapters.length, playing, reduce]);

  const activeChapter = chapters[chapterIndex] ?? chapters[0];

  const renderStageBody = (expandedView: boolean) =>
    activeChapter ? (
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="font-medium">
              {brandName} / {activeChapter.label}
            </span>
          </div>
          <span className="font-mono text-[11px] text-white/50">{browserHost}</span>
        </div>

        <div className={cn("p-5 sm:p-7", expandedView && "min-h-72")}>
          <div className="flex flex-wrap gap-1.5">
            {chapters.map((chapter, idx) => {
              const active = idx === chapterIndex;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setChapterIndex(idx);
                  }}
                  className={cn(
                    "relative rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    active ? "text-white" : "text-white/55 hover:text-white/90",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId={
                        expandedView ? "tour-chapter-modal" : "tour-chapter-stage"
                      }
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      className="absolute inset-0 rounded-full bg-white/15"
                    />
                  ) : null}
                  <span className="relative z-10">{chapter.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeChapter.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]"
            >
              <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">
                  {activeChapter.headline}
                </p>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {activeChapter.rows.map((row) => (
                    <li
                      key={row}
                      className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-sky-400"
                      />
                      <span>{row}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="text-xs text-white/60">
                  {activeChapter.metricLabel}
                </span>
                <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">
                  <NumberTicker
                    value={activeChapter.metricValue}
                    locale
                    startOnView={false}
                  />
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={false}
                    animate={{ width: `${((chapterIndex + 1) / chapters.length) * 100}%` }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}
                    className="h-full rounded-full bg-sky-400"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    ) : null;

  return (
    <section
      aria-label={titleLead}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border bg-background px-5 py-8 text-foreground sm:px-10 sm:py-10",
        className,
      )}
    >
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles aria-hidden="true" className="size-4 text-primary" />
            {brandName}
          </span>
          <nav aria-label={`${brandName} navigation`} className="hidden items-center gap-5 text-xs text-muted-foreground sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => {
                  if (link.href.startsWith("#")) event.preventDefault();
                }}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <a
          href={primaryCtaHref}
          onClick={(event) => {
            if (primaryCtaHref.startsWith("#")) event.preventDefault();
          }}
          className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Get started
        </a>
      </header>

      <div className="mx-auto mt-12 max-w-5xl">
        <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          {eyebrow}
        </span>

        <h2 className="mt-5 max-w-3xl text-3xl font-medium tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
          <span className="block">{titleLead}</span>
          <span className="mt-1 block text-muted-foreground">{titleMuted}</span>
        </h2>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={primaryCtaHref}
            onClick={(event) => {
              if (primaryCtaHref.startsWith("#")) event.preventDefault();
            }}
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {primaryCtaLabel}
          </a>
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalOpen(true)}
            className="h-10 rounded-full px-4 text-xs"
          >
            <Play aria-hidden="true" className="size-3.5 fill-current" />
            {secondaryCtaLabel}
          </Button>
          {footnote ? (
            <span className="text-xs text-muted-foreground">{footnote}</span>
          ) : null}
        </div>

        {/* Interactive shader tour stage */}
        <div className="group relative mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0f223d] via-[#1b3b64] to-[#122633] p-5 transition-colors hover:border-border-strong sm:p-8">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Expand interactive product tour"
            className="absolute inset-0 z-0 cursor-pointer rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          />
          <div className="pointer-events-none relative z-10 [&_button]:pointer-events-auto">
            {renderStageBody(false)}
          </div>
        </div>
      </div>

      <MorphingModal
        viewId={modalOpen ? "tour-player" : null}
        onClose={() => setModalOpen(false)}
        placement="center"
        ariaLabel={`${brandName} full product tour`}
        className="max-w-3xl bg-neutral-950 text-white border-white/15"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/75">
              Interactive walkthrough · {chapterIndex + 1} / {chapters.length}
            </span>
            <button
              type="button"
              onClick={() => setPlaying((prev) => !prev)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-xs font-medium text-white hover:bg-white/15"
            >
              {playing ? (
                <>
                  <Pause aria-hidden="true" className="size-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play aria-hidden="true" className="size-3" />
                  Play
                </>
              )}
            </button>
          </div>
          {renderStageBody(true)}
        </div>
      </MorphingModal>
    </section>
  );
}
