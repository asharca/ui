"use client";

import { VideoShowcaseHero } from "@/components/motion/hero-video-showcase";

export function HeroVideoShowcasePreview() {
  return (
    <VideoShowcaseHero
      brandName="Basalt"
      navLinks={[
        { label: "Product", href: "#product" },
        { label: "Pricing", href: "#pricing" },
        { label: "Docs", href: "#docs" },
        { label: "Changelog", href: "#changelog" },
      ]}
      titleLead="Raw data in, answers out."
      titleMuted="Live views your whole team can read."
      primaryCtaLabel="Start for free"
      secondaryCtaLabel="Watch the tour"
      chapters={[
        {
          id: "sources",
          label: "Sources",
          headline: "Connect warehouse tables in one click",
          metricLabel: "Synced rows",
          metricValue: 482910,
          rows: ["Orders database · synced", "Stripe invoices · live", "Product events · healthy"],
        },
        {
          id: "views",
          label: "Views",
          headline: "Turn SQL models into readable boards",
          metricLabel: "Saved team views",
          metricValue: 38,
          rows: ["Weekly revenue slice", "Expansion retention cohort", "Trial activation funnel"],
        },
        {
          id: "team",
          label: "Team",
          headline: "Share annotated snapshots with stakeholders",
          metricLabel: "Active readers",
          metricValue: 124,
          rows: ["Finance review pinned", "Exec digest scheduled", "Inline comments resolved"],
        },
        {
          id: "digest",
          label: "Digest",
          headline: "Morning summary delivered automatically",
          metricLabel: "Weekly deltas tracked",
          metricValue: 16,
          rows: ["Net dollar retention +4.2%", "Enterprise upgrades +11", "Latency p95 142ms"],
        },
      ]}
    />
  );
}
