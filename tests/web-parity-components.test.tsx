import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { AgentOrgChart } from "@/components/agents/agent-org-chart";
import { AgentPlanPill, AgentPlanRunner, type PlanStep } from "@/components/agents/agent-plan";
import { AgentRunTimeline, type AgentRunStep } from "@/components/agents/agent-run-timeline";
import { AgentTeam } from "@/components/agents/agent-team";
import { AgentRunsList, TraceWaterfall, type AgentTraceRun } from "@/components/agents/agent-traces";
import { BackgroundAgents } from "@/components/agents/background-agents";
import { ContextMeter } from "@/components/agents/context-window";
import { DiffReview } from "@/components/agents/diff-review";
import { ModelPicker } from "@/components/agents/model-picker";
import { ToolApprovalQueue } from "@/components/agents/tool-approval-queue";
import { NeobankAppPreview } from "@/components/mobile/previews/neobank-app-screen";
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

  test("DiffReview renders custom subtitle, accepts hunks, and enables commit", async () => {
    const decided: string[] = [];
    let committedMsg = "";
    const view = render(
      <DiffReview
        subtitle="Atlas · Add rate limits to the API"
        files={[
          {
            id: "f1",
            path: "src/rate-limit.ts",
            versions: [
              {
                id: "v1",
                label: "v1",
                hunks: [
                  {
                    id: "h1",
                    label: "Limit middleware",
                    lines: [
                      { id: "l1", type: "removed", oldLine: 1, content: "const limit = 0;" },
                      { id: "l2", type: "added", newLine: 1, content: "const limit = 60;" },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
        onDecision={(target, decision) => {
          decided.push(`${target.hunkId}:${decision}`);
        }}
        onCommit={(msg) => {
          committedMsg = msg;
        }}
      />,
    );

    expect(view.getByText("Atlas · Add rate limits to the API")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: "Accept Limit middleware" }));
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(decided).toEqual(["h1:accepted"]);

    const commitInput = view.getByLabelText("Commit message");
    fireEvent.change(commitInput, { target: { value: "feat: enforce limit" } });
    fireEvent.click(view.getByRole("button", { name: "Commit" }));
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(committedMsg).toBe("feat: enforce limit");
  });

  test("ContextMeter triggers compact action and toggles auto-compact", async () => {
    let compacted = 0;
    let autoToggled = false;
    const view = render(
      <ContextMeter
        capacity={200000}
        model="Claude Opus 4.5"
        autoCompact={false}
        onAutoCompactChange={() => {
          autoToggled = true;
        }}
        onCompact={() => {
          compacted += 1;
        }}
        categories={[
          { id: "system", label: "System prompt", tokens: 12000 },
          { id: "conversation", label: "Conversation", tokens: 84000 },
        ]}
      />,
    );

    expect(view.getByText("Context window")).toBeTruthy();
    expect(view.getByText("Claude Opus 4.5")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: "Automatic context compaction" }));
    expect(autoToggled).toBe(true);
    fireEvent.click(view.getByRole("button", { name: "Compact now" }));
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(compacted).toBe(1);
  });

  test("BackgroundAgents answers blocking prompts and queues new background tasks", async () => {
    const answers: string[] = [];
    const submitted: string[] = [];
    const view = render(
      <BackgroundAgents
        agents={[
          {
            id: "a1",
            title: "Migrate session store",
            status: "needs-input",
            branch: "feat/sessions",
            question: "Should legacy cookies expire immediately?",
            answerOptions: ["Keep 7d grace window"],
          },
        ]}
        onAnswer={(id, ans) => {
          answers.push(`${id}:${ans}`);
        }}
        onSubmit={(task) => {
          submitted.push(task);
        }}
      />,
    );

    fireEvent.click(view.getByRole("button", { name: "Keep 7d grace window" }));
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(answers).toEqual(["a1:Keep 7d grace window"]);

    fireEvent.change(view.getByLabelText("New background task"), {
      target: { value: "Audit webhook retries" },
    });
    fireEvent.click(view.getByRole("button", { name: "Start" }));
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(submitted).toEqual(["Audit webhook retries"]);
  });

  test("TraceWaterfall and AgentRunsList render telemetry and allow run inspection", () => {
    const sampleRuns: AgentTraceRun[] = [
      {
        id: "run-1",
        name: "Triage ticket #402",
        status: "completed",
        startedAt: "10:04",
        durationMs: 920,
        cost: 0.012,
        recentLatenciesMs: [400, 620, 920],
        spans: [
          { id: "s1", name: "Planner", kind: "agent", startMs: 0, durationMs: 920, status: "completed" },
          { id: "s2", parentId: "s1", name: "Search docs", kind: "retrieval", startMs: 120, durationMs: 310, status: "completed" },
        ],
      },
    ];
    const pickedRuns: Array<string | null> = [];
    const view = render(
      <>
        <TraceWaterfall run={sampleRuns[0]} />
        <AgentRunsList runs={sampleRuns} onSelectedRunChange={(id) => { pickedRuns.push(id); }} />
      </>,
    );

    expect(view.getByRole("region", { name: "Triage ticket #402 trace waterfall" })).toBeTruthy();
    expect(view.getByLabelText("Trace playhead")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: /Triage ticket #402/i }));
    expect(pickedRuns).toEqual(["run-1"]);
  });

  test("ToolApprovalQueue handles A and D keyboard shortcuts cleanly", async () => {
    const decisions: string[] = [];
    const view = render(
      <ToolApprovalQueue
        title="Atlas · Ship the pricing page fix"
        requests={[
          {
            id: "req-1",
            tool: "Terminal",
            target: "bun run check",
            risk: "low",
            rule: "terminal:check",
            ruleDescription: "check scripts",
            kind: "command",
            preview: "bun run check",
          },
        ]}
        onDecision={(decision) => {
          decisions.push(`${decision.requestId}:${decision.decision}`);
        }}
      />,
    );

    expect(view.getByText("Atlas · Ship the pricing page fix")).toBeTruthy();
    fireEvent.keyDown(window, { key: "d" });
    expect(view.getByLabelText("Note to agent")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "a" });
    await new Promise((resolve) => setTimeout(resolve, 15));
    expect(decisions).toEqual(["req-1:once"]);
  });

  test("NeobankAppPreview supports balance masking, quick deposit, card freeze, and activity tab", () => {
    const view = render(<NeobankAppPreview />);

    expect(view.getByText("Hi, Maya")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: "Hide total balance" }));
    expect(view.getByRole("button", { name: "Show total balance" })).toBeTruthy();

    fireEvent.click(view.getByRole("button", { name: "Deposit" }));
    fireEvent.click(view.getByRole("button", { name: "+$500 USDC" }));

    fireEvent.click(view.getByRole("button", { name: "Card" }));
    expect(view.getByText("Virtual Card")).toBeTruthy();
    fireEvent.click(view.getByRole("switch", { name: "Freeze card" }));
    expect(view.getByText("Card Frozen")).toBeTruthy();

    fireEvent.click(view.getByRole("button", { name: "Activity" }));
    expect(view.getAllByText("Deposit USDC").length).toBeGreaterThanOrEqual(2);
    expect(view.getByText("Just now")).toBeTruthy();
    fireEvent.click(view.getByRole("button", { name: /Deposit USDC Just now/i }));
    expect(view.getByText("Confirmed in vault")).toBeTruthy();
  });
});
