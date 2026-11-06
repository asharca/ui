"use client";

import { useState } from "react";
import { UsageBudget } from "@/components/motion/usage-budget";

export function UsageBudgetPreview() {
  const [budget, setBudget] = useState(100);
  const [reject, setReject] = useState(false);
  return <div className="flex w-full flex-col items-center gap-4 py-4 sm:p-6"><UsageBudget budget={budget} period="September" unit="USD" thresholds={[50, 80, 100]} maxBudget={500} step={25} resources={[{ id: "compute", label: "Model inference", amount: 38.4, color: "var(--primary)", description: "1.8M tokens across 3 models" }, { id: "tools", label: "Tool calls", amount: 12.6, color: "var(--primary)", description: "420 searches and browser actions" }, { id: "storage", label: "Knowledge storage", amount: 4.8, color: "var(--primary)", description: "2.4 GB indexed" }]} onSave={async (next) => { if (reject) throw new Error("Local demo rejected this budget. Your saved limit has not changed."); setBudget(next); }} /><details className="w-full max-w-lg text-xs text-muted-foreground"><summary className="cursor-pointer">Demo controls</summary><label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={reject} onChange={(event) => setReject(event.target.checked)} />Reject saves to inspect the error state</label></details></div>;
}
