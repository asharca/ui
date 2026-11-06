"use client";

import { ProgressiveCardDeck } from "@/components/motion/how-it-works";

const steps = [
  {
    "id": "capture",
    "title": "Start with the real context",
    "description": "Bring requests, notes, and examples into one place before deciding what the work should become."
  },
  {
    "id": "shape",
    "title": "Turn the signal into a brief",
    "description": "Clarify the outcome, remove the noise, and give every decision a reason the whole team can see."
  },
  {
    "id": "build",
    "title": "Move through one shared plan",
    "description": "Keep owners, progress, and review in the same flow so handoffs stay clear from start to finish."
  },
  {
    "id": "launch",
    "title": "Ship the version everyone approved",
    "description": "Close the loop with a final check, publish confidently, and leave the next iteration easy to find."
  }
];

export function ProgressiveCardDeckPreview() {
  return <ProgressiveCardDeck steps={steps} title="A clear path from first thought to finished work." description="Move through the process one decision at a time. Use the controls to fold completed steps into the deck." />;
}
