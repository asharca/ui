"use client";

import { useState } from "react";
import {
  PublicRoadmapBoard,
  type RoadmapBoardItem,
} from "@/components/motion/roadmap-board";

const INITIAL_ITEMS: RoadmapBoardItem[] = [
  {
    id: "rb-1",
    title: "Multi-region webhook signing rotation",
    description: "Rotate dual active secrets with zero dropped deliveries during cutover.",
    area: "Developers",
    stage: "planned",
    votes: 142,
  },
  {
    id: "rb-2",
    title: "Offline workspace draft sync",
    description: "Queue local edits across flaky airport Wi-Fi and reconcile automatically.",
    area: "Apps",
    stage: "planned",
    votes: 98,
    voted: true,
  },
  {
    id: "rb-3",
    title: "Live cursor comments in diffs",
    description: "Mention reviewers on exact lines inside agent file diff views.",
    area: "Collaboration",
    stage: "in-progress",
    votes: 215,
  },
  {
    id: "rb-4",
    title: "CSV & Parquet warehouse connector",
    description: "Stream typed schema previews directly into dashboard metric cards.",
    area: "Data",
    stage: "in-progress",
    votes: 174,
  },
  {
    id: "rb-5",
    title: "Shared spaces & guest permissions",
    description: "Group related boards for external design partners with scoped read access.",
    area: "Collaboration",
    stage: "shipped",
    votes: 412,
    voted: true,
  },
  {
    id: "rb-6",
    title: "Native Linear & GitHub MCP bridge",
    description: "Discover and invoke project tools inside agent runs with per-tool prompts.",
    area: "Integrations",
    stage: "shipped",
    votes: 329,
  },
];

export function RoadmapBoardPreview() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const toggleVote = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              voted: !item.voted,
              votes: item.voted ? item.votes - 1 : item.votes + 1,
            }
          : item,
      ),
    );
  };

  const suggestFeature = (input: {
    title: string;
    area: string;
    description: string;
  }) => {
    setItems((prev) => [
      {
        id: `rb-${Date.now()}`,
        title: input.title,
        area: input.area,
        description: input.description,
        stage: "planned",
        votes: 1,
        voted: true,
      },
      ...prev,
    ]);
  };

  return (
    <PublicRoadmapBoard
      areas={["Apps", "Collaboration", "Data", "Developers", "Integrations"]}
      items={items}
      onVote={toggleVote}
      onSuggest={suggestFeature}
    />
  );
}
