"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AgentPlanPill, AgentPlanRunner, type AgentPlanProps, type PlanStatus, type PlanStep } from "@/components/agents/agent-plan";

const initialSteps: PlanStep[] = [
  { id: "inspect", title: "Find the existing webhook handlers", tool: "Search", estimatedMs: 1800, status: "pending" },
  { id: "schema", title: "Read the refund event schema", tool: "Read", estimatedMs: 1500, status: "pending" },
  { id: "implement", title: "Write the refund.succeeded handler", tool: "Edit", estimatedMs: 2600, status: "pending" },
  { id: "guard", title: "Guard against duplicate deliveries", tool: "Edit", estimatedMs: 1700, status: "pending" },
  { id: "test", title: "Run the billing test suite", tool: "Test", estimatedMs: 2000, status: "pending" },
  { id: "report", title: "Open a pull request for review", tool: "Ship", estimatedMs: 1600, status: "pending" },
];

/** Deterministic local demonstration, not a connection to a billing service or a shell. */
export function PlanDemo({ pill = false }: { pill?: boolean }) {
  const [steps, setSteps] = useState(initialSteps);
  const [status, setStatus] = useState<PlanStatus>("draft");
  const [notes, setNotes] = useState<{ id: string; text: string }[]>([]);
  const counter = useRef(0);
  const reduced = useReducedMotion();
  const failedOnce = useRef(false);
  useEffect(() => { if (reduced !== false) return; const timer = window.setTimeout(() => { setStatus("running"); setSteps((current) => current.map((step, index) => index === 0 ? { ...step, status: "running", elapsedMs: 0 } : step)); }, 900); return () => window.clearTimeout(timer); }, [reduced]);
  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setInterval(() => setSteps((current) => {
      const index = current.findIndex((step) => step.status === "running");
      if (index < 0) return current;
      const active = current[index];
      const elapsed = (active.elapsedMs ?? 0) + 100;
      const duration = active.estimatedMs ?? 1500;
      if (elapsed >= duration) {
        if (active.id === "test" && !failedOnce.current) {
          return current.map((step, position) => position === index ? { ...step, status: "failed", elapsedMs: duration, error: "Demo: duplicate refund delivery needs a guard.", activity: [{ id: "test", type: "text", content: "bun test services/billing\n46 passed, 2 failed\nrefunds.test.ts: credit applied twice on retry" }] } : step);
        }
        return current.map((step, position) => position === index ? { ...step, status: "completed", progress: 100, elapsedMs: duration } : position === index + 1 ? { ...step, status: "running", elapsedMs: 0 } : step);
      }
      return current.map((step, position) => position === index ? { ...step, elapsedMs: elapsed, progress: Math.min(99, elapsed / duration * 100), activity: [{ id: "tool", type: "text", content: step.tool === "Search" ? "Searching services/billing for webhook handlers…" : step.tool === "Read" ? "Reading the refund event schema…" : step.tool === "Test" ? "Running the local demonstration test stream…" : `Preparing ${step.title.toLowerCase()}…` }] } : step);
    }), 100);
    return () => window.clearInterval(timer);
  }, [status]);
  useEffect(() => { if (steps.some((step) => step.status === "failed")) { failedOnce.current = true; setStatus("failed"); } else if (steps.length && steps.every((step) => step.status === "completed")) setStatus("completed"); }, [steps]);
  const props: AgentPlanProps = {
    title: "Add refund webhooks to the billing service", steps, status, onStepsChange: setSteps,
    onRun: () => { setStatus("running"); setSteps((current) => current.map((step, index) => ({ ...step, status: index === 0 ? "running" : "pending", elapsedMs: 0, progress: 0, error: undefined }))); },
    onPause: () => setStatus("paused"), onResume: () => setStatus("running"),
    onCancel: () => { setStatus("cancelled"); setSteps((current) => current.map((step) => step.status === "completed" ? step : { ...step, status: "cancelled" })); },
    onRetry: (id) => { setStatus("running"); setSteps((current) => current.map((step) => step.id === id ? { ...step, status: "running", elapsedMs: 0, error: undefined } : step)); },
    onNote: (note) => { const id = `note-${counter.current++}`; setNotes((current) => [...current, { id, text: note }]); setSteps((current) => { const activeIndex = current.findIndex((step) => step.status === "running" || step.status === "failed"); const next = [...current]; next.splice(activeIndex + 1, 0, { id, title: note, status: "pending", tool: "Note", estimatedMs: 1500 }); return next; }); },
  };
  return <div className={pill ? "flex min-h-[36rem] w-full flex-col items-center pt-16" : "w-full py-6"}>{pill ? <AgentPlanPill {...props} /> : <AgentPlanRunner {...props} />}<details className="mx-auto mt-4 w-full max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Execution is simulated locally; no commands or pull requests are sent.</p><div className="mt-2 flex gap-3"><button type="button" className="underline" onClick={() => { setStatus("draft"); setSteps(initialSteps); failedOnce.current = false; }}>Reset to editable draft</button><button type="button" className="underline" disabled={status !== "running"} onClick={() => { setStatus("failed"); setSteps((current) => current.map((step) => step.status === "running" ? { ...step, status: "failed", error: "Demo failure: review this step before retrying." } : step)); }}>Fail current step</button></div>{notes.length > 0 && <ul className="mt-2">{notes.map((note) => <li key={note.id}>Queued: {note.text}</li>)}</ul>}</details></div>;
}

export function AgentPlanRunnerPreview() { return <PlanDemo />; }
