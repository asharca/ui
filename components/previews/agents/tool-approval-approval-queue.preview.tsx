"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import {
  ToolApprovalQueue,
  type QueuedToolRequest,
  type ResolvedToolRequest,
} from "@/components/agents/tool-approval-queue";

const requests: QueuedToolRequest[] = [
  {
    id: "build",
    tool: "Run a shell command",
    target: "apps/web",
    risk: "low",
    rule: "shell:bun-run:apps/web",
    ruleDescription: "bun run *",
    allowAlways: true,
    kind: "command",
    preview: "$ bun run build --filter=web",
    reason: "Build the site to check the new pricing grid compiles.",
  },
  {
    id: "edit",
    tool: "Edit a file",
    target: "app/pricing/plans.ts",
    risk: "medium",
    rule: "edit:app/pricing/plans.ts",
    ruleDescription: "app/pricing/plans.ts",
    kind: "diff",
    preview: ' export function featured(plan: Plan) {\n-  return plan.id === "starter";\n+  return plan.id === "featured";\n }',
    reason: "Feature the plan selected for the new pricing page.",
  },
  {
    id: "test",
    tool: "Run a shell command",
    target: "apps/web",
    risk: "low",
    rule: "shell:bun-run:apps/web",
    ruleDescription: "bun run *",
    allowAlways: true,
    kind: "command",
    preview: "$ bun run test --filter=pricing",
    reason: "Check the updated plan labels and prices.",
  },
  {
    id: "database",
    tool: "Write to the database",
    target: "prod · plans",
    risk: "high",
    rule: "write:prod/plans",
    ruleDescription: "prod · plans",
    icon: <Database />,
    kind: "command",
    preview: "UPDATE plans\nSET featured = true\nWHERE id = 'scale';",
    reason: "Apply the selected featured plan. This request targets production.",
  },
  {
    id: "mail",
    tool: "Send a message",
    target: "pricing-team@example.test",
    risk: "medium",
    rule: "send:pricing-team",
    ruleDescription: "pricing-team@example.test",
    kind: "message",
    preview: "To: pricing-team@example.test\nSubject: Pricing page review\n\nThe updated pricing page is ready for review.",
    reason: "Share a summary with the review team.",
  },
];

export function ToolApprovalQueuePreview() {
  const [queue, setQueue] = useState(requests);
  const [history, setHistory] = useState<ResolvedToolRequest[]>([]);

  return (
    <div className="w-full py-2">
      <ToolApprovalQueue
        requests={queue}
        resolved={history}
        title="Atlas · Ship the pricing page fix"
        emptyDescription="The queue is ready for another run."
        onReplay={() => {
          setQueue(requests);
          setHistory([]);
        }}
        onDecision={async (decision) => {
          const outcomes = queue
            .filter((request) => decision.requestIds.includes(request.id))
            .map(
              (request): ResolvedToolRequest => ({
                ...request,
                decision:
                  decision.decision === "always" && request.id !== decision.requestId
                    ? "rule"
                    : decision.decision,
                note: decision.note,
              }),
            )
            .reverse();
          setHistory((current) => [...outcomes, ...current]);
          setQueue((current) =>
            current.filter((request) => !decision.requestIds.includes(request.id)),
          );
        }}
      />
    </div>
  );
}
