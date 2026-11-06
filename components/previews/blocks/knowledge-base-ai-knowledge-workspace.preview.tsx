"use client";

import { useState } from "react";
import { KnowledgeWorkspace, type KnowledgeSource } from "@/components/motion/knowledge-workspace";

export function KnowledgeBaseAIKnowledgeWorkspacePreview() {
  const [sources, setSources] = useState<KnowledgeSource[]>([
    { id: "brand", title: "Brand voice & writing guidelines", kind: "document", content: "Write like a helpful teammate. Lead with the answer, use plain language, and keep interface labels short. Avoid jargon and explain the next step clearly.\n\nOur voice is thoughtful, direct, and warm. Prefer specific examples over broad promises.", enabled: true, status: "ready" },
    { id: "product", title: "Product overview", kind: "note", content: "beUI helps growing teams organize projects and shared knowledge. Our customers are designers, engineers, and independent studios. Focus on practical workflows, clear ownership, and making useful information easy to find.", enabled: true, status: "ready" },
    { id: "help", title: "Customer help center", kind: "link", url: "https://example.com/help", content: "Reference link for customer-facing help articles. Verify the relevant article before using it as an answer source.", enabled: true, status: "ready" },
    { id: "launch", title: "Autumn launch brief", kind: "document", content: "Launch objective: introduce the new team workspace. Audience: existing customers and small creative teams. Deliverables: a product walkthrough, an announcement, and a concise getting-started guide.", enabled: false, status: "ready" },
    { id: "support", title: "Support response principles", kind: "note", content: "Acknowledge the question, give the shortest complete answer, and include a useful next step. Never invent product capabilities or promise a release date. If the answer is uncertain, say what needs to be checked.", enabled: true, status: "ready" },
  ]);
  const [activity, setActivity] = useState("");
  return <div className="w-full [&>details[open]]:mt-3">
    <KnowledgeWorkspace sources={sources} onSourcesChange={setSources} contextBudget={4000} contextUnit="characters" footer={<p>Preview workspace · changes stay in this session</p>}
      onCreate={async (draft) => {
        if (sources.some((source) => source.title.toLocaleLowerCase() === draft.title.toLocaleLowerCase())) throw new Error("A source with that title already exists.");
        const source: KnowledgeSource = { ...draft, id: crypto.randomUUID(), enabled: draft.kind !== "link", status: "ready" };
        setActivity(`Created local ${draft.kind}: ${draft.title}`);
        return source;
      }}
      onUpdate={async (source, draft) => { if (sources.some(item => item.id !== source.id && item.title.toLocaleLowerCase() === draft.title.toLocaleLowerCase())) throw new Error("A source with that title already exists."); setActivity(`Updated local source: ${draft.title}`); return { ...source, ...draft }; }}
      onRemove={async (source) => { setSources((current) => current.filter((item) => item.id !== source.id)); setActivity(`Removed local source: ${source.title}`); }}
      onToggle={async (source, enabled) => { setSources((current) => current.map((item) => item.id === source.id ? { ...item, enabled } : item)); setActivity(`${enabled ? "Included" : "Excluded"} ${source.title}`); }} />
    <details className="group px-5 [&:not([open])]:h-0 text-[10px] text-muted-foreground sm:px-10"><summary className="sr-only cursor-pointer focus:not-sr-only group-open:not-sr-only">Demo controls</summary><p className="mt-2">Local document management · no vector index or remote fetch is simulated.</p><button type="button" className="mt-2 rounded-lg border border-border px-3 py-2" onClick={() => setSources(items => items.some(item => item.id === "failed-import") ? items : [...items, { id: "failed-import", title: "Archived scan", kind: "document", content: "", enabled: false, status: "error", error: "No readable text supplied. Remove this source and import a plain text document." }])}>Add a failed import</button></details>
    {activity && <p role="status" className="text-xs text-muted-foreground">Host activity: {activity}</p>}
  </div>;
}
