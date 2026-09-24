import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

afterEach(cleanup);

test("the workspace marker and beUI provider slot coexist on one root", () => {
  const { container, rerender } = render(<WorkspaceShell open><input aria-label="草稿" /></WorkspaceShell>);
  const root = container.querySelector("[data-workspace-shell]");
  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-slot")).toBe("sidebar-wrapper");
  expect(container.querySelectorAll("[data-slot='sidebar-wrapper']").length).toBe(1);
  expect(root?.contains(screen.getByRole("textbox"))).toBe(true);
  rerender(<WorkspaceShell open={false}><input aria-label="草稿" /></WorkspaceShell>);
  expect(container.querySelector("[data-workspace-shell]")).toBe(root);
  expect(root?.getAttribute("data-state")).toBe("collapsed");
});
