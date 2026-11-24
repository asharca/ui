"use client";

import { useEffect, useState } from "react";
import {
  AgentRunTimeline,
  type AgentRunStep,
} from "@/components/agents/agent-run-timeline";

function createSteps(
  stage: number,
  gateDecision: "pending" | "approved" | "rejected",
): AgentRunStep[] {
  return [
    {
      id: "spec",
      label: "Read the product spec",
      status: stage >= 1 ? "completed" : "running",
      elapsedSeconds: stage >= 1 ? 2 : 1,
      progress: stage >= 1 ? 100 : 65,
    },
    {
      id: "research",
      label: "Send out researchers",
      status: stage >= 3 ? "completed" : stage >= 1 ? "running" : "pending",
      elapsedSeconds: stage >= 1 ? Math.min(4, stage + 1) : 0,
      progress: stage >= 3 ? 100 : 55,
      subagents: [
        {
          id: "r1",
          name: "Docs scanner",
          status: stage >= 2 ? "completed" : stage >= 1 ? "running" : "queued",
          detail: stage >= 2 ? "14 notes extracted" : "Reading changelog",
        },
        {
          id: "r2",
          name: "Customer quotes",
          status: stage >= 3 ? "completed" : stage >= 1 ? "running" : "queued",
          detail: stage >= 3 ? "6 quotes verified" : "Checking feedback",
        },
      ],
    },
    {
      id: "merge",
      label: "Merge what came back",
      status: stage >= 4 ? "completed" : stage === 3 ? "running" : "pending",
      elapsedSeconds: stage >= 3 ? 2 : 0,
      progress: 70,
    },
    {
      id: "draft",
      label: "Write the brief",
      status: stage >= 5 ? "completed" : stage === 4 ? "running" : "pending",
      elapsedSeconds: stage >= 4 ? 3 : 0,
      progress: 60,
    },
    {
      id: "tighten",
      label: "Tighten the copy",
      status: stage >= 6 ? "completed" : stage === 5 ? "running" : "pending",
      elapsedSeconds: stage >= 5 ? 2 : 0,
      progress: 80,
    },
    {
      id: "post",
      label: "Post to #launch",
      requiresApproval: true,
      status:
        gateDecision === "approved"
          ? "completed"
          : gateDecision === "rejected"
            ? "rejected"
            : "blocked",
      elapsedSeconds: gateDecision === "approved" ? 1 : undefined,
    },
  ];
}

export function AgentTeamRunStepsPreview() {
  const [stage, setStage] = useState(2);
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    if (stage >= 6) return;
    const timer = window.setTimeout(() => {
      setStage((prev) => prev + 1);
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [stage]);

  return (
    <AgentRunTimeline
      title="Launch brief"
      steps={createSteps(stage, decision)}
      onApprove={() => {
        setStage(6);
        setDecision("approved");
      }}
      onReject={() => setDecision("rejected")}
      onReplay={() => {
        setStage(0);
        setDecision("pending");
      }}
    />
  );
}
