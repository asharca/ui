import { afterEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WorkspaceShell, openWorkspaceWindow } from "@/components/workspace/workspace-shell";
import { WorkspaceTabBar, type WorkspaceTab } from "@/components/workspace/workspace-tab-bar";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { buildShadcnItem } from "@/lib/registry-server";

afterEach(cleanup);
const tabs: WorkspaceTab[] = [{ id: "a", title: "概览", pinned: true }, { id: "b", title: "文档" }, { id: "c", title: "设置" }];
describe("beUI workspace", () => {
  test("keeps the same child nodes while the sidebar folds and slots change", () => {
    const view = (open: boolean) => <WorkspaceShell open={open} sidebar={<WorkspaceSidebar groups={[{ id: "nav", items: [{ id: "a", label: "概览" }] }]} />}><input aria-label="草稿" defaultValue="保持内容" /></WorkspaceShell>;
    const { rerender } = render(view(true));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "未提交的内容" } }); rerender(view(false));
    expect(screen.getByRole("textbox")).toBe(input);
    expect((input as HTMLInputElement).value).toBe("未提交的内容");
  });
  test("keeps the header trigger focused through repeated folds without stealing footer focus", () => {
    const view = (open: boolean) => <WorkspaceShell open={open} sidebar={<WorkspaceSidebar
      title="Workspace" logo={<span>W</span>} groups={[]}
      footer={<button type="button">Account</button>}
    />} />;
    const { rerender } = render(view(true));
    const trigger = screen.getByRole("button", { name: "折叠工作区侧栏" });
    act(() => trigger.focus());
    for (const open of [false, true, false, true]) {
      rerender(view(open));
      expect(document.activeElement).toBe(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe(String(open));
    }
    const account = screen.getByRole("button", { name: "Account" });
    act(() => account.focus());
    rerender(view(false));
    expect(document.activeElement).toBe(account);
  });
  test("controlled selection does not move until the host updates", () => {
    const select = mock(() => {});
    const { rerender } = render(<WorkspaceTabBar tabs={tabs} activeTabId="a" onSelect={select} />);
    fireEvent.click(screen.getByRole("tab", { name: "文档" }));
    expect(select).toHaveBeenCalledWith("b");
    expect(screen.getByRole("tab", { name: "概览" }).getAttribute("aria-selected")).toBe("true");
    rerender(<WorkspaceTabBar tabs={tabs} activeTabId="b" onSelect={select} />);
    expect(screen.getByRole("tab", { name: "文档" }).getAttribute("aria-selected")).toBe("true");
  });
  test("missing selection has a tabbable first item on its first render", () => {
    render(<WorkspaceTabBar tabs={tabs} activeTabId="missing" onSelect={() => {}} />);
    expect(screen.getByRole("tab", { name: "概览" }).tabIndex).toBe(0);
    expect(screen.getByRole("tab", { name: "文档" }).tabIndex).toBe(-1);
  });
  test("arrows, Home and End select the expected identity", () => {
    const select = mock(() => {});
    render(<WorkspaceTabBar tabs={tabs} activeTabId="b" onSelect={select} />);
    const item = screen.getByRole("tab", { name: "文档" });
    fireEvent.keyDown(item, { key: "ArrowRight" }); expect(select).toHaveBeenLastCalledWith("c");
    fireEvent.keyDown(item, { key: "Home" }); expect(select).toHaveBeenLastCalledWith("a");
    fireEvent.keyDown(item, { key: "End" }); expect(select).toHaveBeenLastCalledWith("c");
  });
  test("reorder shortcuts cannot cross the pinned boundary", () => {
    const reorder = mock(() => {});
    render(<WorkspaceTabBar tabs={tabs} activeTabId="b" onSelect={() => {}} onReorder={reorder} />);
    const item = screen.getByRole("tab", { name: "文档" });
    fireEvent.keyDown(item, { key: "ArrowLeft", altKey: true }); expect(reorder).not.toHaveBeenCalled();
    fireEvent.keyDown(item, { key: "ArrowRight", altKey: true }); expect(reorder).toHaveBeenCalledWith("b", "c");
  });
  test("pinned, non-closable and final tabs cannot close", () => {
    const close = mock(() => {});
    const { rerender } = render(<WorkspaceTabBar tabs={[tabs[0], { ...tabs[1], closable: false }]} activeTabId="a" onSelect={() => {}} onClose={close} />);
    fireEvent.keyDown(screen.getByRole("tab", { name: "概览" }), { key: "Delete" });
    fireEvent.keyDown(screen.getByRole("tab", { name: "文档" }), { key: "Delete" });
    rerender(<WorkspaceTabBar tabs={[tabs[1]]} activeTabId="b" onSelect={() => {}} onClose={close} />);
    fireEvent.keyDown(screen.getByRole("tab"), { key: "Delete" });
    expect(close).not.toHaveBeenCalled();
  });
  test("restores focus to the host-selected neighbor after removal", () => {
    const close = mock(() => {});
    const { rerender } = render(<WorkspaceTabBar tabs={tabs} activeTabId="b" onSelect={() => {}} onClose={close} />);
    fireEvent.click(screen.getByRole("button", { name: "关闭 文档" }));
    expect(close).toHaveBeenCalledWith("b");
    rerender(<WorkspaceTabBar tabs={[tabs[0], tabs[2]]} activeTabId="c" onSelect={() => {}} onClose={close} />);
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "设置" }));
  });
  test("standalone tab entries include their beUI menu and motion sources", async () => {
    const item = await buildShadcnItem("blocks", "workspace-tab-bar");
    expect(item).not.toBeNull();
    const files = item?.files.map((file) => file.path) ?? [];
    expect(files.some((path) => path.endsWith("components/motion/popover-morph.tsx"))).toBe(true);
    expect(files.some((path) => path.endsWith("components/workspace/workspace-tab-bar.tsx"))).toBe(true);
    expect(files.some((path) => path.includes("agent-internal"))).toBe(false);
  });
});

describe("workspace window boundary", () => {
  test("rejects cross-origin URLs before opening anything", () => {
    const previous = window.open; const open = mock(() => null); window.open = open;
    try {
      expect(() => openWorkspaceWindow("https://external.invalid/workspace")).toThrow();
      expect(() => openWorkspaceWindow("javascript:alert(1)")).toThrow();
      expect(open).not.toHaveBeenCalled();
    } finally { window.open = previous; }
  });
});
