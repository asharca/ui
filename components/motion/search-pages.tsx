"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SPRING_LAYOUT } from "@/lib/ease";
import { BookOpen, Compass, Megaphone, MessagesSquare, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductSearchItem { id: string; title: string; excerpt: string; type: string; area: string; href: string; body?: string; updatedAt?: string; image?: string; avatar?: string }
export interface ProductSearchState { query: string; type: string; area: string; page: number }
export interface SearchResultsPageProps {
  items: ProductSearchItem[];
  title?: string;
  value?: ProductSearchState;
  defaultValue?: Partial<ProductSearchState>;
  onValueChange?: (value: ProductSearchState) => void;
  pageSize?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  suggestions?: string[];
  /** Opt-in URL state, scoped by this prefix. replaceState on edits; popstate reads navigation. Disabled by default. */
  urlPrefix?: string;
  className?: string;
}
function HighlightMatch({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  return start < 0 ? <>{text}</> : <>{text.slice(0, start)}<mark className="rounded-sm bg-primary/15 text-foreground">{text.slice(start, start + query.length)}</mark>{text.slice(start + query.length)}</>;
}

export function SearchResultsPage({ items, title = "Find your next answer", value, defaultValue, onValueChange, pageSize = 6, loading = false, error, onRetry, suggestions = ["Getting started", "API", "Release"], urlPrefix, className }: SearchResultsPageProps) {
  const [internal, setInternal] = useState<ProductSearchState>({ query: "", type: "all", area: "all", page: 1, ...defaultValue });
  const state = value ?? internal;
  const controlled = value !== undefined;
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => { if (previewOpen && !loading && !error) dialog.current?.showModal(); else dialog.current?.close(); }, [previewOpen, loading, error]);
  const id = useId(); const reduce = useReducedMotion(); const limit = Math.max(1, Math.floor(pageSize));
  useEffect(() => {
    if (!urlPrefix || controlled) return;
    const read = () => { const params = new URL(window.location.href).searchParams; setInternal({ query: params.get(`${urlPrefix}q`) ?? "", type: params.get(`${urlPrefix}type`) ?? "all", area: params.get(`${urlPrefix}area`) ?? "all", page: Math.max(1, Number(params.get(`${urlPrefix}page`)) || 1) }); };
    read(); window.addEventListener("popstate", read); return () => window.removeEventListener("popstate", read);
  }, [urlPrefix, controlled]);
  const update = (patch: Partial<ProductSearchState>) => {
    const next = { ...state, page: 1, ...patch };
    if (value === undefined) setInternal(next);
    onValueChange?.(next); setActiveId(null);
    if (urlPrefix) { const url = new URL(window.location.href); for (const [key, entry] of Object.entries({ q: next.query, type: next.type, area: next.area, page: next.page })) { url.searchParams.set(`${urlPrefix}${key}`, String(entry)); } window.history.replaceState(null, "", url); }
  };
  const types = useMemo(() => [...new Set(items.map((item) => item.type))], [items]);
  const areas = useMemo(() => [...new Set(items.map((item) => item.area))], [items]);
  const ranked = useMemo(() => {
    const query = state.query.trim().toLowerCase(); const words = query.split(/\s+/).filter(Boolean);
    return items.filter((item) => (state.type === "all" || item.type === state.type) && (state.area === "all" || item.area === state.area)).map((item) => {
      const title = item.title.toLowerCase(); const content = `${item.excerpt} ${item.body ?? ""}`.toLowerCase();
      const score = words.every((word) => title.includes(word) || content.includes(word)) ? words.reduce((total, word) => total + (title.startsWith(word) ? 10 : title.includes(word) ? 5 : 1), 0) : -1;
      return { item, score };
    }).filter(({ score }) => score >= 0).sort((a, b) => b.score - a.score).map(({ item }) => item);
  }, [items, state.query, state.type, state.area]);
  const pages = Math.max(1, Math.ceil(ranked.length / limit)); const page = Math.min(pages, Math.max(1, state.page));
  const visible = ranked.slice((page - 1) * limit, page * limit);
  const active = visible.find((item) => item.id === activeId) ?? visible[0];
  const selectedIndex = visible.findIndex((item) => item.id === active?.id);
  const grouped = types.map((type) => ({ type, items: visible.filter((item) => item.type === type) })).filter((group) => group.items.length);
  return <section aria-label="Search results page" className={cn("min-h-screen w-full bg-background px-4 py-12 font-sans text-foreground sm:px-8 sm:py-16", className)}>
    <header className="max-w-2xl"><h1 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h1><label htmlFor={`${id}-query`} className="sr-only">Search knowledge</label><div className="relative mt-6"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><input id={`${id}-query`} type="search" role="combobox" aria-autocomplete="list" aria-expanded={!loading && !error && visible.length > 0} aria-controls={`${id}-results`} aria-activedescendant={active && !loading && !error ? `${id}-${active.id}` : undefined} placeholder="Search docs, guides, changelog…" value={state.query} onChange={(event) => update({ query: event.target.value })} onKeyDown={(event) => {
      if (event.key === "Escape") { update({ query: "" }); return; }
      if (!visible.length || loading || error) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); const offset = event.key === "ArrowDown" ? 1 : -1; setActiveId((previous) => { const index = visible.findIndex((item) => item.id === previous); return visible[((index < 0 ? selectedIndex : index) + offset + visible.length) % visible.length].id; }); }
      if (event.key === "Enter" && active) { event.preventDefault(); setPreviewOpen(true); }
    }} className="h-10 w-full appearance-none rounded-full border border-border bg-background pl-10 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden" />{state.query && <button type="button" aria-label="Clear search" onClick={() => update({ query: "" })} className="absolute right-2 top-1.5 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="size-4" /></button>}</div>
    <p role="status" className="mt-4 text-sm text-muted-foreground">{loading ? "Searching…" : error ? "Search is unavailable." : <>{ranked.length} results{state.query && <> for <strong className="font-medium text-foreground">“{state.query}”</strong></>}<span className="hidden sm:inline"> · Use ↑ ↓ to move, Enter to open</span></>}</p></header>
    <div className="mx-auto mt-8 max-w-6xl"><fieldset aria-label="Result type" className="flex w-fit max-w-full min-w-0 gap-1 overflow-x-auto rounded-full border-0 bg-muted/30 p-1 [scrollbar-width:none]">{["all", ...types].map((type) => <button key={type} type="button" aria-pressed={state.type === type} onClick={() => update({ type })} className={cn("cursor-pointer rounded-full shrink-0 whitespace-nowrap px-3.5 py-1.5 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring", state.type === type ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted")}>{type === "all" ? "All" : type}<span className="ml-2 text-xs opacity-70">{items.filter((item) => (type === "all" || item.type === type) && (!state.query.trim() || `${item.title} ${item.excerpt} ${item.body ?? ""}`.toLowerCase().includes(state.query.trim().toLowerCase()))).length}</span></button>)}</fieldset>
    <div className="mt-8 grid gap-10 lg:grid-cols-[192px_minmax(0,1fr)] xl:grid-cols-[192px_minmax(0,1fr)_320px]">
      <aside><h2 className="mb-5 text-xs lg:mb-4 font-medium uppercase tracking-widest text-muted-foreground">Product area</h2><fieldset aria-label="Product area" className="flex flex-wrap gap-x-5 gap-y-3 border-0 lg:flex-col">{[...areas].sort((a, b) => ["Platform", "Integrations", "Security", "Billing"].indexOf(a) - ["Platform", "Integrations", "Security", "Billing"].indexOf(b)).map((area) => <label key={area} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm"><input type="checkbox" className="size-5 rounded-md accent-primary" checked={state.area === area} onChange={() => update({ area: state.area === area ? "all" : area })} />{area}</label>)}</fieldset>{(state.type !== "all" || state.area !== "all") && <button type="button" className="mt-4 cursor-pointer text-xs text-muted-foreground underline" onClick={() => update({ type: "all", area: "all" })}>Reset filters</button>}</aside>
      <div className="min-w-0">{error ? <div role="alert" className="rounded-2xl border border-destructive/30 p-6"><p>{error}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-3 cursor-pointer underline">Try again</button>}</div> : loading ? <div aria-busy="true" className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-muted" />)}</div> : <><div id={`${id}-results`} role="listbox" aria-label="Matching articles">{grouped.map((group) => <fieldset key={group.type} aria-label={group.type} className="mb-10 min-w-0 border-0 p-0 last:mb-0"><h2 className="mb-3 flex h-8 items-center justify-between text-xl font-medium"><span className="flex items-center gap-3">{group.type === "Docs" ? <BookOpen className="size-5" /> : group.type === "Guides" ? <Compass className="size-5" /> : group.type === "Changelog" ? <Megaphone className="size-5" /> : <MessagesSquare className="size-5" />}{group.type}</span><button type="button" className="text-xs text-muted-foreground" onClick={() => update({ type: group.type })}>View {group.items.length} →</button></h2>{group.items.map((item) => <button id={`${id}-${item.id}`} type="button" role="option" aria-selected={active?.id === item.id} key={item.id} onClick={() => { setActiveId(item.id); setPreviewOpen(true); }} aria-haspopup="dialog" className="relative mb-2 flex w-full last:mb-0 cursor-pointer gap-4 rounded-2xl border border-border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">{active?.id === item.id && <motion.span aria-hidden="true" layoutId={reduce ? undefined : `${id}-selection`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="pointer-events-none absolute inset-0 rounded-2xl border border-foreground/40" />}<span className="relative min-w-0 flex-1"><span className="relative block truncate text-xs text-muted-foreground">{item.type} / {item.area}{item.updatedAt && <> · Updated {item.updatedAt}</>}</span><span className="relative mt-1 block font-medium"><HighlightMatch text={item.title} query={state.query.trim()} /></span><span className="relative mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground"><HighlightMatch text={item.excerpt} query={state.query.trim()} /></span></span>{(item.image || item.avatar) && <img src={item.image ?? item.avatar} alt="" className={cn("relative order-first shrink-0 object-cover", item.avatar ? "size-9 rounded-full" : "size-14 rounded-xl")} />}</button>)}</fieldset>)}</div>{!visible.length && <div className="rounded-2xl border border-border p-8 text-center"><h2 className="text-xl font-medium">No results found</h2><p className="my-3 text-sm text-muted-foreground">Try a different search or clear your filters.</p><div className="flex flex-wrap justify-center gap-2">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => update({ query: suggestion, type: "all", area: "all" })} className="cursor-pointer rounded-full border border-border px-3 py-2 text-sm">{suggestion}</button>)}</div></div>}{pages > 1 && <nav aria-label="Search pagination" className="mt-6 flex items-center justify-between"><button type="button" disabled={page === 1} onClick={() => update({ page: page - 1 })} className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-xs text-muted-foreground">{page} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => update({ page: page + 1 })} className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40">Next</button></nav>}</>}</div>
      {active && !loading && !error && <aside aria-label="Result preview" className="hidden self-start rounded-3xl border border-border p-6 xl:sticky xl:top-6 xl:block"><span className="rounded-full bg-muted px-3 py-1 text-xs">{active.type}</span><p className="mt-5 text-xs text-muted-foreground">{active.type} / {active.area}</p><h2 className="my-4 text-xl font-medium">{active.title}</h2><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{active.body ?? active.excerpt}</p><a id={`${id}-open`} href={active.href} className="mt-6 block w-full text-center rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Open article →</a></aside>}
      {active && !loading && !error && <a id={`${id}-mobile-open`} href={active.href} className="sr-only focus:not-sr-only xl:hidden">Open {active.title} →</a>}
    </div></div>
    <dialog ref={dialog} onClose={() => setPreviewOpen(false)} onCancel={() => setPreviewOpen(false)} aria-labelledby={`${id}-dialog-title`} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-3xl border border-border bg-background p-5 text-foreground backdrop:bg-foreground/15 backdrop:backdrop-blur-sm">{active && <><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-muted px-3 py-1 text-xs">{active.type}</span><button type="button" aria-label="Close result preview" onClick={() => dialog.current?.close()} className="grid size-9 place-items-center rounded-full hover:bg-muted"><X className="size-4" /></button></div><p className="mt-4 text-xs text-muted-foreground">{active.type} / {active.area}</p><h2 id={`${id}-dialog-title`} className="mt-1 text-xl font-medium">{active.title}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{active.body ?? active.excerpt}</p><p className="mt-4 text-xs text-muted-foreground">{active.area}{active.updatedAt && ` · Updated ${active.updatedAt}`}</p><a href={active.href} className="mt-5 flex h-9 w-full items-center justify-center rounded-full bg-primary px-5 text-sm text-primary-foreground">Open {active.type.toLowerCase().replace(/s$/, "")} →</a></>}</dialog>
  </section>;
}
