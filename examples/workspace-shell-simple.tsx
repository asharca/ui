'use client';

import { useId, useState } from 'react';
import { Menu, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/asharca/button';
import { IconButton } from '@/components/asharca/icon-button';
import { WorkspaceShell } from '@/components/asharca/workspace-shell';
import { WorkspaceSidebar } from '@/components/asharca/workspace-sidebar';

// No tab bar: the surface receives its own top inset. The child owns scrolling.
export default function WorkspaceShellSimpleDemo() {
  const id = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(['这是不带标签栏的组合。标题和输入区保持固定，只有中间的消息区滚动。']);
  return <WorkspaceShell
    data-demo="workspace-shell-simple" className="h-96 w-full max-w-5xl rounded-2xl" scroll="none"
    sidebar={<WorkspaceSidebar variant="inset" title="轻量工作区" groups={[{ id: 'chat', items: [{ id: 'chat', label: '当前会话', icon: <MessageSquare /> }] }]} activeId="chat" collapsed={collapsed} onCollapsedChange={setCollapsed} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />}
    mobileHeader={<><IconButton label="打开会话导航" icon={<Menu />} onClick={() => setMobileOpen(true)} /><span className="text-xs">轻量工作区</span></>}
    header={<div className="px-4 py-4 text-sm font-semibold">当前会话</div>}
    footer={<form className="flex items-end gap-2 p-3" onSubmit={(event) => { event.preventDefault(); const text = draft.trim(); if (text) { setMessages((current) => [...current, text]); setDraft(''); } }}>
      <div className="min-w-0 flex-1"><label htmlFor={`${id}-message`} className="sr-only">演示消息</label><input id={`${id}-message`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入一条本地消息…" className="h-10 w-full min-w-0 rounded-xl bg-muted px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
      <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="添加演示消息"><Send className="size-4" /></Button>
    </form>}
  >
    <div aria-label="演示消息记录" tabIndex={0} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
      {messages.map((message, index) => <p key={index} className="rounded-xl bg-muted/50 p-3 text-xs leading-6">{message}</p>)}
      <p className="text-[10px] leading-5 text-muted-foreground">仅演示本地消息，不连接模型或持久化服务。</p>
    </div>
  </WorkspaceShell>;
}
