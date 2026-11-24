import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { AgentOrgChart } from "@/components/agents/agent-org-chart";
import { AgentPlanPill, AgentPlanRunner, type PlanStep } from "@/components/agents/agent-plan";
import { AgentRunTimeline, type AgentRunStep } from "@/components/agents/agent-run-timeline";
import { AgentTeam } from "@/components/agents/agent-team";
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
  test("AnimatedSelect opens, filters options, and updates selection", async () => {
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

    // Re-open and close with Escape: trigger label must remain intact after exit cleanup.
    fireEvent.click(trigger);
    fireEvent.keyDown(view.getByRole("listbox"), { key: "Escape" });
    await new Promise((resolve) => setTimeout(resolve, 220));
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

  test("AgentOrgChart summarizes agents, running count, and fires onReplay", () => {
    let replayed = 0;
    const view = render(
      <AgentOrgChart
        onReplay={() => {
          replayed += 1;
        }}
        root={{
          id: "root",
          name: "Orchestrator",
          model: "Atlas 4",
          task: "Coordinate team",
          status: "running",
          cost: 0.12,
          elapsedSeconds: 4,
          accent: "blue",
          icon: "network",
          children: [
            {
              id: "r1",
              name: "Researcher",
              model: "Nimbus Pro",
              task: "Scan pricing",
              status: "done",
              cost: 0.08,
              elapsedSeconds: 3,
              accent: "sky",
              icon: "search",
            },
            {
              id: "c1",
              name: "Coder",
              model: "Kite Pro",
              task: "Implement toggle",
              status: "queued",
              cost: 0,
              elapsedSeconds: 0,
              accent: "emerald",
              icon: "code",
            },
          ],
        }}
      />,
    );

    expect(view.getByText("3 agents")).toBeTruthy();
    expect(view.getByText("Done")).toBeTruthy();
    expect(view.getByText("Queued")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: "Replay agent run" }));
    expect(replayed).toBe(1);
  });

  test("AgentRunTimeline shows subagent branch while running, folds out when done, and handles Approve gate", async () => {
    const runningSteps: AgentRunStep[] = [
      {
        id: "research",
        label: "Send out researchers",
        status: "running",
        elapsedSeconds: 2,
        progress: 40,
        subagents: [
          { id: "s1", name: "Scan competitor pricing", status: "running", elapsedSeconds: 2 },
          { id: "s2", name: "Queued helper", status: "queued" },
        ],
      },
      {
        id: "post",
        label: "Post to #launch",
        status: "pending",
        requiresApproval: true,
      },
    ];

    const view = render(<AgentRunTimeline title="Launch brief" steps={runningSteps} />);
    expect(view.getByText("Scan competitor pricing")).toBeTruthy();
    expect(view.queryByText("Queued helper")).toBeNull();
    expect(view.getByText("Needs approval")).toBeTruthy();
    expect(view.queryByRole("button", { name: /Approve/i })).toBeNull();

    let approved = "";
    view.rerender(
      <AgentRunTimeline
        title="Launch brief"
        onApprove={(id) => {
          approved = id;
        }}
        steps={[
          {
            id: "research",
            label: "Send out researchers",
            status: "completed",
            elapsedSeconds: 5,
            subagents: [
              { id: "s1", name: "Scan competitor pricing", status: "completed", elapsedSeconds: 3 },
            ],
          },
          {
            id: "post",
            label: "Post to #launch",
            status: "blocked",
            requiresApproval: true,
          },
        ]}
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 280));
    expect(view.queryByText("Scan competitor pricing")).toBeNull();
    expect(view.getByText("Waiting on you")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: /Approve/i }));
    expect(approved).toBe("post");
  });

  test("AgentTeam expands completed row without nested TodoList chrome and displays Report card", () => {
    const view = render(
      <AgentTeam
        agents={[
          {
            id: "lead",
            name: "Ship CSV export",
            role: "Lead",
            status: "completed",
            children: [
              {
                id: "research",
                name: "Researcher",
                role: "Researcher",
                color: "text-sky-500",
                status: "completed",
                summary: "Find how reports load their data",
                elapsedMs: 4000,
                steps: [{ id: "s1", title: "Read reports/loader.ts", status: "completed" }],
                report: "Reports load through one query.",
              },
            ],
          },
        ]}
      />,
    );

    const rowBtn = view.getByRole("button", { name: /Researcher/i });
    expect(rowBtn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(rowBtn);
    expect(rowBtn.getAttribute("aria-expanded")).toBe("true");
    expect(view.getByText("Find how reports load their data")).toBeTruthy();
    expect(view.getByText("Read reports/loader.ts")).toBeTruthy();
    expect(view.getByText("Report:")).toBeTruthy();
    expect(view.queryByText(/Researcher steps/i)).toBeNull();
  });

  test("AgentPlanRunner renders streamed inline logs, Up next queued notes, Retry, and Edit plan", async () => {
    let edited = 0;
    let retried = "";
    const steps: PlanStep[] = [
      { id: "a", title: "Find handlers", tool: "Search", status: "completed", elapsedMs: 1200 },
      {
        id: "b",
        title: "Run tests",
        tool: "Test",
        status: "failed",
        elapsedMs: 2000,
        logs: ["bun test services/billing", "46 passed, 2 failed"],
        error: "refunds.test.ts: credit applied twice",
      },
    ];
    const view = render(
      <AgentPlanRunner
        title="Add refund webhooks"
        steps={steps}
        status="failed"
        queuedNotes={[{ id: "n1", text: "Check idempotency key" }]}
        onRetry={(id) => {
          retried = id;
        }}
        onEdit={() => {
          edited += 1;
        }}
        onNote={() => {}}
      />,
    );

    expect(view.getByText("Relay")).toBeTruthy();
    expect(view.getByText("Needs attention")).toBeTruthy();
    expect(view.getByText("bun test services/billing")).toBeTruthy();
    expect(view.getByText("Up next")).toBeTruthy();
    expect(view.getByText("Check idempotency key")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: /Retry/i }));
    expect(retried).toBe("b");
    await new Promise((resolve) => setTimeout(resolve, 15));
    fireEvent.click(view.getByRole("button", { name: "Edit plan" }));
    expect(edited).toBe(1);
  });

  test("AgentPlanPill morphs from pill into runner, hides back to pill, and auto-opens on failure", () => {
    const runningSteps: PlanStep[] = [
      { id: "1", title: "Find handlers", tool: "Search", status: "running", elapsedMs: 600, logs: ['grep "webhook"'] },
      { id: "2", title: "Open PR", tool: "Ship", status: "pending", estimatedMs: 1500 },
    ];
    const view = render(
      <AgentPlanPill title="Add refund webhooks" steps={runningSteps} status="running" />,
    );

    const pillButton = view.getByRole("button", { name: "Show plan: Find handlers" });
    expect(view.queryByRole("button", { name: "Hide plan" })).toBeNull();
    fireEvent.click(pillButton);

    expect(view.queryByRole("button", { name: "Show plan: Find handlers" })).toBeNull();
    const hideBtn = view.getByRole("button", { name: "Hide plan" });
    expect(view.getByText("Add refund webhooks")).toBeTruthy();
    fireEvent.click(hideBtn);

    expect(view.getByRole("button", { name: "Show plan: Find handlers" })).toBeTruthy();

    view.rerender(
      <AgentPlanPill
        title="Add refund webhooks"
        steps={[
          { id: "1", title: "Find handlers", tool: "Search", status: "failed", error: "Timeout" },
          { id: "2", title: "Open PR", tool: "Ship", status: "pending", estimatedMs: 1500 },
        ]}
        status="failed"
      />,
    );
    expect(view.getByRole("button", { name: "Hide plan" })).toBeTruthy();
  });
});
