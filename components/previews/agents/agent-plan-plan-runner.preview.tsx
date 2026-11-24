"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  AgentPlanPill,
  AgentPlanRunner,
  type AgentPlanProps,
  type PlanStatus,
  type PlanStep,
} from "@/components/agents/agent-plan";

const STEP_LOGS: Record<string, string[]> = {
  inspect: ['grep "webhook" services/billing', "14 matches across 6 files"],
  schema: ["read services/billing/events.ts", "RefundSucceededSchema verified (v2)"],
  implement: ["edit services/billing/webhooks/refund.ts", "Added signature + handler route"],
  guard: ["edit services/billing/idempotency.ts", "Checked dedupe key on event.id"],
  test_fail: ["bun test services/billing", "46 passed, 2 failed"],
  test_pass: ["bun test services/billing", "48 passed, 0 failed"],
  report: ["gh pr create --title 'Add billing refund webhooks'", "PR #418 opened"],
};

const INITIAL_STEPS: PlanStep[] = [
  { id: "inspect", title: "Find the existing webhook handlers", tool: "Search", estimatedMs: 1800, status: "pending" },
  { id: "schema", title: "Read the refund event schema", tool: "Read", estimatedMs: 1500, status: "pending" },
  { id: "implement", title: "Write the refund.succeeded handler", tool: "Edit", estimatedMs: 2600, status: "pending" },
  { id: "guard", title: "Guard against duplicate deliveries", tool: "Edit", estimatedMs: 1700, status: "pending" },
  { id: "test", title: "Run the billing test suite", tool: "Test", estimatedMs: 2000, status: "pending" },
  { id: "report", title: "Open a pull request for review", tool: "Ship", estimatedMs: 1500, status: "pending" },
];

function logsForStep(step: PlanStep, progressPct: number, willFail: boolean): string[] {
  const key =
    step.id === "test"
      ? willFail
        ? "test_fail"
        : "test_pass"
      : step.tool === "Your note"
        ? "note"
        : step.id;
  const full = STEP_LOGS[key] ?? [`run "${step.title.toLowerCase()}"`, "done"];
  return progressPct > 45 ? full : [full[0]];
}

interface DemoState {
  status: PlanStatus;
  steps: PlanStep[];
  notes: Array<{ id: string; text: string }>;
  failedOnce: boolean;
}

