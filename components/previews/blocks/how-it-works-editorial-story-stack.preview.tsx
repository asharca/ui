"use client";

import { EditorialStoryStack } from "@/components/motion/how-it-works";

const steps = [
  {
    "id": "capture",
    "title": "Start with the full picture",
    "description": "Bring customer language, internal context, and the original request together before deciding what to build. Nothing is summarized away too early, so the team can see the evidence behind the brief and return to it when priorities change."
  },
  {
    "id": "shape",
    "title": "Make the next move obvious",
    "description": "Turn the shared context into a focused outcome, clear ownership, and a plan the whole team can follow. Make tradeoffs explicit and leave every owner with a next move they can act on without another meeting."
  },
  {
    "id": "launch",
    "title": "Ship without losing the story",
    "description": "Review the final work against the original intent, publish it, and keep the result visible after launch. Connect the shipped version back to the decision that shaped it and leave a useful record for the next release."
  }
];

export function EditorialStoryStackPreview() {
  return <EditorialStoryStack steps={steps} title="From scattered context to a confident release." description="Three considered steps keep the original signal connected to every decision that follows." />;
}
