"use client";

import { TestimonialSpotlight } from "@/components/motion/testimonials";
const items = [
  {
    "id": "quote-0",
    "quote": "We made space for the work that matters. Decisions stay close to their context, handoffs are clearer, and the team can spend more of the day making thoughtful things.",
    "name": "Ari Lane",
    "role": "Studio lead",
    "company": "Northline",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=320&q=80",
    "href": "#reading-quote-0",
    "outcome": "Six hours returned to the team",
    "reference": "026-001",
    "note": "Collected during a preview field interview. Fictional demonstration account."
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
    "note": "Collected during a preview field interview. Fictional demonstration account."
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
    "note": "Collected during a preview field interview. Fictional demonstration account."
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
    "note": "Collected during a preview field interview. Fictional demonstration account."
  }
];

/** Self-contained, original fictional demonstration; replace records with host content. */
export function TestimonialSpotlightPreview() {
  return <div className="w-full"><TestimonialSpotlight items={items} autoPlay interval={6000} /><div className="mt-8 border-t border-border pt-5"><p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Preview reading room</p>{items.map((item) => <details key={item.id} id={`reading-${item.id}`} className="border-b border-border py-3"><summary className="cursor-pointer text-sm font-medium">{item.name}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.quote} This fictional account demonstrates how the component links to host-owned editorial content. In a live site, supply the published article or customer story URL.</p></details>)}</div></div>;
}
