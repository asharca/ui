"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { SPRING_LAYOUT } from "@/lib/ease";
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
  { hex: "#3E6F7A", label: "Fjord" },
  { hex: "#2F4A3A", label: "Pine" },
  { hex: "#BFD3DA", label: "Mist" },
  { hex: "#8A6A4F", label: "Timber" },
];

const PHOTOS = [
  { id: "ph-1", sky: "from-sky-400 via-teal-400 to-emerald-500", ridge: "#164e63" },
  { id: "ph-2", sky: "from-stone-400 via-amber-200/70 to-stone-600", ridge: "#3f3f46" },
  { id: "ph-3", sky: "from-sky-300 via-blue-500 to-slate-800", ridge: "#1e293b" },
  { id: "ph-4", sky: "from-amber-300 via-emerald-700 to-neutral-900", ridge: "#14532d" },
  { id: "ph-5", sky: "from-slate-300 via-cyan-600 to-slate-900", ridge: "#0f172a" },
  { id: "ph-6", sky: "from-amber-200 via-stone-500 to-stone-900", ridge: "#292524" },
];

function ScenicThumb({
  sky,
  ridge,
  className,
}: {
  sky: string;
  ridge: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-b", sky, className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 90"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <path
          d="M0 64 L32 34 L58 54 L88 26 L120 56 L120 90 L0 90 Z"
          fill={ridge}
          fillOpacity="0.65"
        />
        <path
          d="M0 74 L44 50 L78 68 L104 52 L120 66 L120 90 L0 90 Z"
          fill={ridge}
          fillOpacity="0.92"
        />
      </svg>
    </div>
  );
}

