"use client";

import { useInView } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NewBadge } from "@/components/app/docs/new-badge";
import { PhoneFrame } from "@/components/mobile/phone-frame";
import { mobilePreviews } from "@/components/mobile/previews";
import { EASE_OUT_CSS } from "@/lib/ease";
import { type MobileScreenGroup, mobileScreenPath } from "@/lib/mobile-screens";
import { cn } from "@/lib/utils";

export function MobileScreenCard({
  group,
  eager = false,
  className,
}: {
  group: MobileScreenGroup;
  eager?: boolean;
  className?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "160px" });
  const showPreview = eager || inView;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryVariant = group.variants[0];
  const Preview = primaryVariant
    ? mobilePreviews[primaryVariant.previewKey]
    : undefined;
  const phoneTheme =
    mounted && resolvedTheme === "light" ? "light" : "dark";
  const count = group.variants.length;

  return (
    <article
      ref={cardRef}
      className={cn("group/card relative flex flex-col", className)}
    >
      <Link
        href={mobileScreenPath(group.slug)}
        prefetch={false}
        aria-label={`View ${group.title}`}
        className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div
        style={{ transitionTimingFunction: EASE_OUT_CSS }}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-3 transition-colors duration-300 group-hover/card:border-(--color-border-strong)"
      >
        {/* Scaled phone viewport */}
        <div
          inert
          aria-hidden="true"
          className="relative flex h-72 items-start justify-center overflow-hidden rounded-2xl bg-background/80 pt-4"
        >
          {showPreview && Preview ? (
            <div className="origin-top scale-[0.5] transition-transform duration-300 group-hover/card:scale-[0.515]">
              <PhoneFrame theme={phoneTheme} compact>
                <Preview />
              </PhoneFrame>
            </div>
          ) : (
            <div className="h-60 w-[137px] rounded-[1.3rem] border-4 border-[#26272c] bg-card/70" />
          )}
        </div>

        {/* Footer metadata */}
        <div className="mt-3 px-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {group.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {group.badge === "new" ? (
                <NewBadge launchedAt={group.launchedAt} />
              ) : null}
              <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
                {count === 1 ? "1 variant" : `${count} variants`}
              </span>
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {group.description}
          </p>
        </div>
      </div>
    </article>
  );
}
