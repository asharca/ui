"use client";

import { ArrowUpRight, FileCode } from "lucide-react";
import { MorphicCardModal } from "@/components/motion/morphic-card-modal";

const cards = [
  { title: "Agent Chat Input", description: "Vercel AI SDK-compatible composer with model selection, reasoning, agents, skills, and attachments.", files: ["agent-chat-input.tsx", "hooks.ts", "types.ts"] },
  { title: "Morphic Tooltip", description: "Shared-layout tooltip that morphs between triggers with one animated surface.", files: ["morphic-tooltip.tsx"] },
];
export function MorphicCardModalPreview() {
  return <div className="mx-auto flex min-h-80 w-full max-w-xl flex-col justify-center gap-3 px-4"><div className="grid grid-cols-2 gap-3">{cards.map(card => <MorphicCardModal key={card.title} title={card.title} description={card.description} card={<div className="group bg-card p-4"><p className="text-sm font-semibold">{card.title}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{card.description}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-70 group-hover:opacity-100">Click to expand <ArrowUpRight aria-hidden className="size-3" /></span></div>}>
    <ul className="mt-4 space-y-1.5 rounded-xl bg-background px-3 py-2.5">{card.files.map(file => <li key={file} className="flex items-center gap-2"><FileCode aria-hidden className="size-3.5 shrink-0 text-muted-foreground" /><span className="font-mono text-xs">{file}</span></li>)}</ul>
  </MorphicCardModal>)}</div></div>;
}
