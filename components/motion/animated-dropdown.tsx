"use client";

import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { createPortal } from "react-dom";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from "react";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "@/components/motion/popover-morph";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import { useOnOpen } from "@/lib/hooks/use-on-open";
import { PresenceGate } from "@/lib/presence-gate";

function DropdownFlyout({ anchor, onReady, children, shadow }: { anchor: () => HTMLElement | null; onReady: () => void; children: ReactNode; shadow: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const reduce = useReducedMotion();
  const present = useIsPresent();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const reference = anchor();
    const floating = ref.current;
    if (!reference || !floating) return;
    let cancelled = false;
    const cleanup = autoUpdate(reference, floating, () => {
      void computePosition(reference, floating, { placement: "right-start", strategy: "fixed", middleware: [offset({ mainAxis: reduce ? 16 : 4, crossAxis: -12 }), flip({ padding: 8 }), shift({ padding: 8, crossAxis: true })] }).then(({ x, y }) => {
        if (!cancelled) setPosition({ left: x, top: y });
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [anchor, reduce]);
  useLayoutEffect(() => {
    if (!present) { ready.current = false; return; }
    if (!position || ready.current) return;
    ready.current = true;
    onReady();
  }, [position, onReady, present]);
  return createPortal(<PresenceGate>{({ gate }) => <motion.div {...gate} inert={!position || !present} aria-hidden={!position || !present} ref={ref} onPointerDown={event => event.stopPropagation()} className={cn("fixed z-[9999] max-w-[calc(100vw-16px)] rounded-xl border border-border bg-background p-1", shadow && "shadow-lg")} style={{ left: position?.left ?? 0, top: position?.top ?? 0 }} initial={{ opacity: 0, scale: reduce ? 1 : .98 }} animate={{ opacity: position ? 1 : 0, scale: 1 }} exit={{ opacity: 0, scale: reduce ? 1 : .98 }} transition={{ duration: .12, ease: EASE_OUT }}>{children}</motion.div>}</PresenceGate>, document.body);
}

// MorphPopover owns IDs, anchoring and restoration; this native trigger changes
// only its popup semantic from the generic dialog to a menu.
function DropdownMenuTrigger(props: ComponentPropsWithRef<"button">) {
  const { children, ...attributes } = props;
  return <button {...attributes} aria-haspopup="menu">{children}</button>;
}

interface DropdownItemBase {
  id: string;
  label: ReactNode;
  /** Required plain text for typeahead and submenu accessible names. */
  textValue: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  shortcut?: string;
  destructive?: boolean;
}
export type AnimatedDropdownItem =
  | { id: string; kind: "separator" }
  | (DropdownItemBase & { kind?: "action"; onSelect: () => void; closeOnSelect?: boolean })
  | (DropdownItemBase & { kind: "option"; value: string; checked?: boolean })
  | (DropdownItemBase & { kind: "checkbox"; checked: boolean; onCheckedChange: (checked: boolean) => void })
  | (DropdownItemBase & { kind: "submenu"; items: AnimatedDropdownItem[] });
export interface AnimatedDropdownProps {
  trigger: ReactNode;
  ariaLabel: string;
  items: AnimatedDropdownItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  align?: "start" | "end";
  /** Preferred vertical side; flips when the opposite side has more room. */
  side?: "top" | "bottom";
  /** Gap between the trigger and root panel in px. Defaults to 8. */
  sideOffset?: number;
  /** Draw shadows for the root and child panels. Defaults to true. */
  shadow?: boolean;
  /** Root panel corner radius. Defaults to 12px. */
  radius?: number;
  /** Root panel viewport clearance. Defaults to 8px. */
  collisionPadding?: number;
  /** Open on the first/selected option, or the menu root without a highlighted row. */
  initialFocus?: "first" | "selected" | "menu";
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  menuLabel?: string;
  menuWidth?: number;
  submenuWidth?: number;
  /** Keep selection marks separate from leading icons when matching trailing-check menus. */
  indicatorPosition?: "start" | "end";
}

/**
 * Click dropdown composed on the existing corner-morph portal. Nested panels
 * share its collision-aware surface and wrap on narrow viewports. Arrow keys,
 * Home/End, typeahead, Escape and disabled-item skipping apply at every level.
 */
export function AnimatedDropdown({ trigger, ariaLabel, items, open: controlledOpen, defaultOpen = false, onOpenChange, value, defaultValue, onValueChange, align = "start", side = "bottom", sideOffset, shadow = true, radius = 12, collisionPadding, initialFocus = "first", disabled, className, triggerClassName, contentClassName, itemClassName, menuLabel, menuWidth = 224, submenuWidth = menuWidth, indicatorPosition = "start" }: AnimatedDropdownProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const focusRequest = useRef<number | null>(null);
  const typeahead = useRef({ text: "", at: 0 });
  const firstFocus = useRef<"first" | "last" | null>(null);
  const previousOpen = useRef(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [path, setPath] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const open = controlledOpen ?? internalOpen;
  const selected = value ?? internalValue;
  useOnOpen(open, () => { setPath([]); setActive(null); });
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setPath([]);
      setActive(null);
      if (panelRefs.current.some(panel => panel?.contains(document.activeElement))) triggerRef.current?.focus();
    }
  };
  useLayoutEffect(() => {
    if (!open) firstFocus.current = null;
    if (!open && previousOpen.current) {
      if (panelRefs.current.some(panel => panel?.contains(document.activeElement))) triggerRef.current?.focus();
    }
    previousOpen.current = open;
  }, [open]);
  const panels: { items: AnimatedDropdownItem[]; label: string; keyPrefix: string; parentId?: string }[] = [{ items, label: ariaLabel, keyPrefix: "" }];
  for (const itemId of path) {
    const parent = panels[panels.length - 1].items.find(item => item.id === itemId);
    if (parent?.kind !== "submenu" || parent.disabled) break;
    const keyPrefix = `${panels[panels.length - 1].keyPrefix}${itemId.length}:${itemId}`;
    panels.push({ items: parent.items, label: parent.textValue, keyPrefix, parentId: parent.id });
  }
  if (panels.length - 1 < path.length) setPath(path.slice(0, panels.length - 1));
  const itemKey = (level: number, itemId: string) => `${panels[level].keyPrefix}${itemId.length}:${itemId}`;
  const openingFocus = firstFocus.current ?? initialFocus;
  let selectedFallback: string | null = null;
  let fallback: string | null = null;
  let activePresent = false;
  for (const [level, panel] of panels.entries()) {
    for (const item of panel.items) {
      if (item.kind === "separator" || item.disabled) continue;
      const key = itemKey(level, item.id);
      if (level === 0) {
        if (fallback === null || openingFocus === "last") fallback = key;
        if (openingFocus === "selected" && selectedFallback === null && item.kind === "option" && (item.checked ?? selected === item.value)) selectedFallback = key;
      }
      if (active === key) activePresent = true;
    }
  }
  const resolvedActive = activePresent ? active : openingFocus === "menu" ? null : selectedFallback ?? fallback;
  if (active !== null && !activePresent) setActive(null);
  const focusAt = (level: number, edge: "first" | "last" | "selected" | "menu" = "first") => {
    if (edge === "menu") { panelRefs.current[level]?.focus(); return; }
    const choices = panelRefs.current[level]?.querySelectorAll<HTMLButtonElement>(`[data-dropdown-level="${level}"]:not(:disabled)`);
    if (!choices?.length) return;
    let button = edge === "last" ? choices[choices.length - 1] : choices[0];
    if (edge === "selected") {
      for (const choice of choices) {
        if (choice.getAttribute("role") === "menuitemradio" && choice.getAttribute("aria-checked") === "true") {
          button = choice;
          break;
        }
      }
    }
    button.focus();
  };
  const reveal = (item: Extract<AnimatedDropdownItem, { kind: "submenu" }>, level: number, focus: boolean) => {
    focusRequest.current = focus ? level + 1 : null;
    setPath(current => [...current.slice(0, level), item.id]);
    if (focus && path[level] === item.id && panelRefs.current[level + 1]) {
      focusAt(level + 1);
      if (panelRefs.current[level + 1]?.contains(document.activeElement)) focusRequest.current = null;
    }
  };
  const navigate = (event: KeyboardEvent<HTMLDivElement>, level: number) => {
    const choices = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(`[data-dropdown-level="${level}"]:not(:disabled)`));
    const index = choices.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      if (!choices.length) return;
      const current = index < 0 ? (event.key === "ArrowUp" ? 0 : -1) : index;
      const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length;
      choices[next]?.focus();
    } else if ((event.key === "ArrowLeft" || event.key === "Escape") && level > 0) {
      event.preventDefault();
      event.stopPropagation();
      const parentId = panels[level].parentId;
      setPath(current => current.slice(0, level - 1));
      panelRefs.current[level - 1]?.querySelector<HTMLButtonElement>(`[data-item-id="${CSS.escape(parentId ?? "")}"]`)?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== " ") {
      event.preventDefault();
      event.stopPropagation();
      const now = Date.now();
      const text = now - typeahead.current.at > 700 ? event.key : typeahead.current.text + event.key;
      typeahead.current = { text, at: now };
      const matchText = Array.from(text).every(character => character === text[0]) ? text[0] : text;
      const ordered = [...choices.slice(index + 1), ...choices.slice(0, index + 1)];
      ordered.find(choice => choice.dataset.textValue?.toLocaleLowerCase().startsWith(matchText.toLocaleLowerCase()))?.focus();
    }
  };
  const renderPanel = (panel: (typeof panels)[number], level: number) => <div ref={element => { if (!element) return; panelRefs.current[level] = element; return () => { if (panelRefs.current[level] === element) panelRefs.current[level] = null; }; }} role="menu" tabIndex={-1} aria-label={panel.label ?? ariaLabel} onKeyDown={event => navigate(event, level)} style={{ width: (level === 0 ? menuWidth : submenuWidth) - 10, maxWidth: level === 0 && collisionPadding !== undefined ? `calc(100vw - ${collisionPadding * 2 + 12}px)` : undefined }} className="min-w-0 max-w-[calc(100vw-28px)] p-0.5">
          {(level > 0 || menuLabel) && <div className="px-2.5 py-2 text-xs font-medium text-muted-foreground">{level > 0 ? panel.label : menuLabel}</div>}
          {panel.items.length === 0 && <p role="presentation" className="px-2 py-3 text-xs text-muted-foreground">No available actions</p>}
          {panel.items.map(item => {
            if (item.kind === "separator") return <hr key={item.id} className="-mx-1.5 my-1 h-px border-0 bg-border" />;
            const isActive = resolvedActive === itemKey(level, item.id);
            const checked = item.kind === "option" ? (item.checked ?? selected === item.value) : item.kind === "checkbox" ? item.checked : undefined;
            return <button key={item.id} type="button" {...(item.kind === "option" ? { role: "menuitemradio" as const, "aria-checked": checked } : item.kind === "checkbox" ? { role: "menuitemcheckbox" as const, "aria-checked": checked } : { role: "menuitem" as const })} aria-disabled={item.disabled || undefined} aria-haspopup={item.kind === "submenu" ? "menu" : undefined} aria-expanded={item.kind === "submenu" ? path[level] === item.id : undefined} disabled={item.disabled} tabIndex={-1} data-dropdown-level={level} data-item-id={item.id} data-text-value={item.textValue} onFocus={() => { setActive(itemKey(level, item.id)); setPath(current => current[level] && current[level] !== item.id ? current.slice(0, level) : current); }} onPointerEnter={canHover ? () => { if (item.disabled) return; setActive(itemKey(level, item.id)); if (item.kind === "submenu") reveal(item, level, false); else setPath(current => current.slice(0, level)); } : undefined} onKeyDown={event => { if (event.key === "ArrowRight" && item.kind === "submenu") { event.preventDefault(); event.stopPropagation(); reveal(item, level, true); } }} onClick={event => {
              if (item.kind === "submenu") { reveal(item, level, event.detail === 0); return; }
              if (item.kind === "checkbox") { item.onCheckedChange(!item.checked); return; }
              if (item.kind === "option") { if (value === undefined) setInternalValue(item.value); onValueChange?.(item.value); }
              else item.onSelect();
              if (item.kind === "option" || item.closeOnSelect !== false) setOpen(false);
            }} className={cn("relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-40", item.kind === "submenu" && path[level] === item.id && "bg-muted", item.destructive && "text-destructive", itemClassName)}>
              {isActive && <motion.span aria-hidden="true" layoutId={reduce ? undefined : `${id}-focus-${level}`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="pointer-events-none absolute inset-0 rounded-[inherit] bg-muted" />}
              <span aria-hidden="true" className="relative flex size-4 shrink-0 items-center justify-center">{checked && indicatorPosition === "start" ? <Check className="size-3.5" /> : item.icon}</span><span className="relative min-w-0 flex-1">{item.label}{item.description && <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>}</span>{item.shortcut && <span aria-hidden="true" className="relative text-[10px] text-muted-foreground">{item.shortcut}</span>}{checked && indicatorPosition === "end" && <Check aria-hidden="true" className="relative size-3.5 shrink-0" />}{item.kind === "submenu" && <ChevronRight aria-hidden="true" className="relative size-3.5" />}
            </button>;
          })}
        </div>;
  return <MorphPopover open={open} onOpenChange={setOpen} className={className}>
    <MorphPopoverTrigger><DropdownMenuTrigger ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel} onPointerDown={() => { firstFocus.current = null; }} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); firstFocus.current = event.key === "ArrowUp" ? "last" : "first"; if (open) focusAt(0, firstFocus.current); else setOpen(true); } else if (event.key === "Enter" || event.key === " ") firstFocus.current = null; }} className={cn("inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", triggerClassName)}>{trigger}<ChevronDown aria-hidden="true" className={cn("size-3.5 text-muted-foreground", open && "rotate-180")} /></DropdownMenuTrigger></MorphPopoverTrigger>
    <MorphPopoverContent role="group" align={align} side={side} sideOffset={sideOffset} shadow={shadow} radius={radius} collisionPadding={collisionPadding} onOpenAutoFocus={() => focusAt(0, firstFocus.current ?? initialFocus)} className={cn("max-w-[calc(100vw-16px)] p-1", contentClassName)}>
      <div id={`${id}-menu`}>{renderPanel(panels[0], 0)}</div>
    </MorphPopoverContent>
    <AnimatePresence>{open && panels.slice(1).map((panel, index) => { const level = index + 1; return <DropdownFlyout key={panel.keyPrefix} shadow={shadow} anchor={() => panelRefs.current[level - 1]?.querySelector<HTMLButtonElement>(`[data-item-id="${CSS.escape(panel.parentId ?? "")}"]`) ?? null} onReady={() => { if (focusRequest.current === level) { focusAt(level); focusRequest.current = null; } }}>{renderPanel(panel, level)}</DropdownFlyout>; })}</AnimatePresence>
  </MorphPopover>;
}
