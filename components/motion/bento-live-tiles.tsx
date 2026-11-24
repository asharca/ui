"use client";

import { CheckSquare, Command, Globe, KeyRound, Search, Share2 } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Switch } from "@/components/motion/switch";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface BentoLiveTilesProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

const QUERIES = [
  "Q3 launch checklist",
  "pricing experiment owner",
  "API migration notes",
];

/** Five-tile live bento section with hover focus dimming and autonomous viewport animations. */
export function BentoLiveTiles({
  eyebrow = "Product",
  title = "One workspace that keeps up with your team.",
  description = "Write together, find anything, see what changed, and connect the tools you already use.",
  className,
}: BentoLiveTilesProps) {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, { amount: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [metricValue, setMetricValue] = useState(18240);
  const [queryIndex, setQueryIndex] = useState(0);
  const [switches, setSwitches] = useState({
    links: true,
    sso: true,
    audit: false,
  });

  useEffect(() => {
    if (!inView || reduce) return;
    const timer = window.setInterval(() => {
      setMetricValue((prev) => prev + 14);
      setQueryIndex((prev) => (prev + 1) % QUERIES.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [inView, reduce]);

  const dimClass = (id: string) =>
    hovered && hovered !== id
      ? "opacity-55 transition-opacity duration-200"
      : "opacity-100 transition-opacity duration-200";

  return (
    <section
      ref={containerRef}
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
        {/* Tile 1: Collaborative document with live teammate cursors */}
        <article
          onMouseEnter={() => setHovered("collab")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative overflow-hidden rounded-3xl border border-border bg-card p-5 md:col-span-4",
            dimClass("collab"),
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground">Q3 launch plan</span>
            <div className="flex -space-x-1.5 text-[10px] font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-sky-500 text-white ring-2 ring-card">
                M
              </span>
              <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-black ring-2 ring-card">
                T
              </span>
              <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-card">
                I
              </span>
            </div>
          </div>

          <div className="relative mt-4 space-y-2.5 rounded-2xl border border-border bg-background p-4 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <CheckSquare aria-hidden="true" className="size-3.5 text-primary" />
              <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-sky-300">
                Ship onboarding to 10%
              </span>
            </div>
            <p className="pl-5 text-muted-foreground">Pricing review on Thursday</p>
            <p className="pl-5 text-muted-foreground">Draft release notes</p>

            <motion.span
              aria-hidden="true"
              animate={
                inView && !reduce
                  ? { x: [0, 72, 24, 0], y: [0, 12, -4, 0] }
                  : undefined
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute right-14 top-4 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-medium text-white shadow"
            >
              Maya
            </motion.span>
            <motion.span
              aria-hidden="true"
              animate={
                inView && !reduce
                  ? { x: [0, -48, 12, 0], y: [0, -14, 6, 0] }
                  : undefined
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-3 right-8 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white shadow"
            >
              Ines
            </motion.span>
          </div>

          <p className="mt-4 text-xs font-medium text-foreground">
            Edit together in real time
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            See teammates highlight lines and resolve tasks without reload lag.
          </p>
        </article>

        {/* Tile 2: Rolling metric & live bar pulse */}
        <article
          onMouseEnter={() => setHovered("metric")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dimClass("metric"),
          )}
        >
          <div>
            <p className="text-xs text-muted-foreground">Weekly active</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">
              <NumberTicker value={metricValue} locale startOnView={false} />
            </p>
            <div
              aria-hidden="true"
              className="mt-4 flex h-20 items-end gap-1.5 rounded-2xl border border-border bg-background p-3"
            >
              {[
                { id: "bar-1", pct: 38, delay: 0 },
                { id: "bar-2", pct: 52, delay: 0.14 },
                { id: "bar-3", pct: 46, delay: 0.28 },
                { id: "bar-4", pct: 68, delay: 0.42 },
                { id: "bar-5", pct: 60, delay: 0.56 },
                { id: "bar-6", pct: 84, delay: 0.7 },
                { id: "bar-7", pct: 72, delay: 0.84 },
                { id: "bar-8", pct: 95, delay: 0.98 },
              ].map((bar) => (
                <motion.span
                  key={bar.id}
                  animate={
                    inView && !reduce
                      ? {
                          height: [
                            `${bar.pct}%`,
                            `${Math.min(100, bar.pct + 12)}%`,
                            `${bar.pct}%`,
                          ],
                        }
                      : undefined
                  }
                  transition={{
                    duration: 2.2,
                    delay: bar.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ height: `${bar.pct}%` }}
                  className="flex-1 rounded-full bg-primary/80"
                />
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-foreground">Live momentum</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Numbers tick upward cleanly as workspaces ship.
            </p>
          </div>
        </article>

        {/* Tile 3: Self-typing command search */}
        <article
          onMouseEnter={() => setHovered("search")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dimClass("search"),
          )}
        >
          <div className="rounded-2xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
              <span className="truncate font-mono">{QUERIES[queryIndex]}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-2 py-1.5 text-foreground">
                <span>Launch notes v2</span>
                <Command aria-hidden="true" className="size-3" />
              </div>
              <div className="px-2 py-1">Design tokens audit</div>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-foreground">Instant recall</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Jump to docs, tasks, and decisions in one keystroke.
          </p>
        </article>

        {/* Tile 4: Real interactive access switches */}
        <article
          onMouseEnter={() => setHovered("access")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dimClass("access"),
          )}
        >
          <div className="space-y-2.5 rounded-2xl border border-border bg-background p-3.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-foreground">
                <Globe aria-hidden="true" className="size-3.5 text-muted-foreground" />
                Public links
              </span>
              <Switch
                checked={switches.links}
                onCheckedChange={(checked) =>
                  setSwitches((prev) => ({ ...prev, links: checked }))
                }
                ariaLabel="Toggle public links"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-foreground">
                <KeyRound aria-hidden="true" className="size-3.5 text-muted-foreground" />
                SSO required
              </span>
              <Switch
                checked={switches.sso}
                onCheckedChange={(checked) =>
                  setSwitches((prev) => ({ ...prev, sso: checked }))
                }
                ariaLabel="Toggle SSO required"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-foreground">
                <Share2 aria-hidden="true" className="size-3.5 text-muted-foreground" />
                Audit export
              </span>
              <Switch
                checked={switches.audit}
                onCheckedChange={(checked) =>
                  setSwitches((prev) => ({ ...prev, audit: checked }))
                }
                ariaLabel="Toggle audit export"
              />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-foreground">Granular controls</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Real security toggles built directly into workspace settings.
          </p>
        </article>

        {/* Tile 5: Connected signal hub */}
        <article
          onMouseEnter={() => setHovered("hub")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dimClass("hub"),
          )}
        >
          <div className="flex h-32 items-center justify-center rounded-2xl border border-border bg-background p-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 220 96"
              className="h-full w-full text-foreground"
            >
              <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" fill="none">
                <path d="M24 22 Q70 22 110 48" />
                <path d="M24 74 Q70 74 110 48" />
                <path d="M196 48 L110 48" />
              </g>
              <circle cx="24" cy="22" r="8" className="fill-card stroke-border" />
              <circle cx="24" cy="74" r="8" className="fill-card stroke-border" />
              <circle cx="196" cy="48" r="8" className="fill-card stroke-border" />
              <circle cx="110" cy="48" r="14" className="fill-primary/20 stroke-primary" />
              <motion.circle
                cx="24"
                cy="22"
                r="3"
                className="fill-primary"
                animate={
                  inView && !reduce
                    ? { cx: [24, 68, 110], cy: [22, 28, 48] }
                    : undefined
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: EASE_OUT }}
              />
              <motion.circle
                cx="196"
                cy="48"
                r="3"
                className="fill-emerald-500"
                animate={inView && !reduce ? { cx: [196, 150, 110] } : undefined}
                transition={{ duration: 2.1, repeat: Infinity, ease: EASE_OUT }}
              />
            </svg>
          </div>
          <p className="mt-4 text-xs font-medium text-foreground">Data hub</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Route live updates across every connected repository.
          </p>
        </article>
      </div>
    </section>
  );
}
