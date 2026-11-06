"use client";
import { useState } from "react";
import { CompactSummaryCard } from "@/components/motion/purposeful-cards";
export function CompactCardPreview() {
  const [open, setOpen] = useState(false);
  return <div className="flex w-full flex-col items-center gap-4 px-4 py-10 sm:px-8 sm:py-16"><CompactSummaryCard title="Design refresh" status="In progress" people={["Mira Sol", "Alex Reed", "Jo Lane", "Sam Lake", "Lee Park"]} commentCount={3} details={[{ label: "Updated", value: "Updated 2h ago" }, { label: "Team", value: "Product team" }]} context="A tighter visual system for the next product release." onOpen={() => setOpen(value => !value)} />{open && <section aria-label="Project details" className="w-full max-w-sm rounded-xl border border-border p-4"><h3 className="font-semibold">Design refresh</h3><ul className="mt-3 text-sm"><li>8 chapters approved</li><li>4 chapters need a final review</li></ul><button type="button" onClick={() => setOpen(false)} className="mt-3 text-sm underline">Close details</button></section>}</div>;
}
