"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ContextMeter, type ContextCategory } from "@/components/agents/context-window";

const initial: ContextCategory[] = [
  { id: "system", label: "System prompt", tokens: 3200, detail: "Instructions", sources: [{ id: "instructions", label: "Workspace instructions", tokens: 3200 }] },
  { id: "tools", label: "Tool definitions", tokens: 11800, detail: "14 tools" },
  { id: "files", label: "Pinned files", tokens: 31400, detail: "6 files", sources: [{ id: "guide", label: "architecture.md", tokens: 12200, removable: true }, { id: "api", label: "billing/webhooks.ts", tokens: 19200, removable: true }] },
  { id: "conversation", label: "Conversation", tokens: 56700, detail: "38 messages" },
  { id: "results", label: "Tool results", tokens: 24300, detail: "21 calls" },
];

export function ContextWindowMeterPreview() {
  const [categories, setCategories] = useState(initial);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setCategories((current) =>
        current.map((category) => {
          if (category.id === "conversation") return { ...category, tokens: category.tokens + 1600 };
          if (category.id === "results") return { ...category, tokens: category.tokens + 700 };
          return category;
        }),
      );
    }, 2600);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="w-full py-2">
      <ContextMeter
        capacity={200000}
        model="Sonnet 5.5"
        categories={categories}
        defaultOpen
        autoCompact={auto}
        compactThreshold={0.85}
        onAutoCompactChange={setAuto}
        onCompact={() =>
          setCategories((current) =>
            current.map((category) =>
              category.id === "conversation"
                ? { ...category, tokens: Math.round(category.tokens * 0.35), detail: "Summarized" }
                : category,
            ),
          )
        }
        onClearCategory={(id) =>
          setCategories((current) =>
            current.map((category) =>
              category.id === id ? { ...category, tokens: 0, sources: [], detail: "Cleared" } : category,
            ),
          )
        }
        onRemoveSource={(id, sourceId) =>
          setCategories((current) =>
            current.map((category) =>
              category.id === id
                ? {
                    ...category,
                    tokens: Math.max(
                      0,
                      category.tokens -
                        (category.sources?.find((source) => source.id === sourceId)?.tokens ?? 0),
                    ),
                    sources: category.sources?.filter((source) => source.id !== sourceId),
                  }
                : category,
            ),
          )
        }
      />
    </div>
  );
}
