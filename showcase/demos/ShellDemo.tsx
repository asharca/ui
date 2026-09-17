import { useState } from "react";
import { useExternalStoreRuntime, type ThreadMessageLike } from "@assistant-ui/react";
import { Badge, ChatShell, ChatThread, ConversationSidebar, zhCN, type ChatShellMobilePane } from "../../src/index";
export function ShellDemo() {
  const [open, setOpen] = useState(true); const [pane, setPane] = useState<ChatShellMobilePane>("chat"); const [selected, setSelected] = useState("design");
  const [conversations, setConversations] = useState([{ id: "design", title: "设计讨论" }, { id: "release", title: "发布计划" }]);
  const [threads, setThreads] = useState<Record<string, ThreadMessageLike[]>>({ design: [], release: [] });
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({ messages: threads[selected] ?? [], isRunning: false, convertMessage: (message) => message,
    onNew: async (message) => setThreads((previous) => ({ ...previous, [selected]: [...(previous[selected] ?? []), { id: crypto.randomUUID(), role: "user", content: message.content }, { id: crypto.randomUUID(), role: "assistant", content: [{ type: "text", text: "这是本地回复。切换会话后，每个会话的消息仍独立保留。" }] }] })),
  });
  return <div style={{ height: 560, width: "100%", overflow: "hidden", borderRadius: 8 }}><ChatShell sidebarOpen={open} onSidebarOpenChange={setOpen} mobilePane={pane} onMobilePaneChange={setPane}
    labels={{ showSidebar: "显示会话", hideSidebar: "隐藏会话" }} sidebarLabel="会话列表"
    sidebar={<ConversationSidebar groups={[{ id: "assistant", name: "工作助手", conversations }]} labels={zhCN.conversationSidebar} activeConversationId={selected}
      onSelectConversation={(item) => { setSelected(item.id); setPane("chat"); }}
      onCreateConversation={() => { const id = crypto.randomUUID(); setConversations((items) => [...items, { id, title: "新会话" }]); setSelected(id); setPane("chat"); }}
      onConversationOrderChange={(_, ids) => setConversations((items) => [...items].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)))} />}
    header={<><strong>{conversations.find((item) => item.id === selected)?.title}</strong><Badge>本地演示</Badge></>}>
      <ChatThread key={selected} runtime={runtime} assistantName="工作助手" labels={zhCN.chatThread} allowRegenerate={false} />
  </ChatShell></div>;
}
