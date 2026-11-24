"use client";

import { Check, Minus, RotateCcw, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface EvalModelSummary {
  id: string;
  name: string;
  tier: string;
  deltaVsLast: number;
}

export interface EvalCellResult {
  score: number;
  outcome: "pass" | "partial" | "fail";
  output: string;
  graderNote: string;
}

export interface EvalTestCase {
  id: string;
  title: string;
  category: string;
  prompt: string;
  regression?: boolean;
  results: Record<string, EvalCellResult>;
}

export interface EvalResultsProps {
  suiteName: string;
  runLabel: string;
  models: EvalModelSummary[];
  cases: EvalTestCase[];
  running?: boolean;
  onReplay?: () => void;
  className?: string;
}

/** AI eval results comparison card with pass-rate split bars, filters, and modal inspector. */
export function EvalResults({
  suiteName,
  runLabel,
  models,
  cases,
  running = false,
  onReplay,
  className,
}: EvalResultsProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [filter, setFilter] = useState<"all" | "failing" | "regressions">("all");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const modelStats = useMemo(() => {
    return models.map((model) => {
      let pass = 0;
      let partial = 0;
      let fail = 0;
      for (const testCase of cases) {
        const res = testCase.results[model.id];
        if (!res) continue;
        if (res.outcome === "pass") pass += 1;
        else if (res.outcome === "partial") partial += 1;
        else fail += 1;
      }
      const total = Math.max(1, pass + partial + fail);
      return {
        model,
        passPct: Math.round((pass / total) * 100),
        passShare: (pass / total) * 100,
        partialShare: (partial / total) * 100,
        failShare: (fail / total) * 100,
      };
    });
  }, [cases, models]);

  const failingCount = useMemo(
    () =>
      cases.filter((c) =>
        Object.values(c.results).some((res) => res.outcome === "fail"),
      ).length,
    [cases],
  );
  const regressionCount = useMemo(
    () => cases.filter((c) => c.regression).length,
    [cases],
  );

  const visibleCases = useMemo(() => {
    if (filter === "failing") {
      return cases.filter((c) =>
        Object.values(c.results).some((res) => res.outcome === "fail"),
      );
    }
    if (filter === "regressions") {
      return cases.filter((c) => c.regression);
    }
    return cases;
  }, [cases, filter]);

  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? null;

  return (
    <section
      aria-label={`${suiteName} eval results`}
      className={cn(
        "mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{suiteName}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{runLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                running ? "animate-pulse bg-sky-400" : "bg-emerald-500",
              )}
            />
            {running ? "Running" : "Completed"}
          </span>
          {onReplay ? (
            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay eval run"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {modelStats.map(({ model, passPct, passShare, partialShare, failShare }) => (
          <div
            key={model.id}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <p className="text-xs font-semibold text-foreground">{model.name}</p>
            <p className="text-[11px] text-muted-foreground">{model.tier}</p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-medium tracking-tight tabular-nums">
                <NumberTicker value={passPct} suffix="%" startOnView={false} />
              </span>
              <span className="text-[11px] text-muted-foreground">pass rate</span>
            </div>

            <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={false}
                animate={{ width: `${passShare}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
                className="bg-emerald-500"
              />
              <motion.div
                initial={false}
                animate={{ width: `${partialShare}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
                className="bg-amber-400"
              />
              <motion.div
                initial={false}
                animate={{ width: `${failShare}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
                className="bg-rose-500"
              />
            </div>

            <p className="mt-2 font-mono text-[11px] text-muted-foreground tabular-nums">
              {model.deltaVsLast >= 0 ? `+${model.deltaVsLast}` : model.deltaVsLast} vs last run
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(
          [
            { id: "all", label: "All", count: cases.length },
            { id: "failing", label: "Failing", count: failingCount },
            { id: "regressions", label: "Regressions", count: regressionCount },
          ] as const
        ).map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${uid}-filter`}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-border bg-background shadow-xs"
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
              <span className="relative z-10 font-mono text-[11px] text-muted-foreground tabular-nums">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Test case</th>
              {models.map((m) => (
                <th key={m.id} className="px-3 py-2.5 font-medium">
                  {m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleCases.map((testCase) => (
              <tr
                key={testCase.id}
                className="transition-colors hover:bg-muted/35"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseId(testCase.id)}
                    className="text-left outline-none focus-visible:underline"
                  >
                    <span className="block font-medium text-foreground">
                      {testCase.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{testCase.category}</span>
                      {testCase.regression ? (
                        <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-medium text-rose-400">
                          Regression
                        </span>
                      ) : null}
                    </span>
                  </button>
                </td>
                {models.map((model) => {
                  const res = testCase.results[model.id];
                  if (!res) {
                    return (
                      <td key={model.id} className="px-3 py-3 text-muted-foreground">
                        -
                      </td>
                    );
                  }
                  return (
                    <td key={model.id} className="px-3 py-3 font-mono tabular-nums">
                      <button
                        type="button"
                        onClick={() => setSelectedCaseId(testCase.id)}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-5 place-items-center rounded-full",
                            res.outcome === "pass" &&
                              "bg-emerald-500/15 text-emerald-500",
                            res.outcome === "partial" &&
                              "bg-amber-500/15 text-amber-500",
                            res.outcome === "fail" && "bg-rose-500/15 text-rose-500",
                          )}
                        >
                          {res.outcome === "pass" ? (
                            <Check className="size-3" />
                          ) : res.outcome === "partial" ? (
                            <Minus className="size-3" />
                          ) : (
                            <X className="size-3" />
                          )}
                        </span>
                        <span className="text-foreground">
                          {res.score.toFixed(2).replace(/^0/, "")}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MorphingModal
        viewId={activeCase?.id ?? null}
        onClose={() => setSelectedCaseId(null)}
        placement="center"
        ariaLabel={activeCase?.title ?? "Case output inspection"}
        className="max-w-2xl"
      >
        {activeCase ? (
          <div className="space-y-4 p-1">
            <div>
              <p className="text-xs text-muted-foreground">{activeCase.category}</p>
              <h4 className="mt-0.5 text-base font-semibold text-foreground">
                {activeCase.title}
              </h4>
              <p className="mt-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                Prompt: {activeCase.prompt}
              </p>
            </div>

            <div className="space-y-3">
              {models.map((model) => {
                const res = activeCase.results[model.id];
                if (!res) return null;
                return (
                  <div
                    key={model.id}
                    className="rounded-2xl border border-border bg-background p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {model.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {res.outcome} · {res.score.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                      {res.output}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Grader: {res.graderNote}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedCaseId(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </MorphingModal>
    </section>
  );
}
