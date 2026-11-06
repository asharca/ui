"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import { ToolApprovalQueue, type QueuedToolRequest, type ResolvedToolRequest } from "@/components/agents/tool-approval-queue";

const requests: QueuedToolRequest[] = [
  { id: "build", tool: "Run a shell command", target: "apps/web", risk: "low", rule: "shell:bun-run:apps/web", ruleDescription: "bun run *", allowAlways: true, kind: "command", preview: "$ bun run build --filter=web", reason: "Build the site to check the new pricing grid compiles." },
  { id: "edit", tool: "Edit a file", target: "app/pricing/plans.ts", risk: "medium", rule: "edit:app/pricing/plans.ts", ruleDescription: "app/pricing/plans.ts", kind: "diff", preview: ' export function featured(plan: Plan) {\n-  return plan.id === "starter";\n+  return plan.id === "pro";\n }', reason: "Feature the plan selected for the new pricing page." },
  { id: "test", tool: "Run a shell command", target: "apps/web", risk: "low", rule: "shell:bun-run:apps/web", ruleDescription: "bun run *", allowAlways: true, kind: "command", preview: "$ bun run test --filter=pricing", reason: "Check the updated plan labels and prices." },
  { id: "database", tool: "Write to the database", target: "prod · plans", risk: "high", rule: "write:prod/plans", ruleDescription: "prod · plans", icon: <Database />, kind: "command", preview: "UPDATE plans\nSET featured = true\nWHERE id = 'pro';", reason: "Apply the selected featured plan. This request targets production." },
  { id: "mail", tool: "Send a message", target: "pricing-team@example.test", risk: "medium", rule: "send:pricing-team", ruleDescription: "pricing-team@example.test", kind: "message", preview: "To: pricing-team@example.test\nSubject: Pricing page review\n\nThe updated pricing page is ready for review.", reason: "Share a summary with the review team." },
];

export function ToolApprovalQueuePreview() {
  const [queue, setQueue] = useState(requests);
  const [fail, setFail] = useState(false);
  const [history, setHistory] = useState<ResolvedToolRequest[]>([]);
  return <div className="w-full py-6"><ToolApprovalQueue requests={queue} resolved={history} title="Agent · Ship the pricing page fix" emptyDescription="The local queue is ready for another run." onReplay={() => { setQueue(requests); setHistory([]); }} onDecision={async (decision) => {
    if (fail) throw new Error("Demo persistence rejected. Turn off the failure toggle and retry.");
    const outcomes = queue.filter((request) => decision.requestIds.includes(request.id)).map((request): ResolvedToolRequest => ({ ...request, decision: decision.decision === "always" && request.id !== decision.requestId ? "rule" : decision.decision, note: decision.note })).reverse();
    setHistory((current) => [...outcomes, ...current]);
    setQueue((current) => current.filter((request) => !decision.requestIds.includes(request.id)));
  }} /><details className="mx-auto mt-4 max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Decisions update only this local queue. No commands, database writes or messages are sent.</p><label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />Simulate a recoverable host rejection</label><button type="button" className="mt-2 underline" onClick={() => { setQueue(requests); setHistory([]); }}>Replay queue</button></details></div>;
}
