"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { MobileScreenCard } from "@/components/app/mobile/mobile-screen-card";
import {
  MOBILE_DOMAINS,
  MOBILE_SCREEN_GROUPS,
  type MobileDomainId,
} from "@/lib/mobile-screens";
import { cn } from "@/lib/utils";

export function MobileCatalogBrowser() {
  const [domain, setDomain] = useState<MobileDomainId>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();
    return MOBILE_SCREEN_GROUPS.filter((group) => {
      if (domain !== "all" && group.domain !== domain) return false;
      if (!clean) return true;
      return (
        group.title.toLowerCase().includes(clean) ||
        group.description.toLowerCase().includes(clean) ||
        group.variants.some((v) => v.name.toLowerCase().includes(clean))
      );
    });
  }, [domain, query]);

  const variantTotal = filtered.reduce((sum, g) => sum + g.variants.length, 0);

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter mobile screens by domain"
          className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1"
        >
          {MOBILE_DOMAINS.map((tab) => {
            const active = domain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setDomain(tab.id)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 sm:w-64">
          <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter mobile screens..."
            aria-label="Filter mobile screens"
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <h2 className="font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {domain === "all"
            ? "All mobile screens"
            : MOBILE_DOMAINS.find((d) => d.id === domain)?.label}
        </h2>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {filtered.length} groups · {variantTotal} variants
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((group, index) => (
          <MobileScreenCard key={group.slug} group={group} eager={index < 6} />
        ))}
      </div>
    </div>
  );
}
