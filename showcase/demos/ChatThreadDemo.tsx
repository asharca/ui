import { useState } from "react";
import { useExternalStoreRuntime, type ThreadMessageLike } from "@assistant-ui/react";
import { ChatThread } from "../../src/index";

export function ChatThreadDemo({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ThreadMessageLike[]>([]);
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    isRunning: false,
    convertMessage: (message) => message,
    onNew: async (message) => {
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "user", content: message.content },
        { id: crypto.randomUUID(), role: "assistant", content: [{ type: "text", text: "消息已收到。这是本地演示回复，未调用模型服务。" }] },
      ]);
    },
  });
  return <div style={{ height: compact ? "100%" : 480, width: "100%" }}>
    <ChatThread runtime={runtime} assistantName="工作助手" />
  </div>;
}
