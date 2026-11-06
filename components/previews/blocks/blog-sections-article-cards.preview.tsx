"use client";

import { BlogArticleCards } from "@/components/motion/blog-sections";
const articles = [
  {
    "id": "article-0",
    "title": "Make room for the unfinished",
    "excerpt": "How small teams keep uncertain ideas visible without losing momentum.",
    "category": "Design",
    "href": "#reading-article-0",
    "publishedAt": "2026-10-21",
    "dateLabel": "October 21, 2026",
    "readingMinutes": 4,
    "author": "Jules Park",
    "image": {
      "src": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "alt": "A quiet light-filled workspace"
    }
  },
  {
    "id": "article-1",
    "title": "The shape of a useful question",
    "excerpt": "A field guide to interviews that change the work, not just the slide deck.",
    "category": "Research",
    "href": "#reading-article-1",
    "publishedAt": "2026-10-20",
    "dateLabel": "October 20, 2026",
    "readingMinutes": 5,
    "author": "Rae Ellis",
    "image": {
      "src": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      "alt": "A sunlit shared studio table"
    }
  },
  {
    "id": "article-2",
    "title": "A calmer release day",
    "excerpt": "Our checklist for shipping meaningful improvements with less ceremony.",
    "category": "Engineering",
    "href": "#reading-article-2",
    "publishedAt": "2026-10-19",
    "dateLabel": "October 19, 2026",
    "readingMinutes": 6,
    "author": "Em Chen",
    "image": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
      "alt": "A reading lamp against a green wall"
    }
  },
  {
    "id": "article-3",
    "title": "Designing for the quiet moments",
    "excerpt": "What happens between tasks deserves as much care as the task itself.",
    "category": "Design",
    "href": "#reading-article-3",
    "publishedAt": "2026-10-18",
    "dateLabel": "October 18, 2026",
    "readingMinutes": 7,
    "author": "Jules Park",
    "image": {
      "src": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "alt": "A minimal light-filled interior"
    }
  },
  {
    "id": "article-4",
    "title": "Research in the open",
    "excerpt": "Bring evidence into everyday decisions instead of storing it in a report.",
    "category": "Research",
    "href": "#reading-article-4",
    "publishedAt": "2026-10-17",
    "dateLabel": "October 17, 2026",
    "readingMinutes": 8,
    "author": "Rae Ellis",
    "image": {
      "src": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "alt": "Sculptural stone interior"
    }
  },
  {
    "id": "article-5",
    "title": "Small systems, long lives",
    "excerpt": "A practical approach to maintaining a focused component library.",
    "category": "Engineering",
    "href": "#reading-article-5",
    "publishedAt": "2026-10-16",
    "dateLabel": "October 16, 2026",
    "readingMinutes": 9,
    "author": "Em Chen"
  }
];

/** Self-contained, original fictional demonstration; replace records with host content. */
export function BlogArticleCardsPreview() {
  return <div className="w-full"><BlogArticleCards articles={articles} pageSize={3} /><div className="mt-8 border-t border-border pt-5"><p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Preview reading room</p>{articles.map((item) => <details key={item.id} id={`reading-${item.id}`} className="border-b border-border py-3"><summary className="cursor-pointer text-sm font-medium">{item.title}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt} This fictional account demonstrates how the component links to host-owned editorial content. In a live site, supply the published article or customer story URL.</p></details>)}</div></div>;
}
