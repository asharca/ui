"use client";

import { StickyScrollFeatures } from "@/components/motion/features-sticky-scroll";

export function FeatureSectionsStickyScrollPreview() {
  return (
    <StickyScrollFeatures
      title="From scattered data to one live board."
      description="Connect the tools you already use, map what matters, and share numbers that stay fresh on their own."
      steps={[
        {
          id: "sources",
          number: "01",
          title: "Connect your sources",
          description:
            "Pick the tools your numbers live in. Each one links in a click and stays in sync.",
          statusText: "Draft",
          highlights: [
            "Stripe subscriptions · 4 metrics",
            "Postgres orders · synced",
            "Linear milestones · connected",
          ],
        },
        {
          id: "map",
          number: "02",
          title: "Map key relationships",
          description:
            "Link customer accounts, plan tiers, and support volume without fragile glue scripts.",
          statusText: "Mapping",
          highlights: [
            "Workspace ID joined across 3 tables",
            "Plan tier normalized to monthly ARR",
            "Churn signal computed daily",
          ],
        },
        {
          id: "sync",
          number: "03",
          title: "Verify live freshness",
          description:
            "Every metric runs against automated checks before landing on your team board.",
          statusText: "Syncing",
          highlights: [
            "Row count check passed",
            "Revenue reconciliation within $0.00",
            "Latency budget 140ms verified",
          ],
        },
        {
          id: "share",
          number: "04",
          title: "Share a live board",
          description:
            "Publish one link for leadership and customers, updated continuously with zero exports.",
          statusText: "Live",
          highlights: [
            "Read-only executive digest enabled",
            "Weekly Slack summary scheduled",
            "Signed embed ready for docs",
          ],
        },
      ]}
    />
  );
}
