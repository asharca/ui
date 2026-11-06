"use client";

import { useState } from "react";
import { EmptyState } from "@/components/motion/business-decisions/empty-states";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";

export function EmptyStatesBlankBoardPreview() {
  const [restored, setRestored] = useState(false);
  const [draft, setDraft] = useState("");
  const [fail, setFail] = useState(false);
  return <div className="relative w-full">{!restored ? <EmptyState kind="board" action={{ label: "New project", onAction: () => { if (fail) throw new Error("Demo rejection"); setRestored(true); } }} /> : <section className="space-y-4 rounded-2xl border border-border p-6"><h2 role="status" className="font-medium">Untitled project card</h2><Input label="Card title" value={draft} onChange={setDraft} /><Button variant="outline" onClick={() => setRestored(false)}>Reset demo</Button></section>}<details className="absolute left-4 top-full text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate recovery failure" checked={fail} onCheckedChange={setFail} /></details></div>;
}
