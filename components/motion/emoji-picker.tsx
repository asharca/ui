"use client";

import { Apple, Clock, Flag, Hash, Lightbulb, PawPrint, Plane, Search, Smile, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { DigitSwap } from "@/components/motion/digit-swap";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "@/components/motion/popover-morph";
import { SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
  tags?: string[];
  /** Exact fully-qualified Unicode sequences keyed by tone 1–5. */
  tones?: Record<string, string>;
}
export interface EmojiSelection { emoji: string; name: string }
export type EmojiSkinTone = 0 | 1 | 2 | 3 | 4 | 5;
export interface EmojiPickerProps {
  onSelect: (selection: EmojiSelection) => void;
  /** Defaults to a lazy, bundled Unicode 16 dataset. Custom loaders may reject. */
  loadEmoji?: () => Promise<EmojiEntry[]>;
  skinTone?: EmojiSkinTone;
  defaultSkinTone?: EmojiSkinTone;
  onSkinToneChange?: (tone: EmojiSkinTone) => void;
  recent?: string[];
  defaultRecent?: string[];
  onRecentChange?: (recent: string[]) => void;
  /** Optional local persistence; no browser storage is touched without a key. */
  storageKey?: string;
  /** Return false to suppress an unsupported glyph using a host font detector. */
  isEmojiSupported?: (emoji: string) => boolean;
  className?: string;
}

const TONES = ["Default", "Light", "Medium-light", "Medium", "Medium-dark", "Dark"];
const TONE_COLORS = ["#ffc83d", "#f7dece", "#f3d2a2", "#d5ab88", "#af7e57", "#7c533e"];
const CATEGORY_LABELS: Record<string, string> = { "Smileys & Emotion": "Smileys", "People & Body": "People", "Animals & Nature": "Animals", "Food & Drink": "Food", "Travel & Places": "Travel" };
const CATEGORY_ICONS = { Recent: Clock, "Smileys & Emotion": Smile, "People & Body": Users, "Animals & Nature": PawPrint, "Food & Drink": Apple, "Travel & Places": Plane, Activities: Trophy, Objects: Lightbulb, Symbols: Hash, Flags: Flag };
function CategoryIcon({ name }: { name: string }) { const Icon = CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS] ?? Smile; return <Icon aria-hidden className="size-4" />; }
// The public picker requires first-open loading: a static import would eagerly
// ship the entire Unicode table even when no picker has ever been opened.
const defaultLoader = () => import("./emoji-picker-data").then(module => module.emojiData);

/** Creates a cached font probe only in real canvas-capable browsers. */
function createGlyphDetector() {
  let context: CanvasRenderingContext2D | null = null;
  try { context = document.createElement("canvas").getContext("2d", { willReadFrequently: true }); } catch { /* Canvas-less renderers retain the Unicode set. */ }
  if (!context) return (_emoji: string) => true;
  const canvas = context.canvas;
  canvas.width = 64;
  canvas.height = 40;
  context.font = "28px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  context.textBaseline = "top";
  context.fillText("\u{10ffff}", 0, 0);
  const missing = context.getImageData(0, 0, 64, 40).data;
  const cache = new Map<string, boolean>();
  return (emoji: string) => {
    const cached = cache.get(emoji);
    if (cached !== undefined) return cached;
    context.clearRect(0, 0, 64, 40);
    context.fillText(emoji, 0, 0);
    const pixels = context.getImageData(0, 0, 64, 40).data;
    const supported = pixels.some((value, index) => value !== missing[index]) && context.measureText(emoji).width < 56;
    cache.set(emoji, supported);
    return supported;
  };
}

