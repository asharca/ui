import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { CodeBlock } from "@/components/app/docs/code-block";
import { CopyPage } from "@/components/app/docs/copy-page";
import { KeepInMind } from "@/components/app/docs/keep-in-mind";
import { NewBadge } from "@/components/app/docs/new-badge";
import { MobileVariantSection } from "@/components/app/mobile/mobile-variant-tabs";
import {
  getMobileVariantSource,
  getMobileVariantUsage,
} from "@/lib/mobile-screen-source";
import {
  adjacentMobileScreenGroups,
  findMobileScreenGroup,
  MOBILE_SCREENS_PATH,
  mobileScreenPath,
  mobileScreenStaticParams,
} from "@/lib/mobile-screens";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = mobileScreenStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = findMobileScreenGroup(slug);
  if (!group) return {};

  const url = mobileScreenPath(group.slug);
  const title = `${group.title} for React Native`;
  return {
    title,
    description: group.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · beUI`,
      description: group.description,
      url,
      siteName: "beUI",
    },
  };
}

const PAGER_LINK =
  "group flex min-w-0 flex-1 flex-col gap-1 rounded-2xl border border-border px-4 py-3 outline-none transition-colors hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-ring";

export default async function MobileScreenDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = findMobileScreenGroup(slug);
  if (!group) notFound();

  const variantCount = group.variants.length;
  const installCmd = `npx expo install ${group.libraries.join(" ")}`;
  const { prev, next } = adjacentMobileScreenGroups(group.slug);

  return (
    <div className="min-w-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "beUI", path: "/" },
            { name: "Mobile", path: MOBILE_SCREENS_PATH },
            { name: group.title, path: mobileScreenPath(group.slug) },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href={MOBILE_SCREENS_PATH}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Mobile
        </Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">{group.title}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            {group.title}
          </h1>
          <span className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            {variantCount === 1 ? "1 variant" : `${variantCount} variants`}
          </span>
          {group.badge === "new" ? (
            <NewBadge launchedAt={group.launchedAt} />
          ) : null}
        </div>
        <CopyPage
          pageUrl={`${SITE_URL}${mobileScreenPath(group.slug)}`}
          markdownPath="/llms.txt"
          componentName={group.title}
        />
      </div>

      <p className="mt-2 max-w-2xl text-muted-foreground">{group.description}</p>

      <div className="mt-10 flex flex-col gap-12">
        {group.variants.map((variant) => {
          const source = getMobileVariantSource(group, variant);
          const usage = getMobileVariantUsage(group, variant);
          const usageFilename = `app/${variant.slug}.tsx`;

          return (
            <MobileVariantSection
              key={variant.slug}
              variant={variant}
              usageNode={<CodeBlock code={usage} filename={usageFilename} />}
              sourceNode={<CodeBlock code={source} filename={variant.filename} />}
            />
          );
        })}
      </div>

      <section
        id="libraries"
        className="mt-12 scroll-mt-24 border-t border-border pt-8"
      >
        <h2 className="text-sm font-semibold text-foreground">Libraries</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Install peer dependencies once in your Expo project, then copy any
          screen above into{" "}
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
            src/
          </code>
          . See the{" "}
          <Link
            href="/docs/native-setup"
            className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            React Native setup guide
          </Link>{" "}
          for Uniwind theme tokens.
        </p>
        <div className="mt-3">
          <CodeBlock code={installCmd} lang="bash" />
        </div>
      </section>

      <KeepInMind />

      <nav
        aria-label="Previous and next mobile screen groups"
        className="mt-12 flex flex-col gap-3 sm:flex-row"
      >
        {prev ? (
          <Link href={mobileScreenPath(prev.slug)} className={PAGER_LINK}>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowLeft
                aria-hidden="true"
                className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 motion-reduce:transition-none"
              />
              Previous
            </span>
            <span className="truncate text-sm font-medium text-foreground">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden flex-1 sm:block" />
        )}
        {next ? (
          <Link
            href={mobileScreenPath(next.slug)}
            className={cn(PAGER_LINK, "sm:items-end sm:text-right")}
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Next
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </span>
            <span className="max-w-full truncate text-sm font-medium text-foreground">
              {next.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden flex-1 sm:block" />
        )}
      </nav>
    </div>
  );
}
