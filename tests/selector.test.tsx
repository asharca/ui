import { afterEach, expect, test } from "bun:test";
import { setTimeout as delay } from "node:timers/promises";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { Selector } from "@/components/motion/selector";

const options = [
  { id: "a", name: "Sonnet", group: "Pinned", description: "Anthropic", keywords: ["Vision"], details: <p>Balanced reasoning</p> },
  { id: "b", name: "GPT", group: "OpenAI", description: "Fast multimodal" },
  { id: "c", name: "Opus", group: "Anthropic", details: <p>Deep reasoning</p> },
];
afterEach(cleanup);

test("searches generic metadata, separates focus from selection and commits an ID", () => {
  let selected = "";
  const view = render(<Selector options={options} onValueChange={(id) => { selected = id; }} />);
  const trigger = view.getByRole("button", { name: /Sonnet/ });
  fireEvent.click(trigger);
  const input = view.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(view.getByRole("option", { name: /Sonnet/ }).getAttribute("aria-selected")).toBe("true");
  expect(view.getByRole("option", { name: /GPT/ }).getAttribute("aria-selected")).toBe("false");
  fireEvent.change(input, { target: { value: "Vision" } });
  expect(view.queryByRole("option", { name: /GPT/ })).toBeNull();
  fireEvent.change(input, { target: { value: "OpenAI" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(selected).toBe("b");
  expect(view.getByRole("button", { name: /GPT/ }).getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});

test("clear restores choices and controlled selection does not change without its owner", () => {
  const view = render(<Selector options={options} value="a" defaultOpen />);
  const input = view.getByRole("combobox");
  fireEvent.change(input, { target: { value: "zz" } });
  expect(view.queryAllByRole("option")).toHaveLength(0);
  fireEvent.click(view.getByRole("button", { name: "Clear search" }));
  expect(view.getAllByRole("option")).toHaveLength(3);
  expect(document.activeElement).toBe(input);
  fireEvent.click(view.getByRole("option", { name: /GPT/ }));
  expect(view.getByRole("button", { name: /Sonnet/ })).toBeTruthy();
});

test("optional details persist when entered, cancel on leave, and never open for touch", async () => {
  const view = render(<Selector options={options} defaultOpen />);
  const row = view.getByRole("option", { name: /Opus/ });
  fireEvent.pointerEnter(row, { pointerType: "mouse" });
  await waitFor(() => expect(view.getByRole("complementary", { name: "Option details" }).textContent).toContain("Deep reasoning"), { timeout: 2000 });
  const details = view.getByRole("complementary", { name: "Option details" });
  fireEvent.pointerLeave(row, { pointerType: "mouse" });
  fireEvent.pointerEnter(details, { pointerType: "mouse" });
  await act(() => delay(150));
  expect(view.getByRole("complementary", { name: "Option details" })).toBe(details);
  fireEvent.pointerLeave(details, { pointerType: "mouse" });
  await act(() => delay(150));
  expect(view.queryByRole("complementary")).toBeNull();
  fireEvent.pointerEnter(row, { pointerType: "mouse" });
  fireEvent.pointerLeave(row, { pointerType: "mouse" });
  await act(() => delay(1600));
  expect(view.queryByRole("complementary")).toBeNull();
  fireEvent.pointerEnter(row, { pointerType: "touch" });
  await act(() => delay(1600));
  expect(view.queryByRole("complementary")).toBeNull();
}, 10000);

test("page navigation clamps at boundaries and skips disabled options", () => {
  const many = Array.from({ length: 15 }, (_, i) => ({ id: `${i}`, name: `Choice ${i}`, disabled: i === 1 }));
  let selected = "";
  const view = render(<Selector options={many} defaultOpen onValueChange={(id) => { selected = id; }} />);
  const input = view.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(selected).toBe("2");
  fireEvent.click(view.getByRole("button", { name: /Choice 2/ }));
  fireEvent.keyDown(view.getByRole("combobox"), { key: "PageDown" });
  fireEvent.keyDown(view.getByRole("combobox"), { key: "Enter" });
  expect(selected).toBe("14");
});

test("multiple selection toggles without closing and disabled choices cannot commit", () => {
  let selected: string[] = [];
  const view = render(<Selector multiple options={[...options, { id: "d", name: "Unavailable", disabled: true }]} defaultOpen onValueChange={(ids) => { selected = ids; }} />);
  fireEvent.click(view.getByRole("option", { name: /Sonnet/ }));
  fireEvent.click(view.getByRole("option", { name: /GPT/ }));
  expect(selected).toEqual(["a", "b"]);
  expect(view.getByRole("listbox").getAttribute("aria-multiselectable")).toBe("true");
  fireEvent.click(view.getByRole("option", { name: /Unavailable/ }));
  expect(selected).toEqual(["a", "b"]);
  fireEvent.click(view.getByRole("option", { name: /Sonnet/ }));
  expect(selected).toEqual(["b"]);
  fireEvent.click(view.getByRole("button", { name: "Done" }));
  expect(view.getByRole("button", { name: "1 selected" }).getAttribute("aria-expanded")).toBe("false");
});

test("chips remove selections without nested interactive elements and controlled owners remain authoritative", () => {
  let selected: string[] = [];
  const view = render(<Selector multiple options={options} value={["a", "b"]} onValueChange={(ids) => { selected = ids; }} />);
  const remove = view.getByRole("button", { name: "Remove Sonnet" });
  expect(remove.parentElement?.closest("button")).toBeNull();
  fireEvent.click(remove);
  expect(selected).toEqual(["b"]);
  expect(view.getByRole("button", { name: "Remove Sonnet" })).toBe(remove);
  view.rerender(<Selector multiple options={options} value={["b"]} onValueChange={(ids) => { selected = ids; }} />);
  expect(view.queryByRole("button", { name: "Remove Sonnet" })).toBeNull();
});

test("empty and disabled-only lists never emit a selection", () => {
  let calls = 0;
  const view = render(<Selector options={[{ id: "x", name: "Unavailable", disabled: true }]} defaultOpen onValueChange={() => { calls++; }} />);
  const input = view.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(calls).toBe(0);
  expect(input.getAttribute("aria-activedescendant")).toBeNull();
  view.rerender(<Selector options={[]} defaultOpen onValueChange={() => { calls++; }} />);
  fireEvent.keyDown(view.getByRole("combobox"), { key: "Enter" });
  expect(calls).toBe(0);
});

test("grid search and outside dismissal preserve scroll and keyboard focus", () => {
  const overflow = document.body.style.overflow;
  const view = render(<Selector layout="grid" options={options.map((option) => ({ ...option, preview: <span>{option.name} thumbnail</span> }))} />);
  const trigger = view.getByRole("button", { name: /Sonnet/ });
  fireEvent.click(trigger);
  view.getByRole("combobox").focus();
  expect(document.body.style.overflow).toBe(overflow);
  fireEvent.pointerDown(document.body, { pointerType: "mouse" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});
