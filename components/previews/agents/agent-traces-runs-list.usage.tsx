"use client";

import { AgentRunsList, type AgentTraceRun } from "@/components/agents/agent-traces";

/** Supply recorded runs from your observability store. Opening a run uses its same spans. */
export function RunsHistoryUsage({ runs }: { runs: AgentTraceRun[] }) {
  return <AgentRunsList runs={runs} />;
}
