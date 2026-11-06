"use client";

import { Brain, CircleCheck, CodeXml, MessageSquare } from "lucide-react";
import { useState } from "react";
import { MorphicTooltip, MorphicTooltipTrigger } from "@/components/motion/morphic-tooltip";

const tools = [{ label: "Think", hint: "Switch to a deeper reasoning pass", icon: Brain }, { label: "Review", hint: "Review queued", icon: CircleCheck }, { label: "Code", hint: "Ask the coding agent to implement the change", icon: CodeXml }, { label: "Message", hint: "Open the active conversation", icon: MessageSquare }];
export function MorphicTooltipPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="flex min-h-80 w-full flex-col items-center justify-center gap-8 px-4">
    <MorphicTooltip className="rounded-xl border border-border bg-card/60 p-1 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
      {tools.map(({label,hint,icon:Icon}) => <MorphicTooltipTrigger key={label} tooltip={hint} aria-label={label} aria-pressed={selected === label} onClick={() => setSelected(label)} className="grid size-10 place-items-center rounded-2xl border-0 bg-transparent p-0 text-muted-foreground hover:bg-primary/5 hover:text-foreground"><Icon aria-hidden className="size-4" /></MorphicTooltipTrigger>)}
    </MorphicTooltip>
    <p role="status" className="text-sm">{selected ? `${selected} selected` : "Hover the toolbar"}</p>
  </div>;
}
