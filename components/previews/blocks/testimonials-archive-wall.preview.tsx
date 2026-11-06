"use client";

import { useState } from "react";
import { TestimonialArchiveWall } from "@/components/motion/testimonials";
const items = [
  {
    "id": "quote-0",
    "quote": "We spend less time recovering context and more time doing careful work. Clear decisions made our shared week feel calmer.",
    "name": "Ari Lane",
    "role": "Studio lead",
    "company": "Northline",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-0",
    "outcome": "Six hours returned to the team",
    "reference": "026-001",
    "note": "Fictional demonstration account; not a real customer endorsement."
  },
  {
    "id": "quote-1",
    "quote": "One place to explain a decision means we can stop repeating the same conversation and keep moving together.",
    "name": "Morgan Reed",
    "role": "Program director",
    "company": "Openfield",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-1",
    "outcome": "One shared view of progress",
    "reference": "026-002",
    "note": "Fictional demonstration account; not a real customer endorsement."
  },
  {
    "id": "quote-2",
    "quote": "The system fits around our working day. Each person can see what needs attention without another meeting.",
    "name": "Sam Vale",
    "role": "Operations lead",
    "company": "Harbor",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-2",
    "outcome": "Fewer meetings. Better decisions.",
    "reference": "026-003",
    "note": "Fictional demonstration account; not a real customer endorsement."
  },
  {
    "id": "quote-3",
    "quote": "Small improvements compound when the whole team can see them, understand the reason, and contribute the next step.",
    "name": "Dee Winter",
    "role": "Studio lead",
    "company": "Northline",
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-3",
    "outcome": "Six hours returned to the team",
    "reference": "026-004",
    "note": "Fictional demonstration account; not a real customer endorsement."
  },
  {
    "id": "quote-4",
    "quote": "I can return to a project after a week and understand what changed, which questions are open, and where I can help.",
    "name": "Jules Park",
    "role": "Program director",
    "company": "Openfield",
    "avatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-4",
    "outcome": "One shared view of progress",
    "reference": "026-005",
    "note": "Fictional demonstration account; not a real customer endorsement."
  },
  {
    "id": "quote-5",
    "quote": "Clear defaults made it easier to bring new people into the work without losing the care that shaped it.",
    "name": "Rae Ellis",
    "role": "Operations lead",
    "company": "Harbor",
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-5",
    "outcome": "Fewer meetings. Better decisions.",
    "reference": "026-006",
    "note": "Fictional demonstration account; not a real customer endorsement."
  }
];

/** Self-contained, original fictional demonstration; replace records with host content. */
export function TestimonialArchiveWallPreview() {
  const [account, setAccount] = useState("");
  return <div className="w-full"><TestimonialArchiveWall items={items} joinHref="#share-your-account" /><div className="mt-8 border-t border-border pt-5"><p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Preview reading room</p>{items.map((item) => <details key={item.id} id={`reading-${item.id}`} className="border-b border-border py-3"><summary className="cursor-pointer text-sm font-medium">{item.name}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.quote} This fictional account demonstrates how the component links to host-owned editorial content. In a live site, supply the published article or customer story URL.</p></details>)}</div><form id="share-your-account" className="mt-5 rounded-xl border border-border p-5" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setAccount(String(data.get("account"))); }}><label className="block text-sm">Your local preview account<textarea name="account" required className="mt-2 block min-h-24 w-full rounded-lg border border-border bg-background p-3" /></label><button type="submit" className="mt-3 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Save preview account</button>{account && <p role="status" className="mt-3 text-sm">Saved in this preview: {account}</p>}</form></div>;
}
