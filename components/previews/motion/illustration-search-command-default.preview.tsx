"use client";

import { CheckSquare, FileText, StickyNote, Users } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { SearchCommandIllustration } from "@/components/motion/illustration-search-command";

const frames = ["", "l", "la", "lau", "laun", "launc", "launch", "launch", "launch", "launch", "launch", "launch", "launch", "launch"];
export function IllustrationSearchCommandPreview() {
  const [query, setQuery] = useState("launch");
  const [opened, setOpened] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!playing || reduce) return;
    const timer = window.setInterval(() => setStep(current => (current + 1) % frames.length), 300);
    return () => window.clearInterval(timer);
  }, [playing, reduce]);
  const items = [
    { id: "plan", label: "Launch brief", group: "Document", icon: FileText, onSelect: () => setOpened("Launch brief") },
    { id: "notes", label: "Campaign notes", group: "Note", icon: StickyNote, onSelect: () => setOpened("Campaign notes") },
    { id: "checklist", label: "Launch checklist", group: "Task list", icon: CheckSquare, onSelect: () => setOpened("Launch checklist") },
    { id: "team", label: "Team workspace", group: "People", icon: Users, onSelect: () => setOpened("Team workspace") },
  ];
  const demo = playing;
  return <div className="group relative w-full max-w-xl"><SearchCommandIllustration items={items} query={demo ? reduce ? "launch" : frames[step] : query} onQueryChange={setQuery} mode={demo ? "demonstration" : "interactive"} demonstrationActiveId={demo ? reduce || step > 9 ? "checklist" : "plan" : undefined} /><button type="button" onClick={() => { setPlaying(current => !current); setStep(0); }} className="absolute bottom-2 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-background/90 px-3 py-2 text-xs opacity-0 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 disabled:cursor-default">{playing ? "Use real input" : reduce ? "Show static search demonstration" : "Play search demonstration"}</button><p className="sr-only">The demonstration never opens a result. Use real input to type and press Enter.</p>{opened && <article aria-live="polite" className="mt-3 rounded-xl border border-border bg-card p-4"><h4 className="font-medium">{opened}</h4><p className="mt-2 text-sm text-muted-foreground">This local document view was opened by your selection.</p><button type="button" onClick={() => setOpened(null)} className="mt-3 cursor-pointer text-xs underline">Close document</button></article>}</div>;
}
