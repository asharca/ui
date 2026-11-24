"use client";

import { useEffect, useMemo, useState } from "react";
import { CatalogCard } from "@/components/app/catalog/catalog-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import type { CatalogItem, CatalogSectionId } from "@/lib/catalog-taxonomy";
import { isComponentNew } from "@/lib/component-status";

export type CatalogTabId =
  | "all"
  | "new"
  | Exclude<CatalogSectionId, "mobile">;

const TABS: readonly { id: CatalogTabId; label: string; heading: string }[] = [
  { id: "all", label: "All", heading: "All components" },
  { id: "new", label: "New", heading: "Recently launched" },
  { id: "components", label: "Components", heading: "Components" },
  { id: "agents", label: "Agents", heading: "AI Agents" },
  { id: "blocks", label: "Blocks", heading: "Blocks" },
  { id: "pages", label: "Pages", heading: "Pages" },
  { id: "charts", label: "Charts", heading: "Charts" },
  { id: "templates", label: "Templates", heading: "Templates" },
];

const INITIAL_LIMIT = 36;
const STEP_SIZE = 36;

export function CatalogBrowser({
  items,
  initialTab = "all",
}: {
  items: CatalogItem[];
  initialTab?: CatalogTabId;
}) {
  const [tab, setTab] = useState<CatalogTabId>(initialTab);
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("tab");
    if (param && TABS.some((entry) => entry.id === param)) {
      setTab(param as CatalogTabId);
    }
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    if (tab === "all") return items;
    if (tab === "new") {
      return items.filter((item) => isComponentNew(item, now));
    }
    return items.filter((item) => item.section === tab);
  }, [items, tab]);

  const visible = filtered.slice(0, limit);
  const activeMeta = TABS.find((entry) => entry.id === tab) ?? TABS[0];

  const handleTabChange = (next: string) => {
    const nextTab = next as CatalogTabId;
    setTab(nextTab);
    setLimit(INITIAL_LIMIT);
    const url = new URL(window.location.href);
    if (nextTab === "all") url.searchParams.delete("tab");
    else url.searchParams.set("tab", nextTab);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="mt-6">
      <Tabs value={tab} onValueChange={handleTabChange} variant="pill">
        <TabsList>
          {TABS.map((entry) => (
            <TabsTrigger
              key={entry.id}
              value={entry.id}
              indicatorClassName="bg-background"
              className="aria-[selected=true]:text-foreground [&_[data-tabs-label]]:text-foreground"
            >
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section className="mt-8">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {activeMeta.heading}
          </h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {filtered.length}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <CatalogCard
              key={`${item.section}-${item.slug}`}
              href={item.href}
              title={item.name}
              previewKey={item.previewKey}
              badgeLabel={
                item.variantCount === 1
                  ? "1 variant"
                  : `${item.variantCount} variants`
              }
              badge={item.badge}
              launchedAt={item.launchedAt}
              widePreview={item.widePreview}
            />
          ))}
        </div>

        {visible.length < filtered.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((current) => current + STEP_SIZE)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
            >
              Show more ({filtered.length - visible.length} remaining)
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
