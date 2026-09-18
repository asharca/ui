import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { AdminExample } from "../../showcase/examples/AdminExample";
import { AnalyticsExample } from "../../showcase/examples/AnalyticsExample";
import { ProjectsExample } from "../../showcase/examples/ProjectsExample";
import { SettingsExample } from "../../showcase/examples/SettingsExample";
import { appExamples } from "../../showcase/examples/registry";
import { DocsApp } from "../../showcase/DocsApp";

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  document.documentElement.classList.remove("dark");
});

it("keeps every example and its referenced source in the repository", () => {
  expect(new Set(appExamples.map((item) => item.id)).size).toBe(
    appExamples.length,
  );
  for (const example of appExamples) {
    for (const file of example.files)
      expect(existsSync(resolve("showcase/examples", file)), file).toBe(true);
    expect(
      readFileSync(
        resolve("showcase/examples", `${example.component}.tsx`),
        "utf8",
      ),
    ).toContain(`export function ${example.component}`);
  }
});

it("keeps global search available from a standalone example", async () => {
  window.history.replaceState(null, "", "/#/examples/settings");
  const user = userEvent.setup();
  render(<DocsApp />);
  await screen.findByRole("heading", { name: "工作区偏好", level: 1 });
  await user.keyboard("{Control>}k{/Control}");
  const dialog = await screen.findByRole("dialog", { name: "搜索文档" });
  await user.type(within(dialog).getByRole("searchbox"), "项目看板");
  expect(within(dialog).getByRole("link", { name: /项目看板/ })).toHaveAttribute("href", "#/examples/projects");
});

it("keeps selections across order filters and only completes pending orders", async () => {
  const user = userEvent.setup();
  render(<AdminExample />);
  await user.click(screen.getByRole("checkbox", { name: "选择ORD-2408" }));
  await user.click(screen.getByRole("checkbox", { name: "选择ORD-2404" }));
  await user.click(screen.getByRole("button", { name: "下一页订单" }));
  await user.click(screen.getByRole("checkbox", { name: "选择ORD-2402" }));
  await user.selectOptions(
    screen.getByRole("combobox", { name: "订单状态" }),
    "已退款",
  );
  expect(screen.getByText("已选择 3 笔")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "标记已完成" }));
  expect(screen.getByRole("status")).toHaveTextContent("已完成 2 笔订单");
  expect(screen.getByText("ORD-2404")).toBeVisible();
  await user.selectOptions(
    screen.getByRole("combobox", { name: "订单状态" }),
    "全部状态",
  );
  await user.click(screen.getByRole("button", { name: "查看订单 ORD-2408" }));
  expect(within(screen.getByRole("dialog")).getByText("已完成")).toBeVisible();
  expect(
    within(screen.getByRole("dialog")).queryByRole("button", {
      name: "确认完成",
    }),
  ).not.toBeInTheDocument();
  await user.keyboard("{Escape}");
  await user.type(
    screen.getByRole("searchbox", { name: "搜索订单" }),
    "not-found",
  );
  expect(screen.getByText("没有匹配的订单")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "清除筛选" }));
  expect(screen.getByText("ORD-2408")).toBeVisible();
});

it("creates tasks and moves them with an accessible native control", async () => {
  const user = userEvent.setup();
  render(<ProjectsExample />);
  await user.click(screen.getByRole("button", { name: "新建任务" }));
  await user.type(
    screen.getByRole("textbox", { name: "任务名称" }),
    "  增加图表回归  ",
  );
  await user.click(screen.getByRole("button", { name: "创建任务" }));
  expect(screen.getByText("增加图表回归")).toBeVisible();
  await user.selectOptions(
    screen.getByRole("combobox", { name: "DS-107 状态" }),
    "已完成",
  );
  expect(
    within(screen.getByRole("region", { name: "已完成" })).getByText(
      "增加图表回归",
    ),
  ).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("DS-107 已移至已完成");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "按负责人筛选" }),
    "Mia",
  );
  expect(screen.queryByText("增加图表回归")).not.toBeInTheDocument();
});

it("saves a settings baseline and can undo only unsaved edits", async () => {
  const user = userEvent.setup();
  render(<SettingsExample />);
  const name = screen.getByRole("textbox", { name: "工作区名称" });
  await user.clear(name);
  await user.type(name, "产品研发组");
  await user.click(screen.getByRole("button", { name: "保存偏好" }));
  expect(screen.getByRole("status")).toHaveTextContent("演示设置已保存。");
  await user.type(name, "临时");
  await user.click(screen.getByRole("checkbox", { name: "接收工作区通知" }));
  expect(screen.getByRole("radio", { name: "每日摘要" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "撤销更改" }));
  expect(name).toHaveValue("产品研发组");
  expect(screen.getByRole("radio", { name: "每日摘要" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "撤销更改" })).toBeDisabled();
});

it("uses the selected period for charts and accessible underlying tables", async () => {
  const user = userEvent.setup();
  render(<AnalyticsExample />);
  await user.click(screen.getByRole("tab", { name: "数据明细" }));
  expect(
    within(screen.getByRole("region", { name: "每日数据明细" })).getAllByRole(
      "row",
    ),
  ).toHaveLength(8);
  await user.selectOptions(
    screen.getByRole("combobox", { name: "统计周期" }),
    "14",
  );
  expect(
    within(screen.getByRole("region", { name: "每日数据明细" })).getAllByRole(
      "row",
    ),
  ).toHaveLength(15);
  expect(screen.getByRole("region", { name: "订单来源明细" })).toBeVisible();
  expect(screen.getByRole("region", { name: "收入构成明细" })).toBeVisible();
});

it("preserves a draft when changing style, mode, density and source view", async () => {
  window.history.replaceState(null, "", "/#/examples/settings");
  const user = userEvent.setup();
  render(<DocsApp />);
  const name = await screen.findByRole("textbox", { name: "工作区名称" });
  await user.clear(name);
  await user.type(name, "保留输入");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "视觉风格" }),
    "glass",
  );
  await user.selectOptions(
    screen.getByRole("combobox", { name: "示例密度" }),
    "compact",
  );
  await user.click(screen.getByRole("button", { name: "切换深色主题" }));
  expect(document.documentElement).toHaveAttribute("data-ui-style", "glass");
  expect(document.documentElement).toHaveAttribute(
    "data-ui-density",
    "compact",
  );
  expect(document.documentElement).toHaveClass("dark");
  await user.click(screen.getByRole("tab", { name: "源码", exact: true }));
  expect(
    await screen.findByRole("region", {
      name: "showcase/examples/SettingsExample.tsx",
    }),
  ).toHaveTextContent("export function SettingsExample");
  expect(name).not.toBeVisible();
  await user.click(screen.getByRole("tab", { name: "预览", exact: true }));
  expect(screen.getByRole("textbox", { name: "工作区名称" })).toHaveValue(
    "保留输入",
  );
});
