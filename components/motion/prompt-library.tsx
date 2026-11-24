"use client";

import { Check, Copy, Search, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, useId, useMemo, useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { withOccurrenceKeys } from "@/lib/collection-keys";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SavedPrompt {
  id: string;
  title: string;
  template: string;
  category: string;
  uses: number;
  starred?: boolean;
}

export interface PromptLibraryProps {
  prompts: SavedPrompt[];
  defaultCategory?: string;
  onToggleStar?: (id: string, starred: boolean) => void;
  onCopyPrompt?: (text: string, prompt: SavedPrompt) => void;
  className?: string;
}

function extractVariables(template: string): string[] {
  const seen = new Set<string>();
  const matches = template.matchAll(/\{\{([a-zA-Z0-9_ -]+)\}\}/g);
  for (const match of matches) {
    if (match[1]) seen.add(match[1].trim());
  }
  return Array.from(seen);
}

function highlightQuery(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary/20 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function renderTemplateChips(template: string, query: string) {
  const parts = template.split(/(\{\{[^}]+\}\})/g);
  return withOccurrenceKeys(parts, (part) => part).map(({ item: part, key }) => {
    const match = /^\{\{([^}]+)\}\}$/.exec(part);
    if (match?.[1]) {
      return (
        <span
          key={key}
          className="mx-0.5 inline-block rounded-md border border-dashed border-border-strong bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground"
        >
          {match[1].trim()}
        </span>
      );
    }
    return <Fragment key={key}>{highlightQuery(part, query)}</Fragment>;
  });
}

/** Searchable prompt catalog with inline variable slots and modal fill preview. */
export function PromptLibrary({
  prompts: initialPrompts,
  defaultCategory = "all",
  onToggleStar,
  onCopyPrompt,
  className,
}: PromptLibraryProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(defaultCategory);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of prompts) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [prompts]);

  const starredCount = useMemo(
    () => prompts.filter((item) => item.starred).length,
    [prompts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((item) => {
      if (tab === "starred" && !item.starred) return false;
      if (tab !== "all" && tab !== "starred" && item.category !== tab) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.template.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [prompts, query, tab]);

  const activePrompt = prompts.find((item) => item.id === selectedId) ?? null;
  const activeVars = activePrompt ? extractVariables(activePrompt.template) : [];

  const filledPreview = activePrompt
    ? activePrompt.template.replace(/\{\{([^}]+)\}\}/g, (_, name: string) => {
        const key = name.trim();
        return variables[key]?.trim() ? variables[key] : `[${key}]`;
      })
    : "";

  const toggleStar = (id: string) => {
    setPrompts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStarred = !item.starred;
        onToggleStar?.(id, nextStarred);
        return { ...item, starred: nextStarred };
      }),
    );
  };

  const openPrompt = (prompt: SavedPrompt) => {
    setVariables({});
    setCopied(false);
    setSelectedId(prompt.id);
  };

  const copyFilled = async () => {
    if (!activePrompt) return;
    try {
      await navigator.clipboard.writeText(filledPreview);
      setCopied(true);
      onCopyPrompt?.(filledPreview, activePrompt);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      onCopyPrompt?.(filledPreview, activePrompt);
      setCopied(true);
    }
  };

  const tabItems = [
    { id: "all", label: "All", count: prompts.length },
    { id: "starred", label: "Starred", count: starredCount },
    ...categories.map((c) => ({ id: c.name, label: c.name, count: c.count })),
  ];

  return (
    <section
      aria-label="Prompt library"
      className={cn(
        "mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Prompt library</h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {prompts.length} prompts
        </span>
      </header>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search prompts"
          aria-label="Search prompts"
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div
        role="tablist"
        aria-label="Filter prompts by category"
        className="mt-3 flex flex-wrap gap-1.5"
      >
        {tabItems.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${uid}-tab`}
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

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {filtered.length === 0 ? (
          <li className="px-4 py-8 text-center text-xs text-muted-foreground">
            No prompts match your filters.
          </li>
        ) : (
          filtered.map((prompt) => (
            <motion.li
              key={prompt.id}
              layout={!reduce}
              className="group flex items-start gap-3 p-4 transition-colors hover:bg-muted/35"
            >
              <button
                type="button"
                onClick={() => openPrompt(prompt)}
                className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <p className="text-sm font-medium text-foreground">
                  {highlightQuery(prompt.title, query)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {renderTemplateChips(prompt.template, query)}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {prompt.category} · {prompt.uses} uses
                </p>
              </button>
              <button
                type="button"
                aria-label={prompt.starred ? `Unstar ${prompt.title}` : `Star ${prompt.title}`}
                aria-pressed={Boolean(prompt.starred)}
                onClick={() => toggleStar(prompt.id)}
                className={cn(
                  "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  prompt.starred
                    ? "text-amber-400 hover:bg-amber-400/10"
                    : "text-muted-foreground/60 hover:bg-muted hover:text-foreground",
                )}
              >
                <Star
                  aria-hidden="true"
                  className={cn("size-4", prompt.starred && "fill-current")}
                />
              </button>
            </motion.li>
          ))
        )}
      </ul>

      <MorphingModal
        viewId={activePrompt?.id ?? null}
        onClose={() => setSelectedId(null)}
        placement="center"
        ariaLabel={activePrompt ? `Fill variables for ${activePrompt.title}` : "Prompt variables"}
        className="max-w-lg"
      >
        {activePrompt ? (
          <div className="space-y-4 p-1">
            <div>
              <p className="text-xs text-muted-foreground">{activePrompt.category}</p>
              <h4 className="mt-0.5 text-base font-semibold text-foreground">
                {activePrompt.title}
              </h4>
            </div>

            {activeVars.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {activeVars.map((name) => (
                  <label key={name} className="block space-y-1 text-xs">
                    <span className="font-mono text-muted-foreground">{name}</span>
                    <input
                      type="text"
                      value={variables[name] ?? ""}
                      onChange={(event) =>
                        setVariables((prev) => ({ ...prev, [name]: event.target.value }))
                      }
                      placeholder={`Enter ${name}`}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                ))}
              </div>
            ) : null}

            <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Live preview
              </p>
              <p className="text-xs leading-relaxed text-foreground">
                {filledPreview}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => void copyFilled()}>
                {copied ? (
                  <>
                    <Check aria-hidden="true" className="size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" className="size-3.5" />
                    Copy prompt
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </MorphingModal>
    </section>
  );
}
