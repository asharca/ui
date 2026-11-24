"use client";

import { Search } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Switch } from "@/components/motion/switch";
import { cn } from "@/lib/utils";

export interface BentoLiveTilesProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

const SEARCH_DOCS = [
  { id: "doc-1", title: "Q3 launch plan", kind: "Doc" },
  { id: "doc-2", title: "Launch checklist", kind: "Task" },
  { id: "doc-3", title: "Marketing launch", kind: "Page" },
];

const QUERY_PHRASES = ["lau", "launch", "plan"];

const BARS = [
  { id: "b1", pct: 34, delay: 0 },
  { id: "b2", pct: 46, delay: 0.08 },
  { id: "b3", pct: 42, delay: 0.16 },
  { id: "b4", pct: 56, delay: 0.24 },
  { id: "b5", pct: 64, delay: 0.32 },
  { id: "b6", pct: 58, delay: 0.4 },
  { id: "b7", pct: 72, delay: 0.48 },
  { id: "b8", pct: 68, delay: 0.56 },
  { id: "b9", pct: 80, delay: 0.64 },
  { id: "b10", pct: 76, delay: 0.72 },
  { id: "b11", pct: 90, delay: 0.8 },
  { id: "b12", pct: 96, delay: 0.88 },
];

function CursorBadge({
  name,
  colorClass,
  bgClass,
}: {
  name: string;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <span className="inline-flex flex-col items-start">
      <svg
        aria-hidden="true"
        viewBox="0 0 14 14"
        className={cn("size-3.5 -mb-0.5 -ml-1 drop-shadow", colorClass)}
        fill="currentColor"
      >
        <path d="M2 1.5 12 6.5l-4.6 1.5L5.8 12.5 2 1.5z" />
      </svg>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow",
          bgClass,
        )}
      >
        {name}
      </span>
    </span>
  );
}

