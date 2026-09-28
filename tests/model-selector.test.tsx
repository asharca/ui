import { afterEach, expect, test } from "bun:test";
import { setTimeout as delay } from "node:timers/promises";
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
	within,
} from "@testing-library/react";
import { ModelSelector } from "@/components/motion/model-selector";

const models = [
	{
		id: "a",
		name: "Sonnet",
		provider: "Anthropic",
		pinned: true,
		description: "Balanced reasoning",
		tags: ["Vision"],
	},
	{
		id: "b",
		name: "GPT",
		provider: "OpenAI",
		recent: true,
		description: "Fast multimodal",
	},
	{
		id: "c",
		name: "Opus",
		provider: "Anthropic",
		description: "Deep reasoning",
	},
];
afterEach(cleanup);

test("searches capabilities, previews hovered models, and commits selection", async () => {
	let selected = "";
	const view = render(
		<ModelSelector
			models={models}
			onValueChange={(model) => {
				selected = model.id;
			}}
		/>,
	);
	fireEvent.click(view.getByRole("button", { name: /Sonnet/ }));
	const input = view.getByRole("combobox");
	expect(
		view.queryByRole("complementary", { name: "Model details" }),
	).toBeNull();
	fireEvent.pointerEnter(view.getByRole("option", { name: /Opus/ }), {
		pointerType: "mouse",
	});
	await waitFor(
		() => {
			expect(
				view.getByRole("complementary", { name: "Model details" }).textContent,
			).toContain("Deep reasoning");
		},
		{ timeout: 2000 },
	);
	const details = view.getByRole("complementary", { name: "Model details" });
	fireEvent.pointerLeave(view.getByRole("option", { name: /Opus/ }), {
		pointerType: "mouse",
	});
	fireEvent.pointerEnter(details, { pointerType: "mouse" });
	await act(() => delay(150));
	expect(view.getByRole("complementary", { name: "Model details" })).toBe(
		details,
	);
	fireEvent.pointerLeave(details, { pointerType: "mouse" });
	fireEvent.pointerEnter(view.getByRole("option", { name: /Opus/ }), {
		pointerType: "mouse",
	});
	expect(view.getByRole("complementary", { name: "Model details" })).toBe(
		details,
	);
	await act(() => delay(150));
	expect(view.getByRole("complementary", { name: "Model details" })).toBe(
		details,
	);
	fireEvent.pointerLeave(view.getByRole("option", { name: /Opus/ }), {
		pointerType: "mouse",
	});
	await act(() => delay(150));
	expect(
		view.queryByRole("complementary", { name: "Model details" }) === null,
	).toBe(true);
	await act(() => delay(1500));
	expect(
		view.queryByRole("complementary", { name: "Model details" }) === null,
	).toBe(true);
	fireEvent.change(input, { target: { value: "Vision" } });
	expect(view.queryByRole("option", { name: /GPT/ })).toBeNull();
	expect(
		view.getByRole("option", { name: /Sonnet/ }).getAttribute("aria-selected"),
	).toBe("true");
	fireEvent.change(input, { target: { value: "OpenAI" } });
	fireEvent.keyDown(input, { key: "Enter" });
	expect(selected).toBe("b");
	expect(view.getByRole("button", { name: /GPT.*OpenAI/ })).toBeTruthy();
});

test("clear restores models and controlled value stays unchanged", () => {
	const view = render(<ModelSelector models={models} value="a" />);
	fireEvent.click(view.getByRole("button", { name: /Sonnet/ }));
	const input = view.getByRole("combobox");
	fireEvent.change(input, { target: { value: "zz" } });
	expect(view.queryAllByRole("option")).toHaveLength(0);
	fireEvent.click(view.getByRole("button", { name: "Clear model search" }));
	expect(view.getAllByRole("option")).toHaveLength(3);
	expect(document.activeElement).toBe(input);
	fireEvent.click(
		within(view.getByRole("listbox")).getByRole("option", { name: /GPT/ }),
	);
	expect(view.getByRole("button", { name: /Sonnet.*Anthropic/ })).toBeTruthy();
});

test("leaving a row cancels pending details and touch never opens them", async () => {
	const view = render(<ModelSelector models={models} defaultOpen />);
	const row = view.getByRole("option", { name: /Opus/ });
	fireEvent.pointerEnter(row, { pointerType: "mouse" });
	fireEvent.pointerLeave(row, { pointerType: "mouse" });
	await act(() => delay(1600));
	expect(
		view.queryByRole("complementary", { name: "Model details" }),
	).toBeNull();
	fireEvent.pointerEnter(row, { pointerType: "touch" });
	await act(() => delay(1600));
	expect(
		view.queryByRole("complementary", { name: "Model details" }),
	).toBeNull();
});

test("page navigation advances twelve rows and clamps at list boundaries", () => {
	const manyModels = Array.from({ length: 15 }, (_, index) => ({
		id: `model-${index}`,
		name: `Model ${index}`,
		provider: "Provider",
	}));
	let selected = "";
	const view = render(
		<ModelSelector
			models={manyModels}
			defaultOpen
			onValueChange={(model) => {
				selected = model.id;
			}}
		/>,
	);
	const input = view.getByRole("combobox");
	fireEvent.keyDown(input, { key: "PageDown" });
	expect(
		document.getElementById(input.getAttribute("aria-activedescendant") ?? "")
			?.textContent,
	).toContain("Model 12");
	fireEvent.keyDown(input, { key: "PageDown" });
	expect(
		document.getElementById(input.getAttribute("aria-activedescendant") ?? "")
			?.textContent,
	).toContain("Model 14");
	fireEvent.keyDown(input, { key: "PageUp" });
	fireEvent.keyDown(input, { key: "PageUp" });
	fireEvent.keyDown(input, { key: "Enter" });
	expect(selected).toBe("model-0");
});

test("outside pointer dismisses the popover and restores focus without locking page scroll", async () => {
	const overflow = document.body.style.overflow;
	const view = render(<ModelSelector models={models} />);
	const trigger = view.getByRole("button", { name: /Sonnet/ });
	fireEvent.click(trigger);
	const input = view.getByRole("combobox");
	input.focus();
	expect(document.body.style.overflow).toBe(overflow);
	fireEvent.pointerDown(document.body, { pointerType: "mouse" });
	expect(trigger.getAttribute("aria-expanded")).toBe("false");
	expect(document.activeElement === trigger).toBe(true);
	await act(() => delay(150));
	fireEvent.click(trigger);
	fireEvent.change(view.getByRole("combobox"), { target: { value: "OpenAI" } });
	fireEvent.keyDown(view.getByRole("combobox"), { key: "Enter" });
	expect(
		view
			.getByRole("button", { name: /GPT.*OpenAI/ })
			.getAttribute("aria-expanded"),
	).toBe("false");
});
