"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundAgents, type BackgroundAgent } from "@/components/agents/background-agents";

const initial: BackgroundAgent[] = [
  { id: "checkout", title: "Fix the flaky checkout test", status: "running", progress: 35, currentStep: "Trace the race in cart.test.ts", branch: "shop/web · fix/checkout-race", elapsedMs: 48000, steps: ["Find the flaky test", "Trace the race in cart.test.ts", "Await the price fetch", "Run the suite 20 times", "Open a pull request"] },
  { id: "theme", title: "Add dark mode to settings", status: "needs-input", question: "Should a new account follow the system theme?", branch: "shop/web · feat/dark-mode", progress: 50, answerOptions: ["Follow the system", "Start in light"], steps: ["Find the theme tokens", "Add a theme switch", "Persist the choice", "Open a pull request"] },
  { id: "passkeys", title: "Move sign-in to passkeys", status: "failed", progress: 65, currentStep: "Store credentials", error: "Type check failed in auth/session.ts", branch: "shop/web · feat/passkeys" },
  { id: "next", title: "Bump Next.js to 16.3", status: "completed", progress: 100, branch: "shop/web · chore/next-16-3", additions: 42, deletions: 18, result: "Local demo: dependency update prepared for review.", diff: "+ Updated Next.js dependency\n- Removed legacy configuration" },
  { id: "release", title: "Write release notes for 2.4", status: "running", currentStep: "Collect merged pull requests", branch: "shop/docs · docs/release-2-4", progress: 2, elapsedMs: 0, steps: ["Collect merged pull requests", "Draft the notes", "Open a pull request"] },
];

/** Local demo line counts reported when a simulated task finishes. */
const finalDiff: Record<string, [number, number]> = { checkout: [14, 6], release: [58, 0] };
export function BackgroundAgentsListPreview() {
  const [agents, setAgents] = useState(initial);
  const [opened, setOpened] = useState<string>();
  const sequence = useRef(0);
  useEffect(() => { const timer = window.setInterval(() => setAgents((current) => {
    const available = Math.max(0, 2 - current.filter((agent) => agent.status === "running").length);
    const starting = new Set(current.filter((agent) => agent.status === "queued").slice(0, available).map((agent) => agent.id));
    return current.map((agent) => { if (starting.has(agent.id)) return { ...agent, status: "running", progress: 1, elapsedMs: 0, currentStep: agent.steps?.[0] ?? "Working on the delegated task" }; if (agent.status !== "running") return agent; if ((agent.progress ?? 0) >= 100) return { ...agent, status: "completed", progress: 100, additions: finalDiff[agent.id]?.[0] ?? 12, deletions: finalDiff[agent.id]?.[1] ?? 3, result: "Local demo task completed. Ready for review.", diff: "+ Prepared the requested changes" }; const progress = Math.min(100, (agent.progress ?? 0) + 3); return { ...agent, progress, elapsedMs: (agent.elapsedMs ?? 0) + 1000, currentStep: agent.steps?.[Math.min(agent.steps.length - 1, Math.floor(progress / 100 * agent.steps.length))] ?? agent.currentStep }; });
  }), 1000); return () => window.clearInterval(timer); }, []);
  return <div className="w-full py-6"><BackgroundAgents agents={agents}
    onSubmit={(task) => { const id = `task-${sequence.current++}`; setAgents((current) => [...current, { id, title: task, status: current.filter((agent) => agent.status === "running").length >= 2 ? "queued" : "running", progress: 0, currentStep: "Waiting to start" }]); }}
    onAnswer={(id, answer) => setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, status: "running", question: undefined, answer, elapsedMs: agent.elapsedMs ?? 96000, currentStep: agent.steps?.[Math.floor((agent.progress ?? 0) / 100 * agent.steps.length)] ?? "Continuing with your answer" } : agent))}
    onCancel={(id) => setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, status: "cancelled" } : agent))}
    onRetry={(id) => setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, status: "queued", error: undefined, progress: 0, currentStep: "Retrying from last checkpoint" } : agent))}
    onOpen={(id) => setOpened(id)} />
    {opened && <aside className="mx-auto mt-3 max-w-md rounded-2xl border border-border bg-background p-4 text-xs" aria-label="Opened task"><h3 className="font-medium">{agents.find((agent) => agent.id === opened)?.title}</h3><p className="mt-2 text-muted-foreground">{agents.find((agent) => agent.id === opened)?.result ?? "This task has no final report yet."}</p><button type="button" className="mt-2 underline" onClick={() => setOpened(undefined)}>Close task</button></aside>}
    <details className="mx-auto mt-4 max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Task execution is simulated; no repository or remote service is changed.</p><div className="mt-2 flex gap-3"><button type="button" className="underline" onClick={() => setAgents(initial)}>Reset tasks</button><button type="button" className="underline" onClick={() => setAgents((current) => { const active = current.find((agent) => agent.status === "running"); return current.map((agent) => agent.id === active?.id ? { ...agent, status: "failed", error: "Demo failure: retry the task to continue." } : agent); })}>Fail a running task</button></div></details>
  </div>;
}
