"use client";

import { CaseStudySpotlight } from "@/components/motion/case-studies";
const stories = [
  {
    "id": "story-0",
    "customer": "Northline Studio",
    "industry": "Design",
    "title": "More room for the work that matters.",
    "summary": "A six-person design studio replaced status meetings with a shared decision record.",
    "quote": "We spend less time explaining where things are and more time making them better.",
    "person": "Ari Lane",
    "role": "Studio lead",
    "href": "#reading-story-0",
    "image": {
      "src": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      "alt": "A sunlit shared studio table"
    },
    "outcomes": [
      {
        "label": "Hours saved per week",
        "before": 2,
        "after": 8,
        "unit": "h",
        "description": "Weekly team estimate from the sample customer account."
      },
      {
        "label": "On-time milestones",
        "before": 55,
        "after": 89,
        "unit": "%",
        "description": "Share of milestones completed by the planned date."
      }
    ]
  },
  {
    "id": "story-1",
    "customer": "Openfield School",
    "industry": "Education",
    "title": "From scattered notes to shared progress.",
    "summary": "Program teams brought their planning and student feedback into one weekly rhythm.",
    "quote": "The handoff is no longer a moment where context disappears.",
    "person": "Morgan Reed",
    "role": "Program director",
    "href": "#reading-story-1",
    "image": {
      "src": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "alt": "A quiet light-filled workspace"
    },
    "outcomes": [
      {
        "label": "Hours saved per week",
        "before": 3,
        "after": 11,
        "unit": "h",
        "description": "Weekly team estimate from the sample customer account."
      },
      {
        "label": "On-time milestones",
        "before": 59,
        "after": 92,
        "unit": "%",
        "description": "Share of milestones completed by the planned date."
      }
    ]
  },
  {
    "id": "story-2",
    "customer": "Harbor Workshop",
    "industry": "Design",
    "title": "A clearer path from idea to delivery.",
    "summary": "A cooperative workshop made each project milestone visible to every contributor.",
    "quote": "Everyone can see the next step, and why it is the next step.",
    "person": "Sam Vale",
    "role": "Operations lead",
    "href": "#reading-story-2",
    "image": {
      "src": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "alt": "A minimal interior with considered materials"
    },
    "outcomes": [
      {
        "label": "Hours saved per week",
        "before": 4,
        "after": 14,
        "unit": "h",
        "description": "Weekly team estimate from the sample customer account."
      },
      {
        "label": "On-time milestones",
        "before": 63,
        "after": 95,
        "unit": "%",
        "description": "Share of milestones completed by the planned date."
      }
    ]
  },
  {
    "id": "story-3",
    "customer": "Willow Market",
    "industry": "Retail",
    "title": "A neighborhood shop found a steadier weekly rhythm.",
    "summary": "A four-person retail team brought ordering, stock checks and supplier notes into one shared planning view.",
    "quote": "We can prepare for the weekend without spending Friday chasing updates from every corner of the shop.",
    "person": "Nico Bell",
    "role": "Shop owner",
    "href": "#reading-story-3",
    "image": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "A reading lamp against a pale green wall"
    },
    "outcomes": [
      {
        "label": "Planning time per week",
        "before": 7,
        "after": 3,
        "unit": "h",
        "description": "Illustrative weekly planning time in this fictional sample account."
      },
      {
        "label": "Stock checks completed",
        "before": 62,
        "after": 94,
        "unit": "%",
        "description": "Illustrative completion rate for scheduled stock checks."
      }
    ]
  },
  {
    "id": "story-4",
    "customer": "Juniper Kitchen",
    "industry": "Hospitality",
    "title": "A small kitchen made room for a calmer morning service.",
    "summary": "A neighborhood café connected its preparation list and front-of-house handoff so each shift could start with a clear plan.",
    "quote": "The morning team knows what is ready and what needs attention before the first customer arrives.",
    "person": "Taylor Moss",
    "role": "Café manager",
    "href": "#reading-story-4",
    "image": {
      "src": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "alt": "Warm stone surfaces in a quiet interior"
    },
    "outcomes": [
      {
        "label": "Opening preparation time",
        "before": 90,
        "after": 55,
        "unit": "min",
        "description": "Illustrative preparation time in this fictional sample account."
      },
      {
        "label": "Shift handoffs recorded",
        "before": 48,
        "after": 96,
        "unit": "%",
        "description": "Illustrative share of shifts with a completed handoff record."
      }
    ]
  }
];

/** Self-contained, original fictional demonstration; replace records with host content. */
export function CaseStudySpotlightPreview() {
  return <div className="w-full"><CaseStudySpotlight stories={stories} autoPlay interval={6500} /><div className="mt-8 border-t border-border pt-5"><p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Preview reading room</p>{stories.map((item) => <details key={item.id} id={`reading-${item.id}`} className="border-b border-border py-3"><summary className="cursor-pointer text-sm font-medium">{item.title}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary} This fictional account demonstrates how the component links to host-owned editorial content. In a live site, supply the published article or customer story URL.</p></details>)}</div></div>;
}
