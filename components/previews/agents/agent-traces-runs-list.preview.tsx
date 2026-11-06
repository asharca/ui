"use client";

import { useState } from "react";
import { AgentRunsList } from "@/components/agents/agent-traces";
import { demoTraceRuns } from "./agent-traces-trace-waterfall.preview";

export function AgentTracesRunsListPreview() {
  const [empty, setEmpty] = useState(false);
  return <div className="w-full py-6"><AgentRunsList runs={empty ? [] : demoTraceRuns} /><details className="mt-4 text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Synthetic recorded-shape telemetry, not production agent runs.</p><label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={empty} onChange={(event) => setEmpty(event.target.checked)} />Show empty history</label></details></div>;
}
