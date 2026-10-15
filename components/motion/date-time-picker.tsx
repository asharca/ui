"use client";

import {
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock3,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
	type KeyboardEvent,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/motion/button/base";
import {
	DAY,
	iso,
	monthOf,
	parse,
	shiftMonth,
} from "@/components/motion/date-range-picker/date-utils";
import {
	MorphPopover,
	MorphPopoverContent,
	MorphPopoverTrigger,
} from "@/components/motion/popover-morph";
import { WheelPicker } from "@/components/motion/wheel-picker";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type DateTimePickerClassNames = {
	trigger?: string;
	content?: string;
	calendar?: string;
	day?: string;
	selectedDay?: string;
	time?: string;
	confirmButton?: string;
};

export interface DateTimePickerProps {
	/** Local wall-clock time, YYYY-MM-DDTHH:mm. No timezone conversion is applied. */
	value?: string;
	defaultValue?: string;
	/** Called only when Confirm is pressed. Dismissing discards the draft. */
	onValueChange?: (value: string) => void;
	label?: string;
	disabled?: boolean;
	name?: string;
	className?: string;
	classNames?: DateTimePickerClassNames;
}

const pad = (value: number) => String(value).padStart(2, "0");
const HOURS = Array.from({ length: 12 }, (_, index) => pad(index + 1));
const MINUTES = Array.from({ length: 60 }, (_, index) => pad(index));
const dateFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});
const dayFormat = new Intl.DateTimeFormat("en-US", {
	dateStyle: "full",
	timeZone: "UTC",
});
const focusClass =
	"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function localNow() {
	const now = new Date();
	return `${String(now.getFullYear()).padStart(4, "0")}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function validate(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(value))
		throw new Error(
			"DateTimePicker expects local time in YYYY-MM-DDTHH:mm format.",
		);
	parse(value.slice(0, 10));
	return value;
}

function timeLabel(value: string) {
	const hour = Number(value.slice(11, 13));
	return `${pad(hour % 12 || 12)}:${value.slice(14)} ${hour < 12 ? "AM" : "PM"}`;
}

/** Calendar and time-wheel popover with an explicit draft/confirm boundary. */
export function DateTimePicker({
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	label = "Choose date and time",
	disabled = false,
	name,
	className,
	classNames,
}: DateTimePickerProps) {
	const [internal, setInternal] = useState(defaultValue);
	const value = controlledValue ?? internal;
	if (value) validate(value);
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState("");
	const [session, setSession] = useState(0);
	const trigger = useRef<HTMLButtonElement>(null);
	const changeOpen = (next: boolean) => {
		if (disabled) return;
		if (next) {
			setDraft(value || localNow());
			setSession((current) => current + 1);
		}
		setOpen(next);
	};

	return (
		<MorphPopover
			open={open && !disabled}
			onOpenChange={changeOpen}
			className={cn("max-w-full", className)}
		>
			{name && (
				<input type="hidden" name={name} value={value} disabled={disabled} />
			)}
			<MorphPopoverTrigger>
				<Button
					ref={trigger}
					variant="outline"
					disabled={disabled}
					aria-label={`${label}: ${value ? `${dateFormat.format(parse(value.slice(0, 10)))}, ${timeLabel(value)}` : "not selected"}`}
					className={cn(
						"h-9 max-w-full gap-2 rounded-xl bg-background px-3 text-[13px] font-medium",
						focusClass,
						classNames?.trigger,
					)}
				>
					<CalendarDays aria-hidden="true" className="size-4 shrink-0" />
					{value ? (
						<>
							<span className="whitespace-nowrap">
								{dateFormat.format(parse(value.slice(0, 10)))}
							</span>
							<span aria-hidden="true" className="h-4 w-px bg-border" />
							<Clock3
								aria-hidden="true"
								className="hidden size-4 shrink-0 min-[400px]:block"
							/>
							<span className="whitespace-nowrap tabular-nums">
								{timeLabel(value)}
							</span>
						</>
					) : (
						<span className="text-muted-foreground">{label}</span>
					)}
					<ChevronDown
						aria-hidden="true"
						className={cn(
							"ml-1 size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
							open && "rotate-180",
						)}
					/>
				</Button>
			</MorphPopoverTrigger>
			<MorphPopoverContent
				align="start"
				radius={16}
				sideOffset={8}
				className={cn("w-[480px] max-w-[calc(100vw-1.5rem)]", classNames?.content)}
				onOpenAutoFocus={(content) =>
					content
						.querySelector<HTMLElement>('[data-calendar-day][tabindex="0"]')
						?.focus({ preventScroll: true })
				}
			>
				{draft && (
					<DateTimePanel
						key={session}
						initialValue={draft}
						classNames={classNames}
						onConfirm={(next) => {
							if (controlledValue === undefined) setInternal(next);
							onValueChange?.(next);
							setOpen(false);
							trigger.current?.focus({ preventScroll: true });
						}}
					/>
				)}
			</MorphPopoverContent>
		</MorphPopover>
	);
}

function DateTimePanel({
	initialValue,
	onConfirm,
	classNames,
}: {
	initialValue: string;
	onConfirm: (value: string) => void;
	classNames?: DateTimePickerClassNames;
}) {
	const [draft, setDraft] = useState(initialValue);
	const [cursor, setCursor] = useState(initialValue.slice(0, 10));
	const reduce = useReducedMotion() ?? false;
	const id = useId();
	const calendar = useRef<HTMLTableElement>(null);
	const moveFocus = useRef(true);
	const date = draft.slice(0, 10);
	const month = monthOf(cursor);
	const hour = Number(draft.slice(11, 13));
	const period = hour < 12 ? "AM" : "PM";
	const first = parse(month);
	const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY;
	const daysInView =
		Math.ceil((parse(shiftMonth(month, 1)) - start) / DAY / 7) * 7;
	const days = Array.from({ length: daysInView }, (_, index) =>
		iso(start + index * DAY),
	);

	useLayoutEffect(() => {
		if (!moveFocus.current) return;
		calendar.current
			?.querySelector<HTMLElement>(`[data-calendar-day="${cursor}"]`)
			?.focus({ preventScroll: true });
		moveFocus.current = false;
	}, [cursor]);

	const setHour = (next: number) =>
		setDraft(
			(current) => `${current.slice(0, 11)}${pad(next)}${current.slice(13)}`,
		);
	const navigate = (event: KeyboardEvent<HTMLButtonElement>) => {
		const offsets: Record<string, number> = {
			ArrowLeft: -1,
			ArrowRight: 1,
			ArrowUp: -7,
			ArrowDown: 7,
		};
		const key = event.key;
		if (
			!(key in offsets) &&
			!["Home", "End", "PageUp", "PageDown"].includes(key)
		)
			return;
		event.preventDefault();
		moveFocus.current = true;
		setCursor((current) => {
			if (key === "PageUp" || key === "PageDown")
				return shiftMonth(
					current,
					(key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1),
				);
			const weekday = (new Date(parse(current)).getUTCDay() + 6) % 7;
			return iso(
				parse(current) +
					(key === "Home"
						? -weekday
						: key === "End"
							? 6 - weekday
							: offsets[key]) *
						DAY,
			);
		});
	};

	return (
		<div>
			<div className="grid grid-cols-1 min-[520px]:grid-cols-[1fr_160px]">
				<section aria-label="Calendar" className={cn("min-w-0 p-3.5", classNames?.calendar)}>
					<div className="mb-2 flex items-center justify-between gap-2">
						<Button
							variant="outline"
							size="icon"
							aria-label="Previous month"
							className={focusClass}
							onClick={() => setCursor((current) => shiftMonth(current, -1))}
						>
							<ChevronLeft aria-hidden="true" className="size-4" />
						</Button>
						<h3
							id={`${id}-month`}
							aria-live="polite"
							className="text-sm font-medium"
						>
							{monthFormat.format(first)}
						</h3>
						<Button
							variant="outline"
							size="icon"
							aria-label="Next month"
							className={focusClass}
							onClick={() => setCursor((current) => shiftMonth(current, 1))}
						>
							<ChevronRight aria-hidden="true" className="size-4" />
						</Button>
					</div>
					<p id={`${id}-help`} className="sr-only">
						Use arrow keys for days, Home and End for the week, Page Up and Page
						Down for months, or hold Shift for years. Enter selects a date.
						Confirm saves the date and time; Escape discards changes.
					</p>
					<motion.table
						key={month}
						ref={calendar}
						role="grid"
						aria-labelledby={`${id}-month`}
						aria-describedby={`${id}-help`}
						className="w-full table-fixed"
						initial={{ opacity: reduce ? 1 : 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.15, ease: EASE_OUT }}
					>
						<thead>
							<tr>
								{["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
									<th
										key={day}
										scope="col"
										className="pb-3 text-center text-xs font-normal text-muted-foreground"
									>
										{day}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: daysInView / 7 }, (_, week) => (
								<tr key={days[week * 7]}>
									{days.slice(week * 7, week * 7 + 7).map((day) => (
										// biome-ignore lint/a11y/useFocusableInteractive: Calendar cells delegate focus to the contained day button.
										<td
											// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Gridcell selection semantics belong on the native table cell.
											role="gridcell"
											key={day}
											aria-selected={day === date}
											className="py-0.5"
										>
											<motion.button
												type="button"
												data-calendar-day={day}
												tabIndex={day === cursor ? 0 : -1}
												aria-label={dayFormat.format(parse(day))}
												onKeyDown={navigate}
												onClick={() => {
													moveFocus.current = true;
													setCursor(day);
													setDraft((current) => `${day}${current.slice(10)}`);
												}}
												whileTap={reduce ? undefined : { scale: 0.92 }}
												transition={SPRING_PRESS}
												className={cn(
													"relative mx-auto flex size-8 items-center justify-center rounded-xl text-xs tabular-nums transition-colors",
													focusClass,
													day === date
														? "bg-foreground font-medium text-background shadow-sm"
														: "hover:bg-muted",
													day !== date &&
														monthOf(day) !== month &&
														"text-muted-foreground/40",
													classNames?.day,
													day === date && classNames?.selectedDay,
												)}
											>
												{Number(day.slice(8))}
											</motion.button>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</motion.table>
				</section>
				<section
					aria-label="Time"
					className={cn("m-3.5 mt-0 border-t border-border pt-3.5 min-[520px]:ml-0 min-[520px]:mt-3.5 min-[520px]:border-l min-[520px]:border-t-0 min-[520px]:pl-3.5 min-[520px]:pt-0", classNames?.time)}
				>
					<h3 className="mb-3 text-sm font-medium">Time</h3>
					<div className="flex items-center gap-1 tabular-nums">
						{reduce ? (
							<label className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
								Hour
								<select
									aria-label="Hour"
									value={pad(hour % 12 || 12)}
									onChange={(event) =>
										setHour(
											(Number(event.target.value) % 12) +
												(period === "PM" ? 12 : 0),
										)
									}
									className={cn(
										"h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground",
										focusClass,
									)}
								>
									{HOURS.map((value) => (
										<option key={value}>{value}</option>
									))}
								</select>
							</label>
						) : (
							<WheelPicker
								aria-label="Hour"
								options={HOURS}
								value={pad(hour % 12 || 12)}
								onValueChange={(next) =>
									setHour((Number(next) % 12) + (period === "PM" ? 12 : 0))
								}
								itemHeight={32}
								className="flex-1 rounded-lg border-0 bg-transparent text-base"
							/>
						)}
						<span aria-hidden="true" className="text-muted-foreground">
							:
						</span>
						{reduce ? (
							<label className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
								Minute
								<select
									aria-label="Minute"
									value={draft.slice(14)}
									onChange={(event) =>
										setDraft(
											(current) =>
												`${current.slice(0, 14)}${event.target.value}`,
										)
									}
									className={cn(
										"h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground",
										focusClass,
									)}
								>
									{MINUTES.map((value) => (
										<option key={value}>{value}</option>
									))}
								</select>
							</label>
						) : (
							<WheelPicker
								aria-label="Minute"
								options={MINUTES}
								value={draft.slice(14)}
								onValueChange={(next) =>
									setDraft((current) => `${current.slice(0, 14)}${next}`)
								}
								itemHeight={32}
								className="flex-1 rounded-lg border-0 bg-transparent text-base"
							/>
						)}
					</div>
					<fieldset
						aria-label="Time period"
						className="mt-3 flex rounded-xl border border-border bg-muted/50 p-1"
					>
						{["AM", "PM"].map((next) => (
							<button
								key={next}
								type="button"
								aria-pressed={next === period}
								onClick={() => setHour((hour % 12) + (next === "PM" ? 12 : 0))}
								className={cn(
									"relative flex h-8 flex-1 items-center justify-center rounded-lg text-xs",
									focusClass,
								)}
							>
								{next === period && (
									<motion.span
										aria-hidden="true"
										layoutId={reduce ? undefined : `${id}-period`}
										transition={SPRING_LAYOUT}
										className="absolute inset-0 rounded-lg border border-border bg-background shadow-sm"
									/>
								)}
								<span className="relative">{next}</span>
							</button>
						))}
					</fieldset>
				</section>
			</div>
			<div className="flex items-center justify-between gap-2 border-t border-border px-3.5 py-2.5">
				<span className="text-[11px] text-muted-foreground">
					Local time ·{" "}
					{new Intl.DateTimeFormat("en-US", { timeZoneName: "shortOffset" })
						.formatToParts(new Date(draft))
						.find((part) => part.type === "timeZoneName")
						?.value.replace("GMT", "UTC")}
				</span>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className={cn("rounded-lg", focusClass)}
						onClick={() => {
							const now = localNow();
							setDraft(now);
							setCursor(now.slice(0, 10));
						}}
					>
						Now
					</Button>
					<Button
						size="sm"
						className={cn(
							"rounded-lg bg-foreground px-4 text-background hover:bg-foreground/90",
							focusClass,
							classNames?.confirmButton,
						)}
						onClick={() => onConfirm(draft)}
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
}
