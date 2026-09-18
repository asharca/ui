import { useState } from "react";
import { Button, ConversationSidebar, Input, zhCN, type ConversationSidebarGroup } from "../../src/index";
export function ConversationDemo() {
  const [groups, setGroups] = useState<ConversationSidebarGroup[]>([{ id: "work", name: "工作助手", conversations: [{ id: "design", title: "设计讨论" }, { id: "release", title: "发布计划", meta: "3 条消息" }, { id: "locked", title: "只读会话", disabled: true }] }, { id: "research", name: "研究助手", conversations: [] }]);
  const [selected, setSelected] = useState("design"); const [rename, setRename] = useState<{ id: string; title: string } | null>(null);
  return <div style={{ display: "grid", gap: 12, height: 460, width: "100%", maxWidth: 380 }}><ConversationSidebar groups={groups} labels={zhCN.conversationSidebar} activeConversationId={selected} onSelectConversation={(item) => setSelected(item.id)}
    onCreateGroup={() => setGroups((items) => [...items, { id: crypto.randomUUID(), name: `助手 ${items.length + 1}`, conversations: [] }])}
    onCreateConversation={(group) => { const id = crypto.randomUUID(); setGroups((items) => items.map((item) => item.id === group.id ? { ...item, conversations: [...item.conversations, { id, title: "新会话" }] } : item)); setSelected(id); }}
    onRenameConversation={(item) => setRename({ id: item.id, title: item.title ?? "" })}
    onDeleteConversation={(item) => { setGroups((items) => items.map((group) => ({ ...group, conversations: group.conversations.filter((conversation) => conversation.id !== item.id) }))); if (selected === item.id) setSelected(""); }}
    onConversationOrderChange={(groupId, ids) => setGroups((items) => items.map((group) => group.id === groupId ? { ...group, conversations: [...group.conversations].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)) } : group))} />
    {rename && <form onSubmit={(event) => { event.preventDefault(); setGroups((items) => items.map((group) => ({ ...group, conversations: group.conversations.map((item) => item.id === rename.id ? { ...item, title: rename.title.trim() || "新会话" } : item) }))); setRename(null); }} style={{ display: "flex", gap: 8 }}><Input aria-label="新的会话名称" value={rename.title} onChange={(event) => setRename({ ...rename, title: event.target.value })} autoFocus /><Button type="submit">保存</Button><Button onClick={() => setRename(null)}>取消</Button></form>}
  </div>;
}
