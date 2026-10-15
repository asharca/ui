import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { useState } from "react";
import {
  MorphingSearch,
  type MorphingSearchItem,
} from "@/components/motion/morphing-search";
import {
  cleanupOutsideAct,
  renderOutsideAct,
} from "@/tests/support/render-outside-act";

afterEach(cleanup);
afterEach(cleanupOutsideAct);

const itemsFor = (...titles: string[]): MorphingSearchItem[] =>
  titles.map((title) => ({ id: title, title }));

const FIVE = itemsFor("alpha", "beta", "gamma", "delta", "epsilon");
const TWO = itemsFor("alpha", "beta");
const OTHER_FIVE = itemsFor("one", "two", "three", "four", "five");

describe("MorphingSearch async results", () => {
  // Results arriving from a search reach the component as a new `items` prop,
  // in a commit of its own. These tests read that commit the way the browser
  // paints it, which is the window a real key press lands in. The dialog is
  // portalled to the body, so it is scoped to the document rather than to the
  // harness's own root. See tests/support/render-outside-act.tsx.
  const dialog = () => within(document.body).getByRole("dialog");
  const field = () => within(document.body).getByRole("combobox");
  const rows = () => within(document.body).getAllByRole("option");
  const activeRow = () => {
    const id = field().getAttribute("aria-activedescendant");
    return rows().find((row) => row.id === id) ?? null;
  };

  const press = (
    view: ReturnType<typeof renderOutsideAct>,
    key: string,
    times = 1,
  ) => {
    for (let i = 0; i < times; i += 1) {
      view.dispatch(
        dialog(),
        new KeyboardEvent("keydown", { key, bubbles: true }),
      );
      // A real key press gets a render between two keys, and nothing a
      // passive effect scheduled has settled in this window.
      view.flushPendingWork();
    }
  };

  test("keeps what the user types, and filters by it", () => {
    render(<MorphingSearch items={FIVE} defaultOpen />);
    const input = field() as HTMLInputElement;

    fireEvent.change(input, { target: { value: "gam" } });

    expect(input.value).toBe("gam");
    expect(rows().map((row) => row.textContent)).toEqual(["gamma"]);
  });

  test("keeps what the user types when the consumer tracks the query", () => {
    // The common shape: an inline `onQueryChange` that sets parent state. Each
    // keystroke re-renders the parent with a fresh callback, so anything keyed
    // to that callback's identity must not reset the field.
    function Consumer() {
      const [seen, setSeen] = useState("");
      return (
        <div>
          <output data-testid="seen">{seen}</output>
          <MorphingSearch
            items={FIVE}
            defaultOpen
            onQueryChange={(next) => setSeen(next)}
          />
        </div>
      );
    }
    const { container } = render(<Consumer />);
    const input = field() as HTMLInputElement;

    fireEvent.change(input, { target: { value: "gam" } });

    expect(input.value).toBe("gam");
    expect(
      container.querySelector("[data-testid='seen']")?.textContent,
    ).toBe("gam");
  });

  test("does not call the consumer back while it is rendering", () => {
    // `onQueryChange` is the consumer's, so firing it is a side effect and
    // belongs in an effect. Called from the render that opens, it sets state on
    // another component mid-render, which React rejects.
    function Consumer() {
      const [seen, setSeen] = useState("initial");
      return (
        <div>
          <output data-testid="seen">{seen}</output>
          <MorphingSearch items={FIVE} onQueryChange={(next) => setSeen(next)} />
        </div>
      );
    }
    const errors: unknown[] = [];
    const realError = console.error;
    console.error = (...args: unknown[]) => errors.push(args[0]);
    try {
      const { container } = render(<Consumer />);
      fireEvent.click(within(container).getByRole("button"));
      expect(errors).toEqual([]);
      expect(
        container.querySelector("[data-testid='seen']")?.textContent,
      ).toBe("");
    } finally {
      console.error = realError;
    }
  });

  test("never points at a row that the new results no longer have", () => {
    const view = renderOutsideAct(<MorphingSearch items={FIVE} defaultOpen />);
    press(view, "ArrowDown", 3);

    view.commit(<MorphingSearch items={TWO} defaultOpen />);

    expect(rows()).toHaveLength(2);
    expect(activeRow()).not.toBeNull();
  });

  test("selects the first row on a key pressed as the list shrinks", () => {
    const onSelect = mock((_item: MorphingSearchItem) => {});
    const view = renderOutsideAct(
      <MorphingSearch items={FIVE} defaultOpen onSelect={onSelect} />,
    );
    press(view, "ArrowDown", 3);

    view.commit(<MorphingSearch items={TWO} defaultOpen onSelect={onSelect} />);
    press(view, "Enter");

    // The row the user was aiming at is gone. The first row is where a new
    // query already puts the highlight, so Enter commits that rather than
    // nothing at all, and never a row the user never chose.
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: "alpha" });
  });

  test("drops the highlight when the results change without changing length", () => {
    // The case a positional index cannot see. Five rows become five different
    // rows, so nothing overruns, and a highlight kept by position alone would
    // hand Enter to whichever row inherited the slot.
    const onSelect = mock((_item: MorphingSearchItem) => {});
    const view = renderOutsideAct(
      <MorphingSearch items={FIVE} defaultOpen onSelect={onSelect} />,
    );
    press(view, "ArrowDown", 3);
    expect(activeRow()?.textContent).toContain("delta");

    view.commit(
      <MorphingSearch items={OTHER_FIVE} defaultOpen onSelect={onSelect} />,
    );
    press(view, "Enter");

    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: "one" });
  });

  test("does not revive the old row when the results come back", () => {
    const view = renderOutsideAct(<MorphingSearch items={FIVE} defaultOpen />);
    press(view, "ArrowDown", 3);

    // A live search that blanks its rows while fetching and returns the same
    // ones must not glide the highlight back onto a row the user has stopped
    // aiming at.
    view.commit(<MorphingSearch items={TWO} defaultOpen />);
    view.commit(<MorphingSearch items={FIVE} defaultOpen />);

    expect(activeRow()?.textContent).toContain("alpha");
  });

  test("moves one row per key when two keys land in one batch", () => {
    // Programmatic replay — a synthetic key sequence, an e2e driver, an `act`
    // block — can put two keydowns in one batch. Each still has to count.
    const view = renderOutsideAct(<MorphingSearch items={FIVE} defaultOpen />);
    const target = dialog();
    for (let i = 0; i < 3; i += 1) {
      view.dispatch(
        target,
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
    }
    view.flushPendingWork();

    expect(activeRow()?.textContent).toContain("delta");
  });
});

