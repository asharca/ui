"use client";

import { Database, Grid3X3, HardDrive, Palette, StickyNote } from "lucide-react";
import { ConnectedHub } from "@/components/motion/illustration-connected-hub";

const nodes = [
  { id: "database", label: "Records", description: "Structured records use the shared bus.", icon: <Database /> },
  { id: "design", label: "Design", description: "Design context enters the same workspace.", icon: <Palette /> },
  { id: "notes", label: "Notes", description: "Team notes connect through the workspace.", icon: <StickyNote /> },
  { id: "storage", label: "Storage", description: "Stored objects are routed through the bus.", icon: <HardDrive /> },
];

export function ConnectedHubIllustration2Preview() {
  return <ConnectedHub variant={2} label="Shared workspace hub" hubLabel="Connect apps" hubIcon={<Grid3X3 />} nodes={nodes} />;
}
