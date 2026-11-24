"use client";

import { BookOpen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, useId, useState } from "react";
import { Switch } from "@/components/motion/switch";
import { withOccurrenceKeys } from "@/lib/collection-keys";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface LegalParagraphSegment {
  text: string;
  change?: "added" | "removed";
}

export interface LegalPolicySection {
  id: string;
  number: string;
  title: string;
  inShort: string;
  paragraphs: LegalParagraphSegment[][];
}

export interface LegalPolicy {
  id: string;
  label: string;
  title: string;
  summary: string;
  version: string;
  previousVersion: string;
  updatedAt: string;
  effectiveAt: string;
  sections: LegalPolicySection[];
}

export interface LegalPageProps {
  policies: LegalPolicy[];
  defaultPolicyId?: string;
  defaultShowChanges?: boolean;
  className?: string;
}

/** Policy viewer for Privacy, Terms, and Cookies with In-short summaries and highlighted version diffs. */
export function LegalPage({
  policies,
  defaultPolicyId,
  defaultShowChanges = false,
  className,
}: LegalPageProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [policyId, setPolicyId] = useState(defaultPolicyId ?? policies[0]?.id ?? "");
  const [showChanges, setShowChanges] = useState(defaultShowChanges);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    policies[0]?.sections[0]?.id ?? "",
  );

  const policy = policies.find((p) => p.id === policyId) ?? policies[0];
  if (!policy) return null;

  const totalChanges = policy.sections.reduce(
    (sum, sec) =>
      sum +
      sec.paragraphs.flat().filter((seg) => seg.change !== undefined).length,
    0,
  );

  return (
    <article
      aria-label={policy.title}
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-10",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Legal policies"
        className="inline-flex rounded-full border border-border bg-card p-1"
      >
        {policies.map((item) => {
          const active = item.id === policy.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setPolicyId(item.id);
                setActiveSectionId(item.sections[0]?.id ?? "");
              }}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors outline-none",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${uid}-policy-tab`}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  className="absolute inset-0 rounded-full bg-background shadow-xs"
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      <header className="mt-6">
        <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
          {policy.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {policy.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            Version <strong className="text-foreground">{policy.version}</strong>
          </span>
          <span>
            Updated <strong className="text-foreground">{policy.updatedAt}</strong>
          </span>
          <span>
            Effective <strong className="text-foreground">{policy.effectiveAt}</strong>
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-xs font-medium text-foreground">
              Show changes since version {policy.previousVersion}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {totalChanges} highlighted edits
            </p>
          </div>
          <Switch
            checked={showChanges}
            onCheckedChange={setShowChanges}
            ariaLabel={`Show changes since version ${policy.previousVersion}`}
          />
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            On this page
          </p>
          <ul className="space-y-1 border-l border-border">
            {policy.sections.map((section) => {
              const active = activeSectionId === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSectionId(section.id);
                      document
                        .getElementById(`${uid}-${section.id}`)
                        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
                    }}
                    className={cn(
                      "-ml-px flex w-full items-center border-l-2 py-1 pl-3 text-left text-xs transition-colors",
                      active
                        ? "border-foreground font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{section.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-8">
          {policy.sections.map((section) => (
            <section
              key={section.id}
              id={`${uid}-${section.id}`}
              className="scroll-mt-24 border-b border-border pb-8 last:border-b-0 last:pb-0"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {section.number}
                </span>
                <h4 className="text-lg font-medium tracking-tight text-foreground">
                  {section.title}
                </h4>
              </div>

              <div className="mt-3 rounded-2xl border border-border bg-card/60 p-4">
                <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <BookOpen aria-hidden="true" className="size-3" />
                  In short
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                  {section.inShort}
                </p>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {withOccurrenceKeys(section.paragraphs, (p) =>
                  p.map((s) => `${s.change ?? "plain"}:${s.text}`).join("|"),
                ).map(({ item: paragraph, key: pKey }) => (
                  <p key={`${section.id}-${pKey}`}>
                    {withOccurrenceKeys(
                      paragraph,
                      (seg) => `${seg.change ?? "plain"}:${seg.text}`,
                    ).map(({ item: seg, key: sKey }) => {
                      if (seg.change === "removed") {
                        if (!showChanges) return null;
                        return (
                          <del
                            key={`${section.id}-${sKey}`}
                            className="mx-0.5 rounded bg-rose-500/15 px-1 text-rose-400 line-through"
                          >
                            {seg.text}
                          </del>
                        );
                      }
                      if (seg.change === "added") {
                        return (
                          <motion.span
                            key={`${section.id}-${sKey}`}
                            initial={false}
                            animate={{
                              backgroundColor: showChanges
                                ? "rgba(0, 190, 191, 0.16)"
                                : "transparent",
                            }}
                            transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}
                            className={cn(
                              "rounded px-0.5 transition-colors",
                              showChanges && "text-foreground",
                            )}
                          >
                            {seg.text}
                          </motion.span>
                        );
                      }
                      return (
                        <Fragment key={`${section.id}-${sKey}`}>{seg.text}</Fragment>
                      );
                    })}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
