"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import {
	MorphPopover,
	MorphPopoverContent,
	MorphPopoverTrigger,
} from "@/components/motion/popover-morph";
import { SPRING_PRESS } from "@/lib/ease";
import { useOnOpen } from "@/lib/hooks/use-on-open";
import { useRowCursor } from "@/lib/hooks/use-row-cursor";
import { cn } from "@/lib/utils";

export type SelectorOption = {
	id: string;
	name: string;
	description?: string;
	group?: string;
	metadata?: string;
	keywords?: string[];
	icon?: ReactNode;
	preview?: ReactNode;
	details?: ReactNode;
	disabled?: boolean;
};

/** Optional Tailwind overrides, merged after each slot's defaults. */
export type SelectorClassNames = {
	trigger?: string;
	content?: string;
	list?: string;
	option?: string;
	icon?: string;
	search?: string;
	details?: string;
};

type SharedSelectorProps = {
	options: SelectorOption[];
	defaultOpen?: boolean;
	placeholder?: string;
	searchPlaceholder?: string;
	label?: string;
	triggerVariant?: "pill" | "field" | "workspace";
	layout?: "list" | "grid";
	action?: { label: string; onSelect: () => void };
	className?: string;
	/** Style individual parts independently; className styles the outer wrapper. */
	classNames?: SelectorClassNames;
};

export type SelectorProps = SharedSelectorProps & (
	| {
			multiple?: false;
			value?: string;
			defaultValue?: string;
			onValueChange?: (value: string) => void;
		}
	| {
			multiple: true;
			value?: string[];
			defaultValue?: string[];
			onValueChange?: (value: string[]) => void;
		}
);


const SCROLLBAR_CLASS =
	"[scrollbar-width:thin] [scrollbar-gutter:stable] [scrollbar-color:color-mix(in_oklab,var(--foreground)_18%,transparent)_transparent] hover:[scrollbar-color:color-mix(in_oklab,var(--foreground)_30%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb:hover]:bg-foreground/30";