const GROUPED_ITEMS: MorphingSearchItem[] = [
  {
    id: "guide",
    title: "Alpha guide",
    group: "Docs",
    preview: <p>Getting started with the library.</p>,
  },
  {
    id: "team",
    title: "Team roster",
    description: "Workspace collaborators",
    group: "People",
    preview: <p>Three people belong to this workspace.</p>,
  },
  {
    id: "api",
    title: "API reference",
    group: "Docs",
    keywords: ["onboarding"],
    preview: <p>Available endpoints and parameters.</p>,
  },
  { id: "recent", title: "Recent activity" },
  {
    id: "invites",
    title: "Invites",
    group: "People",
    preview: <p>Two invitations are pending.</p>,
  },
];

describe("MorphingSearch grouped details", () => {
  const field = () => within(document.body).getByRole("combobox");
  const list = () => within(document.body).getByRole("listbox");
  const details = () =>
    within(document.body).getByRole("region", { name: "Result details" });
  const expectPreview = (title: string, content: string) => {
    expect(within(details()).getByRole("heading").textContent).toBe(title);
    expect(details().textContent).toContain(content);
  };

  test.each([
    [0, "guide", "Alpha guide"],
    [1, "api", "API reference"],
    [2, "team", "Team roster"],
    [3, "invites", "Invites"],
    [4, "recent", "Recent activity"],
  ] as const)("selects displayed result %i rather than source order", (steps, id, title) => {
    const onSelect = mock((_item: MorphingSearchItem) => {});
    render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen onSelect={onSelect} />);

    expect(
      within(list()).getAllByRole("group").map((group) => group.getAttribute("aria-label")),
    ).toEqual(["Docs", "People", "Results"]);
    const options = within(list()).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "Alpha guide",
      "API reference",
      "Team rosterWorkspace collaborators",
      "Invites",
      "Recent activity",
    ]);
    for (let step = 0; step < steps; step += 1) {
      fireEvent.keyDown(field(), { key: "ArrowDown" });
    }
    expect(field().getAttribute("aria-activedescendant")).toBe(options[steps]?.id);
    expect(within(details()).getByRole("heading").textContent).toBe(title);

    fireEvent.keyDown(field(), { key: "Enter" });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0].id).toBe(id);
  });

  test.each([
    [" DOCS ", ["Alpha guide", "API reference"]],
    ["collaborators", ["Team rosterWorkspace collaborators"]],
    ["onboarding", ["API reference"]],
    ["recent", ["Recent activity"]],
    ["zz", []],
  ])("filters searchable fields for %s", (query, expected) => {
    render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);

    fireEvent.change(field(), { target: { value: query } });

    expect(
      within(list()).queryAllByRole("option").map((option) => option.textContent),
    ).toEqual(expected);
    if (expected.length === 0) {
      expect(within(list()).getByText("No results found.")).not.toBeNull();
      expect(details().textContent).toBe("Select a result to preview.");
      expect(field().getAttribute("aria-activedescendant")).toBeNull();
    }
  });

  test("updates details on pointer, focus, and keyboard navigation", () => {
    render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);
    const team = within(list()).getByRole("option", { name: /Team roster/ });
    const api = within(list()).getByRole("option", { name: "API reference" });

    fireEvent.pointerEnter(team, { pointerType: "mouse" });
    expectPreview("Team roster", "Three people belong to this workspace.");
    expect(field().getAttribute("aria-activedescendant")).toBe(team.id);

    fireEvent.focus(api);
    expectPreview("API reference", "Available endpoints and parameters.");
    fireEvent.keyDown(field(), { key: "ArrowDown" });
    expectPreview("Team roster", "Three people belong to this workspace.");
    fireEvent.keyDown(field(), { key: "ArrowUp" });
    expectPreview("API reference", "Available endpoints and parameters.");

    fireEvent.pointerMove(team, { pointerType: "mouse" });
    expectPreview("Team roster", "Three people belong to this workspace.");
    fireEvent.pointerEnter(api, { pointerType: "touch" });
    expectPreview("Team roster", "Three people belong to this workspace.");
  });

  test("clears the query, restores groups, and returns focus to the field", () => {
    render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);
    const input = field() as HTMLInputElement;
    fireEvent.change(input, { target: { value: "People" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expectPreview("Invites", "Two invitations are pending.");
    const clear = within(document.body).getByRole("button", { name: "Clear search" });
    clear.focus();

    fireEvent.click(clear);

    expect(input.value).toBe("");
    expect(document.activeElement).toBe(input);
    expect(within(list()).getAllByRole("option")).toHaveLength(5);
    expect(
      within(list()).getAllByRole("group").map((group) => group.getAttribute("aria-label")),
    ).toEqual(["Docs", "People", "Results"]);
    expectPreview("Alpha guide", "Getting started with the library.");
  });

  test("replaces stale details when filtering removes the active result", () => {
    render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);
    fireEvent.keyDown(field(), { key: "ArrowDown" });
    expectPreview("API reference", "Available endpoints and parameters.");

    fireEvent.change(field(), { target: { value: "recent" } });
    expectPreview("Recent activity", "No details available.");
    expect(details().textContent).not.toContain("Available endpoints");

    fireEvent.change(field(), { target: { value: "zz" } });
    expect(details().textContent).toBe("Select a result to preview.");
    fireEvent.change(field(), { target: { value: "" } });
    expectPreview("Alpha guide", "Getting started with the library.");
  });

  test("does not revive removed active details when source items return", () => {
    const { rerender } = render(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);
    fireEvent.keyDown(field(), { key: "ArrowDown" });
    expectPreview("API reference", "Available endpoints and parameters.");

    rerender(
      <MorphingSearch items={GROUPED_ITEMS.filter((item) => item.id !== "api")} defaultOpen />,
    );
    expectPreview("Alpha guide", "Getting started with the library.");
    expect(details().textContent).not.toContain("Available endpoints");
    rerender(<MorphingSearch items={GROUPED_ITEMS} defaultOpen />);
    expectPreview("Alpha guide", "Getting started with the library.");
  });

  test("leaves detail control keys and actions independent of result selection", () => {
    const onSelect = mock((_item: MorphingSearchItem) => {});
    const onAction = mock(() => {});
    render(
      <MorphingSearch
        defaultOpen
        onSelect={onSelect}
        items={[
          {
            ...GROUPED_ITEMS[0],
            preview: <button type="button" onClick={onAction}>Read full guide</button>,
          },
          GROUPED_ITEMS[1],
        ]}
      />,
    );
    const action = within(details()).getByRole("button", { name: "Read full guide" });
    action.focus();
    const activeId = field().getAttribute("aria-activedescendant");

    expect(fireEvent.keyDown(action, { key: "ArrowDown" })).toBe(true);
    expect(fireEvent.keyDown(action, { key: "ArrowUp" })).toBe(true);
    expect(fireEvent.keyDown(action, { key: "Enter" })).toBe(true);
    expect(document.activeElement).toBe(action);
    expect(field().getAttribute("aria-activedescendant")).toBe(activeId);
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
    expect(within(document.body).getByRole("dialog")).not.toBeNull();
  });

  test("keeps details optional for flat results", () => {
    render(<MorphingSearch items={TWO} defaultOpen />);

    expect(within(document.body).queryByRole("region", { name: "Result details" })).toBeNull();
    expect(within(list()).getAllByRole("option").map((option) => option.textContent)).toEqual([
      "alpha",
      "beta",
    ]);
  });
});
