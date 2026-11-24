"use client";

import {
  CircleDashed,
  FileText,
  Layers,
  Search,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NewBadge } from "@/components/app/docs/new-badge";
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette";
import { ILLUSTRATION_COLLECTIONS } from "@/lib/catalog-taxonomy";
import { nativeComponentPath } from "@/lib/component-paths";
import {
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREENS_PATH,
  mobileScreenPath,
} from "@/lib/mobile-screens";
import nativeNav from "@/lib/native/nav.json";
import { componentSearchEntries } from "@/lib/site-search";
import { standaloneTemplates } from "@/lib/standalone-templates";
import { cn } from "@/lib/utils";

const PAGES = [
  { slug: "home", name: "Home", href: "/" },
  { slug: "components", name: "Components Catalog", href: "/components" },
  { slug: "explore", name: "Explore Blocks", href: "/explore" },
  { slug: "illustrations", name: "Animated Illustrations", href: "/illustrations" },
  { slug: "templates", name: "Templates", href: "/templates" },
  { slug: "studio", name: "Background Studio", href: "/studio" },
  { slug: "workspace", name: "Workspace Shell Demo", href: "/workspace" },
  { slug: "installation", name: "Installation", href: "/docs/installation" },
  { slug: "theme", name: "Theme setup", href: "/docs/theme" },
  { slug: "ai-agents", name: "AI Agents", href: "/docs/ai-agents" },
  { slug: "motion-patterns", name: "Motion Guides", href: "/docs/motion-patterns" },
  { slug: "openui", name: "OpenUI", href: "/docs/openui" },
  { slug: "native-setup", name: "React Native Setup", href: "/docs/native-setup" },
  { slug: "mobile", name: "Mobile Screens Showcase", href: "/mobile" },
  { slug: "mobile-catalog", name: "Mobile Screens Catalog", href: MOBILE_SCREENS_PATH },
  { slug: "react-native", name: "React Native primitives", href: "/react-native" },
  { slug: "playground", name: "Playground", href: "/playground" },
  { slug: "changelog", name: "Changelog", href: "/changelog" },
];

/** Site search trigger backed by the library's own command palette. */
export function SiteSearch({
  className,
  iconOnly = false,
  overHero = false,
}: {
  className?: string;
  iconOnly?: boolean;
  overHero?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const items = useMemo<CommandItem[]>(
    () => [
      ...componentSearchEntries.map((entry) => ({
        ...entry,
        icon: CircleDashed,
        badge:
          entry.badge === "new" ? (
            <NewBadge launchedAt={entry.launchedAt} />
          ) : undefined,
        onSelect: () => router.push(entry.href),
      })),
      ...ILLUSTRATION_COLLECTIONS.map((item) => ({
        id: `illustration-${item.slug}`,
        label: item.name,
        group: "Illustrations",
        keywords: [item.slug, item.publicSlug, "illustration", "animated"],
        icon: Sparkles,
        onSelect: () => router.push(`/illustrations/${item.slug}`),
      })),
      ...standaloneTemplates.map((template) => ({
        id: `standalone-template-${template.slug}`,
        label: template.name,
        group: "Templates",
        keywords: [template.slug, "template", "app", "nextjs"],
        icon: Layers,
        onSelect: () => router.push(`/templates/${template.slug}`),
      })),
      ...MOBILE_SCREEN_GROUPS.map((group) => ({
        id: `mobile-screen-${group.slug}`,
        label: group.title,
        group: "Mobile Screens",
        keywords: [
          group.slug,
          group.domain,
          ...group.variants.map((v) => v.name),
          "react native",
          "mobile",
          "expo",
        ],
        icon: Smartphone,
        onSelect: () => router.push(mobileScreenPath(group.slug)),
      })),
      ...nativeNav.map((item) => ({
        id: `native-${item.slug}`,
        label: item.title,
        group: "React Native",
        keywords: [item.slug, "react native", "native", "expo", "mobile"],
        icon: Smartphone,
        onSelect: () => router.push(nativeComponentPath(item.slug)),
      })),
      ...PAGES.map((page) => ({
        id: page.slug,
        label: page.name,
        group: "Pages",
        keywords: [page.slug],
        icon: FileText,
        onSelect: () => router.push(page.href),
      })),
    ],
    [router],
  );

  return (
    <>
      <button
        type="button"
        aria-label="Search components"
        onClick={() => setOpen(true)}
        className={cn(
          iconOnly
            ? "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors"
            : "flex h-9 w-full items-center gap-2 rounded-full border px-3 text-sm transition-colors",
          overHero
            ? "border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15"
            : "border-border bg-transparent text-muted-foreground hover:border-(--color-border-strong) hover:text-foreground",
          className,
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        {!iconOnly ? (
          <>
            <span className="hidden flex-1 text-left sm:block">Search</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block">
              ⌘K
            </kbd>
          </>
        ) : null}
      </button>
      <CommandPalette
        items={items}
        open={open}
        onOpenChange={setOpen}
        placeholder="Search the library..."
      />
    </>
  );
}
