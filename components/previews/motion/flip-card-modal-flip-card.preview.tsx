"use client";

import { useState } from "react";
import { ModalFlipCard } from "@/components/motion/flip-cards";

export function ModalFlipCardPreview() {
  const [saved, setSaved] = useState(false);
  return <div className="mx-auto w-full max-w-[18rem] px-3 py-12"><ModalFlipCard title="The light room" card={<div className="relative aspect-[4/5]"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85" alt="A quiet room filled with natural light" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/35 p-5 text-white backdrop-blur-xl"><p className="text-xs text-white/65">Private collection</p><h3 className="mt-2 text-xl font-medium">The light room</h3><p className="mt-2 text-xs text-white/65">Click to open the story</p></div></div>}>
    <div className="space-y-5"><p className="text-muted-foreground">A quiet room shaped by natural light, warm materials, and the space between objects.</p><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85" alt="The light room interior" className="aspect-video w-full rounded-2xl object-cover" /><p>A small shift in perspective can reveal a simpler path. This card rotates as the same surface expands into a focused reading space.</p><button type="button" aria-pressed={saved} onClick={() => setSaved(value => !value)} className="rounded-full bg-foreground px-5 py-2 text-sm text-background">{saved ? "Saved to reading list" : "Save to reading list"}</button><p role="status" className="sr-only">{saved ? "This note is saved for this preview session." : "Not saved yet."}</p></div>
  </ModalFlipCard></div>;
}
