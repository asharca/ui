import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { AnimatedDropdown, type AnimatedDropdownItem } from "@/components/motion/animated-dropdown";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "@/components/motion/popover-morph";

const roles: AnimatedDropdownItem[] = [
  { id: "admin", kind: "option", value: "admin", label: "Admin", textValue: "Admin" },
  { id: "member", kind: "option", value: "member", label: "Member", textValue: "Member" },
  { id: "viewer", kind: "option", value: "viewer", label: "Viewer", textValue: "Viewer" },
];

afterEach(cleanup);

test("selected opening focus follows the current controlled value on reopening", async () => {
  const view = render(<AnimatedDropdown trigger="Role" ariaLabel="Role" items={roles} value="member" initialFocus="selected" />);
  const trigger = view.getByRole("button", { name: "Role" });
  act(() => trigger.focus());
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger, { detail: 1 });
  await waitFor(() => expect(document.activeElement).toBe(view.getByRole("menuitemradio", { name: "Member" })));
  fireEvent.keyDown(document.activeElement ?? window, { key: "Escape" });
  expect(document.activeElement).toBe(trigger);

  view.rerender(<AnimatedDropdown trigger="Role" ariaLabel="Role" items={roles} value="viewer" initialFocus="selected" />);
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger, { detail: 1 });
  await waitFor(() => expect(document.activeElement).toBe(view.getByRole("menuitemradio", { name: "Viewer" })));
});

test("disabled selected options fall back while explicit ArrowUp retains its edge behavior", async () => {
  const items = roles.map(item => item.id === "member" ? { ...item, disabled: true } : item);
  const { getByRole } = render(<AnimatedDropdown trigger="Role" ariaLabel="Role" items={items} value="member" initialFocus="selected" />);
  const trigger = getByRole("button", { name: "Role" });
  act(() => trigger.focus());
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger, { detail: 1 });
  await waitFor(() => expect(document.activeElement).toBe(getByRole("menuitemradio", { name: "Admin" })));
  fireEvent.keyDown(document.activeElement ?? window, { key: "Escape" });

  fireEvent.keyDown(trigger, { key: "ArrowUp" });
  await waitFor(() => expect(document.activeElement).toBe(getByRole("menuitemradio", { name: "Viewer" })));
});

test("nested menu selection and Escape preserve the owning popup until its own dismissal", async () => {
  const { getByRole, getAllByRole } = render(
    <MorphPopover defaultOpen>
      <MorphPopoverTrigger><button type="button">Notifications</button></MorphPopoverTrigger>
      <MorphPopoverContent>
        <AnimatedDropdown trigger="Actions" ariaLabel="Actions" items={roles} defaultValue="member" initialFocus="selected" />
      </MorphPopoverContent>
    </MorphPopover>,
  );
  const actions = await waitFor(() => getByRole("button", { name: "Actions" }));
  fireEvent.click(actions, { detail: 1 });
  await waitFor(() => expect(document.activeElement).toBe(getByRole("menuitemradio", { name: "Member" })));
  expect(getAllByRole("menu")).toHaveLength(1);
  const viewer = getByRole("menuitemradio", { name: "Viewer" });
  fireEvent.pointerDown(viewer);
  fireEvent.click(viewer);
  expect(getByRole("button", { name: "Notifications" }).getAttribute("aria-expanded")).toBe("true");
  expect(actions.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(actions, { detail: 1 });
  await waitFor(() => expect(document.activeElement).toBe(getByRole("menuitemradio", { name: "Viewer" })));
  expect(getByRole("menuitemradio", { name: "Viewer" }).getAttribute("aria-checked")).toBe("true");
  fireEvent.keyDown(document.activeElement ?? window, { key: "Escape" });
  expect(actions.getAttribute("aria-expanded")).toBe("false");
  expect(getByRole("button", { name: "Notifications" }).getAttribute("aria-expanded")).toBe("true");
  expect(document.activeElement).toBe(actions);
  fireEvent.keyDown(actions, { key: "Escape" });
  const notifications = getByRole("button", { name: "Notifications" });
  expect(notifications.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(notifications);
});

test("menu-root opening enters the first enabled row only on navigation", async () => {
  const items = roles.map(item => item.id === "admin" ? { ...item, disabled: true } : item);
  const view = render(<AnimatedDropdown trigger="Role" ariaLabel="Role" items={items} initialFocus="menu" />);
  const trigger = view.getByRole("button", { name: "Role" });
  act(() => trigger.focus());
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger, { detail: 1 });
  const menu = await view.findByRole("menu", { name: "Role" });
  await waitFor(() => expect(document.activeElement).toBe(menu));
  fireEvent.keyDown(menu, { key: "ArrowDown" });
  expect(document.activeElement).toBe(view.getByRole("menuitemradio", { name: "Member" }));
  fireEvent.keyDown(document.activeElement ?? window, { key: "Escape" });
  expect(document.activeElement).toBe(trigger);
  fireEvent.keyDown(trigger, { key: "ArrowUp" });
  await waitFor(() => expect(document.activeElement).toBe(view.getByRole("menuitemradio", { name: "Viewer" })));
});
