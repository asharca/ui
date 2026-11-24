"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PANEL, SPRING_SWAP } from "@/lib/ease";
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

interface PortalPosition {
  top: number;
  left: number;
  placement: "bottom" | "top";
}

function useFloatingPortal(
  open: boolean,
  panelWidth: number,
  estimatedHeight: number,
  setOpen: (next: boolean) => void,
) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<PortalPosition | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const placement: "bottom" | "top" =
      spaceBelow < estimatedHeight && spaceAbove > spaceBelow ? "top" : "bottom";
    const width = Math.min(panelWidth, window.innerWidth - 24);
    const rawLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.max(12, Math.min(rawLeft, window.innerWidth - width - 12));
    setCoords({
      top: placement === "bottom" ? rect.bottom + 8 : rect.top - 8,
      left,
      placement,
    });
  }, [estimatedHeight, panelWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onViewportChange = () => updatePosition();
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open, setOpen]);

  return { triggerRef, panelRef, coords };
}

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
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? models.find((m) => !m.disabled)?.id ?? "",
  );
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  const { triggerRef, panelRef, coords } = useFloatingPortal(
    open,
    316,
    360,
    setOpen,
  );

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

  const commit = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onValueChange?.(id);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
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
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors outline-none",
          "hover:border-border-strong hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          open && "border-border-strong",
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

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && coords ? (
                <div
                  ref={panelRef}
                  id={`${uid}-list`}
                  role="dialog"
                  aria-label="Model catalog"
                  onKeyDown={handleKeyDown}
                  style={{
                    position: "fixed",
                    top: coords.top,
                    left: coords.left,
                    width: "min(19.75rem, calc(100vw - 24px))",
                    transform:
                      coords.placement === "top" ? "translateY(-100%)" : undefined,
                  }}
                  className="z-[200]"
                >
                  <motion.div
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.96,
                            y: coords.placement === "bottom" ? -6 : 6,
                          }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.96,
                            y: coords.placement === "bottom" ? -4 : 4,
                            transition: { duration: 0.14, ease: EASE_OUT },
                          }
                    }
                    transition={reduce ? { duration: 0 } : SPRING_PANEL}
                    className="overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
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
                          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
                            <span>{provider.name}</span>
                            <span className="font-mono text-[11px] tabular-nums">
                              {items.length}
                            </span>
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
                                className="relative flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                {isActive ? (
                                  <motion.span
                                    layoutId={`${uid}-active`}
                                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-xl bg-foreground/[0.07]"
                                  />
                                ) : null}
                                {provider.icon ? (
                                  <span
                                    aria-hidden="true"
                                    className="relative z-10 shrink-0"
                                  >
                                    {provider.icon}
                                  </span>
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
                                    strokeWidth={1.75}
                                    className="relative z-10 size-4 shrink-0 text-foreground"
                                  />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-border p-2.5">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 focus-within:border-border-strong">
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
                          className="shrink-0 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </button>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-mono text-[11px] text-muted-foreground/80"
                        >
                          esc
                        </span>
                      )}
                    </div>
                  </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

export type ModelPickerRailProps = BaseModelPickerProps;

