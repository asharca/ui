"use client";

import { PressAwards } from "@/components/motion/social-proof-press-awards";

export function SocialProofPressAwardsPreview() {
  return (
    <PressAwards
      awards={[
        {
          id: "gold",
          rank: "GOLD",
          title: "Design Launch of the Month",
          jury: "Fieldnote Awards 2026",
          accent: "amber",
        },
        {
          id: "devtool",
          rank: "#1",
          title: "Developer Tool of the Week",
          jury: "Launch Ledger 2026",
          accent: "teal",
        },
        {
          id: "craft",
          rank: "WINNER",
          title: "Best Interface Craft",
          jury: "Northwind Review 2026",
          accent: "sky",
        },
        {
          id: "system",
          rank: "SHORTLIST",
          title: "Product System of the Year",
          jury: "Signal Guild 2026",
          accent: "orange",
        },
      ]}
      quotes={[
        {
          id: "fieldnote",
          publication: "Fieldnote",
          quote:
            "Every transition behaves like a real physical surface instead of a decorative flourish bolted on after handoff.",
          author: "Clara Lindholm",
          role: "Editor, Fieldnote Review",
        },
        {
          id: "ledger",
          publication: "Launch Ledger",
          quote:
            "Ownership of readable files in your repository beats fighting another black-box component runtime.",
          author: "David Chen",
          role: "Staff Reviewer",
        },
        {
          id: "northwind",
          publication: "Northwind",
          quote:
            "Keyboard support, reduced motion, and layout continuity ship tuned out of the box.",
          author: "Nadia Osei",
          role: "Design Systems Lead",
        },
      ]}
    />
  );
}