/** Inline picker: search, scroll-synchronized categories, exact skin tones and roving keyboard focus. */
export function EmojiPicker({ onSelect, loadEmoji = defaultLoader, skinTone, defaultSkinTone = 0, onSkinToneChange, recent, defaultRecent = [], onRecentChange, storageKey, isEmojiSupported, className }: EmojiPickerProps) {
  const id = useId();
  const canHover = useHoverCapable();
  const reduce = useReducedMotion();
  const [entries, setEntries] = useState<EmojiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [request, setRequest] = useState({ loadEmoji, isEmojiSupported });
  if (request.loadEmoji !== loadEmoji || request.isEmojiSupported !== isEmojiSupported) setRequest({ loadEmoji, isEmojiSupported });
  const [query, setQuery] = useState("");
  const [internalTone, setInternalTone] = useState(defaultSkinTone);
  const [internalRecent, setInternalRecent] = useState(defaultRecent);
  const [activeCategory, setActiveCategory] = useState("");
  const [preview, setPreview] = useState<EmojiSelection | null>(null);
  const [toneOpen, setToneOpen] = useState(false);
  const toneControl = useRef<HTMLDivElement>(null);
  const toneTrigger = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const supportDetector = useRef<((emoji: string) => boolean) | null>(null);
  const tone = skinTone ?? internalTone;
  const recents = recent ?? internalRecent;
  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(false);
    Promise.resolve().then(request.loadEmoji).then(data => {
      if (!live) return;
      const supports = request.isEmojiSupported ?? createGlyphDetector();
      supportDetector.current = supports;
      setEntries(data.filter(entry => supports(entry.emoji)));
      setLoading(false);
    }).catch(() => { if (live) { setError(true); setLoading(false); } });
    return () => { live = false; };
  }, [request]);
  useEffect(() => {
    if (!toneOpen) return;
    const dismiss = (event: PointerEvent) => { if (!toneControl.current?.contains(event.target as Node)) setToneOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [toneOpen]);
  useEffect(() => {
    if (!storageKey || recent !== undefined) return;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(saved) && saved.every(value => typeof value === "string")) setInternalRecent(saved.slice(0, 24));
    } catch { /* Private mode or corrupt history does not prevent picking. */ }
  }, [storageKey, recent]);
  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const groups = new Map<string, EmojiSelection[]>();
    if (!normalizedQuery && recents.length) {
      const recentEntries = recents.flatMap(emoji => {
        const entry = entries.find(candidate => candidate.emoji === emoji || Object.values(candidate.tones ?? {}).includes(emoji));
        return entry && supportDetector.current?.(emoji) !== false ? [{ emoji, name: entry.name }] : [];
      });
      if (recentEntries.length) groups.set("Recent", recentEntries);
    }
    for (const entry of entries) {
      if (normalizedQuery && !`${entry.name} ${entry.tags?.join(" ") ?? ""} ${entry.emoji}`.toLocaleLowerCase().includes(normalizedQuery)) continue;
      const emoji = entry.tones?.[tone] ?? entry.emoji;
      if (supportDetector.current?.(emoji) === false) continue;
      const group = groups.get(entry.category) ?? [];
      group.push({ emoji, name: entry.name });
      groups.set(entry.category, group);
    }
    return Array.from(groups, ([name, values]) => ({ name, values }));
  }, [entries, query, recents, tone]);
  const select = (selection: EmojiSelection) => {
    const next = [selection.emoji, ...recents.filter(emoji => emoji !== selection.emoji)].slice(0, 24);
    if (recent === undefined) setInternalRecent(next);
    onRecentChange?.(next);
    if (storageKey) { try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Storage is optional, selection is not. */ } }
    onSelect(selection);
  };
  const synchronizeCategory = useCallback(() => {
    const root = scroller.current;
    if (!root) return;
    const rootTop = root.getBoundingClientRect().top;
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-emoji-category]"));
    const visible = panels.find(panel => panel.getBoundingClientRect().bottom > rootTop + 35);
    if (visible) setActiveCategory(visible.dataset.emojiCategory ?? "");
  }, []);
  const navigateGrid = (event: KeyboardEvent<HTMLButtonElement>) => {
    const buttons = Array.from(scroller.current?.querySelectorAll<HTMLButtonElement>("[data-emoji-choice]") ?? []);
    const index = buttons.indexOf(event.currentTarget);
    let next = index;
    if (event.key === "ArrowRight") next++;
    else if (event.key === "ArrowLeft") next--;
    else if (event.key === "ArrowDown") next += 8;
    else if (event.key === "ArrowUp") next -= 8;
    else if (event.key === "Home") next = event.ctrlKey ? 0 : index - index % 8;
    else if (event.key === "End") next = event.ctrlKey ? buttons.length - 1 : index + 7 - index % 8;
    else if (event.key === "Escape") { search.current?.focus(); return; }
    else return;
    event.preventDefault();
    buttons[Math.max(0, Math.min(next, buttons.length - 1))]?.focus();
  };
  const selectedCategory = sections.some(section => section.name === activeCategory) ? activeCategory : sections[0]?.name;
  return <section className={cn("w-[338px] max-w-full overflow-hidden rounded-3xl border border-border bg-background text-foreground", className)} aria-label="Emoji picker" onKeyDown={event => { if (toneOpen && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setToneOpen(false); toneTrigger.current?.focus(); } }}>
    <div className="p-2 pb-1"><div className="relative h-10 rounded-full border border-border"><Search aria-hidden className="absolute left-3 top-3 size-4 text-muted-foreground" /><input ref={search} aria-label="Search emoji" placeholder="Search emoji" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); scroller.current?.querySelector<HTMLButtonElement>("[data-emoji-choice]")?.focus(); } }} className="h-full w-full min-w-0 rounded-full bg-transparent pl-10 pr-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div></div>
    <div className="px-2"><div role="tablist" aria-label="Emoji categories" className="inline-flex w-full items-center gap-1 rounded-full bg-muted p-0.5">{sections.map((section, index) => <button key={section.name} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selectedCategory === section.name} tabIndex={selectedCategory === section.name ? 0 : -1} title={CATEGORY_LABELS[section.name] ?? section.name} aria-label={CATEGORY_LABELS[section.name] ?? section.name} onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]") ?? []); const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; tabs[next]?.focus(); tabs[next]?.click(); }} onClick={() => { setActiveCategory(section.name); const panel = document.getElementById(`${id}-panel-${index}`); if (panel && scroller.current) scroller.current.scrollTo({ top: panel.getBoundingClientRect().top - scroller.current.getBoundingClientRect().top + scroller.current.scrollTop, behavior: reduce ? "instant" : "smooth" }); }} className={cn("grid h-8 min-w-0 flex-1 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", selectedCategory === section.name && "bg-background text-foreground shadow-sm")}><CategoryIcon name={section.name} /></button>)}</div></div>
    <div ref={scroller} onScroll={synchronizeCategory} className="relative h-64 overflow-y-auto overscroll-contain px-2">
      {loading && <p role="status" className="p-4 text-sm text-muted-foreground">Loading emoji…</p>}
      {error && <div role="alert" className="p-4 text-sm"><p>Emoji could not be loaded.</p><button type="button" onClick={() => setRequest(current => ({ ...current }))} className="mt-2 cursor-pointer underline">Try again</button></div>}
      {!loading && !error && sections.length === 0 && <div className="p-4 text-sm text-muted-foreground"><p role="status">No emoji found.</p>{query && <button type="button" onClick={() => { setQuery(""); search.current?.focus(); }} className="mt-2 cursor-pointer text-foreground underline">Clear search</button>}</div>}
      {sections.map((section, index) => <section key={section.name} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} data-emoji-category={section.name}><h3 className="sticky top-0 z-10 bg-background/95 px-1 py-2 text-xs font-medium text-muted-foreground">{CATEGORY_LABELS[section.name] ?? section.name}</h3><div className="grid grid-cols-8">{section.values.map((selection, selectionIndex) => <button type="button" key={selection.emoji} data-emoji-choice="" aria-label={selection.name} title={selection.name} tabIndex={index === 0 && selectionIndex === 0 ? 0 : -1} onFocus={event => { for (const button of scroller.current?.querySelectorAll<HTMLButtonElement>("[data-emoji-choice][tabindex='0']") ?? []) button.tabIndex = -1; event.currentTarget.tabIndex = 0; setPreview(selection); event.currentTarget.scrollIntoView?.({ block: "nearest" }); }} onPointerEnter={canHover ? () => setPreview(selection) : undefined} onKeyDown={navigateGrid} onClick={() => select(selection)} className="flex size-10 min-w-0 cursor-pointer items-center justify-center justify-self-center rounded-full text-2xl leading-none outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring">{selection.emoji}</button>)}</div></section>)}
    </div>
    <div className="flex items-center gap-2 border-t border-border px-3 py-2"><div className="flex min-w-0 flex-1 items-center gap-3"><span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center text-3xl leading-none">{preview?.emoji ?? "🙂"}</span><span className="min-w-0 truncate text-sm">{preview?.name ?? "Pick an emoji"}</span></div><div ref={toneControl} className="relative flex items-center"><AnimatePresence initial={false}>{toneOpen && <motion.fieldset aria-label="Skin tone" initial={reduce ? false : { opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduce ? 1 : .9 }} transition={{ duration: reduce ? 0 : .15 }} className="absolute right-0 z-20 flex items-center gap-1 rounded-full border border-border bg-background p-1" onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const choices = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button")); const current = choices.indexOf(document.activeElement as HTMLButtonElement); const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + choices.length) % choices.length; choices[next]?.focus(); }}>{TONES.map((name, index) => <button key={name} type="button" aria-label={name} aria-pressed={tone === index} onClick={() => { const next = index as EmojiSkinTone; if (skinTone === undefined) setInternalTone(next); onSkinToneChange?.(next); setToneOpen(false); toneTrigger.current?.focus(); }} className={cn("grid size-7 shrink-0 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring", tone === index && "bg-muted")}><span aria-hidden className="size-4 rounded-full ring-1 ring-foreground/15" style={{ backgroundColor: TONE_COLORS[index] }} /></button>)}</motion.fieldset>}</AnimatePresence><button ref={toneTrigger} type="button" aria-label={`Skin tone: ${TONES[tone]}`} aria-expanded={toneOpen} tabIndex={toneOpen ? -1 : 0} onClick={() => setToneOpen(value => !value)} className={cn("grid size-9 shrink-0 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring", toneOpen && "pointer-events-none opacity-0")}><span aria-hidden className="size-4 rounded-full ring-1 ring-foreground/15" style={{ backgroundColor: TONE_COLORS[tone] }} /></button></div></div>
  </section>;
}

