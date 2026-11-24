"use client";

import { Check, SlidersHorizontal, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface BentoPhotoMosaicProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

const SWATCHES = [
  { hex: "#D97757", label: "Terracotta" },
  { hex: "#2A9D8F", label: "Seafoam" },
  { hex: "#E9C46A", label: "Sunlit" },
  { hex: "#264653", label: "Midnight" },
];

/** Five-tile creative photography bento with shader card, before/after wipe slider, print fan, and palette swatches. */
export function BentoPhotoMosaic({
  eyebrow = "Photo library",
  title = "Every shot, sorted and ready to share.",
  description = "Edit, group, and send your photos without leaving the library.",
  ctaLabel = "Start free",
  onCtaClick,
  className,
}: BentoPhotoMosaicProps) {
  const reduce = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState<string | null>(null);
  const [splitPct, setSplitPct] = useState(52);
  const [fanned, setFanned] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const dim = (id: string) =>
    hovered && hovered !== id
      ? "opacity-55 transition-opacity duration-200"
      : "opacity-100 transition-opacity duration-200";

  const copySwatch = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Ignore restricted clipboard environments
    }
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-10",
        className,
      )}
    >
      <header className="max-w-xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-6">
        {/* Tile 1: Lead shader tile */}
        <article
          onMouseEnter={() => setHovered("lead")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative flex min-h-60 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#2b1a14] via-[#6e3a28] to-[#1e3d47] p-6 text-white md:col-span-3",
            dim("lead"),
          )}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              All devices
            </p>
            <h4 className="mt-2 max-w-xs text-xl font-medium leading-snug">
              Your whole library, one calm place.
            </h4>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/75">
              Import from any camera or phone and pick up edits on the next screen.
            </p>
          </div>
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-4 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-medium text-neutral-950 transition-colors hover:bg-white/90"
          >
            {ctaLabel}
          </button>
        </article>

        {/* Tile 2: Before / after lighting slider */}
        <article
          onMouseEnter={() => setHovered("compare")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:col-span-3",
            dim("compare"),
          )}
        >
          <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
            {/* Edited warm horizon */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b2119] via-[#c7744d] to-[#f2cc8f]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 320 140"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
            >
              <path d="M0 110 Q90 68 180 96 T320 78 L320 140 L0 140 Z" fill="rgba(25,18,16,0.55)" />
            </svg>

            {/* Original muted plate clipped at splitPct */}
            <div
              style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
              className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-700 to-neutral-500"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 320 140"
                preserveAspectRatio="none"
                className="size-full"
              >
                <path d="M0 110 Q90 68 180 96 T320 78 L320 140 L0 140 Z" fill="rgba(12,12,14,0.65)" />
              </svg>
            </div>

            <div
              aria-hidden="true"
              style={{ left: `${splitPct}%` }}
              className="absolute inset-y-0 w-0.5 bg-white shadow"
            >
              <span className="absolute top-1/2 left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow">
                <SlidersHorizontal className="size-3" />
              </span>
            </div>

            <span className="absolute left-3 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
              Original
            </span>
            <span className="absolute right-3 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
              Edited
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-foreground">Fix the lighting cleanly</p>
              <p className="text-[11px] text-muted-foreground">
                Drag to compare raw exposure vs balanced grade.
              </p>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={splitPct}
              aria-label="Before and after split position"
              onChange={(event) => setSplitPct(Number(event.target.value))}
              className="w-24 accent-primary"
            />
          </div>
        </article>

        {/* Tile 3: Fanned print deck */}
        <article
          onMouseEnter={() => {
            setHovered("prints");
            setFanned(true);
          }}
          onMouseLeave={() => {
            setHovered(null);
            setFanned(false);
          }}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dim("prints"),
          )}
        >
          <button
            type="button"
            onClick={() => setFanned((prev) => !prev)}
            className="relative flex h-32 w-full items-center justify-center rounded-2xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle print fan"
          >
            {[
              { id: "p1", bg: "from-sky-500/40 to-indigo-500/40", rot: -10, x: -24 },
              { id: "p2", bg: "from-amber-500/40 to-rose-500/40", rot: 0, x: 0 },
              { id: "p3", bg: "from-emerald-500/40 to-teal-500/40", rot: 10, x: 24 },
            ].map((card, i) => (
              <motion.span
                key={card.id}
                animate={
                  reduce
                    ? undefined
                    : fanned
                      ? { rotate: card.rot, x: card.x }
                      : { rotate: (i - 1) * 3, x: (i - 1) * 6 }
                }
                transition={SPRING_LAYOUT}
                className={cn(
                  "absolute h-20 w-16 rounded-xl border-2 border-white/80 bg-gradient-to-br shadow-md",
                  card.bg,
                )}
              />
            ))}
          </button>
          <div className="mt-4">
            <p className="text-xs font-medium text-foreground">Print-ready stacks</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hover or tap to fan curated selects for client proofing.
            </p>
          </div>
        </article>

        {/* Tile 4: Palette swatches */}
        <article
          onMouseEnter={() => setHovered("palette")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dim("palette"),
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => void copySwatch(swatch.hex)}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-2.5 py-2 text-left text-[11px] transition-colors hover:border-border-strong"
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: swatch.hex }}
                    className="size-4 rounded-md"
                  />
                  <span className="font-mono text-foreground">{swatch.hex}</span>
                </span>
                {copiedHex === swatch.hex ? (
                  <Check aria-hidden="true" className="size-3 text-emerald-500" />
                ) : null}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-foreground">Extracted palette</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click any swatch to copy its exact hex token.
            </p>
          </div>
        </article>

        {/* Tile 5: Shared album viewers */}
        <article
          onMouseEnter={() => setHovered("album")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dim("album"),
          )}
        >
          <div className="space-y-2 rounded-2xl border border-border bg-background p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Autumn shoot</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                <Users aria-hidden="true" className="size-3" />3 viewing
              </span>
            </div>
            <motion.p
              initial={reduce ? false : { opacity: 0.7 }}
              animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: EASE_OUT }}
              className="text-[11px] text-muted-foreground"
            >
              Clara starred Frame 042 · Select #4
            </motion.p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-foreground">Shared albums</p>
            <p className="mt-1 text-xs text-muted-foreground">
              See collaborators join and pick favorite shots live.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
