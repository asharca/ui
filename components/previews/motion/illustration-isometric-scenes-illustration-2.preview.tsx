"use client";

import { IsometricScenes } from "@/components/motion/illustration-isometric-scenes";

const nodes = [
  {
    "id": "receive",
    "label": "Received",
    "detail": "Example event received."
  },
  {
    "id": "process",
    "label": "Processing",
    "detail": "Example event being processed."
  },
  {
    "id": "persist",
    "label": "Persisted",
    "detail": "Example event persisted."
  },
  {
    "id": "complete",
    "label": "Complete",
    "detail": "Example event completed."
  }
];

export function IsometricScenesIllustration2Preview() {
  return <IsometricScenes variant={2} label="Event queue" nodes={nodes} />;
}
