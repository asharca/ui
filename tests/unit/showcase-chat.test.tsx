import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import ChatExample from "../../showcase/ChatExample";

vi.mock("../../src/ChatThread", () => ({
  ChatThread: () => <div>Chat preview</div>,
}));
afterEach(cleanup);

it("creates, searches and renames conversations", async () => {
  const user = userEvent.setup();
  render(<ChatExample />);
  const sidebar = screen.getByRole("complementary", { name: "聊天会话" });
  await user.click(
    within(sidebar).getByRole("button", { name: "新建会话: Asharca" }),
  );
  expect(
    within(sidebar).getByRole("button", { name: "新会话", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await user.click(
    within(sidebar).getByRole("button", { name: "重命名会话: 新会话" }),
  );
  const dialog = screen.getByRole("dialog", { name: "重命名会话" });
  await user.clear(within(dialog).getByRole("textbox"));
  expect(within(dialog).getByRole("button", { name: "保存" })).toBeDisabled();
  await user.type(within(dialog).getByRole("textbox"), "Release plan");
  await user.click(within(dialog).getByRole("button", { name: "保存" }));
  const search = within(sidebar).getByRole("searchbox");
  await user.type(search, "Release");
  expect(
    within(sidebar).queryByRole("button", {
      name: "工作空间设计",
      exact: true,
    }),
  ).not.toBeInTheDocument();
  expect(
    within(sidebar).getByRole("button", { name: "Release plan", exact: true }),
  ).toBeInTheDocument();
});