export interface EmojiReaction extends EmojiSelection { count: number; selected?: boolean }
export interface MessageReactionsProps {
  reactions?: EmojiReaction[];
  defaultReactions?: EmojiReaction[];
  onReactionsChange?: (reactions: EmojiReaction[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  pickerProps?: Omit<EmojiPickerProps, "onSelect">;
  className?: string;
}

/** Counts represent the host's snapshot; selection changes are emitted without invented network work. */
export function MessageReactions({ reactions, defaultReactions = [], onReactionsChange, open: controlledOpen, onOpenChange, pickerProps, className }: MessageReactionsProps) {
  const [internal, setInternal] = useState(defaultReactions);
  const [internalOpen, setInternalOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const current = reactions ?? internal;
  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setInternalOpen(next); onOpenChange?.(next); };
  const toggle = (selection: EmojiSelection) => {
    const existing = current.find(reaction => reaction.emoji === selection.emoji);
    const next = existing ? current.map(reaction => reaction.emoji === selection.emoji ? { ...reaction, selected: !reaction.selected, count: Math.max(0, reaction.count + (reaction.selected ? -1 : 1)) } : reaction).filter(reaction => reaction.count > 0) : [...current, { ...selection, count: 1, selected: true }];
    if (reactions === undefined) setInternal(next);
    onReactionsChange?.(next);
  };
  return <fieldset className={cn("m-0 min-w-0 border-0 p-0 flex flex-wrap items-center gap-2", className)} aria-label="Message reactions">
    <AnimatePresence initial={false}>{current.filter(reaction => reaction.count > 0).map(reaction => <PresenceGate key={reaction.emoji}>{({ gate }) => <motion.button {...gate} type="button" layout={!reduce} initial={reduce ? false : { opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: .6 }} transition={SPRING_LAYOUT} whileTap={reduce ? undefined : { scale: .94, transition: SPRING_PRESS }} aria-label={`${reaction.name}: ${reaction.count} reactions`} aria-pressed={Boolean(reaction.selected)} onClick={() => toggle(reaction)} className={cn("inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring", reaction.selected ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground")}><span aria-hidden="true">{reaction.emoji}</span><DigitSwap value={reaction.count} /></motion.button>}</PresenceGate>)}</AnimatePresence>
    <MorphPopover open={open} onOpenChange={setOpen}><MorphPopoverTrigger><button ref={trigger} type="button" aria-label="Add reaction" className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">☺<span aria-hidden="true">+</span></button></MorphPopoverTrigger><MorphPopoverContent align="start" className="max-w-[calc(100vw-16px)] border-0" onOpenAutoFocus={content => content.querySelector<HTMLInputElement>("input")?.focus()}><EmojiPicker {...pickerProps} onSelect={selection => { toggle(selection); setOpen(false); trigger.current?.focus(); }} /></MorphPopoverContent></MorphPopover>
  </fieldset>;
}
