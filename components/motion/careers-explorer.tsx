"use client";

import { CheckCircle2, ChevronRight, MapPin, Search, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ExplorerRole {
  id: string;
  title: string;
  department: string;
  region: "Global" | "Europe" | "Americas";
  location: string;
  employment: string;
  compensation: string;
  summary: string;
  highlights: string[];
}

export interface CareersJobsExplorerProps {
  roles: ExplorerRole[];
  className?: string;
}

const REGIONS = ["Anywhere", "Global", "Europe", "Americas"] as const;

/** Master-detail careers explorer with search, department/region filters, and directional detail transitions. */
export function CareersJobsExplorer({
  roles,
  className,
}: CareersJobsExplorerProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("Anywhere");
  const [selectedId, setSelectedId] = useState(roles[0]?.id ?? "");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [applyRole, setApplyRole] = useState<ExplorerRole | null>(null);
  const [applied, setApplied] = useState(false);

  const departments = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of roles) counts.set(r.department, (counts.get(r.department) ?? 0) + 1);
    return [
      { name: "All", count: roles.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
    ];
  }, [roles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((role) => {
      if (department !== "All" && role.department !== department) return false;
      if (region !== "Anywhere" && role.region !== region) return false;
      if (!q) return true;
      return (
        role.title.toLowerCase().includes(q) ||
        role.department.toLowerCase().includes(q) ||
        role.summary.toLowerCase().includes(q)
      );
    });
  }, [department, query, region, roles]);

  const activeRole =
    filtered.find((role) => role.id === selectedId) ?? filtered[0] ?? null;

  const chooseRole = (next: ExplorerRole) => {
    const currentIdx = filtered.findIndex((r) => r.id === activeRole?.id);
    const nextIdx = filtered.findIndex((r) => r.id === next.id);
    setDirection(nextIdx >= currentIdx ? 1 : -1);
    setSelectedId(next.id);
  };

  return (
    <section
      aria-label="Open roles explorer"
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-8",
        className,
      )}
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-2xl font-medium tracking-tight">Open roles</h3>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {filtered.length} open
        </p>
      </header>

      <div className="mt-4 flex w-full items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 focus-within:border-border-strong">
        <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roles"
          aria-label="Search open roles"
          className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {departments.map((item) => {
            const active = department === item.name;
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={active}
                onClick={() => setDepartment(item.name)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={`${uid}-dept`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="absolute inset-0 rounded-full border border-border bg-card shadow-xs"
                  />
                ) : null}
                <span className="relative z-10">{item.name}</span>
                <span className="relative z-10 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="inline-flex rounded-full border border-border bg-card p-0.5">
          {REGIONS.map((loc) => {
            const active = region === loc;
            return (
              <button
                key={loc}
                type="button"
                aria-pressed={active}
                onClick={() => setRegion(loc)}
                className={cn(
                  "relative rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={`${uid}-loc`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="absolute inset-0 rounded-full bg-background shadow-xs"
                  />
                ) : null}
                <span className="relative z-10">{loc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="space-y-2">
          {filtered.length === 0 ? (
            <li className="rounded-2xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
              No roles match these filters.
            </li>
          ) : (
            filtered.map((role) => {
              const selected = activeRole?.id === role.id;
              return (
                <li key={role.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseRole(role)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                      selected
                        ? "border-border-strong bg-card shadow-xs"
                        : "border-transparent bg-transparent hover:bg-foreground/[0.04]",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {role.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {role.department} · {role.location}
                      </p>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-opacity",
                        selected ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                      )}
                    />
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6">
          <AnimatePresence mode="wait" initial={false}>
            {activeRole ? (
              <motion.div
                key={activeRole.id}
                initial={
                  reduce ? false : { opacity: 0, x: direction * 16 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduce ? undefined : { opacity: 0, x: direction * -16 }
                }
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {activeRole.department}
                </span>
                <h4 className="mt-1.5 text-xl font-medium text-foreground">
                  {activeRole.title}
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {activeRole.location}
                  </span>
                  <span>·</span>
                  <span>{activeRole.employment}</span>
                  <span>·</span>
                  <span className="font-mono text-foreground">
                    {activeRole.compensation}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {activeRole.summary}
                </p>

                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-foreground/90">
                  {activeRole.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button
                    size="sm"
                    onClick={() => {
                      setApplied(false);
                      setApplyRole(activeRole);
                    }}
                  >
                    Apply for {activeRole.title}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <p className="text-xs text-muted-foreground">Select a role to view details.</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MorphingModal
        viewId={applyRole?.id ?? null}
        onClose={() => setApplyRole(null)}
        placement="center"
        ariaLabel={applyRole ? `Apply for ${applyRole.title}` : "Role application"}
        className="max-w-md"
      >
        {applyRole ? (
          applied ? (
            <div className="space-y-3 p-2 text-center">
              <CheckCircle2
                aria-hidden="true"
                className="mx-auto size-8 text-emerald-500"
              />
              <h4 className="text-base font-semibold text-foreground">
                Application sent
              </h4>
              <p className="text-xs text-muted-foreground">
                Thanks for applying for {applyRole.title}. Our team will follow up
                soon.
              </p>
              <Button size="sm" onClick={() => setApplyRole(null)}>
                Done
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setApplied(true);
              }}
              className="space-y-3 p-1"
            >
              <div>
                <p className="text-xs text-muted-foreground">{applyRole.department}</p>
                <h4 className="mt-0.5 text-base font-semibold text-foreground">
                  Apply for {applyRole.title}
                </h4>
              </div>
              <input
                type="text"
                required
                placeholder="Your name"
                aria-label="Your name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="url"
                placeholder="GitHub or portfolio link"
                aria-label="Portfolio link"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setApplyRole(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  <Send aria-hidden="true" className="size-3.5" />
                  Submit application
                </Button>
              </div>
            </form>
          )
        ) : null}
      </MorphingModal>
    </section>
  );
}
