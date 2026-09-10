import { useState } from "react";
import * as UI from "../../src/index";
import { ChatThreadDemo } from "./ChatThreadDemo";

export function ShellDemo() {
  const [open, setOpen] = useState(true);
  const [pane, setPane] = useState<UI.ChatShellMobilePane>("chat");
  const [selected, setSelected] = useState("design");
  const [conversations, setConversations] = useState([
    { id: "design", title: "设计讨论" },
    { id: "release", title: "发布计划" },
  ]);
  const title = conversations.find((item) => item.id === selected)?.title;
  return (
    <div style={{ height: 360, width: "100%", overflow: "hidden", borderRadius: 8 }}>
      <UI.ChatShell
        sidebarOpen={open}
        onSidebarOpenChange={setOpen}
        mobilePane={pane}
        onMobilePaneChange={setPane}
        labels={{ showSidebar: "显示会话", hideSidebar: "隐藏会话" }}
        sidebarLabel="会话列表"
        sidebar={
          <div style={{ height: "100%", padding: 8, background: "hsl(var(--muted) / 0.5)" }}>
            <UI.ConversationSidebar
              groups={[{ id: "assistant", name: "工作助手", conversations }]}
              activeConversationId={selected}
              onSelectConversation={(item) => { setSelected(item.id); setPane("chat"); }}
              onConversationOrderChange={(_, ids) => setConversations((items) => [...items].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)))}
              labels={{ groups: "会话", searchPlaceholder: "搜索会话", noResults: "没有匹配的会话" }}
            />
          </div>
        }
        header={<><strong style={{ fontSize: 13 }}>{title}</strong><UI.Badge tone="success">在线</UI.Badge></>}
      >
        <ChatThreadDemo compact />
      </UI.ChatShell>
    </div>
  );
}
