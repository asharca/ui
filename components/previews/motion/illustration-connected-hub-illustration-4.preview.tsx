"use client";

import { Bot, Boxes, Brain } from "lucide-react";
import { ConnectedHub } from "@/components/motion/illustration-connected-hub";

const nodes = [
  { id: "workflow", label: "Workflow", description: "A connected workflow receives routed product context.", icon: <Boxes /> },
  { id: "model", label: "Language model", description: "The language-model destination receives routed requests.", icon: <Brain /> },
  { id: "assistant", label: "Assistant", description: "The assistant destination receives routed requests.", icon: <Bot /> },
];

export function ConnectedHubIllustration4Preview() {
  return <ConnectedHub variant={4} label="API and MCP routing" hubLabel="Product" nodes={nodes} />;
}
