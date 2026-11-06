"use client";

import { cloneElement, type ComponentProps, type ReactElement, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";
import { MorphingModal } from "@/components/motion/morphing-modal";
import type { CommandItem } from "@/components/motion/command-palette";
import { searchCommands } from "@/lib/command-search";
import { useRowCursor } from "@/lib/hooks/use-row-cursor";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { useOnOpen } from "@/lib/hooks/use-on-open";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type MorphicCommand = CommandItem & { disabled?: boolean };
export interface MorphicCommandsProps {
  items: MorphicCommand[];
  trigger: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortcut?: string;
  className?: string;
}

/** Reuses the catalog's command search, row cursor, morph and overlay focus. */
export function MorphicCommands({ items, trigger, open: controlled, defaultOpen = false, onOpenChange, shortcut = "k", className }: MorphicCommandsProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const open = controlled ?? internal;
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const focusSearch = useCallback((node: HTMLInputElement | null) => {
    input.current = node;
    if (open) node?.focus({ preventScroll: true });
  }, [open]);
  const anchor = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const filtered = useMemo(() => searchCommands(items, query), [items, query]);
  const enabled = filtered.filter(item => !item.disabled);
  const { activeIndex, moveActive, moveTo } = useRowCursor(enabled, query);
  const active = enabled[activeIndex];
  const change = (next: boolean) => {
    if (!next && document.activeElement?.closest('[role="dialog"]')?.contains(input.current)) anchor.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  const changeRef = useRef(change);
  useLayoutEffect(() => { changeRef.current = change; });
  useOnOpen(open, () => { setQuery(""); moveTo(null); });
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut.toLowerCase()) {
        event.preventDefault(); changeRef.current(!open);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, shortcut]);
  const execute = (item: MorphicCommand) => { if (item.disabled) return; change(false); item.onSelect(); };
  const groups = Array.from(new Set(filtered.map(item => item.group ?? "Commands")));
  const triggerProps = trigger.props as ComponentProps<"button">;
  return <div ref={anchor} className="inline-flex max-w-full">
    {cloneElement(trigger as ReactElement<ComponentProps<"button">>, { onClick: event => { triggerProps.onClick?.(event); if (!event.defaultPrevented) change(true); }, "aria-haspopup": "dialog", "aria-expanded": open })}
    <MorphingModal viewId={open ? id : null} onClose={() => change(false)} placement="center" ariaLabel="Command palette" backdropClassName="bg-foreground/10 [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]" className={cn("max-w-lg self-start mt-[max(0px,calc(min(16vh,6rem)-1rem))] rounded-2xl border border-border shadow-none [&>div]:p-0", className)}>
      <h2 className="sr-only">Command palette</h2>
      <div className="flex shrink-0 items-center gap-2 border-b border-border p-3">
        <div className="relative h-10 min-w-0 flex-1 overflow-hidden rounded-full border border-border bg-background transition-colors duration-200 focus-within:border-muted-foreground/40">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input ref={focusSearch} value={query} onChange={event => setQuery(event.target.value)} aria-label="Search commands" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={`${id}-list`} aria-activedescendant={active ? `${id}-${active.id}` : undefined} placeholder="Search commands…" className="h-full w-full bg-transparent pl-10 pr-3.5 text-sm leading-6 text-foreground caret-foreground outline-none placeholder:text-muted-foreground/60" onKeyDown={event => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); moveActive(event.key === "ArrowDown" ? 1 : -1); }
            if (event.key === "Enter" && active) { event.preventDefault(); execute(active); }
          }} />
        </div>
        <button type="button" onClick={() => change(false)} aria-label="Close palette" className="inline-flex h-9 shrink-0 items-center justify-center rounded-full px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><kbd>Esc</kbd></button>
      </div>
      <motion.div layout={!reduce} transition={SPRING_LAYOUT} id={`${id}-list`} role="listbox" aria-label="Commands" className="max-h-[min(50dvh,24rem)] min-h-0 overflow-y-auto overscroll-contain p-2">
        {groups.map(group => <fieldset key={group} className="m-0 mb-2 min-w-0 border-0 p-0 last:mb-0" aria-label={group}>
          <p className="px-3 pb-1.5 pt-2 text-xs text-muted-foreground">{group}</p>
          {filtered.filter(item => (item.group ?? "Commands") === group).map(item => <button key={item.id} id={`${id}-${item.id}`} type="button" role="option" aria-selected={active?.id === item.id} disabled={item.disabled} aria-disabled={item.disabled || undefined} tabIndex={-1} onPointerEnter={() => { if (hover && !item.disabled) moveTo(item.id); }} onClick={() => execute(item)} className="relative isolate flex min-h-10 w-full items-center gap-3 rounded-full px-3 py-2 text-left outline-none disabled:opacity-40">
            {active?.id === item.id ? <motion.span layoutId={`${id}-cursor`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="absolute inset-0 -z-10 rounded-full bg-muted" /> : null}
            {item.icon ? <item.icon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> : null}<span className="min-w-0 flex-1"><span className="block truncate text-sm">{item.label}</span></span>{item.hint || item.badge ? <span className="text-xs text-muted-foreground">{item.hint}{item.badge}</span> : null}{active?.id === item.id ? <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-muted-foreground" /> : null}
          </button>)}
        </fieldset>)}
        {!filtered.length ? <p className="p-6 text-center text-sm text-muted-foreground">No matching commands.</p> : null}
      </motion.div>
      <div className="flex shrink-0 items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><ArrowUp aria-hidden className="size-3" /><ArrowDown aria-hidden className="size-3" /><span className="ml-1">Navigate</span></span><span className="inline-flex items-center gap-1.5"><CornerDownLeft aria-hidden className="size-3" />Select</span><span className="ml-auto tabular-nums">{filtered.length} results</span><output className="sr-only">{filtered.length} commands found.</output></div>
    </MorphingModal>
  </div>;
}
