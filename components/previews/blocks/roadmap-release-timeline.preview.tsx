"use client";

import { useState } from "react";
import { ReleaseRoadmap, type RoadmapRelease } from "@/components/motion/release-roadmap";

const shipped = { id: "q3", label: "Shipped", title: "Jul – Sep 2026" };
const now = { id: "q4", label: "Now", title: "Oct – Dec 2026" };
const next = { id: "q1", label: "Next", title: "Jan – Mar 2027" };
const later = { id: "later", label: "Later", title: "Exploring" };
const initial: RoadmapRelease[] = [
  { id: "spaces", title: "Shared spaces", description: "Group projects by team and invite partners into a single space.", statusId: "shipped", phase: "Collaboration", period: shipped, votes: 412, progress: 100 },
  { id: "offline", title: "Offline editing", description: "Keep writing on a flight and sync changes when you reconnect.", statusId: "shipped", phase: "Apps", period: shipped, votes: 286, progress: 100 },
  { id: "calendar", title: "Two-way calendar sync", description: "See due dates next to meetings and move them from either side.", statusId: "building", phase: "Integrations", period: now, votes: 538, progress: 68 },
  { id: "permissions", title: "Field-level permissions", description: "Choose who can view or edit sensitive fields on any record.", statusId: "building", phase: "Security", period: now, votes: 197, progress: 34 },
  { id: "api", title: "Public API v2", description: "Faster endpoints, webhooks for every event, and typed SDKs.", statusId: "planned", phase: "Developers", period: next, votes: 344 },
  { id: "widgets", title: "Home screen widgets", description: "Check today’s work and add quick notes without opening the app.", statusId: "planned", phase: "Apps", period: next, votes: 159 },
  { id: "formula", title: "Formula fields", description: "Calculate totals, dates, and scores from the fields you already track.", statusId: "planned", phase: "Data", period: later, votes: 121 },
];

export function RoadmapReleaseTimelinePreview() {
  const [releases, setReleases] = useState(initial);
  const [rejectVote, setRejectVote] = useState(false);
  return <div className="w-full"><ReleaseRoadmap releases={releases} statuses={[{ id: "shipped", label: "Shipped" }, { id: "building", label: "In progress" }, { id: "planned", label: "Planned" }]} onVote={async (release, voted) => { if (rejectVote) throw new Error("The demo host rejected this vote. Uncheck rejection and retry."); setReleases(current => current.map(item => item.id === release.id ? { ...item,voted,votes: item.votes + (voted ? 1 : -1) } : item)); }}/><details className="px-8 pb-5 text-xs text-muted-foreground"><summary className="cursor-pointer">Local vote adapter</summary><p className="my-2">Example roadmap. Votes modify this preview only; no target dates are inferred from release periods.</p><label><input type="checkbox" checked={rejectVote} onChange={event => setRejectVote(event.target.checked)}/> Reject vote callback to inspect recovery</label></details></div>;
}
