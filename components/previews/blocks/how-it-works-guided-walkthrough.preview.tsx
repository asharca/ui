"use client";

import { GuidedWalkthrough } from "@/components/motion/how-it-works";

const steps = [
  {
    "id": "capture",
    "title": "Gather the real request",
    "description": "Capture the language, examples, and context behind what people are asking for."
  },
  {
    "id": "shape",
    "title": "Shape one shared direction",
    "description": "Turn the raw signal into a brief with an outcome, an owner, and a clear next move."
  },
  {
    "id": "launch",
    "title": "Publish the finished work",
    "description": "Review the details against the brief, move it live, and share the result with the team."
  }
];

export function GuidedWalkthroughPreview() {
  return <GuidedWalkthrough steps={steps} title="See the work take shape, one decision at a time." description="Follow the complete path without hiding the context between steps." autoPlay />;
}
