"use client";

import { CheckCircle2, ChevronUp, CircleDot, Clock, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type RoadmapStage = "planned" | "in-progress" | "shipped";

export interface RoadmapBoardItem {
  id: string;
  title: string;
  description: string;
  area: string;
  stage: RoadmapStage;
  votes: number;
  voted?: boolean;
}

export interface RoadmapBoardProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  areas: string[];
  items: RoadmapBoardItem[];
  onVote?: (id: string) => void;
  onSuggest?: (input: { title: string; area: string; description: string }) => void;
  className?: string;
}

const COLUMNS: { id: RoadmapStage; label: string; icon: typeof Clock }[] = [
  { id: "planned", label: "Planned", icon: Clock },
  { id: "in-progress", label: "In progress", icon: CircleDot },
  { id: "shipped", label: "Shipped", icon: CheckCircle2 },
];

/** Three-column public roadmap board with area filters, voting, and live feature suggestions. */
export function PublicRoadmapBoard({
  eyebrow = "Public roadmap",
  title = "Help decide what we build next",
  description = "Vote on the ideas you want most. We read every suggestion and move the top ones into planning.",
  areas,
  items,
  onVote,
  onSuggest,
  className,
}: RoadmapBoardProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [selectedArea, setSelectedArea] = useState("All areas");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftArea, setDraftArea] = useState(areas[0] ?? "Apps");
  const [draftDesc, setDraftDesc] = useState("");

  const areaTabs = ["All areas", ...areas];

  const visibleItems = useMemo(() => {
    if (selectedArea === "All areas") return items;
    return items.filter((item) => item.area === selectedArea);
  }, [items, selectedArea]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draftTitle.trim()) return;
    onSuggest?.({
      title: draftTitle.trim(),
      area: draftArea,
      description:
        draftDesc.trim() || "Suggested by community member for upcoming milestone review.",
    });
    setDraftTitle("");
    setDraftDesc("");
    setSuggestOpen(false);
  };

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-8",
        className,
      )}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {onSuggest ? (
          <button
            type="button"
            onClick={() => setSuggestOpen((prev) => !prev)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Suggest a feature
          </button>
        ) : null}
      </header>

      <AnimatePresence>
        {suggestOpen ? (
          <motion.form
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onSubmit={handleSubmit}
            className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_11rem_auto]"
          >
            <input
              type="text"
              required
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Feature title (e.g. Export trace as JSON)"
              aria-label="Suggested feature title"
              className="min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select
              value={draftArea}
              onChange={(event) => setDraftArea(event.target.value)}
              aria-label="Feature area"
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Post idea
            </button>
            <input
              type="text"
              value={draftDesc}
              onChange={(event) => setDraftDesc(event.target.value)}
              placeholder="Optional context or workflow use case..."
              aria-label="Suggested feature details"
              className="sm:col-span-3 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </motion.form>
        ) : null}
      </AnimatePresence>

      {/* Area filter bar */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {areaTabs.map((area) => {
          const active = selectedArea === area;
          return (
            <button
              key={area}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedArea(area)}
              className={cn(
                "relative rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${uid}-area`}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  className="absolute inset-0 rounded-full border border-border bg-card shadow-xs"
                />
              ) : null}
              <span className="relative z-10">{area}</span>
            </button>
          );
        })}
      </div>

      {/* Three-column board */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const colItems = visibleItems.filter((item) => item.stage === col.id);
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="rounded-2xl border border-border bg-card/50 p-3.5"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Icon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  {col.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {colItems.length}
                </span>
              </div>

              <ul className="space-y-2.5">
                {colItems.map((item) => (
                  <motion.li
                    key={item.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="rounded-2xl border border-border bg-background p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.area}
                      </span>
                      <button
                        type="button"
                        aria-pressed={Boolean(item.voted)}
                        aria-label={`Vote for ${item.title}`}
                        onClick={() => onVote?.(item.id)}
                        className={cn(
                          "inline-flex h-7 items-center gap-1 rounded-full border px-2 font-mono text-xs tabular-nums transition-colors",
                          item.voted
                            ? "border-primary/40 bg-primary/15 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <ChevronUp aria-hidden="true" className="size-3" />
                        <NumberTicker value={item.votes} startOnView={false} />
                      </button>
                    </div>
                    <h4 className="mt-2.5 text-xs font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
