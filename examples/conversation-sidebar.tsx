'use client';
import { useRef, useState } from 'react';
import { ConversationSidebar, type ConversationSidebarGroup } from '@/components/asharca/conversation-sidebar';
const initial: ConversationSidebarGroup[] = [{ id: 'today', label: '今天', conversations: [{ id: 'design', title: '设计一个简约的界面', meta: '刚刚更新' }, { id: 'code', title: '检查组件实现', meta: '10 分钟前' }, { id: 'plan', title: '整理项目计划', meta: '30 分钟前' }] }, { id: 'earlier', label: '更早', conversations: [{ id: 'notes', title: '会议笔记' }] }];
export default function ConversationSidebarDemo() {
  const [groups, setGroups] = useState(initial); const [active, setActive] = useState('design'); const serial = useRef(0);
  return <div className="h-[25rem] w-full max-w-sm overflow-hidden rounded-xl border border-border"><ConversationSidebar groups={groups} activeConversationId={active} onSelect={setActive}
    onNew={() => { const id = `new-${++serial.current}`; setGroups((items) => items.map((group, index) => index ? group : { ...group, conversations: [{ id, title: `新会话 ${serial.current}` }, ...group.conversations] })); setActive(id); }}
    onRename={(id, title) => setGroups((items) => items.map((group) => ({ ...group, conversations: group.conversations.map((item) => item.id === id ? { ...item, title } : item) })))}
    onDelete={(id) => { setGroups((items) => items.map((group) => ({ ...group, conversations: group.conversations.filter((item) => item.id !== id) }))); if (active === id) setActive(''); }}
    onConversationOrderChange={(groupId, ids) => setGroups((items) => items.map((group) => group.id === groupId ? { ...group, conversations: ids.flatMap((id) => group.conversations.filter((item) => item.id === id)) } : group))} />
  </div>;
}
