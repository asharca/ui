import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/app/docs/code-block";
import { PressLink } from "@/components/app/press-link";
import { GITHUB_REPOSITORY_URL } from "@/lib/repository";
import { standaloneTemplates, standaloneTemplateSource } from "@/lib/standalone-templates";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return standaloneTemplates.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = standaloneTemplates.find((entry) => entry.slug === slug);
  if (!template) notFound();
  return { title: template.name, description: template.description, alternates: { canonical: `/templates/${slug}` } };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = standaloneTemplates.find((entry) => entry.slug === slug);
  if (!template) notFound();
  const command = `git clone ${GITHUB_REPOSITORY_URL}.git asharca-ui\ncd asharca-ui/${template.directory}\nbun install\nbun run dev`;
  return (
    <article className="max-w-3xl space-y-9">
      <header className="space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/templates" className="underline-offset-4 hover:underline">Templates</Link><span aria-hidden="true"> / </span><span className="text-foreground">{template.name}</span></nav>
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{template.name}</h1>
        <p className="text-muted-foreground">{template.description}</p>
        <PressLink href={standaloneTemplateSource(template.directory)} className="inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Browse source</PressLink>
      </header>
      <section aria-labelledby="included" className="space-y-4">
        <h2 id="included" className="text-xl font-medium text-foreground">Included workflows</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">{template.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
      </section>
      <section aria-labelledby="run" className="space-y-4">
        <h2 id="run" className="text-xl font-medium text-foreground">Run independently</h2>
        <p className="text-sm text-muted-foreground">The directory contains the application and its copied UI dependencies. It does not import code from its parent checkout. You can move it into a separate repository.</p>
        <CodeBlock code={command} lang="bash" />
        <p className="text-sm text-muted-foreground">Run <code className="text-foreground">bun run typecheck</code> in the application directory for its own strict TypeScript check. Development and production commands belong to the application, not this documentation site.</p>
      </section>
      <section aria-labelledby="services" className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 id="services" className="font-medium text-foreground">Demo and service boundaries</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{template.integrations}</p>
        <p className="text-sm text-muted-foreground">Local browser data is not a server database. Do not enter real credentials, private keys or sensitive customer data into a demo.</p>
      </section>
    </article>
  );
}
