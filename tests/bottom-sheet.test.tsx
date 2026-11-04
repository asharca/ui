import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { BottomSheet } from "@/components/motion/bottom-sheet";

afterEach(cleanup);

function TestSheet() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Quick actions"
        description="Drag the handle to dismiss."
      >
        <p>Sheet body</p>
      </BottomSheet>
    </>
  );
}

describe("BottomSheet", () => {
  test("names the dialog from the visible title", () => {
    const { getByRole } = render(<TestSheet />);
    const dialog = getByRole("dialog", { name: "Quick actions" });
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    const descriptionId = dialog.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId ?? "")?.textContent).toBe(
      "Drag the handle to dismiss.",
    );
    expect(dialog.getAttribute("aria-label")).toBeNull();
  });

  test("falls back to a label when the sheet has no title", () => {
    const { getByRole } = render(
      <BottomSheet open onOpenChange={() => {}}>
        <p>Sheet body</p>
      </BottomSheet>,
    );

    const dialog = getByRole("dialog", { name: "Bottom sheet" });
    expect(dialog.getAttribute("aria-labelledby")).toBeNull();
  });

  test("closes on Escape", () => {
    const onOpenChange = mock((_: boolean) => {});
    const { getByRole } = render(
      <BottomSheet
        open
        onOpenChange={onOpenChange}
        title="Quick actions"
        description="Drag the handle to dismiss."
      >
        <p>Sheet body</p>
      </BottomSheet>,
    );
    expect(getByRole("dialog", { name: "Quick actions" })).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("handles a focused control's Escape once and respects prevented events", () => {
    const onOpenChange = mock((_: boolean) => {});
    const { getByRole } = render(
      <BottomSheet open onOpenChange={onOpenChange} title="Quick actions">
        <button type="button">Copy link</button>
        <input aria-label="Search actions" onKeyDown={(event) => event.preventDefault()} />
      </BottomSheet>,
    );

    fireEvent.keyDown(getByRole("textbox", { name: "Search actions" }), { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.keyDown(getByRole("button", { name: "Copy link" }), { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("only the topmost sheet responds to Escape", () => {
    const closeFirst = mock((_: boolean) => {});
    const closeSecond = mock((_: boolean) => {});
    const previousPosition = document.body.style.position;
    const previousOverflow = document.body.style.overflow;
    const { unmount } = render(
      <>
        <BottomSheet open onOpenChange={closeFirst} title="First sheet" />
        <BottomSheet open onOpenChange={closeSecond} title="Second sheet" />
      </>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(closeFirst).not.toHaveBeenCalled();
    expect(closeSecond).toHaveBeenCalledTimes(1);
    expect(closeSecond).toHaveBeenCalledWith(false);
    unmount();
    expect(document.body.style.position).toBe(previousPosition);
    expect(document.body.style.overflow).toBe(previousOverflow);
  });

  test("keeps the title outside the drag handle", () => {
    const { getByRole } = render(<TestSheet />);
    const dialog = getByRole("dialog", { name: "Quick actions" });
    const title = getByRole("heading", { name: "Quick actions" });
    const handle = dialog.querySelector(".touch-none");
    expect(handle).toBeTruthy();
    expect(handle?.className).toContain("[-webkit-touch-callout:none]");
    expect(title.closest(".touch-none")).toBeNull();
  });
});