/** Deterministic local demonstration, not a connection to a billing service or a shell. */
export function PlanDemo({ pill = false }: { pill?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();

  const [state, setState] = useState<DemoState>({
    status: "draft",
    steps: INITIAL_STEPS,
    notes: [],
    failedOnce: false,
  });
  const counter = useRef(0);
  const started = useRef(false);

  // Start running smoothly once in view (guard inside callback so StrictMode Mount-1 cleanup stays safe)
  useEffect(() => {
    if (!inView || reduce || started.current) return;
    const timer = window.setTimeout(() => {
      started.current = true;
      setState((prev) => {
        if (prev.status !== "draft") return prev;
        return {
          ...prev,
          status: "running",
          steps: prev.steps.map((step, index) =>
            index === 0
              ? {
                  ...step,
                  status: "running",
                  elapsedMs: 100,
                  progress: 6,
                  toolCalls: 1,
                  logs: logsForStep(step, 6, false),
                }
              : step,
          ),
        };
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [inView, reduce]);

  useEffect(() => {
    if (state.status !== "running") return;
    const timer = window.setInterval(() => {
      setState((prev) => {
        if (prev.status !== "running") return prev;
        const index = prev.steps.findIndex((step) => step.status === "running");
        if (index < 0) return prev;

        const active = prev.steps[index];
        const elapsed = (active.elapsedMs ?? 0) + 100;
        const duration = active.estimatedMs ?? 1500;
        const willFail = active.id === "test" && !prev.failedOnce;

        if (elapsed >= duration) {
          if (willFail) {
            return {
              ...prev,
              status: "failed",
              failedOnce: true,
              steps: prev.steps.map((step, position) =>
                position === index
                  ? {
                      ...step,
                      status: "failed",
                      elapsedMs: duration,
                      progress: 100,
                      toolCalls: 2,
                      logs: STEP_LOGS.test_fail,
                      error: "refunds.test.ts: credit applied twice on retry",
                    }
                  : step,
              ),
            };
          }

          const nextSteps = prev.steps.map((step, position) =>
            position === index
              ? {
                  ...step,
                  status: "completed" as const,
                  progress: 100,
                  elapsedMs: duration,
                  toolCalls: logsForStep(step, 100, false).length,
                  logs: undefined,
                }
              : step,
          );

          if (prev.notes.length > 0) {
            const [firstNote, ...restNotes] = prev.notes;
            const inserted: PlanStep = {
              id: firstNote.id,
              title: firstNote.text,
              status: "running",
              tool: "Your note",
              estimatedMs: 1400,
              elapsedMs: 0,
              progress: 5,
              toolCalls: 1,
              logs: [`apply guidance: "${firstNote.text}"`],
            };
            nextSteps.splice(index + 1, 0, inserted);
            return { ...prev, status: "running", steps: nextSteps, notes: restNotes };
          }

          if (index + 1 < nextSteps.length) {
            const nextStep = nextSteps[index + 1];
            nextSteps[index + 1] = {
              ...nextStep,
              status: "running",
              elapsedMs: 0,
              progress: 5,
              toolCalls: 1,
              logs: logsForStep(nextStep, 5, nextStep.id === "test" && !prev.failedOnce),
            };
            return { ...prev, steps: nextSteps };
          }

          return { ...prev, status: "completed", steps: nextSteps };
        }

        const pct = Math.min(99, (elapsed / duration) * 100);
        const stepLogs = logsForStep(active, pct, willFail);
        return {
          ...prev,
          steps: prev.steps.map((step, position) =>
            position === index
              ? {
                  ...step,
                  elapsedMs: elapsed,
                  progress: pct,
                  toolCalls: stepLogs.length,
                  logs: stepLogs,
                }
              : step,
          ),
        };
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [state.status]);

  const props: AgentPlanProps = {
    title: "Add refund webhooks to the billing service",
    agentName: "Relay",
    model: "claude-opus-5-5",
    steps: state.steps,
    status: state.status,
    queuedNotes: state.notes,
    onStepsChange: (steps) => setState((prev) => ({ ...prev, steps })),
    onRun: () => {
      setState((prev) => ({
        status: "running",
        notes: [],
        failedOnce: false,
        steps: prev.steps.map((step, index) => ({
          ...step,
          status: index === 0 ? "running" : "pending",
          elapsedMs: index === 0 ? 0 : undefined,
          progress: 0,
          toolCalls: index === 0 ? 1 : 0,
          error: undefined,
          logs: index === 0 ? logsForStep(step, 5, false) : undefined,
        })),
      }));
    },
    onPause: () => setState((prev) => ({ ...prev, status: "paused" })),
    onResume: () => {
      setState((prev) => {
        if (prev.steps.some((s) => s.status === "running")) {
          return { ...prev, status: "running" };
        }
        const firstPending = prev.steps.findIndex(
          (s) => s.status === "pending" || s.status === "cancelled",
        );
        if (firstPending < 0) return { ...prev, status: "completed" };
        return {
          ...prev,
          status: "running",
          steps: prev.steps.map((s, idx) =>
            idx === firstPending
              ? {
                  ...s,
                  status: "running",
                  elapsedMs: 0,
                  progress: 5,
                  logs: logsForStep(s, 5, false),
                }
              : s,
          ),
        };
      });
    },
    onEdit: () => {
      setState((prev) => ({
        status: "draft",
        notes: [],
        failedOnce: false,
        steps: prev.steps.map((s) => ({
          ...s,
          status: "pending",
          elapsedMs: undefined,
          progress: 0,
          toolCalls: 0,
          error: undefined,
          logs: undefined,
        })),
      }));
    },
    onCancel: () => {
      setState((prev) => ({
        ...prev,
        status: "cancelled",
        steps: prev.steps.map((step) =>
          step.status === "completed" ? step : { ...step, status: "cancelled" },
        ),
      }));
    },
    onRetry: (id) => {
      setState((prev) => ({
        ...prev,
        status: "running",
        failedOnce: true,
        steps: prev.steps.map((step) =>
          step.id === id
            ? {
                ...step,
                status: "running",
                elapsedMs: 0,
                progress: 10,
                error: undefined,
                logs: logsForStep(step, 10, false),
              }
            : step,
        ),
      }));
    },
    onNote: (noteText) => {
      const id = `note-${counter.current++}`;
      setState((prev) => ({
        ...prev,
        notes: [...prev.notes, { id, text: noteText }],
      }));
    },
  };

  return (
    <div
      ref={containerRef}
      className={
        pill
          ? "flex min-h-[34rem] w-full flex-col items-center justify-center py-6"
          : "w-full py-2"
      }
    >
      {pill ? <AgentPlanPill {...props} /> : <AgentPlanRunner {...props} />}
    </div>
  );
}

export function AgentPlanRunnerPreview() {
  return <PlanDemo />;
}
