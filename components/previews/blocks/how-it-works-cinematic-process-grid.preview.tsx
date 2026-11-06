"use client";

import { CinematicProcessGrid } from "@/components/motion/how-it-works";

const steps = [
  {
    "id": "capture",
    "title": "Bring the signal into focus",
    "description": "Collect customer notes, requests, and loose ideas in one brief that keeps the original context intact."
  },
  {
    "id": "shape",
    "title": "Turn context into a clear plan",
    "description": "Organize the brief into decisions, owners, and the next work that will move the outcome forward."
  },
  {
    "id": "launch",
    "title": "Move the right version live",
    "description": "Review the final details, publish with confidence, and keep the result visible to everyone involved."
  }
];

export function CinematicProcessGridPreview() {
  return <CinematicProcessGrid steps={steps} title="One clear path from raw input to release." description="Capture what matters, shape it into an aligned plan, and move it live without losing the thinking that got you there." />;
}
