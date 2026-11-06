"use client";

import { ChatExchange } from "@/components/motion/illustration-chat-exchange";
export function ChatExchangePreview() {
  return <ChatExchange initialPrompt="Turn this launch brief into a clear plan." demo={{ response: "I turned the brief into a launch plan with clear owners and a review timeline.", steps: ["Outline approved", "Owners assigned", "Timeline drafted"], artifacts: ["Brief", "Tasks", "Timeline"] }} onSend={async (prompt) => {
    // Explicit sample dialogue; no AI request is made.
    await new Promise((resolve) => setTimeout(resolve, 650));
    return `Sample conversation about “${prompt}”: Choose three priorities. Give each one a little uninterrupted time. Keep the rest flexible.`;
  }} />;
}