/** Asymmetric photography bento with 6-tile ambient picker, draggable light comparison, fanned album, and palette swatches. */
export function BentoPhotoMosaic({
  eyebrow = "Photo library",
  title = "Every shot, sorted and ready to share",
  description = "Edit, group, and send your photos without leaving the library.",
  ctaLabel = "Start free",
  onCtaClick,
  className,
}: BentoPhotoMosaicProps) {
  const reduce = useReducedMotion() ?? false;
  const compareRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [splitPct, setSplitPct] = useState(32);
  const [fanned, setFanned] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const dim = (id: string) =>
    hovered && hovered !== id
      ? "opacity-55 transition-opacity duration-200"
      : "opacity-100 transition-opacity duration-200";

  const updateSplitFromClientX = (clientX: number) => {
    const rect = compareRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(8, Math.min(92, Math.round(pct))));
  };

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
      <header className="max-w-2xl">
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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Left tall tile: Atmospheric card with selectable 3x2 grid */}
        <article
          onMouseEnter={() => setHovered("lead")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0e4d5e] via-[#4a746c] to-[#9a6b24] p-6 text-white md:row-span-2",
            dim("lead"),
          )}
        >
          <div className="my-auto rounded-2xl border border-white/15 bg-neutral-950/70 p-2.5 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-3 gap-2">
              {PHOTOS.map((photo, idx) => {
                const selected = idx === activePhoto;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Select library photo ${idx + 1}`}
                    onClick={() => setActivePhoto(idx)}
                    className={cn(
                      "aspect-[4/3] overflow-hidden rounded-xl transition-transform outline-none",
                      selected
                        ? "ring-2 ring-white scale-[1.02]"
                        : "opacity-85 hover:opacity-100",
                    )}
                  >
                    <ScenicThumb sky={photo.sky} ridge={photo.ridge} className="size-full" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-medium leading-snug text-white">
              Your whole library, one calm place
            </h4>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-white/80">
              Import from any device and pick up where you left off on the next one.
            </p>
            <button
              type="button"
              onClick={onCtaClick}
              className="mt-4 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-medium text-neutral-950 transition-colors hover:bg-white/90"
            >
              {ctaLabel}
            </button>
          </div>
        </article>

        {/* Top-right tile: Directly draggable Original/Edited lighting canvas */}
        <article
          onMouseEnter={() => setHovered("compare")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5",
            dim("compare"),
          )}
        >
          <div
            ref={compareRef}
            role="slider"
            tabIndex={0}
            aria-label="Before and after light edit comparison"
            aria-valuemin={8}
            aria-valuemax={92}
            aria-valuenow={splitPct}
            onPointerDown={(event) => {
              draggingRef.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              updateSplitFromClientX(event.clientX);
            }}
            onPointerMove={(event) => {
              if (!draggingRef.current) return;
              updateSplitFromClientX(event.clientX);
            }}
            onPointerUp={() => {
              draggingRef.current = false;
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setSplitPct((p) => Math.max(8, p - 4));
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                setSplitPct((p) => Math.min(92, p + 4));
              }
            }}
            className="relative h-48 cursor-ew-resize select-none overflow-hidden rounded-2xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Edited alpine lake glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0d6e6e] via-[#34a0a4] to-[#fde68a]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 360 160"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
            >
              <path d="M0 98 L72 44 L148 82 L236 28 L312 72 L360 54 L360 112 L0 112 Z" fill="rgba(28,37,44,0.72)" />
              <rect y="112" width="360" height="48" fill="rgba(13,148,136,0.52)" />
            </svg>

            {/* Original muted shadow plate */}
            <div
              style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
              className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-700 to-neutral-500"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 360 160"
                preserveAspectRatio="none"
                className="size-full"
              >
                <path d="M0 98 L72 44 L148 82 L236 28 L312 72 L360 54 L360 112 L0 112 Z" fill="rgba(16,18,22,0.82)" />
                <rect y="112" width="360" height="48" fill="rgba(30,34,40,0.72)" />
              </svg>
            </div>

            <div
              aria-hidden="true"
              style={{ left: `${splitPct}%` }}
              className="absolute inset-y-0 w-0.5 bg-white shadow"
            >
              <span className="absolute left-1/2 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[10px] font-bold tracking-tighter text-neutral-900 shadow-lg">
                ||
              </span>
            </div>

            <span className="absolute left-3 top-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
              Original
            </span>
            <span className="absolute right-3 top-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
              Edited
            </span>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">
              Fix the light in one pass
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag to compare the original with the edit.
            </p>
          </div>
        </article>

        {/* Bottom-right pair */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Album fan */}
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
              "flex flex-col justify-between rounded-3xl border border-border bg-card p-5",
              dim("prints"),
            )}
          >
            <button
              type="button"
              onClick={() => setFanned((prev) => !prev)}
              className="relative flex h-28 w-full items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle album stack fan"
            >
              {[
                { id: "a1", sky: "from-sky-400 to-teal-700", ridge: "#0f172a", rot: -10, x: -18 },
                { id: "a2", sky: "from-amber-300 to-stone-700", ridge: "#292524", rot: 10, x: 18 },
                { id: "a3", sky: "from-emerald-400 via-emerald-700 to-neutral-900", ridge: "#14532d", rot: 0, x: 0 },
              ].map((card, i) => (
                <motion.div
                  key={card.id}
                  animate={
                    reduce
                      ? undefined
                      : fanned
                        ? { rotate: card.rot, x: card.x }
                        : { rotate: (i - 1) * 3, x: (i - 1) * 4 }
                  }
                  transition={SPRING_LAYOUT}
                  className="absolute h-24 w-20 overflow-hidden rounded-xl border border-white/60 shadow-lg"
                >
                  <ScenicThumb sky={card.sky} ridge={card.ridge} className="size-full" />
                </motion.div>
              ))}
            </button>

            <div className="mt-3 text-center">
              <p className="text-xs font-medium text-foreground">Weekend in the hills</p>
              <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                <NumberTicker value={128} startOnView={false} /> photos
              </p>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-foreground">
                Albums that build themselves
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Trips and people are grouped as you shoot.
              </p>
            </div>
          </article>

          {/* Palette swatches */}
          <article
            onMouseEnter={() => setHovered("palette")}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex flex-col justify-between rounded-3xl border border-border bg-card p-5",
              dim("palette"),
            )}
          >
            <div>
              <div className="h-16 overflow-hidden rounded-xl border border-border">
                <ScenicThumb
                  sky="from-slate-200 via-cyan-600 to-slate-900"
                  ridge="#134e4a"
                  className="size-full"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => void copySwatch(swatch.hex)}
                    className="group flex flex-col items-center gap-1 outline-none"
                    aria-label={`Copy ${swatch.hex}`}
                  >
                    <span
                      style={{ backgroundColor: swatch.hex }}
                      className="grid size-8 place-items-center rounded-full border border-white/15 shadow-xs transition-transform group-hover:scale-105"
                    >
                      {copiedHex === swatch.hex ? (
                        <Check aria-hidden="true" className="size-3.5 text-white" />
                      ) : null}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {swatch.hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">
                Pull a palette from any photo
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap a swatch to copy its hex.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
