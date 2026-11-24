"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { SiteSearch } from "@/components/app/chrome/site-search";
import { ThemeToggle } from "@/components/app/chrome/theme-toggle";
import { GithubIcon } from "@/components/app/icons";
import { PressLink } from "@/components/app/press-link";
import { hasSiteSidebar, isNativePath } from "@/lib/component-paths";
import { GITHUB_REPOSITORY_URL } from "@/lib/repository";
import { cn } from "@/lib/utils";

function formatStarCount(count: number) {
  if (count >= 1000) {
    const val = Math.round(count / 100) / 10;
    return `${val}k`;
  }
  return String(count);
}

export function SiteHeader({ overlayHero = false }: { overlayHero?: boolean }) {
  const [githubStarCount, setGithubStarCount] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-stars", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (Number.isSafeInteger(data.count) && data.count >= 0) {
          setGithubStarCount(data.count);
        }
      })
      .catch(() => {
        /* The GitHub link remains usable when the count is unavailable. */
      });
    return () => controller.abort();
  }, []);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  const overHero = overlayHero && !scrolled;
  const isComponents =
    (pathname.startsWith("/components") &&
      !pathname.startsWith("/components/templates") &&
      !pathname.startsWith("/components/mobile")) ||
    pathname.startsWith("/charts") ||
    pathname.startsWith("/docs");
  const isExplore = pathname.startsWith("/explore");
  const isIllustrations = pathname.startsWith("/illustrations");
  const isTemplates =
    pathname.startsWith("/templates") ||
    pathname.startsWith("/components/templates");
  const isStudio = pathname.startsWith("/studio");
  const isMobile =
    pathname === "/mobile" ||
    pathname.startsWith("/components/mobile") ||
    isNativePath(pathname);
  const showHeaderThemeToggle =
    !hasSiteSidebar(pathname) && pathname !== "/" && pathname !== "/mobile";

  const formattedStarCount =
    typeof githubStarCount === "number"
      ? formatStarCount(githubStarCount)
      : null;

  const navLinkClass = (active: boolean) =>
    cn(
      "relative rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
      overHero
        ? active
          ? "bg-white/15 text-white"
          : "text-white/75 hover:text-white"
        : active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,border-color,backdrop-filter] duration-300",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex h-14 w-full items-center justify-between gap-3 px-4 sm:px-6 md:px-8",
          overlayHero && !scrolled && "pt-2",
        )}
      >
        <div className="flex items-center gap-3">
          <MobileNav overHero={overHero} />
          <Link
            href="/"
            className={cn(
              "flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight transition-colors duration-300",
              overHero ? "text-white" : "text-foreground",
            )}
          >
            <Image
              src="/beui-mark.png"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="size-6 rounded-lg"
            />
            <span>beUI</span>
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 xl:absolute xl:left-1/2 xl:flex xl:-translate-x-1/2"
        >
          <Link href="/components" className={navLinkClass(isComponents)}>
            Components
          </Link>
          <Link href="/explore" className={navLinkClass(isExplore)}>
            Explore
          </Link>
          <Link href="/illustrations" className={navLinkClass(isIllustrations)}>
            Illustrations
          </Link>
          <Link href="/templates" className={navLinkClass(isTemplates)}>
            Templates
          </Link>
          <Link href="/studio" className={navLinkClass(isStudio)}>
            Studio
          </Link>
          <Link href="/mobile" className={navLinkClass(isMobile)}>
            Mobile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SiteSearch iconOnly overHero={overHero} />
          {showHeaderThemeToggle ? (
            <ThemeToggle className="hidden sm:block" />
          ) : null}
          <PressLink
            href={GITHUB_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "hidden h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors sm:inline-flex",
              overHero
                ? "border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15"
                : "border-border bg-card/50 text-foreground hover:border-(--color-border-strong)",
            )}
            aria-label={
              formattedStarCount
                ? `Star on GitHub, ${formattedStarCount} stars`
                : "Star on GitHub"
            }
          >
            <GithubIcon className="h-3.5 w-3.5" />
            {formattedStarCount ? (
              <span
                className={cn(
                  "tabular-nums",
                  overHero ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {formattedStarCount}
              </span>
            ) : null}
          </PressLink>
        </div>
      </div>
    </header>
  );
}