function highlightMatch(text: string, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-500/25 px-0.5 text-amber-300">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/** Four-tile asymmetric live bento showcase matching product workspace capabilities. */
export function BentoLiveTiles({
  eyebrow = "Product",
  title = "One workspace that keeps up with your team",
  description = "Write together, find anything, see what changed, and connect the tools you already use.",
  className,
}: BentoLiveTilesProps) {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, { amount: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [metricValue, setMetricValue] = useState(19480);
  const [queryIdx, setQueryIdx] = useState(0);
  const [switches, setSwitches] = useState({
    admins: true,
    guests: true,
    publicLinks: false,
  });

  useEffect(() => {
    if (!inView || reduce) return;
    const timer = window.setInterval(() => {
      setMetricValue((prev) => prev + 16);
      setQueryIdx((prev) => (prev + 1) % QUERY_PHRASES.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [inView, reduce]);

  const activeQuery = QUERY_PHRASES[queryIdx] ?? "lau";
  const matchedDocs = SEARCH_DOCS.filter((doc) =>
    doc.title.toLowerCase().includes(activeQuery.toLowerCase()),
  );
  const allowedCount =
    Number(switches.admins) + Number(switches.guests) + Number(switches.publicLinks);

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

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {/* Tile 1: Wide collab doc with 3 live cursors */}
        <article
          onMouseEnter={() => setHovered("collab")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 md:col-span-2",
            dimClass("collab"),
          )}
        >
          <div className="relative rounded-2xl border border-border bg-background/70 p-4 text-xs">
            <p className="font-semibold text-foreground">Q3 launch plan</p>
            <div className="mt-3 space-y-2.5 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-sky-400" />
                <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-foreground">
                  Ship onboarding to 10%
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber-400" />
                <span>Pricing review on Thursday</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>Draft release notes</span>
              </p>
            </div>

            <motion.div
              aria-hidden="true"
              animate={
                inView && !reduce
                  ? { x: [0, 56, 18, 0], y: [0, 14, -4, 0] }
                  : undefined
              }
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute right-24 top-8"
            >
              <CursorBadge name="Maya" colorClass="text-sky-500" bgClass="bg-sky-500" />
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={
                inView && !reduce
                  ? { x: [0, -34, 20, 0], y: [0, -10, 8, 0] }
                  : undefined
              }
              transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute right-10 top-16"
            >
              <CursorBadge
                name="Theo"
                colorClass="text-amber-500"
                bgClass="bg-amber-500"
              />
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={
                inView && !reduce
                  ? { x: [0, 32, -16, 0], y: [0, -8, 6, 0] }
                  : undefined
              }
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-3 right-28"
            >
              <CursorBadge
                name="Ines"
                colorClass="text-teal-500"
                bgClass="bg-teal-500"
              />
            </motion.div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-foreground">
              Edit together in real time
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              See who is in the doc and what they are working on.
            </p>
          </div>
        </article>

        {/* Tile 2: Tall right metric & 12 live chart bars */}
        <article
          onMouseEnter={() => setHovered("metric")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5 md:row-span-2",
            dimClass("metric"),
          )}
        >
          <div>
            <p className="text-xs text-muted-foreground">Weekly active</p>
            <p className="mt-1 font-mono text-3xl font-semibold tracking-tight tabular-nums">
              <NumberTicker value={metricValue} locale startOnView={false} />
            </p>

            <div
              aria-hidden="true"
              className="mt-6 flex h-44 items-end gap-1.5 rounded-2xl border border-border bg-background/60 p-3"
            >
              {BARS.map((bar) => (
                <motion.span
                  key={bar.id}
                  animate={
                    inView && !reduce
                      ? {
                          height: [
                            `${bar.pct}%`,
                            `${Math.min(100, bar.pct + 8)}%`,
                            `${bar.pct}%`,
                          ],
                        }
                      : undefined
                  }
                  transition={{
                    duration: 2.4,
                    delay: bar.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ height: `${bar.pct}%` }}
                  className="flex-1 rounded-sm bg-primary/85"
                />
              ))}
            </div>

            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-background/60 px-3.5 text-xs">
              {[
                { label: "Signups", delta: "+12.4%" },
                { label: "Retention", delta: "+3.1%" },
                { label: "Churn", delta: "-0.8%" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-mono font-medium text-emerald-500 tabular-nums">
                    {row.delta}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-foreground">
              Numbers that update themselves
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Live metrics with the trend right beside them.
            </p>
          </div>
        </article>

        {/* Tile 3: Bottom-left live search with match highlights */}
        <article
          onMouseEnter={() => setHovered("search")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5",
            dimClass("search"),
          )}
        >
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs text-foreground">
              <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
              <span className="font-mono">{activeQuery}</span>
              <span aria-hidden="true" className="h-3.5 w-px animate-pulse bg-primary" />
            </div>

            <ul className="mt-3 space-y-1.5 text-xs">
              {matchedDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-2.5 py-1.5"
                >
                  <span className="truncate font-medium text-foreground">
                    <Fragment>{highlightMatch(doc.title, activeQuery)}</Fragment>
                  </span>
                  <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">
                    {doc.kind}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-foreground">Find it as you type</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Every record filters in milliseconds with match highlights.
            </p>
          </div>
        </article>

        {/* Tile 4: Bottom-middle granular access toggles */}
        <article
          onMouseEnter={() => setHovered("access")}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-5",
            dimClass("access"),
          )}
        >
          <div className="rounded-2xl border border-border bg-background/70 p-3 text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground">Workspace admins</span>
                <Switch
                  checked={switches.admins}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, admins: checked }))
                  }
                  ariaLabel="Toggle workspace admins"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground">External guests</span>
                <Switch
                  checked={switches.guests}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, guests: checked }))
                  }
                  ariaLabel="Toggle external guests"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground">Public share links</span>
                <Switch
                  checked={switches.publicLinks}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, publicLinks: checked }))
                  }
                  ariaLabel="Toggle public share links"
                />
              </div>
            </div>
            <p className="mt-3 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground tabular-nums">
              {allowedCount} of 3 allowed
            </p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-foreground">
              Access you can read at a glance
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Flip permissions in place without opening a separate page.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
