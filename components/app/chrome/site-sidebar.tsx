"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/app/chrome/theme-toggle";
import { NewBadge } from "@/components/app/docs/new-badge";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import {
  CATALOG_SECTIONS,
  type CatalogSectionId,
} from "@/lib/catalog-taxonomy";
import {
  isNativePath,
  NATIVE_PATH,
  nativeComponentPath,
} from "@/lib/component-paths";
import { moveNewItemsToTop } from "@/lib/component-status";
import nativeNav from "@/lib/native/nav.json";
import { cn } from "@/lib/utils";

const INTRO = [
  { slug: "components", name: "Components", href: "/components" },
  { slug: "installation", name: "Installation", href: "/docs/installation" },
  { slug: "native-setup", name: "React Native setup", href: "/docs/native-setup" },
  { slug: "ai-agents", name: "For AI agents", href: "/docs/ai-agents" },
  { slug: "react-native", name: "React Native", href: NATIVE_PATH },
  { slug: "workspace", name: "Workspace", href: "/workspace" },
];

const GUIDES = [
  { slug: "motion-patterns", name: "Motion Guides", href: "/docs/motion-patterns" },
  { slug: "theme", name: "Theme setup", href: "/docs/theme" },
  { slug: "openui", name: "OpenUI", href: "/docs/openui" },
];

const NATIVE_GROUPS = nativeNav.reduce<
  { name: string; items: typeof nativeNav }[]
>((groups, item) => {
  const group = groups.find((entry) => entry.name === item.group);
  if (group) group.items.push(item);
  else groups.push({ name: item.group, items: [item] });
  return groups;
}, []);

const NATIVE_INTRO = [
  { slug: "native-home", name: "Overview", href: NATIVE_PATH },
  { slug: "mobile-showcase", name: "Mobile Showcase", href: "/mobile" },
  { slug: "mobile-screens", name: "Mobile Screens (35)", href: "/components/mobile" },
  { slug: "native-setup", name: "Setup", href: "/docs/native-setup" },
];

const STICKY_CLEARANCE = 16;

function useRevealActiveLink(pathname: string) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const link = Array.from(nav.querySelectorAll("a")).find(
      (anchor) => anchor.getAttribute("href") === pathname,
    );
    if (!link || link.getClientRects().length === 0) return;
    let scroller = nav.parentElement;
    while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) {
      scroller = scroller.parentElement;
    }
    if (!scroller) return;
    const view = scroller.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.top >= view.top + STICKY_CLEARANCE && item.bottom <= view.bottom) {
      return;
    }
    scroller.scrollTop += item.top - view.top - (view.height - item.height) / 2;
  }, [pathname]);
  return ref;
}

function linkClass(active: boolean) {
  return cn(
    "relative block rounded-lg px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    active
      ? "bg-foreground/[0.06] font-medium text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );
}

function NativeSidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const navRef = useRevealActiveLink(pathname);
  const now = Date.now();

  return (
    <nav
      ref={navRef}
      aria-label="Browse React Native components"
      className="flex flex-col gap-6"
    >
      <div>
        <p className="mb-1.5 block px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          React Native
        </p>
        <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
          {NATIVE_INTRO.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              prefetch={false}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={onNavigate}
              className={linkClass(pathname === item.href)}
            >
              {item.name}
            </Link>
          ))}
        </SharedLayoutBg>
      </div>
      {NATIVE_GROUPS.map((group) => (
        <div key={group.name}>
          <p className="mb-1.5 flex items-center gap-2 rounded-md px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.name}
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground/[0.06] px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
              {group.items.length}
            </span>
          </p>
          <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
            {moveNewItemsToTop(
              group.items.map((item) => ({
                ...item,
                badge: "launchedAt" in item ? ("new" as const) : undefined,
              })),
              now,
            ).map((item) => {
              const href = nativeComponentPath(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={href}
                  prefetch={false}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={onNavigate}
                  className={linkClass(pathname === href)}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{item.title}</span>
                    {item.badge === "new" ? (
                      <NewBadge launchedAt={item.launchedAt} />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </SharedLayoutBg>
        </div>
      ))}
    </nav>
  );
}

function WebSidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const navRef = useRevealActiveLink(pathname);
  const now = Date.now();
  const [openSections, setOpenSections] = useState<Record<CatalogSectionId, boolean>>({
    components: true,
    agents: true,
    blocks: true,
    pages: true,
    templates: true,
    charts: true,
    mobile: false,
  });

  const toggleSection = (id: CatalogSectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav
      ref={navRef}
      aria-label="Browse components"
      className="flex flex-col gap-6"
    >
      <div>
        <p className="mb-1.5 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Intro
        </p>
        <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
          {INTRO.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              onClick={onNavigate}
              aria-current={pathname === item.href ? "page" : undefined}
              className={linkClass(pathname === item.href)}
            >
              {item.name}
            </Link>
          ))}
        </SharedLayoutBg>
      </div>

      <div>
        <p className="mb-1.5 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Guides
        </p>
        <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
          {GUIDES.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              onClick={onNavigate}
              aria-current={pathname === item.href ? "page" : undefined}
              className={linkClass(pathname === item.href)}
            >
              {item.name}
            </Link>
          ))}
        </SharedLayoutBg>
      </div>

      {CATALOG_SECTIONS.map((section) => {
        const hasActive = section.items.some((item) => pathname === item.href);
        const isOpen = openSections[section.id] || hasActive;
        const sortedItems = moveNewItemsToTop(section.items, now);

        return (
          <div key={section.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleSection(section.id)}
              className="mb-1.5 flex w-full items-center justify-between gap-2 rounded-md px-3 py-1 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span>{section.label}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  !isOpen && "-rotate-90",
                )}
              />
            </button>
            {isOpen ? (
              <SharedLayoutBg
                inset={0}
                pillClassName="rounded-lg bg-foreground/[0.05]"
              >
                {sortedItems.map((item) => (
                  <Link
                    key={`${section.id}-${item.slug}`}
                    href={item.href}
                    prefetch={false}
                    onClick={onNavigate}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={linkClass(pathname === item.href)}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate">{item.name}</span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {item.kind !== "native" ? (
                          <span className="rounded-md bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground tabular-nums">
                            {item.variantCount}
                          </span>
                        ) : null}
                        {item.badge === "new" ? (
                          <NewBadge launchedAt={item.launchedAt} />
                        ) : null}
                      </span>
                    </span>
                  </Link>
                ))}
              </SharedLayoutBg>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

/** Nav list shared by the desktop sidebar and the mobile bottom sheet. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  if (isNativePath(pathname)) {
    return <NativeSidebarNav pathname={pathname} onNavigate={onNavigate} />;
  }
  return <WebSidebarNav pathname={pathname} onNavigate={onNavigate} />;
}

export function SiteSidebar() {
  return (
    <aside aria-label="Site navigation" className="flex min-h-full flex-col">
      <div className="flex-1">
        <SidebarNav />
      </div>
      <div className="sticky -bottom-6 z-20 -mb-6 mt-6 border-t border-border bg-background px-2.5 py-3">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
