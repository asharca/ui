"use client";

import { useEffect, useState } from "react";
import { AgentTeam, type TeamAgentNode } from "@/components/agents/agent-team";

const specialists: TeamAgentNode[] = [
  { id: "research", name: "Researcher", role: "Researcher", color: "text-sky-500", status: "queued", currentStep: "Read reports/loader.ts", steps: [{ id: "r1", title: "Read reports/loader.ts", status: "pending" }, { id: "r2", title: "Map the CSV columns", status: "pending" }] },
  { id: "implementation", name: "Coder", role: "Builder", color: "text-emerald-500", status: "queued", currentStep: "Write toCsv()", steps: [{ id: "i1", title: "Write toCsv()", status: "pending" }, { id: "i2", title: "Add the Export button", status: "pending" }] },
  { id: "tests", name: "Tester", role: "Tester", color: "text-amber-500", status: "queued", currentStep: "Write CSV fixtures", steps: [{ id: "t1", title: "Write CSV fixtures", status: "pending" }, { id: "t2", title: "Test an empty report", status: "pending" }] },
  { id: "review", name: "Reviewer", role: "Reviewer", color: "text-pink-500", status: "waiting", dependsOn: ["research", "implementation", "tests"], currentStep: "Read the diff", steps: [{ id: "v1", title: "Read the diff", status: "pending" }, { id: "v2", title: "Approve the export", status: "pending" }] },
];
const reports: Record<string, string> = { research: "Reports load through one query; 9 columns, 2 are dates.", implementation: "Added a streaming export route and a button; 3 files changed.", tests: "6 demo checks pass, including empty reports and ISO dates.", review: "Looks good; asked for a filename with the report date." };
/** Simulated tool calls each specialist makes over its whole run. */
const callBudget: Record<string, number> = { research: 3, implementation: 4, tests: 3, review: 3 };
const speed: Record<string, number> = { research: 5, implementation: 2.8, tests: 5, review: 6.5 };
const initial: TeamAgentNode[] = [{ id: "lead", name: "Ship CSV export for the reports page", role: "Lead", status: "queued", progress: 0, currentStep: "Ready to split the goal", children: [] }];

function leadStep(children: TeamAgentNode[]) {
  const working = children.filter((node) => node.status === "running").length;
  if (children.length < specialists.length) return "Delegating";
  if (working) return `Waiting on ${working} ${working === 1 ? "subagent" : "subagents"}`;
  return "Delegating";
}

/** Deterministic local choreography; no files, commands or models are touched. */
export function AgentTeamTreePreview() {
  const [agents, setAgents] = useState(initial);
  const [elapsed, setElapsed] = useState(0);
  const running = agents.some((agent) => agent.status === "running");
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setElapsed((value) => value + 200), 200); return () => window.clearInterval(timer); }, [running]);
  useEffect(() => {
    if (!elapsed) return;
    setAgents((current) => current.map((lead) => {
      if (lead.status !== "running") return lead;
      const children = [...(lead.children ?? [])];
      for (let index = 0; index < specialists.length; index++) if (elapsed >= 600 + index * 300 && !children.some((node) => node.id === specialists[index].id)) children.push({ ...specialists[index] });
      const updated = children.map((node): TeamAgentNode => {
        if (node.status === "cancelled" || node.status === "failed" || node.status === "completed") return node;
        if (node.dependsOn?.some((id) => !children.some((sibling) => sibling.id === id && sibling.status === "completed"))) return { ...node, status: "waiting" };
        const progress = Math.min(100, (node.progress ?? 0) + speed[node.id]);
        const stepIndex = progress > 50 ? 1 : 0;
        const stepTitle = node.steps?.[stepIndex]?.title;
        return { ...node, progress, status: progress >= 100 ? "completed" : "running", elapsedMs: (node.elapsedMs ?? 0) + 200, report: progress >= 100 ? reports[node.id] : undefined, currentStep: typeof stepTitle === "string" ? stepTitle : node.currentStep, steps: node.steps?.map((step, index, values) => ({ ...step, status: progress >= (index + 1) / values.length * 100 ? "completed" : progress >= index / values.length * 100 ? "in-progress" : "pending" })) };
      });
      const done = updated.length === specialists.length && updated.every((node) => node.status === "completed");
      return { ...lead, children: updated, progress: updated.reduce((sum, node) => sum + (node.progress ?? 0), 0) / specialists.length, status: done ? "completed" : "running", currentStep: done ? undefined : leadStep(updated), report: done ? "CSV export is built, tested, and approved" : undefined };
    }));
  }, [elapsed]);
  const toolCalls = agents.flatMap((lead) => lead.children ?? []).reduce((sum, node) => sum + Math.floor((node.status === "completed" ? 100 : node.progress ?? 0) / 100 * callBudget[node.id]), 0);
  const updateNode = (nodes: TeamAgentNode[], id: string, status: TeamAgentNode["status"]): TeamAgentNode[] => nodes.map((node) => ({ ...node, ...(node.id === id ? { status, error: status === "failed" ? "Demo failure: the export route did not compile." : undefined, ...(status === "running" ? { progress: 0, report: undefined } : {}) } : {}), children: node.children ? updateNode(node.children, id, status) : undefined }));
  return <div className="w-full py-6"><AgentTeam agents={agents} toolCalls={toolCalls} elapsedMs={elapsed}
    onCancel={(id) => setAgents((current) => updateNode(current, id, "cancelled"))}
    onRetry={(id) => setAgents((current) => updateNode(current, id, "running").map((lead) => ({ ...lead, status: "running" })))}
    onRun={() => { setAgents(initial.map((agent) => ({ ...agent, status: "running" as const, currentStep: "Splitting the goal" }))); setElapsed(0); }}
    onCancelAll={() => setAgents((current) => current.map((lead) => ({ ...lead, status: "cancelled", currentStep: "Stopped", children: lead.children?.map((child) => child.status === "completed" ? child : { ...child, status: "cancelled" }) })))} />
    <details className="mx-auto mt-4 max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Agent work and reports are simulated locally; no files or commands are changed.</p><button type="button" className="mt-2 underline" onClick={() => setAgents((current) => updateNode(current, "implementation", "failed"))}>Fail the coder</button></details>
  </div>;
}
