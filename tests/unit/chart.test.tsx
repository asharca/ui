import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "../../src/Chart";

// jsdom does not lay out responsive charts; actual sizes are checked in Playwright.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 320, 280),
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const config = {
  revenue: { label: "收入", color: "var(--chart-1)" },
  team: { label: "团队版", color: "var(--chart-2)" },
};

it("scopes series colors without injecting CSS or sharing configuration across charts", () => {
  render(
    <>
      <ChartContainer config={config} aria-label="第一张图">
        <span>图表一</span>
      </ChartContainer>
      <ChartContainer
        config={{ revenue: { label: "Revenue", color: "red" } }}
        style={{ height: 240 }}
        aria-label="第二张图"
      >
        <span>图表二</span>
      </ChartContainer>
    </>,
  );
  expect(
    screen.getByLabelText("第一张图").style.getPropertyValue("--color-revenue"),
  ).toBe("var(--chart-1)");
  expect(screen.getByLabelText("第二张图")).toHaveStyle({
    "--color-revenue": "red",
    height: "240px",
  });
  expect(document.querySelector("style")).toBeNull();
});

it("formats zero values, hides inactive entries, and resolves pie labels by name", () => {
  render(
    <ChartContainer config={config}>
      <ChartTooltipContent
        active
        label="9/18"
        formatter={(value) => `CNY ${value}`}
        payload={[
          {
            dataKey: "revenue",
            name: "revenue",
            value: 0,
            graphicalItemId: "one",
          },
          { dataKey: "value", name: "team", value: 42, graphicalItemId: "two" },
          {
            dataKey: "hidden",
            name: "hidden",
            value: 99,
            hide: true,
            graphicalItemId: "three",
          },
        ]}
      />
      <ChartLegendContent
        payload={[
          { dataKey: "revenue", value: "revenue" },
          { dataKey: "value", value: "team" },
          { value: "hidden", type: "none" },
        ]}
      />
    </ChartContainer>,
  );
  expect(screen.getByText("CNY 0")).toBeVisible();
  expect(screen.getByText("CNY 42")).toBeVisible();
  expect(screen.getAllByText("收入")).toHaveLength(2);
  expect(screen.getAllByText("团队版")).toHaveLength(2);
  expect(screen.queryByText("hidden")).not.toBeInTheDocument();
});

it("does not show empty or inactive tooltips", () => {
  render(
    <ChartContainer config={config}>
      <ChartTooltipContent active payload={[]} label="空数据" />
      <ChartTooltipContent
        active={false}
        payload={[{ name: "revenue", value: 1, graphicalItemId: "one" }]}
        label="未激活"
      />
    </ChartContainer>,
  );
  expect(screen.queryByText("空数据")).not.toBeInTheDocument();
  expect(screen.queryByText("未激活")).not.toBeInTheDocument();
});
