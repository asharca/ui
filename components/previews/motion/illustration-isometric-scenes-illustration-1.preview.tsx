"use client";

import { IsometricScenes } from "@/components/motion/illustration-isometric-scenes";

const nodes = [
  {
    "id": "edge",
    "label": "Data lanes",
    "detail": "Example inbound data lane."
  },
  {
    "id": "compute",
    "label": "Compute node",
    "detail": "Example compute node state."
  },
  {
    "id": "storage",
    "label": "Status signals",
    "detail": "Example status indicators."
  }
];

export function IsometricScenesIllustration1Preview() {
  return <IsometricScenes variant={1} label="Compute node" nodes={nodes} />;
}
