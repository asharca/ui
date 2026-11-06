"use client";

import { useState } from "react";
import { AIThinkingLoader, type ThinkingState } from "@/components/motion/ai-thinking-patterns";

export function AIThinkingLoaderAssemblingTilesPreview() {
  const [state, setState] = useState<ThinkingState>("thinking");
  return <div className="relative flex min-h-[260px] w-full items-center justify-center py-10">
    <AIThinkingLoader pattern="assembling-tiles" state={state} />
    <details className="absolute bottom-1 right-2 text-xs text-muted-foreground"><summary className="cursor-pointer">Preview states</summary><fieldset aria-label="Loader state" className="flex flex-wrap gap-2 rounded-xl border border-border bg-background p-2">{(["thinking", "stopped", "complete"] as const).map(value => <button type="button" key={value} aria-pressed={state === value} onClick={() => setState(value)} className="rounded-full px-3 py-1 aria-pressed:bg-muted">{value}</button>)}</fieldset></details>
  </div>;
}
