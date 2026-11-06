"use client";

import { useState } from "react";
import { SearchResultsPage, type ProductSearchItem } from "@/components/motion/search-pages";

const items: ProductSearchItem[] = [
  { id: "receive", title: "Receive events with webhooks", excerpt: "Fieldwork sends a signed HTTP request to your endpoint whenever something changes, so your app can react without polling.", type: "Docs", area: "Platform", href: "/docs", updatedAt: "Oct 2" },
  { id: "verify", title: "Verify webhook signatures", excerpt: "Read the raw request body and pass it to the SDK with the signature header. Requests older than five minutes are rejected.", type: "Docs", area: "Security", href: "/docs", updatedAt: "Sep 28" },
  { id: "retries", title: "Retries and backoff", excerpt: "Failed webhook deliveries retry with exponential backoff for up to three days before the endpoint is paused.", type: "Docs", area: "Platform", href: "/docs", updatedAt: "Sep 20" },
  { id: "slack", title: "Send webhook alerts to Slack", excerpt: "Forward published notes to a Slack channel in about ten minutes, with a small function and one webhook endpoint.", type: "Guides", area: "Integrations", href: "/guides", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&fm=webp&q=80&w=240&h=240" },
  { id: "test", title: "Test webhooks on your laptop", excerpt: "Use the CLI to forward live events to localhost, replay deliveries, and inspect every request while you build.", type: "Guides", area: "Integrations", href: "/guides", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&fm=webp&q=80&w=240&h=240" },
  { id: "replay", title: "Replay any webhook delivery", excerpt: "Resend a past event to the same or a different endpoint from the delivery log, with the original signature refreshed.", type: "Changelog", area: "Platform", href: "/changelog", updatedAt: "Oct 6" },
  { id: "ips", title: "Static IPs for webhook delivery", excerpt: "Allowlist a fixed set of addresses for outgoing webhooks on Scale plans, available in every region.", type: "Changelog", area: "Security", href: "/changelog", updatedAt: "Sep 18" },
  { id: "queue", title: "Queueing webhooks before processing them", excerpt: "We acknowledge right away and push each event to a queue, which keeps us well inside the ten-second window.", type: "Community", area: "Platform", href: "/docs", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&fm=webp&q=80&w=96&h=96" },
  { id: "duplicates", title: "Handling duplicate webhook events", excerpt: "Store the event ID with a unique constraint and skip anything you have already seen. Retries become harmless.", type: "Community", area: "Billing", href: "/docs", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&fm=webp&q=80&w=96&h=96" },
];

export function SearchResultsPreview() {
  const [mode, setMode] = useState("ready");
  return <div className="w-full"><details className="px-4 text-xs text-muted-foreground"><summary className="cursor-pointer py-2">Demo controls</summary><p>Illustrative knowledge index. Results open this site’s real documentation, guides, and changelog.</p><label>Preview data state <select className="ml-2 rounded-md border border-border bg-background p-2" value={mode} onChange={(event) => setMode(event.target.value)}><option value="ready">Ready</option><option value="loading">Loading</option><option value="error">Error</option></select></label></details><SearchResultsPage title="Search" items={items} defaultValue={{ query: "webhook" }} pageSize={9} loading={mode === "loading"} error={mode === "error" ? "Demo: the search index couldn't be loaded." : undefined} onRetry={() => setMode("ready")} suggestions={["webhook", "signature", "Slack"]} /></div>;
}
