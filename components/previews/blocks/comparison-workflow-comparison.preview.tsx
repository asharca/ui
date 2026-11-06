"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { WorkflowComparison, type WorkflowPath } from "@/components/motion/comparison";

const before: WorkflowPath = {
  id: "before", label: "The scattered approach",
  steps: [
    { id: "requests", title: "Requests everywhere", description: "Check your inbox, chat, and spreadsheets for the full picture." },
    { id: "handoff", title: "Another handoff", description: "Ask around to find out who has time to take it on." },
    { id: "update", title: "Chasing an update", description: "Send a follow-up just to learn where things stand." },
    { id: "context", title: "Rebuild the context", description: "Dig through old threads when the same question comes up." },
  ], outcome: "Your team holds everything together.",
};
const after: WorkflowPath = {
  id: "after", label: "A connected workspace",
  steps: [
    { id: "start", title: "One place to start", description: "Every request arrives in a shared, organized queue." },
    { id: "next", title: "A clear next step", description: "Assign an owner and keep the context with the work." },
    { id: "progress", title: "Progress you can see", description: "Follow each task from its first step to the finish." },
    { id: "learn", title: "Keep what you learn", description: "Turn completed work into a useful starting point for next time." },
  ], outcome: "Your workspace keeps the work connected.",
};

export function WorkflowComparisonPreview() {
  const [timings, setTimings] = useState(false);
  return <div className="w-full"><WorkflowComparison title="Less chasing. More doing." description="See what changes when your team's work has a place to come together." before={{ ...before, steps: before.steps.map((step, index) => ({ ...step, duration: timings ? `${[20, 45, 30, 25][index]} min example` : undefined })) }} after={{ ...after, steps: after.steps.map((step, index) => ({ ...step, duration: timings ? `${[5, 10, 5, 5][index]} min example` : undefined })) }} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative timing controls</summary><p className="mt-4 leading-6">Example process and timing estimates only; not measured productivity claims.</p><Button className="mt-4" variant="outline" size="sm" aria-pressed={timings} onClick={() => setTimings(!timings)}>{timings ? "Hide timing estimates" : "Show timing estimates"}</Button></details></div>;
}
