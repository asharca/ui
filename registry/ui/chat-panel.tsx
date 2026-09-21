'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Message } from './message';
import { PromptInput, type PromptInputProps } from './prompt-input';
import { cn } from './utils';

export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: ReactNode; copyText?: string }
export interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: PromptInputProps['onSubmit'];
  busy?: boolean;
  onStop?: () => void;
  title?: string;
  footer?: ReactNode;
  className?: string;
}
export function ChatPanel({ messages, onSend, busy = false, onStop, title = '对话', footer, className }: ChatPanelProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (element && following.current) element.scrollTop = element.scrollHeight;
  }, [messages, busy]);
  useEffect(() => {
    if (!content.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const element = viewport.current;
      if (element && following.current) element.scrollTop = element.scrollHeight;
    });
    observer.observe(content.current);
    return () => observer.disconnect();
  }, []);
  return <section aria-label={title} className={cn('flex h-[34rem] min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-background', className)}>
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5"><h3 className="text-sm font-medium">{title}</h3><span className="text-xs text-muted-foreground">{busy ? '正在回复…' : '准备就绪'}</span></header>
    <div ref={viewport} role="log" aria-label="对话消息" aria-live="polite" aria-busy={busy} tabIndex={0}
      onScroll={(event) => { const element = event.currentTarget; following.current = element.scrollHeight - element.scrollTop - element.clientHeight < 64; }}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
      <div ref={content} className="grid gap-6">
        {messages.length ? messages.map((message) => <Message key={message.id} role={message.role} copyText={message.copyText}>{message.content}</Message>) : <p className="py-16 text-center text-sm text-muted-foreground">从一个问题开始。</p>}
        {busy && <p role="status" className="pl-10 text-sm text-muted-foreground motion-safe:animate-pulse">正在整理回答…</p>}
      </div>
    </div>
    <div className="shrink-0 p-3"><PromptInput onSubmit={onSend} busy={busy} onStop={onStop} footer={footer} /></div>
  </section>;
}
