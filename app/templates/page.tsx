import type { Metadata } from "next";
import Link from "next/link";
import { PressLink } from "@/components/app/press-link";
import { standaloneTemplates } from "@/lib/standalone-templates";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Standalone application templates",
  description: "Independent React and Next.js frontend applications with editable source, local demo workflows and explicit service integration boundaries.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Source-owned applications</p>
        <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Start with a complete workspace.</h1>
        <p className="text-muted-foreground">Four independent frontend projects, each with its own routes, state and package configuration. Copy a project directory and run it without the documentation site.</p>
        <p className="text-sm text-muted-foreground">These are local demonstrations, not hosted AI, financial, authentication or collaboration services. Each project identifies what you need to connect before production.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {standaloneTemplates.map((template) => (
          <article key={template.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-medium text-foreground"><Link href={`/templates/${template.slug}`} className="underline-offset-4 hover:underline">{template.name}</Link></h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{template.description}</p>
            <ul className="my-5 flex-1 space-y-2 text-sm text-foreground">
              {template.features.map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true" className="text-muted-foreground">—</span>{feature}</li>)}
            </ul>
            <PressLink href={`/templates/${template.slug}`} className="self-start rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">View project</PressLink>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Looking for individual UI sections? <Link href="/components/blocks" className="text-foreground underline underline-offset-4">Browse copy-paste blocks</Link>.</p>
    </div>
  );
}
