"use client";

import { useEffect, useState } from "react";
import { ContextMeter, type ContextCategory } from "@/components/agents/context-window";

const initial: ContextCategory[] = [
  { id: "system", label: "System prompt", tokens: 3200, detail: "Instructions", sources: [{ id: "instructions", label: "Workspace instructions", tokens: 3200 }] },
  { id: "tools", label: "Tool definitions", tokens: 11800, detail: "14 tools" },
  { id: "files", label: "Pinned files", tokens: 31400, detail: "6 files", sources: [{ id: "guide", label: "architecture.md", tokens: 12200, removable: true }, { id: "api", label: "billing/webhooks.ts", tokens: 19200, removable: true }] },
  { id: "conversation", label: "Conversation", tokens: 58600, detail: "38 messages" },
  { id: "results", label: "Tool results", tokens: 24100, detail: "21 calls" },
];

export function ContextWindowMeterPreview() {
  const [categories, setCategories] = useState(initial);
  const [auto, setAuto] = useState(true);
  const [compactions, setCompactions] = useState(0);
  const [streaming, setStreaming] = useState(true);
  useEffect(() => { if (!streaming) return; const timer = window.setInterval(() => setCategories((current) => current.map((category) => category.id === "conversation" ? { ...category, tokens: category.tokens + 1800 } : category)), 4000); return () => window.clearInterval(timer); }, [streaming]);
  return <div className="w-full py-6"><ContextMeter capacity={200000} model="Sonnet 5.5" categories={categories} defaultOpen autoCompact={auto} compactThreshold={0.85} onAutoCompactChange={setAuto} onCompact={() => { setCategories((current) => current.map((category) => category.id === "conversation" ? { ...category, tokens: Math.round(category.tokens * 0.35), detail: "Summarized" } : category)); setCompactions((count) => count + 1); }} onClearCategory={(id) => setCategories((current) => current.map((category) => category.id === id ? { ...category, tokens: 0, sources: [], detail: "Cleared" } : category))} onRemoveSource={(id, sourceId) => setCategories((current) => current.map((category) => category.id === id ? { ...category, tokens: Math.max(0, category.tokens - (category.sources?.find((source) => source.id === sourceId)?.tokens ?? 0)), sources: category.sources?.filter((source) => source.id !== sourceId) } : category))} />
    <details className="mx-auto mt-4 max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Token counts are deterministic demonstration data. {compactions} compactions.</p><div className="mt-2 flex flex-wrap gap-3"><button type="button" className="underline" onClick={() => setStreaming(!streaming)}>{streaming ? "Pause new turns" : "Resume turns"}</button><button type="button" className="underline" onClick={() => setCategories((current) => current.map((category) => category.id === "conversation" ? { ...category, tokens: category.tokens + 30000 } : category))}>Add 30k-token turn</button><button type="button" className="underline" onClick={() => { setCategories(initial); setCompactions(0); }}>Reset context</button></div></details>
  </div>;
}
