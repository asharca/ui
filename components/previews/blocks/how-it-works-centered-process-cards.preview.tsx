"use client";

import { CenteredProcessCards } from "@/components/motion/how-it-works";

const steps = [
  {
    "id": "capture",
    "label": "Understand",
    "title": "Listen before shaping the answer",
    "description": "Collect the request, its context, and the examples that reveal what a useful outcome should actually feel like."
  },
  {
    "id": "shape",
    "label": "Align",
    "title": "Make one direction easy to follow",
    "description": "Turn the signal into a focused brief with clear decisions, an owner, and the next move everyone can see."
  },
  {
    "id": "launch",
    "label": "Deliver",
    "title": "Close the loop with confidence",
    "description": "Review the finished work against the original intent, publish it, and keep the result visible after launch."
  }
];

export function CenteredProcessCardsPreview() {
  return <CenteredProcessCards steps={steps} title="Three steps. One clear outcome." description="A considered process keeps the original context connected to every decision, from the first request to the finished release." action={{ label: "Explore the process", href: "#capture" }} />;
}
