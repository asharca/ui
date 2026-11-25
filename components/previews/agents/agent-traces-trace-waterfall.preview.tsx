"use client";

import { TraceWaterfall, type AgentTraceRun, type AgentTraceSpan } from "@/components/agents/agent-traces";

/** Recorded-shape demonstration data, not production telemetry. */
const spans: AgentTraceSpan[] = [
  { id: "root", name: "support-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 9180, input: "Handle a refund request", output: "Refund request processed in the local demonstration." },
  { id: "moderation", parentId: "root", name: "input.moderation", kind: "guardrail", status: "completed", startMs: 20, durationMs: 190, input: "Customer refund request", output: "Allowed" },
  { id: "plan", parentId: "root", name: "plan", kind: "llm", model: "orion-large", cost: 0.0061, status: "completed", startMs: 260, durationMs: 1050, inputTokens: 1840, outputTokens: 212, input: "Customer says order #55102 arrived damaged and asks for a refund. Plan the steps.", output: "1. Check refund policy\n2. Look up order #55102\n3. Decide eligibility\n4. Issue refund via billing\n5. Reply to the customer", attributes: { temperature: 0.2 } },
  { id: "search", parentId: "root", name: "kb.search", kind: "retrieval", status: "completed", startMs: 1350, durationMs: 570, input: "Refund policy for damaged orders", output: "Policy document found" },
  { id: "embed", parentId: "search", name: "embed.query", kind: "tool", status: "completed", startMs: 1360, durationMs: 130, input: "Refund policy query", output: "Query embedding prepared" },
  { id: "vector", parentId: "search", name: "vector.query", kind: "tool", status: "completed", startMs: 1500, durationMs: 390, input: "Policy index", output: "3 relevant policy excerpts" },
  { id: "lookup-failed", parentId: "root", name: "orders.lookup", kind: "tool", status: "failed", startMs: 1950, durationMs: 950, input: '{ "order_id": "55102" }', error: "Demo: upstream lookup timed out. A retry was recorded.", attributes: { "http.status": 504, retry: "scheduled" } },
  { id: "lookup", parentId: "root", name: "orders.lookup", kind: "tool", status: "completed", startMs: 3000, durationMs: 660, input: "order_id: 55102", output: "Delivered; damaged item reported within refund window" },
  { id: "eligibility", parentId: "root", name: "decide.eligibility", kind: "llm", status: "completed", startMs: 3700, durationMs: 2450, inputTokens: 3220, outputTokens: 430, input: "Evaluate the order against the refund policy", output: "Eligible for a full refund" },
  { id: "billing", parentId: "root", name: "billing-subagent", kind: "agent", status: "completed", startMs: 6180, durationMs: 2200, input: "Prepare a refund for order #55102", output: "Refund prepared" },
  { id: "draft", parentId: "billing", name: "draft.refund", kind: "llm", status: "completed", startMs: 6200, durationMs: 920, inputTokens: 2030, outputTokens: 180, input: "Prepare the refund payload", output: "amount: 4900, currency: USD" },
  { id: "payment", parentId: "billing", name: "payments.refund", kind: "tool", status: "completed", startMs: 7200, durationMs: 880, input: "Demo payment reference", output: "Recorded refund result; no real payment submitted" },
  { id: "policy", parentId: "billing", name: "policy.check", kind: "guardrail", status: "completed", startMs: 8110, durationMs: 240, input: "Refund amount and order policy", output: "Within policy" },
  { id: "reply", parentId: "root", name: "compose.reply", kind: "llm", status: "completed", startMs: 8400, durationMs: 640, inputTokens: 1950, outputTokens: 380, input: "Summarize the recorded refund result", output: "Your refund has been prepared in this demonstration." },
  { id: "pii", parentId: "root", name: "output.pii-scan", kind: "guardrail", status: "completed", startMs: 9080, durationMs: 100, input: "Customer response", output: "No sensitive details detected" },
];
export const demoTraceRuns: AgentTraceRun[] = [
  { id: "run_7f3a91c2", name: "support-agent · refund request", status: "completed", startedAt: "2026-11-04T14:02:18Z", durationMs: 9180, cost: 0.030, retryCount: 1, recentLatenciesMs: [8300, 7700, 8500, 7200, 9000, 8100, 9180], spans },
  { id: "run_2b8e04aa", name: "research-agent · market brief", status: "completed", startedAt: "2026-11-04T13:41:05Z", durationMs: 13400, cost: 0.066, recentLatenciesMs: [11800, 13200, 12100, 14000, 13400], spans: [{ id: "root", name: "research-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 13400, inputTokens: 21000, outputTokens: 2600, output: "Brief prepared." }] },
  { id: "run_88a1d4e7", name: "support-agent · refund request", status: "completed", startedAt: "2026-11-04T13:36:52Z", durationMs: 7530, cost: 0.027, recentLatenciesMs: [7300, 7900, 7500, 7000, 7530], spans: [{ id: "root", name: "support-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 7530, inputTokens: 8100, outputTokens: 1117 }] },
  { id: "run_c90d17f3", name: "code-review-agent · PR #482", status: "completed", startedAt: "2026-11-04T13:12:47Z", durationMs: 7840, cost: 0.025, recentLatenciesMs: [7200, 7700, 8100, 7500, 7840], spans: [{ id: "root", name: "code-review-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 7840, inputTokens: 9500, outputTokens: 1020 }, { id: "retry", parentId: "root", name: "source.lookup", kind: "tool", status: "failed", startMs: 100, durationMs: 200, error: "Lookup retried" }] },
  { id: "run_e4c2b1d9", name: "research-agent · market brief", status: "failed", startedAt: "2026-11-04T13:05:16Z", durationMs: 16240, cost: 0.086, recentLatenciesMs: [13800, 14100, 15200, 16000, 16240], spans: [{ id: "root", name: "research-agent.run", kind: "agent", status: "failed", startMs: 0, durationMs: 16240, inputTokens: 28000, outputTokens: 2680, error: "Source provider timed out" }] },
  { id: "run_51fe6b20", name: "onboarding-agent · workspace setup", status: "completed", startedAt: "2026-11-04T12:58:30Z", durationMs: 5260, cost: 0.002, recentLatenciesMs: [5000, 4900, 5400, 5200, 5260], spans: [{ id: "root", name: "onboarding-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 5260, inputTokens: 2000, outputTokens: 250 }] },
  { id: "run_0f7a3c58", name: "code-review-agent · PR #482", status: "completed", startedAt: "2026-11-04T12:44:09Z", durationMs: 7060, cost: 0.020, recentLatenciesMs: [7500, 6900, 7200, 7100, 7060], spans: [{ id: "root", name: "code-review-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 7060, inputTokens: 7500, outputTokens: 916 }] },
  { id: "run_6d2e9b41", name: "onboarding-agent · workspace setup", status: "completed", startedAt: "2026-11-04T12:20:33Z", durationMs: 7100, cost: 0.002, recentLatenciesMs: [6800, 7200, 6500, 6900, 7100], spans: [{ id: "root", name: "onboarding-agent.run", kind: "agent", status: "completed", startMs: 0, durationMs: 7100, inputTokens: 2200, outputTokens: 275 }] },
];

export function AgentTracesWaterfallPreview() {
  const run = demoTraceRuns[0];
  return (
    <div className="w-full py-2">
      <TraceWaterfall run={run} defaultSelectedSpanId={run.spans.find((span) => span.kind === "llm")?.id} />
    </div>
  );
}
