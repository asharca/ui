"use client";

import { PinnedProductStory, type ProductTourStep } from "@/components/motion/marketing-product-tour";

const steps: ProductTourStep[] = [
  { id: "capture", title: "Capture the signal", stage: "inbox", description: "Bring requests into a shared inbox, with the conversation and useful context already attached." },
  { id: "plan", title: "Find a clear next step", stage: "planning", description: "Turn the same requests into a considered plan. Give the work an owner and a place to move forward." },
  { id: "review", title: "Bring the details together", stage: "review", description: "Review the work with the people who know its context, before it becomes part of a release." },
  { id: "publish", title: "Close the loop", stage: "released", description: "Bring the decisions and the useful changes into a release note your team can return to." },
];
const cards = [
  { id: "search", title: "A faster way to find the work", detail: "Bring the most useful results closer.", owner: "Jamie" },
  { id: "export", title: "A clearer project export", detail: "Keep the structure in a portable format.", owner: "Alex" },
  { id: "appearance", title: "A more considered dark mode", detail: "Give every surface a little more care.", owner: "Kai" },
  { id: "handoff", title: "A kinder handoff", detail: "Carry the decisions into the next step.", owner: "Jamie" },
  { id: "notes", title: "A useful release note", detail: "Share the small changes that matter.", owner: "Alex" },
  { id: "permissions", title: "Permissions that make sense", detail: "Keep the boundaries visible to the team.", owner: "Kai" },
];
export function PinnedStoryPreview() {
  return <PinnedProductStory title="From scattered requests to a shipped release." description="Bring the first signal, the considered plan, and the finished details into one connected story." steps={steps} cards={cards}/>;
}
