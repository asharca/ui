import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Manual } from "../../showcase/Manual";

afterEach(cleanup);

it("searches the manual, handles no results and opens the matching demo", async () => {
  const user = userEvent.setup();
  const navigate = vi.fn();
  render(<Manual onNavigate={navigate} />);
  expect(
    screen.getByRole("navigation", { name: "手册目录" }),
  ).toBeInTheDocument();
  const search = screen.getByRole("searchbox", { name: "搜索使用手册" });
  await user.type(search, "ChatComposerToolbar");
  expect(
    screen.getByRole("heading", { name: "自定义输入工具栏" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "安装与接入" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "复制统一工具菜单" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "打开对应示例" }));
  expect(navigate).toHaveBeenCalledWith("chat");
  await user.clear(search);
  await user.type(search, "not-a-real-component");
  expect(screen.getByRole("status")).toHaveTextContent("没有找到相关内容");
  await user.click(screen.getByRole("button", { name: "清除搜索" }));
  expect(
    screen.getByRole("heading", { name: "安装与接入" }),
  ).toBeInTheDocument();
});
