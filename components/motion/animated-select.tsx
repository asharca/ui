"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
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

interface RegisteredItem {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled: boolean;
}

interface AnimatedSelectContextValue {
  selectId: string;
  listboxId: string;
  layoutId: string;
  open: boolean;
  setOpen: (next: boolean) => void;
  closeAndRestoreFocus: () => void;
  value: string | undefined;
  onSelect: (val: string) => void;
  activeValue: string | undefined;
  setActiveValue: (val: string | undefined) => void;
  items: RegisteredItem[];
  registerItem: (item: RegisteredItem) => void;
  unregisterItem: (value: string) => void;
  disabled: boolean;
  invalid: boolean;
  touched: boolean;
  required: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  reduce: boolean;
}

const AnimatedSelectContext = createContext<AnimatedSelectContextValue | null>(null);
const RegisterOnlyContext = createContext(false);
const GroupContext = createContext<{ registerVisible: (id: string, visible: boolean) => void } | null>(null);

function useAnimatedSelect(name: string) {
  const ctx = useContext(AnimatedSelectContext);
  if (!ctx) throw new Error(`<${name}> must be used within <AnimatedSelect>`);
  return ctx;
}

export interface AnimatedSelectProps {
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called when the selected option changes. */
  onValueChange?: (value: string) => void;
  /** Controlled open state of the menu. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Form field name emitted via a hidden input. */
  name?: string;
  /** Marks the control required; invalid state shows once blurred/submitted without a value. */
  required?: boolean;
  /** Explicitly force invalid styling on the trigger. */
  invalid?: boolean;
  /** Disables opening and changing selection. */
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function AnimatedSelect({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  name,
  required = false,
  invalid = false,
  disabled = false,
  children,
  className,
}: AnimatedSelectProps) {
  const selectId = useId();
  const listboxId = useId();
  const layoutId = useId();
  const reduce = useReducedMotion() ?? false;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [touched, setTouched] = useState(false);
  const [items, setItems] = useState<RegisteredItem[]>([]);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const open = disabled ? false : controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return;
      if (controlledOpen === undefined) setInternalOpen(next);
      if (!next) {
        setSearchQuery("");
        setTouched(true);
      }
      onOpenChange?.(next);
    },
    [controlledOpen, disabled, onOpenChange],
  );

  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, [setOpen]);

  const onSelect = useCallback(
    (nextValue: string) => {
      if (controlledValue === undefined) setInternalValue(nextValue);
      setTouched(true);
      onValueChange?.(nextValue);
      closeAndRestoreFocus();
    },
    [closeAndRestoreFocus, controlledValue, onValueChange],
  );

  const registerItem = useCallback((item: RegisteredItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((entry) => entry.value === item.value);
      if (idx === -1) return [...prev, item];
      const existing = prev[idx];
      if (
        existing &&
        existing.label === item.label &&
        existing.description === item.description &&
        existing.disabled === item.disabled &&
        existing.icon === item.icon
      ) {
        return prev;
      }
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  }, []);

  const unregisterItem = useCallback((val: string) => {
    setItems((prev) => prev.filter((item) => item.value !== val));
  }, []);

  const ctx = useMemo<AnimatedSelectContextValue>(
    () => ({
      selectId,
      listboxId,
      layoutId,
      open,
      setOpen,
      closeAndRestoreFocus,
      value,
      onSelect,
      activeValue,
      setActiveValue,
      items,
      registerItem,
      unregisterItem,
      disabled,
      invalid,
      touched,
      required,
      triggerRef,
      searchQuery,
      setSearchQuery,
      reduce,
    }),
    [
      activeValue,
      closeAndRestoreFocus,
      disabled,
      invalid,
      items,
      layoutId,
      listboxId,
      onSelect,
      open,
      reduce,
      registerItem,
      required,
      searchQuery,
      selectId,
      setOpen,
      touched,
      unregisterItem,
      value,
    ],
  );

  return (
    <AnimatedSelectContext.Provider value={ctx}>
      <div className={cn("relative inline-block", className)}>
        {name ? (
          <input
            type="hidden"
            name={name}
            value={value ?? ""}
            required={required}
          />
        ) : null}
        {children}
      </div>
    </AnimatedSelectContext.Provider>
  );
}

