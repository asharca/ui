import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { MorphingModal } from "@/components/motion/morphing-modal";

const originalOverflow = document.body.style.overflow;

afterEach(() => {
  cleanup();
  document.body.style.overflow = originalOverflow;
});

function TestModal() {
  const [view, setView] = useState<string | null>(null);
  return (
    <div data-testid="clipping-parent" style={{ transform: "scale(0.8)", overflow: "hidden" }}>
      <button type="button" onClick={() => setView("options")}>Open options</button>
      <MorphingModal viewId={view} onClose={() => setView(null)}>
        {view === "options" ? (
          <button type="button" onClick={() => setView("details")}>View details</button>
        ) : view === "details" ? (
          <p>Wallet details</p>
        ) : null}
      </MorphingModal>
    </div>
  );
}

test("escapes transformed clipping parents and retains content through view and exit transitions", async () => {
  const { getByRole, getByText, getByTestId } = render(<TestModal />);
  const host = getByTestId("clipping-parent");
  fireEvent.click(getByRole("button", { name: "Open options" }));
  const backdrop = getByRole("button", { name: "Close modal" });
  const action = getByRole("button", { name: "View details" });
  expect(host.contains(backdrop)).toBe(false);
  expect(host.contains(action)).toBe(false);

  fireEvent.click(action);
  const details = getByText("Wallet details");
  expect(action.isConnected).toBe(true);
  await waitFor(() => expect(action.isConnected).toBe(false));
  expect(getByText("Wallet details")).toBe(details);

  fireEvent.click(backdrop);
  expect(details.isConnected).toBe(true);
  expect(details.closest("[inert]")).not.toBeNull();
  await waitFor(() => expect(details.isConnected).toBe(false));
  expect(backdrop.isConnected).toBe(false);
});

test("keeps scrolling locked until the final exit, including an interrupted close", async () => {
  document.body.style.overflow = "scroll";
  const { getByRole } = render(<TestModal />);
  const trigger = getByRole("button", { name: "Open options" });
  fireEvent.click(trigger);
  const backdrop = getByRole("button", { name: "Close modal" });
  const action = getByRole("button", { name: "View details" });

  fireEvent.click(backdrop);
  expect(action.isConnected).toBe(true);
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.click(trigger);
  expect(getByRole("button", { name: "View details" })).toBe(action);
  expect(document.body.style.overflow).toBe("hidden");

  fireEvent.click(backdrop);
  expect(document.body.style.overflow).toBe("hidden");
  await waitFor(() => expect(action.isConnected).toBe(false));
  expect(document.body.style.overflow).toBe("scroll");
});
