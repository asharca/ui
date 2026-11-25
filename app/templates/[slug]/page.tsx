import { ArrowLeft, ChevronRight, ExternalLink, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/app/docs/code-block";
import { CopyPage } from "@/components/app/docs/copy-page";
import { PressLink } from "@/components/app/press-link";
import { TemplateEditorialSections } from "@/components/app/templates/template-editorial-sections";
import { TemplateLiveStage } from "@/components/app/templates/template-live-stage";
import { GITHUB_REPOSITORY_URL } from "@/lib/repository";
import { demoUrlFor, SITE_URL } from "@/lib/site";
import {
  standaloneTemplates,
  standaloneTemplateSource,
} from "@/lib/standalone-templates";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return standaloneTemplates.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = standaloneTemplates.find((entry) => entry.slug === slug);
  if (!template) notFound();
  return {
    title: template.name,
    description: template.description,
    alternates: { canonical: `/templates/${slug}` },
  };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = standaloneTemplates.find((entry) => entry.slug === slug);
  if (!template) notFound();

  const demoUrl = demoUrlFor(template.slug);
  const command = `git clone ${GITHUB_REPOSITORY_URL}.git asharca-ui\ncd asharca-ui/${template.directory}\nbun install\nbun run dev`;

  return (
    <article className="mx-auto max-w-5xl space-y-12 pb-16">
      <header className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link
              href="/templates"
              className="transition-colors hover:text-foreground"
            >
              Templates
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">{template.name}</span>
          </nav>

          <CopyPage
            pageUrl={`${SITE_URL}/templates/${template.slug}`}
            markdownPath="/llms.txt"
            componentName={template.name}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {template.name}
            </h1>
            <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs text-muted-foreground">
              1 variant
            </span>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {template.description}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card/70 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Get this template
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {template.tagline}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
            >
              <Play className="size-3.5" aria-hidden="true" />
              Live preview
            </a>
            <PressLink
              href={standaloneTemplateSource(template.directory)}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-500"
            >
              Browse source
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </PressLink>
          </div>
        </div>
      </header>

      <section
        id="live-preview"
        aria-label={`${template.name} live preview`}
        className="scroll-mt-24"
      >
        <TemplateLiveStage
          slug={template.slug}
          title={template.name}
          demoUrl={demoUrl}
          fallbackSlug={template.slug}
        />
      </section>

      <TemplateEditorialSections
        whatIsIt={template.whatIsIt}
        whoIsItFor={template.whoIsItFor}
        highlights={template.highlights}
        directory={template.directory}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <section aria-labelledby="included" className="space-y-4">
          <h2 id="included" className="text-lg font-medium text-foreground">
            Included workflows
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
            {template.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="run" className="space-y-4">
          <h2 id="run" className="text-lg font-medium text-foreground">
            Run independently
          </h2>
          <p className="text-sm text-muted-foreground">
            The directory contains the application and its copied UI
            dependencies. It does not import code from its parent checkout.
          </p>
          <CodeBlock code={command} lang="bash" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Run <code className="text-foreground">bun run typecheck</code> in
            the application directory for its own strict TypeScript check.
          </p>
        </section>
      </div>

      <section
        aria-labelledby="services"
        className="space-y-3 rounded-2xl border border-border bg-card/60 p-5"
      >
        <h2 id="services" className="font-medium text-foreground">
          Demo and service boundaries
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {template.integrations}
        </p>
        <p className="text-sm text-muted-foreground">
          Local browser data is not a server database. Do not enter real
          credentials, private keys or sensitive customer data into a demo.
        </p>
      </section>

      <div className="pt-2">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to all templates
        </Link>
      </div>
    </article>
  );
}
