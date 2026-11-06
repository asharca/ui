"use client";

import { Boxes, BrainCircuit, ClipboardCheck, Database, MessageSquare, Radar, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { RollingStackIllustration } from "@/components/motion/illustration-rolling-stack";

const items = [
  { id: "data", label: "Data sources", icon: <Database /> },
  { id: "prompt", label: "Prompt design", icon: <MessageSquare /> },
  { id: "tools", label: "Tool selection", icon: <Boxes /> },
  { id: "reason", label: "Reasoning loop", icon: <BrainCircuit /> },
  { id: "safety", label: "Safety checks", icon: <ShieldCheck /> },
  { id: "quality", label: "Quality evals", icon: <ClipboardCheck /> },
  { id: "monitor", label: "Production monitor", icon: <Radar /> },
];
export function IllustrationRollingStackCardsPreview() {
  const [loop, setLoop] = useState(true);
  const [active, setActive] = useState("reason");
  return <div className="w-full max-w-xl"><RollingStackIllustration variant="cards" label="Interface workflow" items={items} activeId={active} onActiveChange={setActive} loop={loop} autoPlay /><label className="sr-only focus-within:not-sr-only"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} /> Loop the ordered stack</label></div>;
}
