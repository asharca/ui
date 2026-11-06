"use client";

import { AgentPlanPill, type AgentPlanProps } from "@/components/agents/agent-plan";

/** Pass your execution model and real host callbacks; steps are never simulated. */
export function RunningPlanUsage(props: AgentPlanProps) {
  return <AgentPlanPill {...props} />;
}
