import { ChevronRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CatalogCard } from "@/components/app/catalog/catalog-card";
import { CopyPage } from "@/components/app/docs/copy-page";
import { getCatalogSection } from "@/lib/catalog-taxonomy";
import { SITE_URL } from "@/lib/site";
import {
  standaloneTemplates,
  standaloneTemplateSource,
} from "@/lib/standalone-templates";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Complete Next.js landing-page templates and independent application workspaces with editable source.",
  alternates: { canonical: "/templates" },
};

const PILLS = [
  { href: "/components", label: "All", active: false },
  { href: "/components?tab=new", label: "New", active: false },
  { href: "/components?tab=components", label: "Components", active: false },
  { href: "/components?tab=agents", label: "Agents", active: false },
  { href: "/components?tab=blocks", label: "Blocks", active: false },
  { href: "/components?tab=pages", label: "Pages", active: false },
  { href: "/templates", label: "Templates", active: true },
];

export default function TemplatesPage() {
  const templates = getCatalogSection("templates").items;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href="/components"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Components
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Templates</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Next.js landing pages &amp; application templates
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Complete Next.js landing pages and standalone application projects
            for AI products, analytics tools, developer tools, crypto products,
            and modern SaaS launches.
          </p>
        </div>
        <CopyPage
          pageUrl={`${SITE_URL}/templates`}
          markdownPath="/llms.txt"
          componentName="Templates"
        />
      </div>

      <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-1 rounded-full bg-muted p-1">
        {PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            aria-current={pill.active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              pill.active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {pill.label}
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Templates
          </h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {templates.length}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((item) => (
            <CatalogCard
              key={item.slug}
              href={item.href}
              title={item.name}
              previewKey={item.previewKey}
              badgeLabel={
                item.kind === "standalone"
                  ? "App template"
                  : item.variantCount === 1
                    ? "1 variant"
                    : `${item.variantCount} variants`
              }
              badge={item.badge}
              launchedAt={item.launchedAt}
              widePreview={item.widePreview}
            />
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-border pt-10">
        <header className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Source-owned applications
          </p>
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Four standalone Next.js projects
          </h2>
          <p className="text-sm text-muted-foreground">
            Each directory under <code className="text-foreground">templates/</code>{" "}
            contains its own routes, state, and package configuration so you can
            copy and run it independently.
          </p>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {standaloneTemplates.map((template) => (
            <article
              key={template.slug}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-foreground">
                  <Link
                    href={`/templates/${template.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {template.name}
                  </Link>
                </h3>
                <a
                  href={standaloneTemplateSource(template.directory)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Source</span>
                  <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {template.description}
              </p>
              <ul className="my-4 flex-1 space-y-1.5 text-sm text-foreground/90">
                {template.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="text-muted-foreground">
                      —
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/templates/${template.slug}`}
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                View project
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
