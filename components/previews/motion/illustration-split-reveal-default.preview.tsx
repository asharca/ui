"use client";

import { Check, Code2, Database, FileText, ShieldCheck, UserRound } from "lucide-react";
import { SplitRevealIllustration } from "@/components/motion/illustration-split-reveal";

const tags = [
  { label: "Product docs", icon: FileText, top: 25, left: 5 },
  { label: "API schema", icon: Code2, top: 25, left: 53 },
  { label: "Support notes", icon: FileText, top: 39, left: -4 },
  { label: "Usage signals", icon: Database, top: 39, left: 50 },
  { label: "Release brief", icon: FileText, top: 53, left: 7 },
  { label: "Model policy", icon: ShieldCheck, top: 53, left: 61 },
  { label: "Evaluation set", icon: ShieldCheck, top: 67, left: 2 },
  { label: "User intent", icon: UserRound, top: 67, left: 55 },
];
function ContextTags({ blurred = false }: { blurred?: boolean }) {
  return <div className={blurred ? "absolute inset-0 blur-[2px]" : "absolute inset-0"}>{tags.map(({ label, icon: Icon, top, left }) => <div key={label} className="absolute flex h-8 w-[43%] items-center gap-1.5 rounded-full bg-background px-2 ring-1 ring-border" style={{ top: `${top}%`, left: `${left}%` }}><span className="grid size-5 shrink-0 place-items-center rounded-full bg-sky-500/10 text-sky-600"><Icon className="size-3" aria-hidden /></span><span className="min-w-0 flex-1 truncate text-xs">{label}</span><Check className="size-3 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600" aria-hidden /></div>)}</div>;
}
export function IllustrationSplitRevealPreview() {
  return <SplitRevealIllustration autoPlay beforeLabel="Unrefined context" afterLabel="Refined context" before={<ContextTags blurred />} after={<ContextTags />} />;
}
