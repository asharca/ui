"use client";

import { useId } from "react";
import { RollingLogoCarousel } from "@/components/motion/logo-cloud";

const names = ["Northline", "Paperwell", "Morrow", "Fieldwork", "Stillform", "Arcstead", "Commonpath", "Daybreak", "Quartzwell", "Folio", "Orbitline", "Aperture"];
const marks = ["◈", "⌁", "◒", "✳", "▱", "⌘", "⊞", "◬", "◇", "⊙", "⌇", "△"];

export function RollingLogoCarouselPreview() {
  const id = useId();
  return <div className="w-full min-w-0"><RollingLogoCarousel title="The names change. The standard stays high." description="A rotating view of the teams using one flexible system to ship distinctly their own." logos={names.map((name, index) => ({ id: name.toLowerCase(), name, mark: marks[index], href: `#${id}-${index}` }))} /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Original demonstration wordmarks · not customer endorsements</summary><div className="mt-4 grid gap-3 sm:grid-cols-2">{names.map((name, index) => <article key={name} id={`${id}-${index}`} className="rounded-xl border border-border p-4"><h3 className="text-sm font-medium text-foreground">{name}</h3><p className="mt-2 leading-6">An original fictional wordmark for layout demonstration, not an endorsement or customer claim.</p></article>)}</div></details></div>;
}
