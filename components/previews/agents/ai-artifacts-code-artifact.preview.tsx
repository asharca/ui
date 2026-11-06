"use client";
import { useState } from "react";
import { AIArtifact } from "@/components/agents/ai-artifacts";
import { Button } from "@/components/motion/button";
const code = `type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export function groupTasks(tasks: Task[]) {
  return {
    pending: tasks.filter((task) => !task.completed),
    completed: tasks.filter((task) => task.completed),
  };
}`;
export function CodeArtifactPreview() {
  const [closed, setClosed] = useState(false);
  return <div className="flex min-h-96 w-full items-center justify-center p-4 sm:p-6">{closed ? <Button variant="outline" onClick={() => setClosed(false)}>Reopen code artifact</Button> : <AIArtifact className="max-w-2xl" kind="code" title="Task grouping utility" filename="group-tasks.ts" versions={[{ id: "v1", label: "Version 1", content: code }]} onClose={() => setClosed(true)} />}</div>;
}
