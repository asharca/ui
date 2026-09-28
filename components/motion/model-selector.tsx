"use client";

import { Check, ChevronDown, Pin, Search, X } from "lucide-react";
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
import { useRowCursor } from "@/lib/hooks/use-row-cursor";
import { useOnOpen } from "@/lib/hooks/use-on-open";
import { cn } from "@/lib/utils";

export type ModelOption = {
	id: string;
	name: string;
	provider: string;
	description?: string;
	context?: string;
	tags?: string[];
	pinned?: boolean;
	recent?: boolean;
	icon?: ReactNode;
	preview?: ReactNode;
};

export type ModelSelectorSize = "sm" | "md" | "lg";

export interface ModelSelectorProps {
	models: ModelOption[];
	value?: string;
	defaultValue?: string;
	defaultOpen?: boolean;
	onValueChange?: (model: ModelOption) => void;
	placeholder?: string;
	/** Trigger, picker and detail card size. Defaults to "md". */
	size?: ModelSelectorSize;
	className?: string;
}

type ModelGroup = { label: string; items: ModelOption[] };

const SIZE_CLASS = {
	sm: {
		trigger: "h-9 gap-1.5 px-2.5 text-xs",
		panel:
			"h-[min(360px,calc(100dvh-24px))] w-[min(320px,calc(100vw-24px))] text-xs",
		row: "h-7 gap-1.5 px-2 text-xs",
		icon: "size-5",
		search: "h-9 px-2.5",
		detail: "w-[min(280px,calc(100vw-24px))] p-3 text-xs",
	},
	md: {
		trigger: "h-11 gap-2 px-3 text-sm",
		panel:
			"h-[min(440px,calc(100dvh-24px))] w-[min(400px,calc(100vw-24px))] text-xs",
		row: "h-8 gap-2 px-2 text-xs",
		icon: "size-6",
		search: "h-10 px-3",
		detail: "w-[min(336px,calc(100vw-24px))] p-3 text-xs",
	},
	lg: {
		trigger: "h-13 gap-2.5 px-4 text-base",
		panel:
			"h-[min(520px,calc(100dvh-24px))] w-[min(480px,calc(100vw-24px))] text-sm",
		row: "h-10 gap-2.5 px-3 text-sm",
		icon: "size-7",
		search: "h-12 px-4",
		detail: "w-[min(384px,calc(100vw-24px))] p-4 text-sm",
	},
};

const SCROLLBAR_CLASS =
	"[scrollbar-width:thin] [scrollbar-gutter:stable] [scrollbar-color:color-mix(in_oklab,var(--foreground)_18%,transparent)_transparent] hover:[scrollbar-color:color-mix(in_oklab,var(--foreground)_30%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb:hover]:bg-foreground/30";

