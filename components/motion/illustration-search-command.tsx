"use client";

import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import type { CommandItem } from "@/components/motion/command-palette";
import { searchCommands } from "@/lib/command-search";
import { SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { useRowCursor } from "@/lib/hooks/use-row-cursor";
import { cn } from "@/lib/utils";

export interface SearchCommandIllustrationProps {
  items: CommandItem[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  label?: string;
  /** Optional externally directed highlight for an explicitly labelled demonstration. */
  demonstrationActiveId?: string;
  emptyLabel?: string;
  /** Explicitly labels externally driven preview playback; never executes commands automatically. */
  mode?: "interactive" | "demonstration";
  className?: string;
}
/** Inline command-search composition. Host commands are called only by intentional selection. */
export function SearchCommandIllustration({ items, query: controlledQuery, defaultQuery = "", onQueryChange, label = "Search workspace", emptyLabel = "No matching results", mode = "interactive", demonstrationActiveId, className }: SearchCommandIllustrationProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const query = controlledQuery ?? internalQuery;
  const rows = useMemo(() => searchCommands(items, mode === "demonstration" ? "" : query), [items, query, mode]);
  const { activeIndex, moveTo, moveActive } = useRowCursor(rows, query);
  const active = mode === "demonstration" && demonstrationActiveId ? Math.max(0, rows.findIndex(item => item.id === demonstrationActiveId)) : activeIndex;
  const uid = useId();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const setQuery = (next: string) => { if (controlledQuery === undefined) setInternalQuery(next); onQueryChange?.(next); };

  return <section aria-label={label} className={cn("relative isolate flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-xl bg-muted p-[9%] text-foreground", className)}>
    <div className="w-full max-w-[27rem] overflow-hidden rounded-2xl border border-border bg-background">
    <div className="flex h-14 items-center gap-3 border-b border-border px-4">
      <Search aria-hidden className="size-4 text-muted-foreground" />
      <input aria-label={label} role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={`${uid}-results`} aria-activedescendant={rows[active] ? `${uid}-${rows[active].id}` : undefined} readOnly={mode === "demonstration"} value={query} placeholder="Search documents and actions…" onChange={e => setQuery(e.target.value)} onKeyDown={e => {
        if (mode === "demonstration") return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); moveActive(e.key === "ArrowDown" ? 1 : -1); }
        if (e.key === "Home") { e.preventDefault(); moveTo(rows[0]?.id ?? null); }
        if (e.key === "End") { e.preventDefault(); moveTo(rows.at(-1)?.id ?? null); }
        if (e.key === "Enter" && rows[activeIndex]) { e.preventDefault(); rows[activeIndex].onSelect(); }
        if (e.key === "Escape") { setQuery(""); moveTo(null); }
      }} className="h-14 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring" /><kbd aria-hidden className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">⌘ K</kbd>
    </div>
    <div className="p-3"><p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Quick actions</p><div role="listbox" id={`${uid}-results`} aria-label="Workspace results" className="min-h-40 space-y-1">
      {rows.map((item, index) => { const Icon = item.icon; return <button key={item.id} type="button" id={`${uid}-${item.id}`} role="option" aria-selected={index === active} tabIndex={-1} disabled={mode === "demonstration"} onMouseEnter={() => { if (hover) moveTo(item.id); }} onMouseDown={e => e.preventDefault()} onClick={() => { moveTo(item.id); item.onSelect(); }} className="relative isolate flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-left text-xs disabled:cursor-default">
        {index === active && <motion.span layoutId={`${uid}-active`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="absolute inset-0 -z-10 rounded-lg bg-muted" />}
        {Icon && <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted"><Icon className="size-4" /></span>}<span className="min-w-0 flex-1"><span className="block">{item.label}</span>{item.group && <span className="block text-[9px] text-muted-foreground">{item.group}</span>}</span>
      </button>; })}
      {!rows.length && <p role="status" className="p-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>}
    </div></div>
    <p className="sr-only">{rows.length} results · ↑ ↓ navigate · Enter opens · Esc clears. {mode === "demonstration" ? "Presentation-only demo playback." : "Interactive search."}</p></div>
  </section>;
}
