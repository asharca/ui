'use client';
import { useState, type ReactNode } from 'react';
import { ArrowLeft, PanelLeft } from 'lucide-react';
import { IconButton } from './icon-button';
import { cn } from './utils';

export interface ChatShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  header?: ReactNode;
  rightPanel?: ReactNode;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  mobilePane?: 'sidebar' | 'chat';
  onMobilePaneChange?: (pane: 'sidebar' | 'chat') => void;
  className?: string;
}
export function ChatShell({ sidebar, children, header, rightPanel, sidebarOpen, onSidebarOpenChange, mobilePane, onMobilePaneChange, className }: ChatShellProps) {
  const [open, setOpen] = useState(true);
  const [pane, setPane] = useState<'sidebar' | 'chat'>('chat');
  const isOpen = sidebarOpen ?? open;
  const currentPane = mobilePane ?? pane;
  function changeOpen(next: boolean) { if (sidebarOpen === undefined) setOpen(next); onSidebarOpenChange?.(next); }
  function changePane(next: 'sidebar' | 'chat') { if (mobilePane === undefined) setPane(next); onMobilePaneChange?.(next); }
  return <section aria-label="聊天工作区" className={cn('flex h-[34rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-background', className)}>
    <header className="flex min-h-14 shrink-0 items-center gap-3 border-b border-border px-3">
      <IconButton className="sm:hidden" label={currentPane === 'chat' ? '查看会话列表' : '返回聊天'} icon={currentPane === 'chat' ? <PanelLeft /> : <ArrowLeft />} onClick={() => changePane(currentPane === 'chat' ? 'sidebar' : 'chat')} />
      <IconButton className="hidden sm:inline-flex" label={isOpen ? '隐藏会话侧栏' : '显示会话侧栏'} icon={<PanelLeft />} onClick={() => changeOpen(!isOpen)} />
      <div className="min-w-0 flex-1 text-sm font-medium">{header ?? '聊天工作区'}</div>
    </header>
    <div className="flex min-h-0 flex-1">
      <aside aria-label="会话导航面板" className={cn('min-h-0 w-full shrink-0 flex-col border-r border-border sm:w-60', currentPane === 'sidebar' ? 'flex' : 'hidden', isOpen ? 'sm:flex' : 'sm:hidden')}>{sidebar}</aside>
      <div className={cn('min-h-0 min-w-0 flex-1 flex-col sm:flex', currentPane === 'chat' ? 'flex' : 'hidden')}>{children}</div>
      {rightPanel && <aside aria-label="辅助面板" className="hidden w-60 shrink-0 overflow-y-auto border-l border-border p-4 xl:block">{rightPanel}</aside>}
    </div>
  </section>;
}