/** Compact model picker with a floating provider icon rail to filter providers. */
export function ModelPickerRail({
  providers,
  models,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Choose model",
  searchPlaceholder = "Search",
  disabled = false,
  className,
}: ModelPickerRailProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const initialSelectedId =
    controlledValue ?? defaultValue ?? models.find((m) => !m.disabled)?.id ?? "";
  const initialProvider =
    models.find((m) => m.id === initialSelectedId)?.providerId ??
    providers[0]?.id ??
    "all";

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(initialSelectedId);
  const [providerFilter, setProviderFilter] = useState<string>(initialProvider);
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | undefined>(undefined);

  const { triggerRef, panelRef, coords } = useFloatingPortal(
    open,
    380,
    330,
    setOpen,
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const selected = models.find((item) => item.id === value);
  const selectedProvider = providers.find((p) => p.id === selected?.providerId);

  const activeProvider =
    providers.find((p) => p.id === providerFilter) ?? providers[0];

  const visibleModels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((model) => {
      if (q) {
        return (
          model.name.toLowerCase().includes(q) ||
          model.description?.toLowerCase().includes(q)
        );
      }
      if (providerFilter !== "all" && model.providerId !== providerFilter) {
        return false;
      }
      return true;
    });
  }, [models, providerFilter, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    if (selected?.providerId) {
      setProviderFilter(selected.providerId);
    }
    setHoveredId(selected?.id);
  }, [open, selected?.id, selected?.providerId]);

  const selectModel = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onValueChange?.(id);
    setOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors outline-none",
          "hover:border-border-strong hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          open && "border-border-strong",
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

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && coords ? (
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-label="Provider rail model picker"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setOpen(false);
                      triggerRef.current?.focus({ preventScroll: true });
                    }
                  }}
                  style={{
                    position: "fixed",
                    top: coords.top,
                    left: coords.left,
                    width: "min(23.75rem, calc(100vw - 24px))",
                    transform:
                      coords.placement === "top" ? "translateY(-100%)" : undefined,
                  }}
                  className="z-[200]"
                >
                  <motion.div
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.96,
                            y: coords.placement === "bottom" ? -6 : 6,
                          }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.96,
                            y: coords.placement === "bottom" ? -4 : 4,
                            transition: { duration: 0.14, ease: EASE_OUT },
                          }
                    }
                    transition={reduce ? { duration: 0 } : SPRING_PANEL}
                    className="flex overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl"
                  >
                  <nav
                    aria-label="Filter by provider"
                    className="flex shrink-0 flex-col items-center gap-1 self-start rounded-full border border-border bg-background/60 p-1"
                  >
                    {providers.map((provider) => {
                      const active = providerFilter === provider.id && !query.trim();
                      return (
                        <button
                          key={provider.id}
                          type="button"
                          title={provider.name}
                          aria-label={provider.name}
                          aria-pressed={active}
                          onClick={() => {
                            setQuery("");
                            setProviderFilter(provider.id);
                          }}
                          className="relative grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground outline-none"
                        >
                          {active ? (
                            <motion.span
                              layoutId={`${uid}-rail`}
                              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                              className="absolute inset-0 rounded-full bg-foreground/[0.09]"
                            />
                          ) : null}
                          <span aria-hidden="true" className="relative z-10">
                            {provider.icon ?? provider.name.slice(0, 1)}
                          </span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="flex min-w-0 flex-1 flex-col pl-2.5">
                    <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-0.5">
                      <div className="flex min-w-0 items-baseline gap-1.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {query.trim() ? "Search results" : (activeProvider?.name ?? "Models")}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {visibleModels.length}
                        </span>
                      </div>

                      <div className="flex w-28 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 focus-within:border-border-strong">
                        <Search
                          aria-hidden="true"
                          className="size-3 shrink-0 text-muted-foreground"
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
                    </div>

                    <div
                      role="listbox"
                      aria-label="Models"
                      className="max-h-64 space-y-0.5 overflow-y-auto pr-0.5"
                    >
                      {visibleModels.length === 0 ? (
                        <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                          No matching models.
                        </p>
                      ) : (
                        visibleModels.map((model) => {
                          const checked = model.id === value;
                          const isHighlighted =
                            hoveredId === model.id || (hoveredId === undefined && checked);
                          const provider = providers.find((p) => p.id === model.providerId);
                          return (
                            <button
                              key={model.id}
                              type="button"
                              role="option"
                              aria-selected={checked}
                              disabled={model.disabled}
                              onMouseEnter={() => setHoveredId(model.id)}
                              onMouseLeave={() => setHoveredId(undefined)}
                              onClick={() => selectModel(model.id)}
                              className="relative flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-45"
                            >
                              {isHighlighted ? (
                                <motion.span
                                  layoutId={`${uid}-rail-row`}
                                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                                  aria-hidden="true"
                                  className="absolute inset-0 rounded-xl bg-foreground/[0.07]"
                                />
                              ) : null}
                              {provider?.icon ? (
                                <span
                                  aria-hidden="true"
                                  className="relative z-10 shrink-0"
                                >
                                  {provider.icon}
                                </span>
                              ) : null}
                              <span className="relative z-10 min-w-0 flex-1 truncate font-medium text-foreground">
                                {model.name}
                              </span>
                              {checked ? (
                                <Check
                                  aria-hidden="true"
                                  strokeWidth={1.75}
                                  className="relative z-10 size-4 shrink-0 text-foreground"
                                />
                              ) : null}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
