import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ModelPicker } from "@/components/agents/model-picker";
import {
  AnimatedSelect,
  AnimatedSelectContent,
  AnimatedSelectItem,
  AnimatedSelectTrigger,
  AnimatedSelectValue,
} from "@/components/motion/animated-select";
import { LegalPage } from "@/components/motion/legal-page";
import { PromptLibrary } from "@/components/motion/prompt-library";
import { PublicRoadmapBoard } from "@/components/motion/roadmap-board";

afterEach(cleanup);

describe("Web parity components", () => {
  test("AnimatedSelect opens, filters options, and updates selection", () => {
    const selected: string[] = [];
    const view = render(
      <AnimatedSelect defaultValue="one" onValueChange={(v) => selected.push(v)}>
        <AnimatedSelectTrigger ariaLabel="Pick status">
          <AnimatedSelectValue />
        </AnimatedSelectTrigger>
        <AnimatedSelectContent searchable>
          <AnimatedSelectItem value="one" label="First option" />
          <AnimatedSelectItem value="two" label="Second option" />
        </AnimatedSelectContent>
      </AnimatedSelect>,
    );

    const trigger = view.getByRole("combobox", { name: "Pick status" });
    expect(trigger.textContent).toContain("First option");

    fireEvent.click(trigger);
    const second = view.getByRole("option", { name: "Second option" });
    fireEvent.click(second);

    expect(selected).toEqual(["two"]);
    expect(trigger.textContent).toContain("Second option");
  });

  test("ModelPicker filters grouped models and selects cleanly", () => {
    const picked: string[] = [];
    const view = render(
      <ModelPicker
        providers={[
          { id: "a", name: "Alpha" },
          { id: "b", name: "Beta" },
        ]}
        models={[
          { id: "m1", providerId: "a", name: "Alpha Fast" },
          { id: "m2", providerId: "b", name: "Beta Reasoner" },
        ]}
        defaultValue="m1"
        onValueChange={(id) => picked.push(id)}
      />,
    );

    fireEvent.click(view.getByRole("button", { name: /Alpha Fast/i }));
    const search = view.getByPlaceholderText(/Search models/i);
    fireEvent.change(search, { target: { value: "Reasoner" } });
    fireEvent.click(view.getByRole("option", { name: /Beta Reasoner/i }));
    expect(picked).toEqual(["m2"]);
  });

  test("PromptLibrary filters by category and fills template variables in modal", () => {
    const view = render(
      <PromptLibrary
        prompts={[
          {
            id: "p1",
            title: "Release digest",
            template: "Summarize changes for {{audience}}.",
            category: "Writing",
            uses: 12,
            starred: true,
          },
          {
            id: "p2",
            title: "SQL explain",
            template: "Inspect query on {{engine}}.",
            category: "Code",
            uses: 8,
            starred: false,
          },
        ]}
      />,
    );

    fireEvent.click(view.getByRole("tab", { name: /Code/i }));
    expect(view.queryByText("Release digest")).toBeNull();
    expect(view.getByText("SQL explain")).toBeTruthy();

    fireEvent.click(view.getByRole("tab", { name: /All/i }));
    fireEvent.click(view.getByText("Release digest"));
    const input = view.getByPlaceholderText("Enter audience");
    fireEvent.change(input, { target: { value: "executives" } });
    expect(view.getByText("Summarize changes for executives.")).toBeTruthy();
  });

  test("PublicRoadmapBoard adds suggested items into Planned", () => {
    const items = [
      {
        id: "r1",
        title: "Existing item",
        description: "Baseline",
        area: "Apps",
        stage: "planned" as const,
        votes: 10,
      },
    ];
    let suggestedTitle = "";
    const view = render(
      <PublicRoadmapBoard
        areas={["Apps", "Data"]}
        items={items}
        onSuggest={(input) => {
          suggestedTitle = input.title;
        }}
      />,
    );

    fireEvent.click(view.getByRole("button", { name: /Suggest a feature/i }));
    fireEvent.change(view.getByLabelText("Suggested feature title"), {
      target: { value: "CSV Export" },
    });
    fireEvent.click(view.getByRole("button", { name: /Post idea/i }));
    expect(suggestedTitle).toBe("CSV Export");
  });

  test("LegalPage toggles highlighted removed segments when Show changes is turned on", () => {
    const view = render(
      <LegalPage
        policies={[
          {
            id: "privacy",
            label: "Privacy",
            title: "Privacy policy",
            summary: "Summary copy",
            version: "4",
            previousVersion: "3",
            updatedAt: "Nov 3, 2026",
            effectiveAt: "Dec 1, 2026",
            sections: [
              {
                id: "s1",
                number: "01",
                title: "Collection",
                inShort: "Short summary",
                paragraphs: [
                  [
                    { text: "Keep this. " },
                    { text: "New rule.", change: "added" },
                    { text: "Old rule.", change: "removed" },
                  ],
                ],
              },
            ],
          },
        ]}
      />,
    );

    expect(view.queryByText("Old rule.")).toBeNull();
    fireEvent.click(
      view.getByRole("switch", { name: "Show changes since version 3" }),
    );
    expect(view.getByText("Old rule.")).toBeTruthy();
  });
});
