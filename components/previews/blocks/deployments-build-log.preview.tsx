"use client";

import { useEffect, useState } from "react";
import {
  DeploymentBuild,
  type DeploymentBuildStep,
  type DeploymentLogEntry,
} from "@/components/motion/deployment-build";

const BASE_STEP_NAMES = [
  "Clone repository",
  "Restore cache",
  "Install packages",
  "Typecheck & lint",
  "Compile pages",
  "Optimize assets",
  "Upload build",
  "Assign domains",
];

const LOG_STREAM: DeploymentLogEntry[] = [
  { id: "l1", time: "14:02:01", message: "Cloning origin/main at 8f3c2a1..." },
  { id: "l2", time: "14:02:02", message: "Restored bun lockfile cache (142 MB)" },
  { id: "l3", time: "14:02:04", message: "Installed 412 workspace packages in 1.8s" },
  { id: "l4", time: "14:02:07", message: "tsc --noEmit: 0 errors" },
  { id: "l5", time: "14:02:14", message: "Compiled 247 static routes & registry endpoints" },
  { id: "l6", time: "14:02:17", message: "Optimized fonts, SVG sprites, and shader chunks" },
  { id: "l7", time: "14:02:20", message: "Uploaded immutable build artifact edge-us-east" },
  { id: "l8", time: "14:02:22", level: "success", message: "Deployment ready at app.example.com" },
];

export function DeploymentsBuildLogPreview() {
  const [mode, setMode] = useState<"success" | "error">("success");
  const [stage, setStage] = useState(4);

  useEffect(() => {
    const limit = mode === "error" ? 4 : 8;
    if (stage >= limit) return;
    const timer = window.setTimeout(() => {
      setStage((prev) => prev + 1);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [mode, stage]);

  const isError = mode === "error" && stage >= 4;
  const isReady = mode === "success" && stage >= 8;

  const steps: DeploymentBuildStep[] = BASE_STEP_NAMES.map((label, idx) => {
    if (isError && idx === 3) {
      return { id: label, label, status: "error", durationSeconds: 2.4 };
    }
    if (idx < stage) {
      return { id: label, label, status: "done", durationSeconds: 0.8 + idx * 0.4 };
    }
    if (idx === stage && !isError && !isReady) {
      return { id: label, label, status: "running" };
    }
    return { id: label, label, status: "pending" };
  });

  const logs = isError
    ? [
        ...LOG_STREAM.slice(0, 3),
        {
          id: "err",
          time: "14:02:07",
          level: "error" as const,
          message: "error TS2322: Type 'string' is not assignable to type 'number' in pricing.tsx:48",
        },
      ]
    : LOG_STREAM.slice(0, Math.max(1, stage));

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {(["success", "error"] as const).map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => {
              setMode(variant);
              setStage(0);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              mode === variant
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {variant}
          </button>
        ))}
      </div>

      <DeploymentBuild
        commitMessage="Add annual billing toggle to pricing"
        environment="Production"
        branch="main"
        commitSha="8f3c2a1"
        author="Maeve Doyle"
        createdAgo="2m ago"
        domains={["app.example.com", "billing.example.com"]}
        status={isError ? "error" : isReady ? "ready" : stage === 0 ? "queued" : "building"}
        elapsedSeconds={stage * 2.6}
        steps={steps}
        logs={logs}
        onRedeploy={() => setStage(0)}
        onRetry={() => {
          setMode("success");
          setStage(0);
        }}
      />
    </div>
  );
}
