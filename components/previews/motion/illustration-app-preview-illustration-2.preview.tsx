"use client";

import { AssistantPhone } from "@/components/motion/illustration-app-preview";
export function AssistantPhonePreview() {
  return <AssistantPhone suggestions={["Brief", "Tasks"]} demo={{ prompt: "Turn these notes into a focused launch plan.", response: "I organized the brief into three clear moves with owners and review points.", steps: ["Clarify the position", "Draft launch sequence", "Schedule final review"] }} onAsk={async (prompt) => {
    // Explicit local illustration demo, not an AI service.
    await new Promise((resolve) => setTimeout(resolve, 650));
    return `Demo response to “${prompt}”: Start with one small step, protect a quiet hour, and leave room to reflect.`;
  }} />;
}
