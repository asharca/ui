"use client";

import { useInView } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { NewBadge } from "@/components/app/docs/new-badge";
import type { CardVariant } from "@/components/app/landing/landing-component-card";
import { PreviewFit } from "@/components/app/landing/preview-fit";
import { previews } from "@/components/previews";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

const VARIANT_SPAN: Record<CardVariant, string> = {
  default: "",
  wide: "sm:col-span-2",
  feature: "sm:col-span-2 sm:row-span-2",
};

export type CatalogCardProps = {
  href: string;
  title: string;
  previewKey: string;
  badgeLabel?: string;
  badge?: "new";
  launchedAt?: string;
  widePreview?: boolean;
  variant?: CardVariant;
  className?: string;
};

export function CatalogCard({
  href,
  title,
  previewKey,
  badgeLabel,
  badge,
  launchedAt,
  widePreview = false,
  variant = "default",
  className,
}: CatalogCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldRenderPreview = useInView(cardRef, {
    once: true,
    margin: "120px",
  });
  const [hover, setHover] = useState(false);
  const Preview = previews[previewKey];
  const feature = variant === "feature";

  return (
    <article
      ref={cardRef}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        "group/card relative h-72",
        VARIANT_SPAN[variant],
        className,
      )}
    >
      <Link
        href={href}
        prefetch={false}
        aria-label={`View ${title}`}
        className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div
        style={{ transitionTimingFunction: EASE_OUT_CSS }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors duration-300 contain-[paint] group-hover/card:border-(--color-border-strong)"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
          <h3
            title={title}
            className={cn(
              "min-w-0 flex-1 truncate font-sans font-medium text-foreground",
              feature ? "text-lg" : "text-base",
            )}
          >
            {title}
          </h3>
          {(badgeLabel || badge === "new") && (
            <div className="flex shrink-0 items-center gap-1.5">
              {badgeLabel ? (
                <span className="rounded-md bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-xs text-foreground/70 tabular-nums">
                  {badgeLabel}
                </span>
              ) : null}
              {badge === "new" ? <NewBadge launchedAt={launchedAt} /> : null}
            </div>
          )}
        </div>

        <div
          inert
          aria-hidden="true"
          className="relative mx-2 mb-2 flex min-h-0 flex-1 overflow-hidden rounded-2xl bg-background"
        >
          {shouldRenderPreview ? (
            <PreviewFit
              hover={hover}
              stageWidth={widePreview ? 960 : 460}
              maxScale={feature ? 1 : widePreview ? 0.92 : 0.82}
              align={widePreview ? "top" : "center"}
              marginClassName="m-0 h-full"
            >
              {Preview ? <Preview /> : null}
            </PreviewFit>
          ) : null}
        </div>
      </div>
    </article>
  );
}
