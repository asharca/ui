"use client";

import { useMemo, useState } from "react";
import { CatalogCard } from "@/components/app/catalog/catalog-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import {
  EXPLORE_DOMAINS,
  type ExploreDomainId,
  type ExploreItem,
} from "@/lib/catalog-taxonomy";

const INITIAL_LIMIT = 24;
const STEP_SIZE = 24;

export function ExploreBrowser({ items }: { items: ExploreItem[] }) {
  const [domain, setDomain] = useState<ExploreDomainId>("all");
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  const filtered = useMemo(() => {
    if (domain === "all") return items;
    return items.filter((item) => item.domains.includes(domain));
  }, [items, domain]);

  const visible = filtered.slice(0, limit);
  const activeDomain =
    EXPLORE_DOMAINS.find((entry) => entry.id === domain) ?? EXPLORE_DOMAINS[0];

  return (
    <div className="mt-8">
      <Tabs
        value={domain}
        onValueChange={(next) => {
          setDomain(next as ExploreDomainId);
          setLimit(INITIAL_LIMIT);
        }}
        variant="pill"
      >
        <TabsList>
          {EXPLORE_DOMAINS.map((entry) => (
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

      <div className="mt-8 flex items-center gap-2">
        <h2 className="font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {domain === "all" ? "Everything" : activeDomain.label}
        </h2>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {filtered.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <CatalogCard
            key={item.id}
            href={item.href}
            title={
              item.familyName === item.variantName
                ? item.familyName
                : `${item.familyName} · ${item.variantName}`
            }
            previewKey={item.previewKey}
            badgeLabel={item.typeLabel}
            badge={item.badge}
            launchedAt={item.launchedAt}
            widePreview={item.widePreview}
          />
        ))}
      </div>

      {visible.length < filtered.length ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((current) => current + STEP_SIZE)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
          >
            Load more ({filtered.length - visible.length} remaining)
          </button>
        </div>
      ) : null}
    </div>
  );
}
