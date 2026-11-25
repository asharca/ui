"use client";

import { AgentRunsList } from "@/components/agents/agent-traces";
import { demoTraceRuns } from "./agent-traces-trace-waterfall.preview";

export function AgentTracesRunsListPreview() {
  return (
    <div className="w-full py-2">
      <AgentRunsList runs={demoTraceRuns} />
    </div>
  );
}
