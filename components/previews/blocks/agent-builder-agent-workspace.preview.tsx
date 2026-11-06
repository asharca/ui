"use client";

import { useState } from "react";
import { LifeBuoy, BookOpen, MessageSquareText, Search, PackageSearch, Ticket } from "lucide-react";
import { AgentWorkspace, type AgentConfiguration } from "@/components/agents/agent-workspace";

export function AgentBuilderAgentWorkspacePreview() {
  const [configuration, setConfiguration] = useState<AgentConfiguration>({ name: "Customer support", description: "Clear answers. Thoughtful follow-ups.", instructions: "You are a helpful customer support assistant. Answer using the connected knowledge sources. Keep responses clear and concise. If you cannot verify an answer, say so and suggest contacting the support team. Ask for approval before taking actions that change customer data.", modelId: "balanced", sourceIds: ["handbook", "release-notes"], toolIds: ["search"], requireApproval: true });
  const [saved, setSaved] = useState("");
  const [failSave, setFailSave] = useState(false);
  const [failTest, setFailTest] = useState(false);
  return <div className="w-full [&>details[open]]:mt-3">
    <AgentWorkspace value={configuration} onValueChange={setConfiguration} testLabel="Demo responses"
      models={[{ id: "balanced", name: "Balanced", description: "For everyday questions and multi-step tasks" }, { id: "fast", name: "Fast", description: "For quick answers and simple tasks" }, { id: "reasoning", name: "Reasoning", description: "For complex questions and careful analysis" }]}
      sources={[{ id: "handbook", name: "Help center", description: "Setup guides and common questions", icon: <LifeBuoy /> }, { id: "release-notes", name: "Product handbook", description: "Features, plans, and workspace basics", icon: <BookOpen /> }, { id: "voice", name: "Voice & tone", description: "How we communicate with customers", icon: <MessageSquareText /> }]}
      tools={[{ id: "search", name: "Search knowledge", description: "Find relevant passages in connected sources", icon: <Search /> }, { id: "order", name: "Look up an order", description: "Read order details from your connected system", icon: <PackageSearch /> }, { id: "ticket", name: "Create support ticket", description: "Escalate an issue for a human to review", icon: <Ticket /> }]}
      onSave={async (next) => { if (failSave) throw new Error("Demo host rejected this save. Uncheck rejection and try again."); localStorage.setItem("beui-agent-builder-demo", JSON.stringify(next)); setSaved(next.name); }}
      onTest={async function* ({ configuration: current, messages, signal }) {
        if (failTest) throw new Error("Demo runtime rejected the test. Uncheck rejection and try again.");
        const question = messages.at(-1)?.content ?? "";
        const answer = `Local demonstration, not an AI answer. ${current.name} received: “${question}”. Model: ${current.modelId}. Sources: ${current.sourceIds.join(", ") || "none"}. Allowed tools: ${current.toolIds.join(", ") || "none"}. Instructions: ${current.instructions}`;
        for (const word of answer.split(" ")) {
          if (signal.aborted) return;
          yield `${word} `;
          const { promise, resolve } = Promise.withResolvers<void>();
          setTimeout(resolve, 25);
          await promise;
        }
      }} />
    <details className="group px-5 [&:not([open])]:h-0 text-[10px] text-muted-foreground"><summary className="sr-only cursor-pointer focus:not-sr-only group-open:not-sr-only">Demo controls</summary><div className="mt-3 flex flex-wrap items-center gap-4"><span>Local demo · no AI service or deployment</span><label className="flex items-center gap-2"><input type="checkbox" checked={failSave} onChange={(event) => setFailSave(event.target.checked)} />Reject save callback</label><label className="flex items-center gap-2"><input type="checkbox" checked={failTest} onChange={(event) => setFailTest(event.target.checked)} />Reject test callback</label></div></details>
    {saved && <p role="status" className="text-xs text-muted-foreground">Saved “{saved}” to this browser’s local storage; not deployed.</p>}
  </div>;
}
