"use client";

import { SignalGrid, type MarketingFeature } from "@/components/motion/marketing-feature-sections";

const features: MarketingFeature[] = [
  { id: "orchestration", title: "Connected orchestration", description: "Bring the right steps together, with a clear view of the work moving between them.", visual: null },
  { id: "context", title: "Context-aware execution", description: "Keep decisions grounded in the request, the sources, and the people behind each next step.", visual: null },
  { id: "guardrails", title: "Built-in guardrails", description: "Make the boundaries visible. Keep consequential decisions with the people who own them.", visual: null },
  { id: "memory", title: "Persistent memory", description: "Carry useful knowledge forward, instead of asking your team to start every conversation again.", visual: null },
  { id: "handoff", title: "Human handoff", description: "Bring in the right person with the conversation and its context already close at hand.", visual: null },
  { id: "visibility", title: "End-to-end visibility", description: "See what happened, understand why it happened, and find a useful place to go next.", visual: null },
];

export function SignalGridPreview() {
  return <SignalGrid title={"Scattered context.\nOne clear next step."} description={"Bring knowledge, decisions, and execution into the same operating layer. Every signal stays visible from input to outcome."} features={features} />;
}
