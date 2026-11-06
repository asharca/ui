"use client";

import { useState } from "react";
import { GenerationScene } from "@/components/motion/illustration-chat-exchange";
export function GenerationScenePreview() {
  const [selection, setSelection] = useState("");
  return <div className="w-full max-w-xl"><GenerationScene onGenerate={async (brief) => {
    // Explicit original sample concepts, not generated media.
    await new Promise((resolve) => setTimeout(resolve, 650));
    return [
      { id: "dawn", title: "Dawn", description: `An open, spacious direction for “${brief}”.`, artwork: <span className="size-12 rounded-full bg-primary/30" /> },
      { id: "fold", title: "Fold", description: "Layered notes with a little more structure.", artwork: <span className="size-12 rotate-12 rounded-lg border-2 border-primary" /> },
    ];
  }} onSelect={(concept) => setSelection(concept.title)} /><p aria-live="polite" className="sr-only">{selection ? `${selection} selected` : "Choose an illustrated prompt to create sample directions."}</p></div>;
}