function modelMatches(model: ModelOption, query: string) {
	return [
		model.name,
		model.provider,
		model.description,
		model.context,
		...(model.tags ?? []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase()
		.includes(query.trim().toLowerCase());
}

export function ModelSelector({
	models,
	value,
	defaultValue,
	defaultOpen = false,
	onValueChange,
	placeholder = "Select a model",
	size = "md",
	className,
}: ModelSelectorProps) {
	const uid = useId();
	const sizes = SIZE_CLASS[size];
	const [internalValue, setInternalValue] = useState(
		defaultValue ?? models[0]?.id ?? "",
	);
	const [open, setOpen] = useState(defaultOpen);
	const listRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const detailRef = useRef<HTMLElement>(null);
	const detailAnchor = useRef<HTMLElement | null>(null);
	const detailTimer = useRef<number | undefined>(undefined);
	const [detailId, setDetailId] = useState<string | null>(null);
	const [detailPosition, setDetailPosition] = useState({ top: 12, left: 12 });
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const selectedId = value ?? internalValue;
	const selected = models.find((model) => model.id === selectedId);
	const filtered = useMemo(
		() => models.filter((model) => modelMatches(model, query)),
		[models, query],
	);
	const groups = useMemo<ModelGroup[]>(() => {
		const result: ModelGroup[] = [];
		const add = (label: string, items: ModelOption[]) => {
			if (items.length) result.push({ label, items });
		};
		add(
			"Pinned",
			filtered.filter((model) => model.pinned),
		);
		add(
			"Recent",
			filtered.filter((model) => model.recent && !model.pinned),
		);
		const providers = new Map<string, ModelOption[]>();
		for (const model of filtered.filter(
			(item) => !item.pinned && !item.recent,
		)) {
			const items = providers.get(model.provider) ?? [];
			items.push(model);
			providers.set(model.provider, items);
		}
		for (const [provider, items] of providers) add(provider, items);
		return result;
	}, [filtered]);
	const rows = useMemo(() => groups.flatMap((group) => group.items), [groups]);
	const { activeIndex, moveTo, moveActive } = useRowCursor(rows, query);
	const active = rows[activeIndex];
	const detail = open ? rows.find((model) => model.id === detailId) : undefined;
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
	const showDetail = (model: ModelOption, anchor: HTMLElement) => {
		clearDetailTimer();
		if (detailId === model.id) return;
		setDetailId(null);
		detailTimer.current = window.setTimeout(() => {
			detailAnchor.current = anchor;
			setDetailId(model.id);
		}, 1500);
	};
	useLayoutEffect(() => {
		if (!detail) return;
		const place = () => {
			const rect = detailAnchor.current?.getBoundingClientRect();
			const card = detailRef.current;
			if (!rect || !card) return;
			const rightSpace = window.innerWidth - rect.right - 20;
			const leftSpace = rect.left - 20;
			const left =
				rightSpace >= card.offsetWidth || rightSpace >= leftSpace
					? rect.right + 8
					: rect.left - card.offsetWidth - 8;
			setDetailPosition({
				left: Math.max(
					12,
					Math.min(left, window.innerWidth - card.offsetWidth - 12),
				),
				top: Math.max(
					12,
					Math.min(rect.top, window.innerHeight - card.offsetHeight - 12),
				),
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
	useEffect(
		() => () => {
			window.clearTimeout(detailTimer.current);
		},
		[],
	);
	useOnOpen(open, () => {
		setQuery("");
		setDetailId(null);
		moveTo(selectedId || null);
	});
	useEffect(() => {
		if (!open) return;
		const frame = requestAnimationFrame(() => {
			listRef.current
				?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
				?.scrollIntoView({ block: "nearest" });
		});
		return () => cancelAnimationFrame(frame);
	}, [open, activeIndex]);

	useEffect(() => {
		if (!open) return;
		const frame = requestAnimationFrame(() => inputRef.current?.focus());
		return () => cancelAnimationFrame(frame);
	}, [open]);

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
	const select = (model: ModelOption) => {
		if (value === undefined) setInternalValue(model.id);
		onValueChange?.(model);
		close();
	};
	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.nativeEvent.isComposing) return;
		if (event.key !== "Tab") hideDetail();
		if (event.key === "Escape") {
			event.preventDefault();
			close();
		} else if (
			event.target !== inputRef.current &&
			!(
				event.target instanceof HTMLElement &&
				event.target.getAttribute("role") === "option"
			)
		) {
			return;
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			moveActive(1);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			moveActive(-1);
		} else if (event.key === "PageDown" || event.key === "PageUp") {
			event.preventDefault();
			for (let step = 0; step < 12; step++) {
				moveActive(event.key === "PageDown" ? 1 : -1);
			}
		} else if (event.key === "Enter" && active) {
			event.preventDefault();
			select(active);
		}
	};

	return (
		<MorphPopover open={open} onOpenChange={changeOpen} className="w-full">
			<MorphPopoverTrigger>
				<button
					type="button"
					ref={triggerRef}
					className={cn(
						"flex w-full items-center rounded-xl border border-border bg-background text-left shadow-sm transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-ring",
						sizes.trigger,
						className,
					)}
				>
					<span
						className={cn(
							"flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
							sizes.icon,
						)}
					>
						{selected?.icon ?? (
							<span className="text-xs font-semibold">
								{selected?.name.slice(0, 1) ?? "M"}
							</span>
						)}
					</span>
					<span className="min-w-0 flex-1 truncate">
						<span className="block truncate font-medium">
							{selected?.name ?? placeholder}
						</span>
						{selected ? (
							<span className="block truncate text-xs text-muted-foreground">
								{selected.provider}
							</span>
						) : null}
					</span>
					<ChevronDown aria-hidden className="size-4 text-muted-foreground" />
				</button>
			</MorphPopoverTrigger>

			<MorphPopoverContent
				align="start"
				sideOffset={4}
				radius={12}
				className={cn("flex flex-col bg-card/95 backdrop-blur-xl", sizes.panel)}
			>
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<div
						className={cn(
							"flex shrink-0 items-center gap-2 border-b border-border",
							sizes.search,
						)}
					>
						<Search aria-hidden className="size-3.5 text-muted-foreground" />
						<input
							ref={inputRef}
							onKeyDown={onKeyDown}
							value={query}
							onChange={(event) => {
								hideDetail();
								setQuery(event.target.value);
							}}
							role="combobox"
							aria-label="Search models"
							aria-expanded="true"
							aria-controls={`${uid}-models`}
							aria-activedescendant={
								rows.length ? `${uid}-${activeIndex}` : undefined
							}
							placeholder="Search models or providers"
							className="h-7 min-w-0 flex-1 bg-transparent text-[inherit] leading-7 outline-none placeholder:text-muted-foreground"
						/>
						{query ? (
							<button
								type="button"
								aria-label="Clear model search"
								onClick={() => {
									setQuery("");
									inputRef.current?.focus();
								}}
								className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<X aria-hidden className="size-4" />
							</button>
						) : null}
						<kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
							ESC
						</kbd>
					</div>
					<div
						ref={listRef}
						id={`${uid}-models`}
						role="listbox"
						aria-label="Models"
						onScroll={hideDetail}
						className={cn(
							"min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2",
							SCROLLBAR_CLASS,
						)}
					>
						{rows.length ? (
							groups.map((group) => (
								<div key={group.label} className="mb-1 last:mb-0">
									<div className="flex h-8 items-center px-2 text-xs text-muted-foreground">
										{group.label}
									</div>
									{group.items.map((model) => {
										const index = rows.indexOf(model);
										const isActive = index === activeIndex;
										const isSelected = model.id === selectedId;
										return (
											<button
												key={model.id}
												id={`${uid}-${index}`}
												type="button"
												role="option"
												aria-selected={isSelected}
												data-index={index}
												onKeyDown={onKeyDown}
												tabIndex={-1}
												aria-describedby={
													detail?.id === model.id ? `${uid}-details` : undefined
												}
												onPointerEnter={(event) => {
													if (event.pointerType === "touch") return;
													moveTo(model.id);
													showDetail(model, event.currentTarget);
												}}
												onPointerLeave={scheduleDetailClose}
												onFocus={(event) => {
													moveTo(model.id);
													showDetail(model, event.currentTarget);
												}}
												onBlur={scheduleDetailClose}
												onClick={() => select(model)}
												className={cn(
													"relative my-0.5 flex w-full items-center rounded-[10px] text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
													sizes.row,
													isActive && "bg-muted/60",
													isSelected && "bg-muted/70 text-foreground",
												)}
											>
												{isSelected ? (
													<span
														aria-hidden
														className="absolute inset-y-[20%] left-0 w-0.5 rounded-full bg-primary"
													/>
												) : null}
												<span
													className={cn(
														"flex shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground",
														sizes.icon,
													)}
												>
													{model.icon ?? (
														<span className="text-xs font-semibold">
															{model.name.slice(0, 1)}
														</span>
													)}
												</span>
												<span className="min-w-0 flex-1 truncate">
													{model.name}
													{model.pinned || model.recent ? (
														<span className="ml-1.5 text-muted-foreground">
															· {model.provider}
														</span>
													) : null}
												</span>
												{model.pinned ? (
													<Pin
														aria-label="Pinned"
														className="size-3 shrink-0 -rotate-45 text-muted-foreground"
													/>
												) : null}
												{isSelected ? (
													<Check
														aria-label="Selected"
														className="size-4 text-primary"
													/>
												) : null}
											</button>
										);
									})}
								</div>
							))
						) : (
							<p className="px-3 py-10 text-center text-sm text-muted-foreground">
								No models found.
							</p>
						)}
					</div>
				</div>
			</MorphPopoverContent>
			{detail
				? createPortal(
						<aside
							ref={detailRef}
							id={`${uid}-details`}
							aria-label="Model details"
							onPointerEnter={clearDetailTimer}
							onPointerLeave={scheduleDetailClose}
							onPointerDown={(event) => event.stopPropagation()}
							className={cn(
								"fixed z-[10000] max-h-[min(420px,70dvh)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover shadow-xl",
								sizes.detail,
								SCROLLBAR_CLASS,
							)}
							style={detailPosition}
						>
							<p className="truncate text-sm font-medium">{detail.name}</p>
							<dl className="mt-3 space-y-1.5 border-t border-border pt-3 leading-5">
								<div className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-3">
									<dt className="text-muted-foreground">Provider</dt>
									<dd className="truncate">{detail.provider}</dd>
								</div>
								<div className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-3">
									<dt className="text-muted-foreground">Model ID</dt>
									<dd className="truncate font-mono" title={detail.id}>
										{detail.id}
									</dd>
								</div>
								{detail.context ? (
									<div className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-3">
										<dt className="text-muted-foreground">Context</dt>
										<dd>{detail.context}</dd>
									</div>
								) : null}
							</dl>
							{detail.description ? (
								<p className="mt-3 text-muted-foreground leading-5">
									{detail.description}
								</p>
							) : null}
							{detail.tags?.length ? (
								<div className="mt-3 flex flex-wrap gap-1.5">
									{detail.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							) : null}
							{detail.preview ? (
								<div className="mt-3">{detail.preview}</div>
							) : null}
						</aside>,
						document.body,
					)
				: null}
		</MorphPopover>
	);
}
