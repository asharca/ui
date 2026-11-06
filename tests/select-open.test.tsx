import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";

function Field({
  open,
  defaultOpen,
  onOpenChange,
  label = "Time",
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
}) {
  return (
    <Select open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="09:00">09:00</SelectItem>
        <SelectItem value="17:00">17:00</SelectItem>
      </SelectContent>
    </Select>
  );
}

afterEach(cleanup);

describe("Select open state", () => {
  test("uncontrolled still toggles on its own", () => {
    const { getByRole } = render(<Field />);
    const trigger = getByRole("button");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("defaultOpen seeds the uncontrolled panel", () => {
    const { getByRole } = render(<Field defaultOpen />);
    expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  test("a controlled panel only moves when the consumer says so", () => {
    const onOpenChange = mock(() => {});
    const { getByRole } = render(<Field open={false} onOpenChange={onOpenChange} />);
    const trigger = getByRole("button");

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("controlled open renders the panel open without a click", () => {
    const { getByRole } = render(<Field open />);
    expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
    expect(getByRole("listbox").getAttribute("aria-hidden")).toBe("false");
  });

  test("one owner can keep a stack of selects to a single open panel", () => {
    function Stack() {
      const [openId, setOpenId] = useState<string | null>(null);
      return (
        <>
          <Field
            label="start"
            open={openId === "start"}
            onOpenChange={(next) => setOpenId(next ? "start" : null)}
          />
          <Field
            label="end"
            open={openId === "end"}
            onOpenChange={(next) => setOpenId(next ? "end" : null)}
          />
        </>
      );
    }

    const { getAllByRole } = render(<Stack />);
    const [start, end] = getAllByRole("button");

    fireEvent.click(start);
    expect(start.getAttribute("aria-expanded")).toBe("true");

    // Keyboard activation dispatches a click and no pointerdown, so nothing
    // outside-dismisses the first panel — the owner has to close it.
    fireEvent.click(end);
    expect(end.getAttribute("aria-expanded")).toBe("true");
    expect(start.getAttribute("aria-expanded")).toBe("false");
  });

  test("opening focus recovers when inherited visibility finishes transitioning", () => {
    const { getByRole, getByText } = render(<Field />);
    const trigger = getByRole("button");
    const option = getByText("09:00");
    trigger.focus();
    const focus = spyOn(option, "focus").mockImplementationOnce(() => {});
    try {
      fireEvent.click(trigger);
      expect(document.activeElement).toBe(trigger);
      // Happy DOM drops TransitionEvent.propertyName; preserve the browser payload.
      fireEvent(option, Object.assign(new Event("transitionend", { bubbles: true }), { propertyName: "visibility" }));
      expect(document.activeElement).toBe(option);
      fireEvent.keyDown(option, { key: "End" });
      expect(document.activeElement).toBe(getByRole("option", { name: "17:00" }));
    } finally {
      focus.mockRestore();
    }
  });

  test("deferred opening focus does not reclaim focus after the reader leaves", () => {
    const { getByRole, getByText } = render(<><Field /><button type="button">Outside</button></>);
    const trigger = getByRole("button", { name: "Time" });
    const outside = getByRole("button", { name: "Outside" });
    const option = getByText("09:00");
    trigger.focus();
    const focus = spyOn(option, "focus").mockImplementationOnce(() => {});
    try {
      fireEvent.click(trigger);
      outside.focus();
      fireEvent(option, Object.assign(new Event("transitionend", { bubbles: true }), { propertyName: "visibility" }));
      expect(document.activeElement).toBe(outside);
    } finally {
      focus.mockRestore();
    }
  });
});