export function Selector(props: SelectorProps) {
	const {
		options,
		defaultOpen = false,
		placeholder = "Select an option",
		searchPlaceholder = "Search options",
		label = "Options",
		triggerVariant = "field",
		layout = "list",
		action,
		className,
		classNames,
	} = props;
	const uid = useId();
	const reduce = useReducedMotion();
	const [internalValue, setInternalValue] = useState<string | string[]>(() =>
		props.defaultValue ?? (props.multiple ? [] : options.find((option) => !option.disabled)?.id ?? ""),
	);
	const currentValue = props.value ?? internalValue;
	const latestValue = useRef(currentValue);
	useLayoutEffect(() => {
		latestValue.current = currentValue;
	});
	const selectedIds = new Set(Array.isArray(currentValue) ? currentValue : [currentValue]);
	const selectedOptions = options.filter((option) => !option.disabled && selectedIds.has(option.id));
	const selected = selectedOptions[0];
	const [open, setOpen] = useState(defaultOpen);
	const [query, setQuery] = useState("");
	const listRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const detailRef = useRef<HTMLElement>(null);
	const detailAnchor = useRef<HTMLElement | null>(null);
	const detailTimer = useRef<number | undefined>(undefined);
	const touchInteraction = useRef(false);
	const [detailId, setDetailId] = useState<string | null>(null);
	const [detailPosition, setDetailPosition] = useState({ top: 12, left: 12 });
	const groups = useMemo(() => {
		const result = new Map<string, SelectorOption[]>();
		const search = query.trim().toLowerCase();
		for (const option of options) {
			if (![option.name, option.description, option.group, option.metadata, ...(option.keywords ?? [])]
				.filter(Boolean).join(" ").toLowerCase().includes(search)) continue;
			const group = option.group ?? "";
			const items = result.get(group) ?? [];
			items.push(option);
			result.set(group, items);
		}
		return Array.from(result, ([label, items]) => ({ label, items }));
	}, [options, query]);
	const rows = useMemo(() => groups.flatMap((group) => group.items).filter((option) => !option.disabled), [groups]);
	const { activeIndex, moveTo, moveActive } = useRowCursor(rows, query);
	const active = rows[activeIndex];
	const detail = open ? rows.find((option) => option.id === detailId && option.details != null) : undefined;

	const clearDetailTimer = () => {
		window.clearTimeout(detailTimer.current);
		detailTimer.current = undefined;
	};
	const hideDetail = () => {
		clearDetailTimer();
		setDetailId(null);
	};
	const scheduleDetailClose = () => {
		clearDetailTimer();
		detailTimer.current = window.setTimeout(() => setDetailId(null), 100);
	};
	const showDetail = (option: SelectorOption, anchor: HTMLElement) => {
		clearDetailTimer();
		if (option.disabled || option.details == null || touchInteraction.current) {
			setDetailId(null);
			return;
		}
		if (detailId === option.id) return;
		setDetailId(null);
		detailTimer.current = window.setTimeout(() => {
			detailAnchor.current = anchor;
			setDetailId(option.id);
		}, 1500);
	};
	useEffect(() => {
		if (!open || rows.length === 0) window.clearTimeout(detailTimer.current);
		return () => window.clearTimeout(detailTimer.current);
	}, [open, rows]);
	useLayoutEffect(() => {
		if (!detail) return;
		const place = () => {
			const rect = detailAnchor.current?.getBoundingClientRect();
			const card = detailRef.current;
			if (!rect || !card) return;
			const rightSpace = window.innerWidth - rect.right - 20;
			const leftSpace = rect.left - 20;
			const left = rightSpace >= card.offsetWidth || rightSpace >= leftSpace
				? rect.right + 8 : rect.left - card.offsetWidth - 8;
			setDetailPosition({
				left: Math.max(12, Math.min(left, window.innerWidth - card.offsetWidth - 12)),
				top: Math.max(12, Math.min(rect.top, window.innerHeight - card.offsetHeight - 12)),
			});
		};
		place();
		const observer = new ResizeObserver(place);
		if (detailRef.current) observer.observe(detailRef.current);
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
		};
	}, [detail]);
	useOnOpen(open, () => {
		setQuery("");
		setDetailId(null);
		moveTo(selected?.id ?? null);
	});
	useEffect(() => {
		if (!open) return;
		const frame = requestAnimationFrame(() => {
			listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
				?.scrollIntoView({ block: "nearest" });
		});
		return () => cancelAnimationFrame(frame);
	}, [open, activeIndex]);

	const changeOpen = (next: boolean) => {
		setOpen(next);
		if (!next) {
			hideDetail();
			setQuery("");
		}
	};
	const close = () => {
		changeOpen(false);
		triggerRef.current?.focus();
	};
	const select = (option: SelectorOption) => {
		if (option.disabled) return;
		if (props.multiple) {
			const liveValue = props.value ?? latestValue.current;
			const liveIds = Array.isArray(liveValue) ? liveValue : [];
			const enabledIds = liveIds.filter((id) => options.some((item) => item.id === id && !item.disabled));
			const next = enabledIds.includes(option.id)
				? enabledIds.filter((id) => id !== option.id)
				: [...enabledIds, option.id];
			if (props.value === undefined) {
				latestValue.current = next;
				setInternalValue(next);
			}
			props.onValueChange?.(next);
			hideDetail();
		} else {
			if (props.value === undefined) setInternalValue(option.id);
			props.onValueChange?.(option.id);
			close();
		}
	};
	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.nativeEvent.isComposing) return;
		touchInteraction.current = false;
		if (event.key !== "Tab") hideDetail();
		if (event.key === "Escape") {
			event.preventDefault();
			close();
		} else if (event.target !== inputRef.current &&
			!(event.target instanceof HTMLElement && event.target.getAttribute("role") === "option")) {
			return;
		} else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			moveActive(event.key === "ArrowDown" ? 1 : -1);
		} else if (event.key === "PageDown" || event.key === "PageUp") {
			event.preventDefault();
			for (let step = 0; step < 12; step++) moveActive(event.key === "PageDown" ? 1 : -1);
		} else if (event.key === "Enter" && active) {
			event.preventDefault();
			select(active);
		}
	};

	return (
		<MorphPopover open={open} onOpenChange={changeOpen} className={cn("max-w-full", triggerVariant === "pill" ? "w-auto" : "w-64", className)}>
			<div className={cn("w-full border border-border bg-background shadow-sm", triggerVariant === "pill" ? "rounded-3xl" : "rounded-xl")}>
				<MorphPopoverTrigger>
					<button
						type="button"
						ref={triggerRef}
						className={cn("flex min-h-11 w-full items-center gap-2 rounded-[inherit] px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring", classNames?.trigger)}
					>
						{selected?.icon != null ? <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted", classNames?.icon)}>{selected.icon}</span> : null}
						<span className="min-w-0 flex-1">
							<span className={cn("block truncate font-medium", !selected && "text-muted-foreground")}>
								{props.multiple ? (selectedOptions.length ? `${selectedOptions.length} selected` : placeholder) : selected?.name ?? placeholder}
							</span>
							{triggerVariant === "workspace" && selected?.description ? <span className="block truncate text-xs text-muted-foreground">{selected.description}</span> : null}
						</span>
						<motion.span
							aria-hidden
							initial={false}
							animate={{ rotate: open ? 180 : 0 }}
							transition={reduce ? { duration: 0 } : SPRING_PRESS}
							className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
						>
							<ChevronDown className="size-4" />
						</motion.span>
					</button>
				</MorphPopoverTrigger>
				{props.multiple && selectedOptions.length ? (
					<div className="flex flex-wrap gap-1.5 px-2.5 pb-2.5">
						{selectedOptions.map((option) => (
							<span key={option.id} className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-muted/60 py-0.5 pr-0.5 pl-2 text-xs">
								<span className="truncate">{option.name}</span>
								<button type="button" aria-label={`Remove ${option.name}`} onClick={() => { select(option); triggerRef.current?.focus(); }} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden className="size-3" /></button>
							</span>
						))}
					</div>
				) : null}
			</div>
			<MorphPopoverContent align="start" sideOffset={6} radius={16} onOpenAutoFocus={() => inputRef.current?.focus()} className={cn("flex w-[22rem] max-w-[calc(100vw-24px)] flex-col bg-background text-sm text-foreground", classNames?.content)}>
				<div className="shrink-0 p-2 pb-1">
					<div className={cn("flex h-10 items-center gap-2 rounded-lg bg-muted/60 px-3", classNames?.search)}>
						<Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
						<input ref={inputRef} onKeyDown={onKeyDown} value={query} onChange={(event) => { hideDetail(); setQuery(event.target.value); }} role="combobox" aria-label={searchPlaceholder} aria-expanded="true" aria-autocomplete="list" aria-controls={`${uid}-options`} aria-activedescendant={active ? `${uid}-option-${activeIndex}` : undefined} placeholder={searchPlaceholder} className="h-full min-w-0 flex-1 bg-transparent text-[inherit] outline-none placeholder:text-muted-foreground" />
						{query ? <button type="button" aria-label="Clear search" onClick={() => { hideDetail(); setQuery(""); inputRef.current?.focus(); }} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden className="size-4" /></button> : <kbd className="text-[10px] text-muted-foreground">ESC</kbd>}
					</div>
				</div>
				<div ref={listRef} id={`${uid}-options`} role="listbox" aria-label={label} aria-multiselectable={props.multiple || undefined} onScroll={hideDetail} className={cn("max-h-[min(360px,calc(100dvh-176px))] min-h-0 overflow-y-auto overscroll-contain p-2", SCROLLBAR_CLASS, classNames?.list)}>
					{groups.length ? groups.map((group) => (
						<fieldset key={group.label} className="mb-2 min-w-0 border-0 p-0 last:mb-0">
							{group.label ? <legend className="px-2 py-2 text-[11px] font-medium text-muted-foreground">{group.label}</legend> : null}
							<div className={cn(layout === "grid" ? "grid grid-cols-2 gap-2" : "space-y-0.5")}>
								{group.items.map((option) => {
									const index = rows.indexOf(option);
									const isActive = active?.id === option.id;
									const isSelected = !option.disabled && selectedIds.has(option.id);
									return (
										<button key={option.id} id={index >= 0 ? `${uid}-option-${index}` : undefined} type="button" role="option" aria-selected={isSelected} aria-disabled={option.disabled || undefined} disabled={option.disabled} data-index={index >= 0 ? index : undefined} onKeyDown={onKeyDown} tabIndex={-1} aria-describedby={detail?.id === option.id ? `${uid}-details` : undefined}
											onPointerEnter={(event) => { touchInteraction.current = event.pointerType === "touch"; if (touchInteraction.current || option.disabled) return; moveTo(option.id); showDetail(option, event.currentTarget); }}
											onPointerDown={(event) => { touchInteraction.current = event.pointerType === "touch"; if (touchInteraction.current) hideDetail(); }} onPointerLeave={scheduleDetailClose}
											onFocus={(event) => { if (option.disabled) return; moveTo(option.id); showDetail(option, event.currentTarget); }} onBlur={scheduleDetailClose} onClick={() => select(option)}
											className={cn("relative flex min-h-12 w-full gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40", layout === "grid" ? "flex-col items-stretch border border-border" : "items-center", layout === "grid" && isSelected && "border-foreground", isActive && "bg-muted/70", classNames?.option)}>
											{layout === "grid" ? <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-muted/60 text-muted-foreground">{option.preview ?? option.icon ?? <span className="text-2xl font-medium">{option.name.slice(0, 1)}</span>}</div> : <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground", classNames?.icon)}>{option.icon ?? <span className="text-xs font-medium">{option.name.slice(0, 1)}</span>}</span>}
											<span className="flex min-w-0 flex-1 items-center gap-2">
												<span className="min-w-0 flex-1"><span className="block truncate font-medium">{option.name}</span>{option.description ? <span className="block truncate text-xs text-muted-foreground">{option.description}</span> : null}</span>
												{option.metadata ? <span className="shrink-0 text-[10px] text-muted-foreground">{option.metadata}</span> : null}
												<span aria-hidden className={cn("flex size-4 shrink-0 items-center justify-center", props.multiple && "rounded border border-border", props.multiple && isSelected && "border-foreground bg-foreground text-background")}>{isSelected ? <Check className="size-3.5" /> : null}</span>
											</span>
										</button>
									);
								})}
							</div>
						</fieldset>
					)) : <p className="px-3 py-8 text-center text-sm text-muted-foreground">No options found.</p>}
				</div>
				<div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
					<span className="flex flex-wrap gap-x-3 gap-y-1">{props.multiple ? <span>{selectedOptions.length} selected</span> : <><span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span></>}</span>
					<div className="flex items-center gap-2">
						{action ? <button type="button" onClick={() => { close(); action.onSelect(); }} className="rounded-md px-2 py-1 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{action.label}</button> : null}
						{props.multiple ? <button type="button" onClick={close} className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background focus-visible:outline-2 focus-visible:outline-ring">Done</button> : null}
					</div>
				</div>
			</MorphPopoverContent>
			{detail ? createPortal(
				<aside ref={detailRef} id={`${uid}-details`} aria-label="Option details" onKeyDown={onKeyDown} onPointerEnter={clearDetailTimer} onPointerLeave={scheduleDetailClose} onPointerDown={(event) => event.stopPropagation()} onFocus={clearDetailTimer} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleDetailClose(); }} className={cn("fixed z-[10000] max-h-[min(420px,70dvh)] w-[21rem] max-w-[calc(100vw-24px)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-4 text-sm text-foreground shadow-xl", SCROLLBAR_CLASS, classNames?.details)} style={{ ...detailPosition, backgroundColor: "var(--background)" }}>{detail.details}</aside>, document.body,
			) : null}
		</MorphPopover>
	);
}
