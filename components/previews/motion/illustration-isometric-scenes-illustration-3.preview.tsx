"use client";

import { IsometricScenes } from "@/components/motion/illustration-isometric-scenes";

const nodes = [
  {
    "id": "sources",
    "label": "Sources",
    "detail": "Source material."
  },
  {
    "id": "structure",
    "label": "Structure",
    "detail": "Content structure."
  },
  {
    "id": "actions",
    "label": "Actions",
    "detail": "Product actions."
  },
  {
    "id": "layout",
    "label": "Layout",
    "detail": "Interface composition."
  },
  {
    "id": "motion",
    "label": "Motion",
    "detail": "Motion behavior."
  },
  {
    "id": "theme",
    "label": "Theme",
    "detail": "Theme tokens."
  },
  {
    "id": "release",
    "label": "Release",
    "detail": "Release state."
  }
];

export function IsometricScenesIllustration3Preview() {
  return <IsometricScenes variant={3} defaultValue="layout" label="Product capabilities" nodes={nodes} />;
}
