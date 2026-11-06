"use client";

import { IsometricScenes } from "@/components/motion/illustration-isometric-scenes";

const nodes = [
  {
    "id": "btc",
    "label": "Bitcoin",
    "detail": "Illustrative Bitcoin tower, not a balance."
  },
  {
    "id": "eth",
    "label": "Ethereum",
    "detail": "Illustrative Ethereum tower, not a balance."
  },
  {
    "id": "sol",
    "label": "Solana",
    "detail": "Illustrative Solana tower, not a balance."
  }
];

export function IsometricScenesIllustration5Preview() {
  return <IsometricScenes variant={5} label="Crypto towers" nodes={nodes} />;
}
