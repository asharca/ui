"use client";

import { Check, ChevronDown, Layers, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { SPRING_LAYOUT, SPRING_PANEL, SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ModelProvider {
  id: string;
  name: string;
  icon?: ReactNode;
}

export interface ModelOption {
  id: string;
  name: string;
  providerId: string;
  description?: string;
  contextWindow?: string;
  badge?: string;
  speed?: string;
  disabled?: boolean;
}

interface BaseModelPickerProps {
  providers: ModelProvider[];
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (modelId: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export type ModelPickerProps = BaseModelPickerProps;

/** Searchable grouped model picker with a fixed bottom search field. */
export function ModelPicker({
  providers,
  models,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Choose model",
  searchPlaceholder = "Search models or providers...",
  disabled = false,
  className,
}: ModelPickerProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? models.find((m) => !m.disabled)?.id ?? "",
  );
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const selected = models.find((item) => item.id === value);
  const selectedProvider = providers.find((p) => p.id === selected?.providerId);

  const providerMap = useMemo(
    () => new Map(providers.map((provider) => [provider.id, provider])),
    [providers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter((model) => {
      const providerName = providerMap.get(model.providerId)?.name ?? "";
      return (
        model.name.toLowerCase().includes(q) ||
        providerName.toLowerCase().includes(q) ||
        model.description?.toLowerCase().includes(q) ||
        model.badge?.toLowerCase().includes(q)
      );
    });
  }, [models, providerMap, query]);

  const grouped = useMemo(() => {
    return providers
      .map((provider) => ({
        provider,
        items: filtered.filter((m) => m.providerId === provider.id),
      }))
      .filter((entry) => entry.items.length > 0);
  }, [filtered, providers]);

  const flatEnabled = useMemo(
    () => filtered.filter((item) => !item.disabled),
    [filtered],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setActiveId(
      flatEnabled.find((item) => item.id === value)?.id ?? flatEnabled[0]?.id,
    );
    requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
  }, [flatEnabled, open, value]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open]);

  const commit = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onValueChange?.(id);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!flatEnabled.length) return;
    const idx = Math.max(0, flatEnabled.findIndex((item) => item.id === activeId));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveId(flatEnabled[(idx + 1) % flatEnabled.length]?.id);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveId(
        flatEnabled[(idx - 1 + flatEnabled.length) % flatEnabled.length]?.id,
      );
    } else if (event.key === "Enter" && activeId) {
      const target = flatEnabled.find((item) => item.id === activeId);
      if (target) {
        event.preventDefault();
        commit(target.id);
      }
    }
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex min-h-9 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors outline-none",
          "hover:border-border-strong hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        )}
      >
        {selectedProvider?.icon ? (
          <span aria-hidden="true" className="shrink-0">
            {selectedProvider.icon}
          </span>
        ) : null}
        <span className="truncate">{selected?.name ?? placeholder}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING_SWAP}
          className="text-muted-foreground"
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={`${uid}-list`}
            role="dialog"
            aria-label="Model catalog"
            onKeyDown={handleKeyDown}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.14 } }
            }
            transition={reduce ? { duration: 0 } : SPRING_PANEL}
            className="absolute left-1/2 top-full z-40 mt-2 w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
          >
            <div
              role="listbox"
              aria-label="Available models"
              className="max-h-72 overflow-y-auto p-1.5"
            >
              {grouped.length === 0 ? (
                <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                  No models match &ldquo;{query}&rdquo;.
                </p>
              ) : (
                grouped.map(({ provider, items }) => (
                  <div key={provider.id} className="mb-1.5 last:mb-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
                      {provider.icon ? (
                        <span aria-hidden="true" className="shrink-0">
                          {provider.icon}
                        </span>
                      ) : null}
                      <span>{provider.name}</span>
                    </div>
                    {items.map((model) => {
                      const isSelected = model.id === value;
                      const isActive = model.id === activeId;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={model.disabled}
                          onMouseEnter={() => setActiveId(model.id)}
                          onClick={() => commit(model.id)}
                          className="relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm outline-none disabled:opacity-45"
                        >
                          {isActive ? (
                            <motion.span
                              layoutId={`${uid}-active`}
                              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                              aria-hidden="true"
                              className="absolute inset-0 rounded-xl bg-muted"
                            />
                          ) : null}
                          <span className="relative z-10 min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate font-medium text-foreground">
                                {model.name}
                              </span>
                              {model.badge ? (
                                <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                  {model.badge}
                                </span>
                              ) : null}
                            </span>
                            {model.description ? (
                              <span className="block truncate text-xs text-muted-foreground">
                                {model.description}
                              </span>
                            ) : null}
                          </span>
                          {model.contextWindow ? (
                            <span className="relative z-10 shrink-0 font-mono text-[11px] text-muted-foreground">
                              {model.contextWindow}
                            </span>
                          ) : null}
                          {isSelected ? (
                            <Check
                              aria-hidden="true"
                              className="relative z-10 size-3.5 shrink-0 text-primary"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-border bg-card/60 px-3 py-2.5">
              <Search
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-foreground"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type ModelPickerRailProps = BaseModelPickerProps;

/** Compact radio-style model picker with an icon rail to filter providers. */
export function ModelPickerRail({
  providers,
  models,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Choose model",
  searchPlaceholder = "Filter models...",
  disabled = false,
  className,
}: ModelPickerRailProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? models.find((m) => !m.disabled)?.id ?? "",
  );
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const selected = models.find((item) => item.id === value);
  const selectedProvider = providers.find((p) => p.id === selected?.providerId);

  const visibleModels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((model) => {
      if (providerFilter !== "all" && model.providerId !== providerFilter) {
        return false;
      }
      if (!q) return true;
      return (
        model.name.toLowerCase().includes(q) ||
        model.description?.toLowerCase().includes(q)
      );
    });
  }, [models, providerFilter, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const handleOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open]);

  const selectModel = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onValueChange?.(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex min-h-9 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors outline-none",
          "hover:border-border-strong hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        )}
      >
        {selectedProvider?.icon ? (
          <span aria-hidden="true" className="shrink-0">
            {selectedProvider.icon}
          </span>
        ) : null}
        <span className="truncate">{selected?.name ?? placeholder}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING_SWAP}
          className="text-muted-foreground"
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Provider rail model picker"
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.14 } }
            }
            transition={reduce ? { duration: 0 } : SPRING_PANEL}
            className="absolute left-1/2 top-full z-40 mt-2 flex w-[min(25rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
          >
            <nav
              aria-label="Filter by provider"
              className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/35 p-1.5"
            >
              <button
                type="button"
                title="All providers"
                aria-label="All providers"
                aria-pressed={providerFilter === "all"}
                onClick={() => setProviderFilter("all")}
                className="relative grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
              >
                {providerFilter === "all" ? (
                  <motion.span
                    layoutId={`${uid}-rail`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="absolute inset-0 rounded-xl bg-background shadow-xs"
                  />
                ) : null}
                <Layers aria-hidden="true" className="relative z-10 size-4" />
              </button>
              {providers.map((provider) => {
                const active = providerFilter === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    title={provider.name}
                    aria-label={provider.name}
                    aria-pressed={active}
                    onClick={() => setProviderFilter(provider.id)}
                    className="relative grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {active ? (
                      <motion.span
                        layoutId={`${uid}-rail`}
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        className="absolute inset-0 rounded-xl bg-background shadow-xs"
                      />
                    ) : null}
                    <span aria-hidden="true" className="relative z-10">
                      {provider.icon ?? provider.name.slice(0, 1)}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <Search
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div
                role="listbox"
                aria-label="Models"
                className="max-h-64 space-y-0.5 overflow-y-auto p-1.5"
              >
                {visibleModels.length === 0 ? (
                  <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                    No matching models.
                  </p>
                ) : (
                  visibleModels.map((model) => {
                    const checked = model.id === value;
                    const provider = providers.find((p) => p.id === model.providerId);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        role="option"
                        aria-selected={checked}
                        disabled={model.disabled}
                        onClick={() => selectModel(model.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition-colors outline-none",
                          checked
                            ? "bg-muted text-foreground"
                            : "text-foreground/90 hover:bg-muted/60",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-3.5 shrink-0 place-items-center rounded-full border",
                            checked
                              ? "border-primary bg-primary/15"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {checked ? (
                            <span className="size-1.5 rounded-full bg-primary" />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {model.name}
                          </span>
                          {providerFilter === "all" && provider ? (
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {provider.name}
                              {model.speed ? ` · ${model.speed}` : ""}
                            </span>
                          ) : model.speed ? (
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {model.speed}
                            </span>
                          ) : null}
                        </span>
                        {model.contextWindow ? (
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {model.contextWindow}
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
