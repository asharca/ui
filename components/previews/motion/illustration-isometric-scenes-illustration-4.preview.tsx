"use client";

import { IsometricScenes } from "@/components/motion/illustration-isometric-scenes";

const nodes = [
  {
    "id": "entry",
    "label": "Entry",
    "detail": "Input enters the runtime."
  },
  {
    "id": "api",
    "label": "API",
    "detail": "API boundary."
  },
  {
    "id": "layers",
    "label": "Layers",
    "detail": "Layered runtime."
  },
  {
    "id": "app",
    "label": "App",
    "detail": "Application surface."
  }
];

export function IsometricScenesIllustration4Preview() {
  return <IsometricScenes variant={4} label="Application runtime" nodes={nodes} />;
}
