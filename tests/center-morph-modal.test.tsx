import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import {
  CenterMorphModal,
  CenterMorphModalContent,
  CenterMorphModalTrigger,
} from "@/components/motion/center-morph-modal";

afterEach(cleanup);

function TestModal() {
  return (
    <CenterMorphModal>
      <CenterMorphModalTrigger>
        <button type="button">Open profile</button>
      </CenterMorphModalTrigger>
      <CenterMorphModalContent ariaLabel="Profile">
        <p>Profile content</p>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}

describe("CenterMorphModal", () => {
  test("opens from its trigger and closes from the inset control", () => {
    const { getByRole, queryByRole } = render(<TestModal />);

    expect(queryByRole("dialog")).toBeNull();
    const trigger = getByRole("button", { name: "Open profile" });
    fireEvent.click(trigger);
    expect(getByRole("dialog", { name: "Profile" })).toBeTruthy();

    fireEvent.click(getByRole("button", { name: "Close modal" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("closes on Escape", () => {
    const { getByRole } = render(<TestModal />);

    const trigger = getByRole("button", { name: "Open profile" });
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("releases pointer events as soon as closing starts", () => {
    const { getByRole } = render(<TestModal />);

    fireEvent.click(getByRole("button", { name: "Open profile" }));
    const dialog = getByRole("dialog", { name: "Profile" });
    const backdrop = getByRole("button", { name: "Dismiss modal" });

    fireEvent.click(getByRole("button", { name: "Close modal" }));

    expect(dialog.style.pointerEvents).toBe("none");
    expect(backdrop.style.pointerEvents).toBe("none");
  });

  test("preserves focus while controlled callbacks and dismissibility change", async () => {
    const changes: number[] = [];
    const view = (revision: number, dismissible: boolean) => (
      <CenterMorphModal open onOpenChange={() => changes.push(revision)}>
        <CenterMorphModalTrigger>
          <button type="button">Open profile</button>
        </CenterMorphModalTrigger>
        <CenterMorphModalContent ariaLabel="Profile" dismissible={dismissible}>
          <input aria-label="Name" />
          <input aria-label="Email" />
        </CenterMorphModalContent>
      </CenterMorphModal>
    );
    const { getByRole, rerender } = render(view(0, true));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(document.activeElement).toBe(getByRole("textbox", { name: "Name" }));

    const email = getByRole("textbox", { name: "Email" });
    email.focus();
    rerender(view(1, false));
    expect(document.activeElement).toBe(email);
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(document.activeElement).toBe(email);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(changes).toEqual([]);

    rerender(view(2, true));
    expect(document.activeElement).toBe(email);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(changes).toEqual([2]);
  });

  test("keeps scrolling locked through interrupted and completed exits", async () => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "scroll";
    try {
      const { getByRole } = render(<TestModal />);
      const trigger = getByRole("button", { name: "Open profile" });
      fireEvent.click(trigger);
      const dialog = getByRole("dialog", { name: "Profile" });
      fireEvent.click(getByRole("button", { name: "Close modal" }));
      expect(document.activeElement).toBe(trigger);
      expect(dialog.isConnected).toBe(true);
      expect(document.body.style.overflow).toBe("hidden");

      fireEvent.click(trigger);
      expect(getByRole("dialog", { name: "Profile" })).toBe(dialog);
      expect(document.body.style.overflow).toBe("hidden");
      fireEvent.click(getByRole("button", { name: "Close modal" }));
      expect(document.body.style.overflow).toBe("hidden");
      await waitFor(() => expect(dialog.isConnected).toBe(false));
      expect(document.body.style.overflow).toBe("scroll");
    } finally {
      cleanup();
      document.body.style.overflow = previousOverflow;
    }
  });
});
