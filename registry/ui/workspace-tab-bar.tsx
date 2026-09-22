'use client';
import { useRef, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, MoreHorizontal, Pin, PinOff, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { IconButton } from './icon-button';
import { cn, focusRing } from './utils';

export interface WorkspaceTab { id: string; title: string; icon?: ReactNode; pinned?: boolean; dirty?: boolean }
export interface WorkspaceTabBarProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  onReorder?: (sourceId: string, targetId: string) => void;
  onPinnedChange?: (id: string, pinned: boolean) => void;
  className?: string;
}
export function WorkspaceTabBar({ tabs, activeTabId, onSelect, onClose, onReorder, onPinnedChange, className }: WorkspaceTabBarProps) {
  const refs = useRef(new Map<string, HTMLButtonElement>());
  function move(source: WorkspaceTab, target: WorkspaceTab | undefined) {
    if (!target || source.id === target.id || Boolean(source.pinned) !== Boolean(target.pinned)) return;
    onReorder?.(source.id, target.id);
    refs.current.get(source.id)?.focus();
  }
  function selectAt(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length];
    if (!target) return;
    onSelect(target.id); refs.current.get(target.id)?.focus();
  }
  return <div className={cn('max-w-full overflow-x-auto border-b border-border bg-muted/20', className)}>
    <div role="tablist" aria-label="工作区标签" className="flex min-w-max items-center gap-1 p-1.5">
      {tabs.map((tab, index) => <div key={tab.id} className={cn('group flex items-center rounded-lg border border-transparent', tab.id === activeTabId && 'border-border bg-background shadow-sm')}
        draggable={Boolean(onReorder)} onDragStart={(event) => { event.dataTransfer.setData('text/plain', tab.id); event.dataTransfer.effectAllowed = 'move'; }}
        onDragOver={(event) => { if (onReorder) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); const source = tabs.find((item) => item.id === event.dataTransfer.getData('text/plain')); if (source) move(source, tab); }}>
        <button ref={(node) => { if (node) refs.current.set(tab.id, node); else refs.current.delete(tab.id); }} type="button" role="tab" aria-selected={tab.id === activeTabId} tabIndex={tab.id === activeTabId || !tabs.some((item) => item.id === activeTabId) && index === 0 ? 0 : -1}
          onClick={() => onSelect(tab.id)} onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); const step = event.key === 'ArrowLeft' ? -1 : 1; if (event.altKey) move(tab, tabs[index + step]); else selectAt(index + step); }
            if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectAt(event.key === 'Home' ? 0 : tabs.length - 1); }
          }} className={cn('flex h-8 max-w-48 items-center gap-2 rounded-lg px-2.5 text-xs text-muted-foreground aria-selected:text-foreground', focusRing)}>
          {tab.icon && <span aria-hidden="true" className="inline-flex [&_svg]:size-3.5">{tab.icon}</span>}{tab.pinned && <Pin aria-hidden="true" className="size-3" />}<span className="truncate" title={tab.title}>{tab.title}</span>{tab.dirty && <span aria-label="未保存" className="size-1.5 rounded-full bg-current" />}
        </button>
        {(onReorder || onPinnedChange) && <DropdownMenu><DropdownMenuTrigger asChild><IconButton label={`${tab.title}操作`} icon={<MoreHorizontal />} className="size-6" /></DropdownMenuTrigger><DropdownMenuContent align="start">
          {onPinnedChange && <DropdownMenuItem onSelect={() => onPinnedChange(tab.id, !tab.pinned)}>{tab.pinned ? <PinOff /> : <Pin />}{tab.pinned ? '取消固定' : '固定标签'}</DropdownMenuItem>}
          {onReorder && <><DropdownMenuItem disabled={!tabs[index - 1] || Boolean(tabs[index - 1]?.pinned) !== Boolean(tab.pinned)} onSelect={() => move(tab, tabs[index - 1])}><ArrowLeft />向左移动</DropdownMenuItem><DropdownMenuItem disabled={!tabs[index + 1] || Boolean(tabs[index + 1]?.pinned) !== Boolean(tab.pinned)} onSelect={() => move(tab, tabs[index + 1])}><ArrowRight />向右移动</DropdownMenuItem></>}
        </DropdownMenuContent></DropdownMenu>}
        {onClose && !tab.pinned && <IconButton label={`关闭 ${tab.title}`} icon={<X />} disabled={tabs.length <= 1} className="mr-1 size-6" onClick={() => { if (tabs.length > 1) onClose(tab.id); }} />}
      </div>)}
    </div>
  </div>;
}
