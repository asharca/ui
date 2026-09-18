import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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

it("connects workspace tabs to navigation, pinning, reordering and new windows", async () => {
  const user = userEvent.setup();
  const open = vi.spyOn(window, "open").mockReturnValue(null);
  render(<App />);
  const bar = screen.getByRole("navigation", { name: "工作区标签页" });
  const sidebar = screen.getByRole("navigation", { name: "组件分类" });
  await user.click(within(sidebar).getByRole("button", { name: "表单输入" }));
  expect(
    within(bar).getByRole("button", { name: "表单输入", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await user.click(within(bar).getByRole("button", { name: "固定 表单输入" }));
  expect(bar.querySelectorAll("[data-tab-id]")[1]).toHaveTextContent(
    "表单输入",
  );
  await user.click(
    within(bar).getByRole("button", { name: "取消固定 表单输入" }),
  );
  const source = within(bar)
    .getByRole("button", { name: "表单输入", exact: true })
    .closest("li")!;
  const target = within(bar)
    .getByRole("button", { name: "数据展示", exact: true })
    .closest("li")!;
  const dataTransfer = { setData: vi.fn(), effectAllowed: "", dropEffect: "" };
  fireEvent.dragStart(source, { dataTransfer });
  fireEvent.dragOver(target, { dataTransfer });
  fireEvent.drop(target, { dataTransfer });
  expect(bar.querySelectorAll("[data-tab-id]")[2]).toHaveTextContent(
    "表单输入",
  );
  await user.click(
    within(bar).getByRole("button", { name: "在新窗口打开 表单输入" }),
  );
  expect(open).toHaveBeenCalledWith(
    expect.stringContaining("view=forms&detached=1"),
    "_blank",
    "popup,noopener,noreferrer",
  );
  await user.click(within(bar).getByRole("button", { name: "关闭 表单输入" }));
  expect(
    within(bar).getByRole("button", { name: "聊天界面", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await user.click(within(bar).getByRole("button", { name: "新建标签页" }));
  expect(
    within(bar).getAllByRole("button", { name: "全部组件", exact: true }),
  ).toHaveLength(2);
  await user.click(within(sidebar).getByRole("button", { name: "基础控件" }));
  expect(
    within(bar).getAllByRole("button", { name: "全部组件", exact: true }),
  ).toHaveLength(1);
  expect(
    within(bar).getByRole("button", { name: "基础控件", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

it.each([
  ["all", "全部组件", "组件工作台"],
  ["data", "数据展示", "数据展示"],
  ["forms", "表单输入", "表单输入"],
  ["chat", "聊天界面", "聊天界面"],
  ["manual", "全部组件", "组件工作台"],
  ["unknown", "全部组件", "组件工作台"],
])(
  "isolates detached view %s on initial load and reload",
  (view, label, heading) => {
    window.history.replaceState(null, "", `/?view=${view}&detached=1`);
    const assertSingleTab = () => {
      expect(screen.queryByRole("button", { name: "使用手册" })).not.toBeInTheDocument();
      const bar = screen.getByRole("navigation", { name: "工作区标签页" });
      expect(bar.querySelectorAll("[data-tab-id]")).toHaveLength(1);
      expect(
        within(bar).getByRole("button", { name: label, exact: true }),
      ).toHaveAttribute("aria-current", "page");
      expect(
        view === "chat"
          ? screen.getByRole("region", { name: "聊天界面" })
          : screen.getByRole("heading", { name: heading, level: 1 }),
      ).toBeVisible();
    };
    const { unmount } = render(<App />);
    assertSingleTab();
    unmount();
    render(<App />);
    assertSingleTab();
  },
);

it("operates the new examples and filters by component name", async () => {
  const user = userEvent.setup();
  render(<App />);
  const email = screen.getByRole("switch", { name: /邮件通知/ });
  await user.click(email);
  expect(email).toHaveAttribute("aria-checked", "false");
  await user.click(
    screen.getByRole("button", { name: "如何邀请新的团队成员？" }),
  );
  expect(
    screen.getByText("在团队成员中填写对方的邮箱，选择对应角色后添加成员。"),
  ).toBeVisible();
  fireEvent.change(screen.getByRole("slider", { name: "发布进度" }), {
    target: { value: "100" },
  });
  expect(screen.getByRole("progressbar", { name: "发布进度" })).toHaveAttribute(
    "value",
    "100",
  );
  await user.click(screen.getByRole("button", { name: "邀请成员" }));
  await user.type(
    screen.getByRole("textbox", { name: "受邀成员邮箱" }),
    "new@example.com",
  );
  await user.click(screen.getByRole("button", { name: "添加", exact: true }));
  expect(screen.getByText("new@example.com")).toBeInTheDocument();
  await user.type(
    screen.getByRole("searchbox", { name: "搜索组件" }),
    "Switch",
  );
  expect(screen.getByRole("heading", { name: "通知偏好" })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "团队成员" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "查看代码 Switch" }));
  expect(
    screen.getByRole("region", { name: "Switch 示例代码" }),
  ).toHaveTextContent('<Switch id="email" defaultChecked />');
});

it("collapses to accessible icon navigation and remembers the preference", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);
  await user.click(screen.getByRole("button", { name: "折叠侧边栏" }));
  expect(screen.getByRole("button", { name: "展开侧边栏" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(localStorage.getItem("asharca-ui:sidebar-collapsed")).toBe("true");
  await user.click(
    within(screen.getByRole("navigation", { name: "组件分类" })).getByRole(
      "button",
      { name: "表单输入", exact: true },
    ),
  );
  expect(
    within(screen.getByRole("navigation", { name: "组件分类" })).getByRole(
      "button",
      { name: "表单输入", exact: true },
    ),
  ).toHaveAttribute("aria-current", "page");
  unmount();
  render(<App />);
  const expand = screen.getByRole("button", { name: "展开侧边栏" });
  expand.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: "折叠侧边栏" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(localStorage.getItem("asharca-ui:sidebar-collapsed")).toBe("false");
});

it("filters components, changes theme, creates a project and paginates", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(
    screen.getByRole("searchbox", { name: "搜索组件" }),
    "no-match",
  );
  expect(screen.getByText("没有匹配的组件")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "清除搜索" }));
  await user.click(screen.getByRole("button", { name: "切换深色主题" }));
  expect(document.documentElement).toHaveClass("dark");
  await user.click(screen.getAllByRole("button", { name: "新建项目" })[0]);
  const dialog = screen.getByRole("dialog", { name: "新建项目" });
  await user.type(within(dialog).getByLabelText("项目名称"), "Design System");
  expect(
    within(dialog).getByRole("button", { name: "创建项目" }),
  ).toBeDisabled();
  await user.clear(within(dialog).getByLabelText("项目名称"));
  await user.type(within(dialog).getByLabelText("项目名称"), "Test project");
  await user.click(within(dialog).getByRole("button", { name: "创建项目" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByText("Test project")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "上一页" }));
  expect(screen.getByText("Design System")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "已发布", exact: true }));
  expect(screen.getByText("Design System")).toBeInTheDocument();
  expect(
    screen.queryByText("Workspace", { exact: true }),
  ).not.toBeInTheDocument();
});