export interface AnimatedSelectTriggerProps {
  className?: string;
  children?: ReactNode;
  /** Accessible name when no visible label is tied to the trigger. */
  ariaLabel?: string;
  id?: string;
}

export function AnimatedSelectTrigger({
  className,
  children,
  ariaLabel,
  id,
}: AnimatedSelectTriggerProps) {
  const {
    selectId,
    listboxId,
    open,
    setOpen,
    triggerRef,
    disabled,
    invalid,
    touched,
    required,
    value,
    items,
    setActiveValue,
    reduce,
  } = useAnimatedSelect("AnimatedSelectTrigger");

  const isInvalid = invalid || (required && touched && !value);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      const enabled = items.filter((item) => !item.disabled);
      const target =
        enabled.find((item) => item.value === value) ??
        (event.key === "ArrowUp" ? enabled[enabled.length - 1] : enabled[0]);
      setActiveValue(target?.value);
      setOpen(true);
    }
  };

  return (
    <button
      ref={triggerRef}
      id={id ?? selectId}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-label={ariaLabel}
      aria-invalid={isInvalid || undefined}
      disabled={disabled}
      onClick={() => {
        if (!open) {
          const enabled = items.filter((item) => !item.disabled);
          setActiveValue(
            enabled.find((item) => item.value === value)?.value ?? enabled[0]?.value,
          );
        }
        setOpen(!open);
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex min-h-9 items-center justify-between gap-2.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors outline-none",
        "hover:border-border-strong hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isInvalid && "border-destructive ring-1 ring-destructive/30",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2">{children}</span>
      <motion.span
        aria-hidden="true"
        animate={{ rotate: open ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : SPRING_SWAP}
        className="shrink-0 text-muted-foreground"
      >
        <ChevronDown className="size-3.5" />
      </motion.span>
    </button>
  );
}

export function AnimatedSelectValue({
  placeholder = "Select an option",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value, items } = useAnimatedSelect("AnimatedSelectValue");
  const selected = items.find((item) => item.value === value);

  if (!selected) {
    return (
      <span className={cn("truncate text-muted-foreground", className)}>
        {placeholder}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 truncate", className)}>
      {selected.icon ? (
        <span aria-hidden="true" className="shrink-0">
          {selected.icon}
        </span>
      ) : null}
      <span className="truncate">{selected.label}</span>
    </span>
  );
}

export interface AnimatedSelectContentProps {
  /** Renders a filter input inside the dropdown panel. */
  searchable?: boolean;
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Empty message shown when no options match search. */
  emptyText?: string;
  /** Horizontal alignment relative to the trigger. */
  align?: "start" | "center" | "end";
  className?: string;
  children: ReactNode;
}

export function AnimatedSelectContent({
  searchable = false,
  searchPlaceholder = "Search options...",
  emptyText = "No matching options.",
  align = "start",
  className,
  children,
}: AnimatedSelectContentProps) {
  const {
    open,
    closeAndRestoreFocus,
    setOpen,
    triggerRef,
    listboxId,
    items,
    value,
    activeValue,
    setActiveValue,
    onSelect,
    searchQuery,
    setSearchQuery,
    reduce,
  } = useAnimatedSelect("AnimatedSelectContent");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const typedRef = useRef({ query: "", at: 0 });
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    minWidth: number;
    placement: "bottom" | "top";
  } | null>(null);

  const visibleItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  const enabledVisible = useMemo(
    () => visibleItems.filter((item) => !item.disabled),
    [visibleItems],
  );

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const estimatedHeight = searchable ? 310 : Math.min(280, Math.max(120, items.length * 40 + 16));
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const placement =
      spaceBelow < estimatedHeight && spaceAbove > spaceBelow ? "top" : "bottom";

    const menuWidth = Math.max(rect.width, 224);
    let left = rect.left;
    if (align === "center") {
      left = rect.left + rect.width / 2 - menuWidth / 2;
    } else if (align === "end") {
      left = rect.right - menuWidth;
    }
    left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));

    setCoords({
      top: placement === "bottom" ? rect.bottom + 8 : rect.top - 8,
      left,
      minWidth: Math.max(rect.width, 224),
      placement,
    });
  }, [align, items.length, searchable, triggerRef]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleViewportChange = () => updatePosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, setOpen, triggerRef]);

  useEffect(() => {
    if (!open) return;
    if (searchable) {
      requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
    } else {
      requestAnimationFrame(() => {
        const listEl = panelRef.current?.querySelector<HTMLElement>("[role='listbox']");
        listEl?.focus({ preventScroll: true });
      });
    }
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    if (activeValue && enabledVisible.some((item) => item.value === activeValue)) return;
    setActiveValue(
      enabledVisible.find((item) => item.value === value)?.value ??
        enabledVisible[0]?.value,
    );
  }, [activeValue, enabledVisible, open, setActiveValue, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!enabledVisible.length && event.key !== "Escape") return;
    const currentIndex = Math.max(
      0,
      enabledVisible.findIndex((item) => item.value === activeValue),
    );

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = enabledVisible[(currentIndex + 1) % enabledVisible.length];
      if (next) setActiveValue(next.value);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev =
        enabledVisible[
          (currentIndex - 1 + enabledVisible.length) % enabledVisible.length
        ];
      if (prev) setActiveValue(prev.value);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      if (enabledVisible[0]) setActiveValue(enabledVisible[0].value);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      const last = enabledVisible[enabledVisible.length - 1];
      if (last) setActiveValue(last.value);
      return;
    }
    if (event.key === "PageDown") {
      event.preventDefault();
      const target =
        enabledVisible[Math.min(enabledVisible.length - 1, currentIndex + 5)];
      if (target) setActiveValue(target.value);
      return;
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      const target = enabledVisible[Math.max(0, currentIndex - 5)];
      if (target) setActiveValue(target.value);
      return;
    }
    if (event.key === "Enter" || (event.key === " " && !searchable)) {
      const target = enabledVisible.find((item) => item.value === activeValue);
      if (target) {
        event.preventDefault();
        onSelect(target.value);
      }
      return;
    }

    if (
      !searchable &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = Date.now();
      const ch = event.key.toLowerCase();
      const query =
        now - typedRef.current.at < 500 ? typedRef.current.query + ch : ch;
      typedRef.current = { query, at: now };
      const start = query.length === 1 ? currentIndex + 1 : currentIndex;
      for (let step = 0; step < enabledVisible.length; step++) {
        const candidate = enabledVisible[(start + step) % enabledVisible.length];
        if (candidate?.label.toLowerCase().startsWith(query)) {
          setActiveValue(candidate.value);
          break;
        }
      }
    }
  };

  // Hidden pre-pass keeps items registered while the portal is unmounted so the
  // trigger displays the initial selected label and icon immediately.
  const registrationPass = !open ? (
    <RegisterOnlyContext.Provider value={true}>
      <div hidden aria-hidden="true">
        {children}
      </div>
    </RegisterOnlyContext.Provider>
  ) : null;

  if (typeof document === "undefined") {
    return registrationPass;
  }

  return (
    <>
      {registrationPass}
      {createPortal(
        <AnimatePresence>
          {open && coords ? (
            <motion.div
              ref={panelRef}
              onKeyDown={handleKeyDown}
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
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                minWidth: coords.minWidth,
                transform:
                  coords.placement === "top" ? "translateY(-100%)" : undefined,
                transformOrigin:
                  coords.placement === "top" ? "bottom left" : "top left",
              }}
              className={cn(
                "z-[200] max-w-[min(22rem,calc(100vw-24px))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl",
                className,
              )}
            >
              {searchable ? (
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                  <Search
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-muted-foreground"
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              ) : null}
              <div
                id={listboxId}
                role="listbox"
                tabIndex={searchable ? -1 : 0}
                aria-activedescendant={
                  activeValue ? `${listboxId}-opt-${activeValue}` : undefined
                }
                className="max-h-64 overflow-y-auto p-1.5 outline-none"
              >
                {children}
                {searchable && visibleItems.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                    {emptyText}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export function AnimatedSelectGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const registerVisible = useCallback((id: string, visible: boolean) => {
    setVisibleMap((prev) =>
      prev[id] === visible ? prev : { ...prev, [id]: visible },
    );
  }, []);

  const hasVisibleChildren =
    Object.keys(visibleMap).length === 0 ||
    Object.values(visibleMap).some(Boolean);

  return (
    <GroupContext.Provider value={{ registerVisible }}>
      <fieldset
        className={cn(
          "m-0 border-0 p-0 py-1 first:pt-0 last:pb-0",
          !hasVisibleChildren && "hidden",
          className,
        )}
      >
        {children}
      </fieldset>
    </GroupContext.Provider>
  );
}

export function AnimatedSelectLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AnimatedSelectSeparator({ className }: { className?: string }) {
  return <hr className={cn("my-1 border-0 border-t border-border", className)} />;
}

export interface AnimatedSelectItemProps {
  value: string;
  /** Text label displayed in the trigger and used for search/typeahead matching. */
  label?: string;
  /** Optional supporting line rendered below the label inside the menu. */
  description?: string;
  /** Optional leading icon rendered inside both the menu row and trigger value. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function AnimatedSelectItem({
  value,
  label,
  description,
  icon,
  disabled = false,
  className,
  children,
}: AnimatedSelectItemProps) {
  const {
    listboxId,
    layoutId,
    value: selectedValue,
    activeValue,
    setActiveValue,
    onSelect,
    registerItem,
    unregisterItem,
    searchQuery,
    reduce,
  } = useAnimatedSelect("AnimatedSelectItem");
  const registerOnly = useContext(RegisterOnlyContext);
  const group = useContext(GroupContext);

  const textLabel =
    label ?? (typeof children === "string" || typeof children === "number" ? String(children) : value);

  useLayoutEffect(() => {
    registerItem({ value, label: textLabel, description, icon, disabled });
    return () => unregisterItem(value);
  }, [description, disabled, icon, registerItem, textLabel, unregisterItem, value]);

  const q = searchQuery.trim().toLowerCase();
  const visible =
    !q ||
    textLabel.toLowerCase().includes(q) ||
    description?.toLowerCase().includes(q) ||
    value.toLowerCase().includes(q);

  useEffect(() => {
    if (!registerOnly && group) {
      group.registerVisible(value, visible);
    }
  }, [group, registerOnly, value, visible]);

  if (registerOnly || !visible) return null;

  const selected = selectedValue === value;
  const active = activeValue === value;

  return (
    <button
      id={`${listboxId}-opt-${value}`}
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onMouseEnter={() => {
        if (!disabled) setActiveValue(value);
      }}
      onClick={() => {
        if (!disabled) onSelect(value);
      }}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors outline-none",
        disabled
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer text-foreground",
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId={`${layoutId}-highlight`}
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          aria-hidden="true"
          className="absolute inset-0 -z-0 rounded-xl bg-muted"
        />
      ) : null}
      {icon ? (
        <span aria-hidden="true" className="relative z-10 shrink-0 text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <span className="relative z-10 min-w-0 flex-1">
        <span className="block truncate font-medium">{children ?? textLabel}</span>
        {description ? (
          <span className="block truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {selected ? (
        <Check
          aria-hidden="true"
          className="relative z-10 size-3.5 shrink-0 text-primary"
        />
      ) : null}
    </button>
  );
}
