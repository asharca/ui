import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { WorkspaceExample as App } from "../../showcase/examples/WorkspaceExample";

vi.mock("../../src/ChatThread", () => ({
  ChatThread: () => <div>Chat preview</div>,
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

it("connects sidebar navigation to tabs and detaches one tab at a time", async () => {
  const user = userEvent.setup();
  const replace = vi.fn();
  const popup = {
    opener: window,
    location: { replace },
  } as unknown as Window;
  const open = vi.spyOn(window, "open").mockReturnValue(popup);
  render(<App />);

  const bar = screen.getByRole("navigation", { name: "工作区标签页" });
  const sidebar = screen.getByRole("navigation", { name: "工作区导航" });
  await user.click(within(sidebar).getByRole("button", { name: "成员" }));

  expect(screen.getByRole("heading", { name: "成员", level: 1 })).toBeVisible();
  expect(document.querySelector('[data-workspace-layout="members"]')).toBeInTheDocument();
  expect(within(bar).getByRole("button", { name: "成员", exact: true })).toHaveAttribute("aria-current", "page");

  await user.click(within(bar).getByRole("button", { name: "固定 成员" }));
  expect(within(bar).getByRole("button", { name: "取消固定 成员" })).toHaveAttribute("aria-pressed", "true");
  await user.click(within(bar).getByRole("button", { name: "取消固定 成员" }));
  await user.click(within(bar).getByRole("button", { name: "单独打开 成员" }));

  expect(open).toHaveBeenCalledWith("about:blank", "_blank", "popup");
  expect(replace).toHaveBeenCalledWith(expect.stringContaining("view=members&detached=1"));
  expect(popup.opener).toBeNull();
  expect(within(bar).queryByRole("button", { name: "成员", exact: true })).not.toBeInTheDocument();
  expect(within(bar).getByRole("button", { name: "智能体", exact: true })).toHaveAttribute("aria-current", "page");

  await user.click(within(bar).getByRole("button", { name: "新建标签页" }));
  expect(within(bar).getAllByRole("button", { name: "助手", exact: true })).toHaveLength(2);
  await user.click(within(sidebar).getByRole("button", { name: "MCP" }));
  expect(within(bar).getAllByRole("button", { name: "助手", exact: true })).toHaveLength(1);
  expect(within(bar).getByRole("button", { name: "MCP", exact: true })).toHaveAttribute("aria-current", "page");
  expect(document.querySelector('[data-workspace-layout="mcp"]')).toBeInTheDocument();
});

it("renders a distinct content layout for every sidebar destination", async () => {
  const user = userEvent.setup();
  render(<App />);
  const sidebar = screen.getByRole("navigation", { name: "工作区导航" });
  expect(within(sidebar).getAllByRole("button")).toHaveLength(6);
  const cases = [
    ["智能体", "agents", "发布检查"],
    ["知识库", "knowledge", "产品文档"],
    ["成员", "members", "Ava Chen"],
    ["市场", "market", "代码审查助手"],
    ["MCP", "mcp", "代码仓库"],
  ] as const;

  for (const [label, layout, item] of cases) {
    await user.click(within(sidebar).getByRole("button", { name: label }));
    expect(screen.getByRole("heading", { name: label, level: 1 })).toBeVisible();
    expect(document.querySelector(`[data-workspace-layout="${layout}"]`)).toBeInTheDocument();
    expect(screen.getByText(item)).toBeVisible();
  }
});

it.each([
  ["work", "智能体", "agents"],
  ["members", "成员", "members"],
  ["mcp", "MCP", "mcp"],
  ["chat", "助手", "chat"],
  ["unknown", "助手", "chat"],
])("renders detached view %s without the workspace shell", (view, label, layout) => {
  window.history.replaceState(null, "", `/?view=${view}&detached=1#/examples/workspace`);
  render(<App />);

  expect(document.querySelector(".workbench")).toHaveAttribute("data-detached", "true");
  expect(screen.queryByRole("navigation", { name: "工作区导航" })).not.toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: "工作区标签页" })).not.toBeInTheDocument();
  if (layout === "chat") {
    expect(screen.getByRole("region", { name: "聊天界面" })).toBeVisible();
  } else {
    expect(screen.getByRole("heading", { name: label, level: 1 })).toBeVisible();
    expect(document.querySelector(`[data-workspace-layout="${layout}"]`)).toBeInTheDocument();
  }
});

it("collapses to accessible icon navigation and remembers the preference", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);
  await user.click(screen.getByRole("button", { name: "折叠侧边栏" }));
  expect(screen.getByRole("button", { name: "展开侧边栏" })).toHaveAttribute("aria-expanded", "false");
  expect(localStorage.getItem("asharca-ui:sidebar-collapsed")).toBe("true");
  await user.click(within(screen.getByRole("navigation", { name: "工作区导航" })).getByRole("button", { name: "成员" }));
  expect(within(screen.getByRole("navigation", { name: "工作区导航" })).getByRole("button", { name: "成员" })).toHaveAttribute("aria-current", "page");

  unmount();
  render(<App />);
  const expand = screen.getByRole("button", { name: "展开侧边栏" });
  expand.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: "折叠侧边栏" })).toHaveAttribute("aria-expanded", "true");
  expect(localStorage.getItem("asharca-ui:sidebar-collapsed")).toBe("false");
});

it("filters the active page and keeps workspace actions local to that tab", async () => {
  const user = userEvent.setup();
  render(<App />);
  const sidebar = screen.getByRole("navigation", { name: "工作区导航" });
  await user.click(within(sidebar).getByRole("button", { name: "市场" }));

  const search = screen.getByRole("searchbox", { name: "搜索市场" });
  await user.type(search, "发布协调器");
  expect(screen.getByText("发布协调器")).toBeVisible();
  expect(screen.queryByText("代码审查助手")).not.toBeInTheDocument();
  await user.clear(search);
  await user.type(search, "no-match");
  expect(screen.getByText("没有匹配的市场")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "清除搜索" }));
  await user.click(screen.getByRole("button", { name: "浏览市场", exact: true }));
  expect(screen.getByRole("status")).toHaveTextContent("浏览市场：演示操作已触发");

  await user.click(screen.getByRole("button", { name: "切换深色主题" }));
  expect(document.documentElement).toHaveClass("dark");
});
