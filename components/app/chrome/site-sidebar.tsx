"use client";

import { categoryPath, componentPath, isNativePath, NATIVE_PATH, nativeComponentPath } from "@/lib/component-paths";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import nativeNav from "@/lib/native/nav.json";
import { registry } from "@/lib/registry";
import { NewBadge } from "@/components/app/docs/new-badge";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { moveNewItemsToTop } from "@/lib/component-status";
import { cn } from "@/lib/utils";

const INTRO = [
  { slug: "home", name: "Home", href: "/components/motion" },
  { slug: "react-native", name: "React Native", href: NATIVE_PATH },
  { slug: "templates", name: "Templates", href: "/templates" },
  { slug: "changelog", name: "Changelog", href: "/changelog" },
];

const PATTERNS = [
  { slug: "motion-patterns", name: "Motion Guides", href: "/docs/motion-patterns" },
  { slug: "ai-agents", name: "Agent Guide", href: "/docs/ai-agents" },
  { slug: "openui", name: "OpenUI", href: "/docs/openui" },
  { slug: "native-setup", name: "React Native Setup", href: "/docs/native-setup" },
];

const SIDEBAR_CATEGORY_ORDER: Record<string, number> = {
  agents: 0,
  motion: 1,
  blocks: 2,
};

const SIDEBAR_CATEGORIES = registry.filter((category) => category.slug !== "charts").sort(
  (a, b) =>
    (SIDEBAR_CATEGORY_ORDER[a.slug] ?? Number.MAX_SAFE_INTEGER) -
    (SIDEBAR_CATEGORY_ORDER[b.slug] ?? Number.MAX_SAFE_INTEGER),
);


// Native components in catalog order, grouped as the native showcase groups
// them, for the sidebar on /react-native pages.
const NATIVE_GROUPS = nativeNav.reduce<{ name: string; items: typeof nativeNav }[]>(
  (groups, item) => {
    const group = groups.find((entry) => entry.name === item.group);
    if (group) group.items.push(item);
    else groups.push({ name: item.group, items: [item] });
    return groups;
  },
  [],
);

const NATIVE_INTRO = [
  { slug: "native-home", name: "Overview", href: NATIVE_PATH },
  { slug: "native-setup", name: "Setup", href: "/docs/native-setup" },
];

const COUNT_CLASS =
  "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground/[0.06] px-1 text-[10px] font-medium tabular-nums text-muted-foreground";

const GROUP_LABEL =
  "mb-1.5 flex items-center gap-2 rounded-md px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

// Keep a little space above the active link when revealing it in the sidebar.
const STICKY_CLEARANCE = 16;

/**
 * Keep the current page's link in view when the list mounts or the route
 * changes. A fresh load, a reload or the phone sheet opening would otherwise
 * start the list at the top, far from the reader's place. A visible link is
 * left alone, so clicking an item never moves the list.
 */
function useRevealActiveLink(pathname: string) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const link = Array.from(nav.querySelectorAll("a")).find(
      (anchor) => anchor.getAttribute("href") === pathname,
    );
    // A link inside a filtered-out group has no boxes to reveal.
    if (!link || link.getClientRects().length === 0) return;
    let scroller = nav.parentElement;
    while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) {
      scroller = scroller.parentElement;
    }
    if (!scroller) return;
    const view = scroller.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.top >= view.top + STICKY_CLEARANCE && item.bottom <= view.bottom) return;
    scroller.scrollTop += item.top - view.top - (view.height - item.height) / 2;
  }, [pathname]);
  return ref;
}

/** The React Native pages' list: overview, setup, then components by group. */
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
    <nav ref={navRef} aria-label="Browse React Native components" className="flex flex-col gap-6">
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
          <p className={GROUP_LABEL}>
            {group.name}
            <span className={COUNT_CLASS}>{group.items.length}</span>
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

function linkClass(active: boolean) {
  return cn(
    "relative block rounded-lg px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    active
      ? "text-foreground font-medium bg-foreground/[0.06]"
      : "text-muted-foreground hover:text-foreground",
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

function WebSidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const navRef = useRevealActiveLink(pathname);
  const now = Date.now();
  const isCharts = pathname === "/charts" || pathname.startsWith("/charts/");
  const categories = isCharts
    ? registry.filter((category) => category.slug === "charts")
    : SIDEBAR_CATEGORIES;
  const intro = isCharts
    ? [{ slug: "home", name: "Home", href: "/charts" }]
    : INTRO;

  return (
    <nav ref={navRef} aria-label="Browse components" className="flex flex-col gap-8">
      <div>
        <p className="mb-2 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Intro
        </p>
        <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
          {intro.map((item) => (
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
      {!isCharts ? (
        <div>
          <p className="mb-2 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Guides
          </p>
          <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
            {PATTERNS.map((item) => (
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
      ) : null}
      {categories.map((cat) => (
        <div key={cat.slug}>
          <Link
            href={categoryPath(cat.slug)}
            onClick={onNavigate}
            className="mb-2 flex items-center gap-2 rounded-md px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {cat.name}
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground/[0.06] px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
              {cat.components.length}
            </span>
          </Link>
          <SharedLayoutBg inset={0} pillClassName="rounded-lg bg-foreground/[0.05]">
            {moveNewItemsToTop(cat.components, now).map((comp) => {
              const href = componentPath(cat.slug, comp.slug);
              return (
                <Link
                  key={comp.slug}
                  href={href}
                  onClick={onNavigate}
                  aria-current={pathname === href ? "page" : undefined}
                  className={linkClass(pathname === href)}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{comp.name}</span>
                    {comp.badge === "new" ? (
                      <NewBadge launchedAt={comp.launchedAt} />
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

export function SiteSidebar() {
  return (
    <aside aria-label="Site navigation">
      <SidebarNav />
    </aside>
  );
}
