import { afterEach, expect, test } from "bun:test";
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { axe } from "jest-axe";
import { DateTimePicker } from "@/components/motion/date-time-picker";

afterEach(cleanup);

test("datetime drafts discard on Escape, commit noon/midnight correctly and preserve form values", async () => {
	const changes: string[] = [];
	const view = render(
		<DateTimePicker
			defaultValue="2026-10-15T09:30"
			name="scheduledAt"
			onValueChange={(value) => changes.push(value)}
		/>,
	);
	const trigger = view.getByRole("button", { name: /^Choose date and time:/ });
	fireEvent.click(trigger);
	const dialog = await view.findByRole("dialog");
	await waitFor(() =>
		expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
			"2026-10-15",
		),
	);
	fireEvent.click(
		view.getByRole("button", { name: "Friday, October 16, 2026" }),
	);
	const firstHourSelect = view.queryByRole("combobox", { name: "Hour" });
	if (firstHourSelect)
		fireEvent.change(firstHourSelect, { target: { value: "12" } });
	else {
		fireEvent.keyDown(view.getByRole("listbox", { name: "Hour" }), {
			key: "End",
		});
		await waitFor(() =>
			expect(
				view.getByRole("option", { name: "12", selected: true }),
			).toBeTruthy(),
		);
	}
	fireEvent.click(view.getByRole("button", { name: "PM" }));
	expect(changes).toEqual([]);
	fireEvent.keyDown(dialog, { key: "Escape" });
	expect(document.activeElement).toBe(trigger);
	fireEvent.click(trigger);
	await waitFor(() => {
		const hourSelect = view.queryByRole("combobox", {
			name: "Hour",
		}) as HTMLSelectElement | null;
		if (hourSelect) expect(hourSelect.value).toBe("09");
		else
			expect(
				view.getByRole("option", { name: "09", selected: true }),
			).toBeTruthy();
	});
	expect(view.getByRole("gridcell", { selected: true }).textContent).toBe("15");
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
		"2026-10-15",
	);
	const hourSelect = view.queryByRole("combobox", { name: "Hour" });
	if (hourSelect) fireEvent.change(hourSelect, { target: { value: "12" } });
	else {
		fireEvent.keyDown(view.getByRole("listbox", { name: "Hour" }), {
			key: "End",
		});
		await waitFor(() =>
			expect(
				view.getByRole("option", { name: "12", selected: true }),
			).toBeTruthy(),
		);
	}
	fireEvent.click(view.getByRole("button", { name: "PM" }));
	expect((await axe(view.getByRole("dialog"))).violations).toEqual([]);
	fireEvent.click(view.getByRole("button", { name: "Confirm" }));
	expect(changes).toEqual(["2026-10-15T12:30"]);
	expect(
		view.container.querySelector<HTMLInputElement>('input[name="scheduledAt"]')
			?.value,
	).toBe("2026-10-15T12:30");
	expect(document.activeElement).toBe(trigger);
	fireEvent.click(trigger);
	await view.findByRole("dialog");
	fireEvent.click(view.getByRole("button", { name: "AM" }));
	fireEvent.click(view.getByRole("button", { name: "Confirm" }));
	expect(changes.at(-1)).toBe("2026-10-15T00:30");
});

test("calendar keyboard navigation clamps leap months, crosses years and keeps one focused day", async () => {
	const view = render(<DateTimePicker defaultValue="2028-01-31T23:59" />);
	fireEvent.click(view.getByRole("button", { name: /^Choose date and time:/ }));
	await view.findByRole("dialog");
	await waitFor(() =>
		expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
			"2028-01-31",
		),
	);
	fireEvent.keyDown(document.activeElement as HTMLElement, { key: "PageDown" });
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
		"2028-02-29",
	);
	act(() => {
		fireEvent.keyDown(document.activeElement as HTMLElement, {
			key: "ArrowRight",
		});
		fireEvent.keyDown(document.activeElement as HTMLElement, {
			key: "ArrowRight",
		});
	});
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
		"2028-03-02",
	);
	fireEvent.keyDown(document.activeElement as HTMLElement, {
		key: "PageUp",
		shiftKey: true,
	});
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(
		"2027-03-02",
	);
	expect(
		view.getByRole("grid").querySelectorAll('button[tabindex="0"]').length,
	).toBe(1);
});

