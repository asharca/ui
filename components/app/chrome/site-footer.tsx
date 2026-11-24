import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/app/chrome/theme-toggle";
import { GithubIcon } from "@/components/app/icons";
import {
  getCatalogSection,
  ILLUSTRATION_COLLECTIONS,
} from "@/lib/catalog-taxonomy";
import { GITHUB_REPOSITORY_URL } from "@/lib/repository";

const COMPONENT_ITEMS = getCatalogSection("components").items;
const BLOCK_ITEMS = getCatalogSection("blocks").items;
const TEMPLATE_ITEMS = getCatalogSection("templates").items;

const LINKS = [
  { href: "/changelog", label: "Changelog" },
  { href: "/components", label: "Browse all" },
  { href: "/explore", label: "Explore" },
  { href: "/illustrations", label: "Illustrations" },
  { href: "/templates", label: "Templates" },
  { href: "/studio", label: "Background Studio" },
  { href: "/workspace", label: "Workspace" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/ai-agents", label: "For AI agents" },
  { href: "/docs/theme", label: "Theming" },
  { href: "/docs/motion-patterns", label: "Motion guides" },
  { href: GITHUB_REPOSITORY_URL, label: "GitHub" },
  { href: "/llms.txt", label: "llms.txt" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-x-8 gap-y-12 px-4 py-16 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        {/* Brand */}
        <div className="max-w-xs">
          <Link
            prefetch={false}
            href="/"
            className="inline-flex items-center gap-2.5"
          >
            <Image
              src="/beui-mark.png"
              alt=""
              width={30}
              height={30}
              className="size-[30px] rounded-full"
            />
            <span className="text-lg font-semibold tracking-[-0.01em] text-foreground">
              beUI
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Animated motion components, illustrations, blocks, and full templates
            for React, Next.js and React Native. Copy the source or install with
            a CLI.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Created by <span className="text-foreground">Saurabh</span>
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <a
              href={GITHUB_REPOSITORY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon className="size-4" />
            </a>
            <a
              href="https://x.com/saurra3h"
              target="_blank"
              rel="noreferrer noopener"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="sr-only">X / Twitter</span>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                className="size-4"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a
              href="mailto:saurabh10102@gmail.com"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="sr-only">Email</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
                focusable="false"
                className="size-4"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
          </div>
          <div className="mt-5">
            <ThemeToggle />
          </div>
        </div>

        {/* Components */}
        <nav aria-label="Components">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Components
          </p>
          <ul className="mt-4 space-y-2.5">
            {COMPONENT_ITEMS.slice(0, 7).map((item) => (
              <li key={item.slug}>
                <Link
                  prefetch={false}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                prefetch={false}
                href="/components?tab=components"
                className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                View all ({COMPONENT_ITEMS.length})
              </Link>
            </li>
          </ul>
        </nav>

        {/* Blocks */}
        <nav aria-label="Blocks">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Blocks
          </p>
          <ul className="mt-4 space-y-2.5">
            {BLOCK_ITEMS.slice(0, 7).map((item) => (
              <li key={item.slug}>
                <Link
                  prefetch={false}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                prefetch={false}
                href="/components?tab=blocks"
                className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                View all ({BLOCK_ITEMS.length})
              </Link>
            </li>
          </ul>
        </nav>

        {/* Illustrations */}
        <nav aria-label="Illustrations">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Illustrations
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                prefetch={false}
                href="/illustrations"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Animated Illustrations
              </Link>
            </li>
            {ILLUSTRATION_COLLECTIONS.slice(0, 5).map((item) => (
              <li key={item.slug}>
                <Link
                  prefetch={false}
                  href={`/illustrations/${item.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                prefetch={false}
                href="/illustrations"
                className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                View all ({ILLUSTRATION_COLLECTIONS.length})
              </Link>
            </li>
          </ul>
        </nav>

        {/* Templates */}
        <nav aria-label="Templates">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Templates
          </p>
          <ul className="mt-4 space-y-2.5">
            {TEMPLATE_ITEMS.slice(0, 7).map((item) => (
              <li key={item.slug}>
                <Link
                  prefetch={false}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                prefetch={false}
                href="/templates"
                className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                View all ({TEMPLATE_ITEMS.length})
              </Link>
            </li>
          </ul>
        </nav>

        {/* Links */}
        <nav aria-label="Links">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Links
          </p>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((item) => {
              const external = item.href.startsWith("http");
              return (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    prefetch={false}
                    href={item.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
