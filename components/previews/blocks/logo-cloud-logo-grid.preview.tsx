"use client";

import { useId } from "react";
import { LogoGrid } from "@/components/motion/logo-cloud";

const names = ["Northline", "Paperwell", "Morrow", "Fieldwork", "Stillform", "Arcstead", "Commonpath", "Daybreak"];
const marks = ["◈", "⌁", "◒", "✳", "▱", "⌘", "⊞", "◬", "◇", "⊙", "⌇", "△"];

export function LogoGridPreview() {
  const id = useId();
  return <div className="w-full min-w-0"><LogoGrid title="The fastest teams build with beUI" description="From seed-stage startups to platform teams shipping at scale." logos={names.map((name, index) => ({ id: name.toLowerCase(), name, mark: marks[index], href: `#${id}-${index}` }))} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Original demonstration wordmarks · not customer endorsements</summary><div className="mt-4 grid gap-3 sm:grid-cols-2">{names.map((name, index) => <article key={name} id={`${id}-${index}`} className="rounded-xl border border-border p-4"><h3 className="text-sm font-medium text-foreground">{name}</h3><p className="mt-2 leading-6">An original fictional wordmark for layout demonstration, not an endorsement or customer claim.</p></article>)}</div></details></div>;
}
