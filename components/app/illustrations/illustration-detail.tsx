"use client";

import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InstallCommand } from "@/components/app/docs/install-command";
import { previews } from "@/components/previews";
import type { IllustrationCollection } from "@/lib/catalog-taxonomy";
import { cn } from "@/lib/utils";

export function IllustrationDetail({
  collection,
}: {
  collection: IllustrationCollection;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    const prompt = [
      `Install "${collection.name}" from beUI:`,
      ...collection.variants.map(
        (variant) => `- ${variant.name}: bunx --bun shadcn add @beui/${variant.installSlug}`,
      ),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/illustrations"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        <span>All illustrations</span>
      </Link>

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {collection.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-3.5 text-success" />
            ) : (
              <Copy aria-hidden="true" className="size-3.5 text-muted-foreground" />
            )}
            <span>{copied ? "Copied prompt" : "Copy prompt"}</span>
          </button>
          <Link
            href={collection.docsHref}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
          >
            <span>Source &amp; API</span>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </header>

      <div
        className={cn(
          "mt-8 grid gap-8",
          collection.variants.length > 1
            ? "grid-cols-1 md:grid-cols-2"
            : "max-w-xl grid-cols-1",
        )}
      >
        {collection.variants.map((variant) => {
          const Preview = previews[variant.previewKey];
          return (
            <section key={variant.slug} className="min-w-0">
              <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-6 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="w-full max-w-full overflow-x-auto flex items-center justify-center">
                  {Preview ? <Preview /> : null}
                </div>
              </div>
              <h2 className="mt-4 text-sm font-medium text-foreground">
                {variant.name}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {variant.description}
              </p>
              <div className="mt-3">
                <InstallCommand slug={variant.installSlug} />
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          Use it in your project
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Use the command beside each preview to install only that variant, then
          customize its copy, theme colors, and motion directly in your codebase.
          Full source and usage snippets are available on{" "}
          <Link
            href={collection.docsHref}
            className="text-foreground underline underline-offset-4"
          >
            the component documentation page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
