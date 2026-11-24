"use client";

import { PromptLibrary, type SavedPrompt } from "@/components/motion/prompt-library";

const SAMPLE_PROMPTS: SavedPrompt[] = [
  {
    id: "release-notes",
    title: "Release notes from commits",
    template:
      "Turn these commits into release notes for {{audience}}. Group them into new, improved, and fixed. Keep each line under 15 words.",
    category: "Writing",
    uses: 128,
    starred: true,
  },
  {
    id: "review-pr",
    title: "Review a pull request",
    template:
      "Review this {{language}} diff for bugs, missing tests, and unclear names. List issues by severity, then suggest one fix for each.",
    category: "Code",
    uses: 94,
    starred: true,
  },
  {
    id: "calm-reply",
    title: "Calm reply to an upset customer",
    template:
      "Write a reply to {{name}} about {{issue}}. Acknowledge the problem, explain the next step clearly, and keep the tone warm and direct.",
    category: "Support",
    uses: 61,
    starred: false,
  },
  {
    id: "competitor-brief",
    title: "Synthesize competitor changelog",
    template:
      "Compare these updates from {{competitor}} against our roadmap for {{quarter}} and highlight three concrete differentiators.",
    category: "Research",
    uses: 42,
    starred: true,
  },
  {
    id: "sql-explain",
    title: "Explain slow query plan",
    template:
      "Inspect this {{engine}} query plan and propose two index or join changes that avoid full sequential scans.",
    category: "Code",
    uses: 53,
    starred: false,
  },
  {
    id: "changelog-tweet",
    title: "Launch announcement post",
    template:
      "Draft a crisp 40-word announcement introducing {{feature}} with one customer benefit and no marketing buzzwords.",
    category: "Writing",
    uses: 37,
    starred: false,
  },
  {
    id: "interview-synthesis",
    title: "Cluster user interview notes",
    template:
      "Group key pain points across these {{count}} customer interviews into ranked themes with direct supporting quotes.",
    category: "Research",
    uses: 29,
    starred: false,
  },
];

export function PromptLibraryPreview() {
  return <PromptLibrary prompts={SAMPLE_PROMPTS} />;
}
