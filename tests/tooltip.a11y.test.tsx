import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/motion/tooltip";
import { TooltipSurface } from "@/components/motion/tooltip-surface";

afterEach(cleanup);

test("keyboard focus shows the tooltip as the trigger's description", async () => {
  const { container, getByRole } = render(
    <Tooltip content="Copies the link">
      <button type="button">Share</button>
    </Tooltip>,
  );
  const trigger = getByRole("button", { name: "Share" });
  expect(trigger.hasAttribute("aria-describedby")).toBe(false);
  await act(async () => {
    trigger.focus();
  });
  await waitFor(() => expect(getByRole("tooltip").textContent).toBe("Copies the link"));
  expect(trigger.getAttribute("aria-describedby")).toBe(getByRole("tooltip").id);
  expect((await axe(container)).violations).toEqual([]);
  expect((await axe(getByRole("tooltip"))).violations).toEqual([]);
});

test("asLabel names an icon-only trigger while the tooltip is closed", async () => {
  const { container, getByRole, queryByRole } = render(
    <TooltipProvider>
      <Tooltip asLabel>
        <TooltipTrigger>
          <svg aria-hidden="true" width="16" height="16" />
        </TooltipTrigger>
        <TooltipContent arrow>Bold</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  expect(queryByRole("tooltip")).toBeNull();
  const trigger = getByRole("button", { name: "Bold" });
  expect(trigger.hasAttribute("aria-describedby")).toBe(false);
  expect((await axe(container)).violations).toEqual([]);
});

test("asLabel open state keeps a single name and no duplicate description", async () => {
  const { container, getByRole } = render(
    <Tooltip asLabel content="Italic">
      <button type="button">
        <svg aria-hidden="true" width="16" height="16" />
      </button>
    </Tooltip>,
  );
  const trigger = getByRole("button", { name: "Italic" });
  await act(async () => {
    trigger.focus();
  });
  await waitFor(() => expect(getByRole("tooltip", { hidden: true }).textContent).toBe("Italic"));
  expect(trigger.hasAttribute("aria-describedby")).toBe(false);
  expect((await axe(container)).violations).toEqual([]);
});

test("empty content adds no tooltip or description", async () => {
  const { getByRole, queryByRole } = render(
    <Tooltip content={null}>
      <button type="button">Plain</button>
    </Tooltip>,
  );
  const trigger = getByRole("button", { name: "Plain" });
  await act(async () => {
    trigger.focus();
  });
  expect(queryByRole("tooltip", { hidden: true })).toBeNull();
  expect(trigger.hasAttribute("aria-describedby")).toBe(false);
});

test("the surface waits for placement without leaking readiness to the DOM", async () => {
  const { getByRole, rerender } = render(<TooltipSurface ready={false}>Measured label</TooltipSurface>);
  const surface = getByRole("tooltip");
  expect(surface.hasAttribute("ready")).toBe(false);
  expect(surface.style.opacity).toBe("0");

  rerender(<TooltipSurface ready>Measured label</TooltipSurface>);
  await waitFor(() => expect(surface.style.opacity).toBe("1"));
  expect(surface.hasAttribute("ready")).toBe(false);
});

test("sized anchors remain visible in the viewport and hide when fully clipped", async () => {
  const { getByRole } = render(
    <Tooltip open content="Visible anchor">
      <button type="button">Inspect</button>
    </Tooltip>,
  );
  const anchor = getByRole("button", { name: "Inspect" });
  let left = 100;
  anchor.getBoundingClientRect = () => new DOMRect(left, 100, 50, 30);
  const surface = await waitFor(() => getByRole("tooltip"));
  expect(surface.parentElement?.style.visibility).toBe("visible");

  left = -100;
  fireEvent(window, new Event("resize"));
  await waitFor(() => expect(surface.parentElement?.style.visibility).toBe("hidden"));
});

test("closing before placement and after reopening both complete the tooltip exit", async () => {
  const example = (open: boolean) => (
    <Tooltip open={open} content="Quick label">
      <button type="button">Inspect lifecycle</button>
    </Tooltip>
  );
  const { getByRole, rerender } = render(example(true));
  rerender(example(false));
  await waitFor(() => expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(0));

  rerender(example(true));
  const surface = await waitFor(() => getByRole("tooltip"));
  rerender(example(false));
  expect(surface.parentElement?.hasAttribute("inert")).toBe(true);
  await waitFor(() => expect(surface.isConnected).toBe(false));
  expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(0);
});
