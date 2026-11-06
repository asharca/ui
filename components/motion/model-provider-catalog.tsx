"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { SelectorOption } from "@/components/motion/selector";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "@/components/motion/popover-morph";
import { Tooltip } from "@/components/motion/tooltip";
import { useRowCursor } from "@/lib/hooks/use-row-cursor";
import { useOnOpen } from "@/lib/hooks/use-on-open";
import { cn } from "@/lib/utils";

export interface ModelProvider { id: string; name: string; mark?: string }
export interface CatalogModel extends SelectorOption { providerId: string }
export interface ModelCatalogProps {
  providers: ModelProvider[];
  models: CatalogModel[];
  navigation?: "catalog" | "rail";
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

/** Host-owned models, compact grouped selection, and an in-panel provider rail. */
export function ModelCatalog({ providers, models, navigation = "catalog", value, defaultValue, onValueChange, className }: ModelCatalogProps) {
  const [internal, setInternal] = useState(defaultValue ?? models.find(model => !model.disabled)?.id ?? "");
  const [provider, setProvider] = useState<string | null>(() => models.find(model => model.id === (value ?? internal))?.providerId ?? providers[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = models.find(model => model.id === (value ?? internal));
  const owner = providers.find(item => item.id === selected?.providerId);
  const uid = useId();
  const list = useRef<HTMLDivElement>(null);
  const mountList = useCallback((node: HTMLDivElement | null) => {
    list.current = node;
    node?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "center" });
  }, []);
  const filtered = useMemo(() => models.filter(model => (!provider || navigation !== "rail" || model.providerId === provider) && [model.name, model.description, model.metadata, providers.find(item => item.id === model.providerId)?.name, ...(model.keywords ?? [])].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase())), [models, providers, provider, navigation, query]);
  const enabled = filtered.filter(model => !model.disabled);
  const { activeIndex, moveActive, moveTo } = useRowCursor(enabled, `${query}:${provider}`);
  const active = enabled[activeIndex];
  useOnOpen(open, () => { setQuery(""); if (navigation === "rail") setProvider(selected?.providerId ?? providers[0]?.id ?? null); moveTo(selected?.id ?? null); });
  useEffect(() => { if (open && active) list.current?.querySelector<HTMLElement>(`[data-active="true"]`)?.scrollIntoView({ block: "nearest" }); }, [open, active]);
  const choose = (model: CatalogModel) => { if (model.disabled) return; if (value === undefined) setInternal(model.id); onValueChange?.(model.id); setOpen(false); };
  const rail = navigation === "rail";
  const current = providers.find(item => item.id === provider);
  const searchProps = { role: "combobox", "aria-expanded": true, "aria-controls": `${uid}-list`, "aria-activedescendant": active ? `${uid}-${active.id}` : undefined, value: query, onChange: (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value), onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => { if (event.nativeEvent.isComposing) return; if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); moveActive(event.key === "ArrowDown" ? 1 : -1); } if (event.key === "Enter" && active) { event.preventDefault(); choose(active); } } } as const;
  const row = (model: CatalogModel, item: ModelProvider) => <Tooltip key={model.id} delay={1500} side="right" disabled={model.disabled} content={model.details ?? (model.description ? <div><p>{model.description}</p>{model.metadata && <p className="mt-1 text-xs text-muted-foreground">{model.metadata}</p>}</div> : undefined)}><button type="button" id={`${uid}-${model.id}`} role="option" aria-selected={selected?.id === model.id} aria-disabled={model.disabled || undefined} disabled={model.disabled} tabIndex={-1} data-active={active?.id === model.id} onPointerEnter={() => { if (!model.disabled) moveTo(model.id); }} onClick={() => choose(model)} className="flex h-12 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm outline-none data-[active=true]:bg-muted disabled:opacity-45"><span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full text-xs">{model.icon ?? item.mark ?? item.name.slice(0,1)}</span><span className="min-w-0 flex-1 truncate font-medium">{model.name}</span>{selected?.id === model.id && <Check aria-hidden className="size-3.5" />}</button></Tooltip>;
  return <MorphPopover open={open} onOpenChange={setOpen} className={cn("inline-flex", className)}>
    <MorphPopoverTrigger><button type="button" aria-label={`Select model, current: ${selected?.name ?? "None"}`} className="flex h-10 min-w-52 items-center justify-between gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><span aria-hidden className="grid size-5 place-items-center text-xs">{selected?.icon ?? owner?.mark ?? owner?.name.slice(0, 1)}</span><span className="flex-1 truncate text-left">{selected?.name ?? "Select a model"}</span><ChevronDown aria-hidden className="size-3.5 text-muted-foreground" /></button></MorphPopoverTrigger>
    <MorphPopoverContent align="start" side="top" sideOffset={8} radius={12} onOpenAutoFocus={content => content.querySelector<HTMLInputElement>("input")?.focus()} className={cn("flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-background p-0 text-foreground", rail ? "w-96" : "w-80")}>
      <div className="flex min-h-0">
        {rail && <nav aria-label="Model providers" className="m-2 mr-0 flex w-14 shrink-0 flex-col items-center gap-2 rounded-full bg-muted p-2">{providers.map(item => <button type="button" key={item.id} title={item.name} aria-label={item.name} aria-pressed={provider === item.id} onClick={() => setProvider(item.id)} className="grid size-9 shrink-0 place-items-center rounded-full text-sm text-foreground outline-none aria-pressed:bg-background focus-visible:ring-2 focus-visible:ring-ring">{item.mark ?? item.name.slice(0,1)}</button>)}</nav>}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {rail && <div className="relative z-20 flex items-center justify-between gap-3 bg-background px-4 pb-1 pt-3"><span className="min-w-0 truncate text-sm"><span className="font-medium">{current?.name}</span> <span className="tabular-nums text-muted-foreground">{filtered.length}</span></span><div className="relative h-8 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-background transition-colors duration-200 focus-within:border-muted-foreground/40"><Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><input {...searchProps} aria-label={`Search ${current?.name ?? ""} models`} placeholder="Search" className="h-full w-full bg-transparent pl-8 pr-3.5 text-xs text-foreground outline-none placeholder:text-muted-foreground" /></div></div>}
          <div ref={mountList} role="listbox" id={`${uid}-list`} aria-label="Models" className="h-80 max-h-[50dvh] min-h-0 min-w-0 overflow-y-auto overscroll-contain px-2 pb-2">
            {rail ? filtered.map(model => row(model, current ?? providers.find(item => item.id === model.providerId)!)) : providers.filter(item => filtered.some(model => model.providerId === item.id)).map(item => <fieldset key={item.id} className="m-0 min-w-0 border-0 p-0" aria-label={item.name}><div className="flex items-center justify-between px-2 pb-1.5 pt-3 text-xs font-medium text-muted-foreground"><span>{item.name}</span><span className="tabular-nums">{filtered.filter(model => model.providerId === item.id).length}</span></div>{filtered.filter(model => model.providerId === item.id).map(model => row(model, item))}</fieldset>)}
            {!filtered.length && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No models found.</p>}
          </div>
        </div>
      </div>
      {!rail && <div className="relative z-20 shrink-0 border-t border-border bg-background p-2"><div className="flex h-10 items-center gap-2 rounded-full border border-border-strong px-3 focus-within:border-muted-foreground/40"><Search aria-hidden className="size-4 shrink-0 text-muted-foreground" /><input {...searchProps} aria-label="Search models or providers" placeholder="Search models or providers…" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" /><kbd className="text-[10px] text-muted-foreground">esc</kbd></div></div>}
      <p role="status" className="sr-only">{filtered.length} models found</p>
    </MorphPopoverContent>
  </MorphPopover>;
}
