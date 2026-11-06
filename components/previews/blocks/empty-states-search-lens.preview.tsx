"use client";

import { useState } from "react";
import { EmptyState } from "@/components/motion/business-decisions/empty-states";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";

export function EmptyStatesSearchLensPreview() {
  const [restored, setRestored] = useState(false);
  const [fail, setFail] = useState(false);
  return <div className="relative w-full">{!restored ? <EmptyState kind="search" action={{ label: "Reset search", onAction: () => { if (fail) throw new Error("Demo rejection"); setRestored(true); } }} /> : <section className="space-y-4 rounded-2xl border border-border p-6"><h2 role="status" className="font-medium">Filters cleared. Showing all results.</h2><ul className="space-y-2 text-sm"><li>Research synthesis</li><li>Workspace refresh</li></ul><Button variant="outline" onClick={() => setRestored(false)}>Reset demo</Button></section>}<details className="absolute left-4 top-full text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate recovery failure" checked={fail} onCheckedChange={setFail} /></details></div>;
}