test("controlled values remain consumer-owned and invalid wall-clock values are rejected", async () => {
	const changes: string[] = [];
	const view = render(
		<DateTimePicker
			value="2026-12-31T23:59"
			onValueChange={(next) => changes.push(next)}
		/>,
	);
	fireEvent.click(view.getByRole("button", { name: /^Choose date and time:/ }));
	await view.findByRole("dialog");
	fireEvent.click(
		view.getByRole("button", { name: "Friday, January 1, 2027" }),
	);
	fireEvent.click(view.getByRole("button", { name: "Confirm" }));
	expect(changes).toEqual(["2027-01-01T23:59"]);
	expect(
		view.getByRole("button", { name: /^Choose date and time:/ }).textContent,
	).toContain("Dec 31, 2026");
	cleanup();
	expect(() => render(<DateTimePicker value="2026-02-30T09:30" />)).toThrow(
		"Invalid calendar date",
	);
	expect(() => render(<DateTimePicker value="2026-10-15T24:00" />)).toThrow(
		"YYYY-MM-DDTHH:mm",
	);
});

test("month navigation keeps six full weeks without committing the draft", async () => {
	const changes: string[] = [];
	const view = render(
		<DateTimePicker
			defaultValue="2027-01-15T09:30"
			onValueChange={(next) => changes.push(next)}
		/>,
	);
	fireEvent.click(view.getByRole("button", { name: /^Choose date and time:/ }));
	await view.findByRole("dialog");
	// February 2027 needs four weeks; May needs six. Both keep the same footprint.
	for (let month = 0; month < 12; month++) {
		const grid = view.getByRole("grid");
		expect(grid.querySelectorAll("tbody tr").length).toBe(6);
		const cells = view.getAllByRole("gridcell");
		expect(cells.length).toBe(42);
		const first = new Date(cells[0].querySelector("button")?.dataset.calendarDay ?? "");
		expect(first.getUTCDay()).toBe(1);
		expect(
			view.getByRole("button", {
				name: new Intl.DateTimeFormat("en-US", {
					dateStyle: "full",
					timeZone: "UTC",
				}).format(new Date(Date.UTC(2027, month + 1, 0))),
			}),
		).toBeTruthy();
		fireEvent.click(view.getByRole("button", { name: "Next month" }));
	}
	expect(changes).toEqual([]);
	fireEvent.click(view.getByRole("button", { name: "Previous month" }));
	fireEvent.click(view.getByRole("button", { name: "Friday, December 31, 2027" }));
	fireEvent.click(view.getByRole("button", { name: "Confirm" }));
	expect(changes).toEqual(["2027-12-31T09:30"]);
	expect(view.queryByRole("dialog", { hidden: true })).toBeNull();
});

test("year choices preserve the month, clamp leap days and leave confirmation explicit", async () => {
	const changes: string[] = [];
	const view = render(<DateTimePicker defaultValue="2028-02-29T23:59" onValueChange={(next) => changes.push(next)} />);
	fireEvent.click(view.getByRole("button", { name: /^Choose date and time:/ }));
	await view.findByRole("dialog");
	const chooseYear = view.getByRole("button", { name: "Choose year" });
	fireEvent.click(chooseYear);
	expect(document.activeElement).toBe(view.getByRole("button", { name: "2028" }));
	expect((await axe(view.getByRole("dialog"))).violations).toEqual([]);
	fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowRight" });
	expect(document.activeElement).toBe(view.getByRole("button", { name: "2029" }));
	fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Escape" });
	expect(document.activeElement).toBe(chooseYear);
	expect(view.getByRole("dialog")).toBeTruthy();
	fireEvent.click(chooseYear);
	fireEvent.click(view.getByRole("button", { name: "2029" }));
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe("2029-02-28");
	expect(changes).toEqual([]);
	fireEvent.click(chooseYear);
	fireEvent.click(view.getByRole("button", { name: "Next years" }));
	fireEvent.click(view.getByRole("button", { name: "2041" }));
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe("2041-02-28");
	fireEvent.click(document.activeElement as HTMLElement);
	fireEvent.click(view.getByRole("button", { name: "Confirm" }));
	expect(changes).toEqual(["2041-02-28T23:59"]);
});

test.each([
	["0000-01-15T09:30", "0", "Previous years", "Previous month"],
	["9999-12-15T09:30", "9999", "Next years", "Next month"],
])("year choices respect four-digit calendar bounds at %s", async (value, year, pageButton, monthButton) => {
	const view = render(<DateTimePicker defaultValue={value} />);
	fireEvent.click(view.getByRole("button", { name: /^Choose date and time:/ }));
	await view.findByRole("dialog");
	fireEvent.click(view.getByRole("button", { name: "Choose year" }));
	expect((view.getByRole("button", { name: pageButton }) as HTMLButtonElement).disabled).toBe(true);
	fireEvent.click(view.getByRole("button", { name: year }));
	expect((view.getByRole("button", { name: monthButton }) as HTMLButtonElement).disabled).toBe(true);
	expect(view.getByRole("grid").querySelectorAll("tbody tr").length).toBe(6);
	expect(document.activeElement?.getAttribute("data-calendar-day")).toBe(value.slice(0, 10));
});
