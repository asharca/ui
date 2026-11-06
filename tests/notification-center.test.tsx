import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { NotificationPanel, type CenterNotification } from "@/components/motion/business-decisions/notification-center";

afterEach(cleanup);

test("an emptied selected notification category remains selected across host updates", () => {
  const build: CenterNotification = { id: "build", title: "Build finished", summary: "Ready to deploy", category: "Builds", group: "Today", createdAt: "Now", read: false };
  const audit: CenterNotification = { id: "audit", title: "Security review", summary: "Review required", category: "Audits", group: "Today", createdAt: "Now", read: false };
  const props = { onRead: () => undefined, onArchive: () => undefined };
  const view = render(<NotificationPanel {...props} notifications={[build, audit]} />);
  fireEvent.click(view.getByRole("tab", { name: "Builds" }));
  expect(view.getByRole("tab", { name: "Builds" }).getAttribute("aria-selected")).toBe("true");

  view.rerender(<NotificationPanel {...props} notifications={[audit]} />);
  expect(view.getByRole("tab", { name: "Builds" }).getAttribute("aria-selected")).toBe("true");

  fireEvent.keyDown(view.getByRole("tab", { name: "Builds" }), { key: "ArrowRight" });
  expect(view.getByRole("tab", { name: "All" }).getAttribute("aria-selected")).toBe("true");
  expect(view.getByText(audit.title)).toBeTruthy();
  fireEvent.keyDown(view.getByRole("tab", { name: "All" }), { key: "End" });
  expect(view.getByRole("tab", { name: "Builds" }).getAttribute("aria-selected")).toBe("true");
  expect(view.getByRole("tab", { name: "Builds" }).tabIndex).toBe(0);

  const replacement = { ...build, id: "next-build", title: "Next build finished" };
  view.rerender(<NotificationPanel {...props} notifications={[audit, replacement]} />);
  expect(view.getByRole("tab", { name: "Builds" }).getAttribute("aria-selected")).toBe("true");
  expect(view.getByText(replacement.title)).toBeTruthy();

  fireEvent.click(view.getByRole("tab", { name: "All" }));
  expect(view.getByText(audit.title)).toBeTruthy();
  expect(view.getByRole("tab", { name: "All" }).getAttribute("aria-selected")).toBe("true");
});
