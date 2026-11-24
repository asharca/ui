"use client";

import { Check, Copy } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { PreviewFit } from "@/components/app/landing/preview-fit";
import { previews } from "@/components/previews";
import type { IllustrationCollection } from "@/lib/catalog-taxonomy";

function IllustrationCard({ item }: { item: IllustrationCollection }) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldRender = useInView(cardRef, { once: true, margin: "120px" });
  const [hover, setHover] = useState(false);
  const lead = item.variants[0];
  const Preview = lead ? previews[lead.previewKey] : undefined;

  return (
    <article
      ref={cardRef}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative"
    >
      <Link
        href={`/illustrations/${item.slug}`}
        prefetch={false}
        aria-label={`View ${item.name}`}
        className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-2 transition-colors duration-200 group-hover:border-(--color-border-strong)">
        <div
          inert
          aria-hidden="true"
          className="relative h-56 overflow-hidden rounded-2xl border border-border/60 bg-background bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
        >
          {shouldRender ? (
            <PreviewFit
              hover={hover}
              maxScale={0.78}
              marginClassName="m-0 h-full bg-transparent"
            >
              {Preview ? <Preview /> : null}
            </PreviewFit>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 px-2.5 pt-3 pb-1.5">
          <span className="truncate text-sm font-medium text-foreground">
            {item.name}
          </span>
          {item.variants.length > 1 ? (
            <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
              {item.variants.length}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function IllustrationsGrid({
  collections,
  totalVariants,
}: {
  collections: IllustrationCollection[];
  totalVariants: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    const prompt = [
      "Use these animated React illustrations from beUI:",
      ...collections.map(
        (col) =>
          `- ${col.name}: ${col.variants.map((v) => `@beui/${v.installSlug}`).join(", ")}`,
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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              Animated illustrations
            </h1>
            <span className="rounded-md bg-foreground/[0.06] px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums">
              {totalVariants}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Small animated visuals made for feature cards, product sections, and
            empty states. Install the React source and adapt every detail.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyPrompt}
          className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5 text-success" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5 text-muted-foreground" />
          )}
          <span>{copied ? "Copied prompt" : "Copy prompt"}</span>
        </button>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((item) => (
          <IllustrationCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
