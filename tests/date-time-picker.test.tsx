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
