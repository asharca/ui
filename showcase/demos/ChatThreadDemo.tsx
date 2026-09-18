import { useEffect, useRef, useState } from "react";
import { useExternalStoreRuntime, type ThreadMessageLike } from "@assistant-ui/react";
import { Brain, Globe2 } from "lucide-react";
import { Button, ChatComposerToolbar, ChatThread, zhCN } from "../../src/index";
export function ChatThreadDemo({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ThreadMessageLike[]>([]); const [running, setRunning] = useState(false); const [web, setWeb] = useState(false); const [pinned, setPinned] = useState(["web"]);
  const generation = useRef(0);
  useEffect(() => () => { generation.current += 1; }, []);
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages, isRunning: running, convertMessage: (message) => message,
    onNew: async (message) => {
      const current = ++generation.current; const replyId = crypto.randomUUID();
      setRunning(true);
      setMessages((previous) => [...previous, { id: crypto.randomUUID(), role: "user", content: message.content }, { id: replyId, role: "assistant", content: [{ type: "text", text: "" }], status: { type: "running" } }]);
      const response = "这是 **ToolPlane 风格的本地流式演示**。\n\n消息正在逐步输出，你可以随时点击停止。\n\n```ts\nconst ready = true;\n```\n\n传输、持久化和工具权限仍由你的应用管理。";
      for (let length = 4; length < response.length + 4; length += 4) {
        await new Promise((resolve) => setTimeout(resolve, 35));
        if (current !== generation.current) return;
        const done = length >= response.length;
        setMessages((previous) => previous.map((item) => item.id === replyId ? { ...item, content: [{ type: "text", text: response.slice(0, length) }], status: done ? { type: "complete", reason: "stop" } : { type: "running" } } : item));
      }
      if (current === generation.current) setRunning(false);
    },
    onCancel: async () => { generation.current += 1; setRunning(false); setMessages((previous) => previous.map((item) => item.role === "assistant" && item.status?.type === "running" ? { ...item, status: { type: "incomplete", reason: "cancelled" } } : item)); },
  });
  function scenario(kind: "empty" | "markdown" | "tools") {
    generation.current += 1; setRunning(false);
    if (kind === "empty") { setMessages([]); return; }
    setMessages([{ id: "scenario", role: "assistant", content: kind === "tools" ? [
      { type: "reasoning", text: "先检索项目资料，再整理相关结果。" },
      { type: "tool-call", toolCallId: "search-demo", toolName: "mcp__workspace__search", args: { query: "设计系统" }, result: { matches: ["组件文档", "发布计划"] } },
      { type: "text", text: "已找到两份相关资料。展开处理过程可以查看工具卡片。" },
    ] : [{ type: "text", text: "## 发布清单\n\n- 检查无障碍标签\n- 验证工具审批\n\n| 组件 | 状态 |\n| --- | --- |\n| Button | 完成 |\n| ChatThread | 验证中 |\n\n```tsx\n<Button variant=\"primary\">开始</Button>\n```" }] }]);
  }
  return <div style={{ display: "flex", flexDirection: "column", gap: 12, height: compact ? "100%" : 600, width: "100%", minHeight: 0 }}>
    {!compact && <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}><Button size="sm" onClick={() => scenario("empty")}>空会话</Button><Button size="sm" onClick={() => scenario("markdown")}>Markdown</Button><Button size="sm" onClick={() => scenario("tools")}>工具过程</Button></div>}
    <ChatThread runtime={runtime} assistantName="ToolPlane 助手" labels={zhCN.chatThread} allowRegenerate={false} showAttachmentPicker={false}
      composerStatus="本地模拟 · 无需密钥" getToolPresentation={(name) => name === "mcp__workspace__search" ? { label: "搜索工作区", kind: "mcp" } : undefined}
      composerTools={<ChatComposerToolbar labels={zhCN.composerToolbar} pinnedIds={pinned} onPinnedIdsChange={setPinned} tools={[
        { id: "web", label: "联网搜索", icon: <Globe2 />, pressed: web, group: "工具", onSelect: () => setWeb(!web) },
        { id: "skill", label: "插入检查提示", icon: <Brain />, group: "技能", onSelect: () => runtime.thread.composer.setText("请帮我检查组件的交互和可访问性。") },
      ]} />} />
  </div>;
}
