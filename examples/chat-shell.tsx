'use client';
import { useId, useState } from 'react';
import { ChatShell } from '@/components/asharca/chat-shell';
export default function ChatShellDemo() {
  const inputId = useId();
  const [active, setActive] = useState('设计讨论');
  const [pane, setPane] = useState<'sidebar' | 'chat'>('chat');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Record<string, string[]>>({ '设计讨论': ['从一个组件开始。'], '工作记录': ['这里保存这个会话自己的内容。'] });
  return <ChatShell className="h-[27rem] max-w-4xl" header={active} mobilePane={pane} onMobilePaneChange={setPane}
    sidebar={<nav aria-label="演示会话" className="grid gap-1 p-3">{Object.keys(messages).map((name) => <button key={name} type="button" aria-current={active === name ? 'page' : undefined} className="rounded-lg px-3 py-2.5 text-left text-xs text-muted-foreground hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:text-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setActive(name); setPane('chat'); }}>{name}</button>)}</nav>}>
    <div role="log" aria-label="演示消息" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">{messages[active].map((message, index) => <p key={index} className="rounded-xl bg-muted/40 px-3 py-2 text-xs leading-6">{message}</p>)}</div>
    <form className="m-3 grid gap-2 rounded-xl border border-border p-3" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setMessages((current) => ({ ...current, [active]: [...current[active], draft.trim()] })); setDraft(''); }}>
      <label htmlFor={inputId} className="sr-only">演示输入</label><input id={inputId} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="写一条本地消息…" className="min-w-0 bg-transparent text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      <div className="flex items-center justify-between gap-2"><span className="text-[10px] text-muted-foreground">仅本地演示</span><button type="submit" disabled={!draft.trim()} className="rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring">发送</button></div>
    </form>
  </ChatShell>;
}
