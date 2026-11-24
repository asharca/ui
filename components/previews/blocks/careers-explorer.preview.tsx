"use client";

import { CareersJobsExplorer } from "@/components/motion/careers-explorer";

export function CareersExplorerPreview() {
  return (
    <CareersJobsExplorer
      roles={[
        {
          id: "motion-eng",
          title: "Senior Motion Engineer",
          department: "Engineering",
          region: "Global",
          location: "Remote, global",
          employment: "Full-time",
          compensation: "$170k to $210k",
          summary:
            "Shape spring curves, layout transitions, and zero-jank UI primitives used across web applications.",
          highlights: [
            "Own motion tokens and cross-browser 60fps interaction craft",
            "Author self-contained React components with accessible keyboard navigation",
            "Mentor contributors on layout animations and reduced-motion design",
          ],
        },
        {
          id: "frontend-eng",
          title: "Frontend Systems Engineer",
          department: "Engineering",
          region: "Americas",
          location: "Remote, Americas",
          employment: "Full-time",
          compensation: "$160k to $195k",
          summary:
            "Architect registry tooling, TypeScript CLI workflows, and docs visualizers.",
          highlights: [
            "Maintain static registry packaging and tree-shaking checks",
            "Build sandboxed live code previews and inspector controls",
          ],
        },
        {
          id: "design-eng",
          title: "Staff Design Engineer",
          department: "Design",
          region: "Europe",
          location: "Remote, Europe",
          employment: "Full-time",
          compensation: "$165k to $200k",
          summary:
            "Design and build flagship page sections, data visualizations, and interactive brand storytelling.",
          highlights: [
            "Lead new component releases from exploration to final source",
            "Establish crisp dark and light mode surface hierarchy",
          ],
        },
        {
          id: "product-mgr",
          title: "Product Lead, Developer Tools",
          department: "Product",
          region: "Americas",
          location: "New York or remote",
          employment: "Full-time",
          compensation: "$175k to $205k",
          summary:
            "Partner closely with engineering and design teams to prioritize high-impact blocks and templates.",
          highlights: [
            "Synthesize customer interviews and GitHub feedback into weekly shipped work",
            "Drive MCP and AI agent discovery ergonomics",
          ],
        },
        {
          id: "growth-lead",
          title: "Developer Ecosystem Lead",
          department: "Growth",
          region: "Europe",
          location: "London or remote",
          employment: "Full-time",
          compensation: "$145k to $175k",
          summary:
            "Tell authentic technical stories through interactive demos, guides, and community launches.",
          highlights: [
            "Publish deep technical breakdowns of motion architecture",
            "Support teams migrating design systems into open source registries",
          ],
        },
      ]}
    />
  );
}
