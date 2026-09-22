'use client';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, MoreHorizontal, Pin, PinOff, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { IconButton } from './icon-button';
import { cn, focusRing } from './utils';

export interface WorkspaceTab {
  id: string;
  title: string;
  icon?: ReactNode;
  pinned?: boolean;
  dirty?: boolean;
  /** 标签按钮的 DOM id；用于面板的 aria-labelledby，与业务 id 分开以支持多个实例。 */
  tabId?: string;
  /** 内容面板的 DOM id，用于 aria-controls。面板由宿主渲染。 */
  panelId?: string;
}
export interface WorkspaceTabBarProps {
  /** default：独立标签条；inset：与 WorkspaceShell 正文连接的无边框标签。 */
  variant?: 'default' | 'inset';
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  onReorder?: (sourceId: string, targetId: string) => void;
  onPinnedChange?: (id: string, pinned: boolean) => void;
  className?: string;
}
export function WorkspaceTabBar({ tabs, activeTabId, onSelect, onClose, onReorder, onPinnedChange, variant = 'default', className }: WorkspaceTabBarProps) {
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (variant !== 'inset') return;
    const scroller = scrollRef.current;
    const active = refs.current.get(activeTabId)?.parentElement;
    if (!scroller || !active) return;
    // Scroll only this strip, never the host page or its vertical content panel.
    const viewport = scroller.getBoundingClientRect();
    const tab = active.getBoundingClientRect();
    if (tab.left < viewport.left) scroller.scrollLeft += tab.left - viewport.left;
    else if (tab.right > viewport.right) scroller.scrollLeft += tab.right - viewport.right;
  }, [activeTabId, tabs, variant]);
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
  const inset = variant === 'inset';
  return <div ref={scrollRef} data-slot="workspace-tab-bar" data-variant={variant} className={cn('max-w-full min-w-0 shrink-0 overflow-x-auto', inset ? 'bg-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'border-b border-border bg-muted/20', className)}>
    <div role="tablist" aria-label="工作区标签" className={cn('flex min-w-max gap-1', inset ? 'h-14 items-end px-[calc(var(--workspace-gap,0.5rem)+var(--workspace-radius,0.75rem))] pt-2' : 'items-center p-1.5')}>
      {tabs.map((tab, index) => <div key={tab.id} data-slot="workspace-tab" data-active={tab.id === activeTabId} className={cn(
        'group relative flex shrink-0 items-center',
        inset ? 'h-11 rounded-t-[var(--workspace-radius,0.75rem)] px-1 pb-1' : 'rounded-lg border border-transparent',
        tab.id === activeTabId && (inset
          ? 'bg-[var(--workspace-surface,var(--background))] before:pointer-events-none before:absolute before:bottom-0 before:-left-2 before:size-2 before:bg-[radial-gradient(circle_at_top_left,transparent_70%,var(--workspace-surface,var(--background))_72%)] after:pointer-events-none after:absolute after:bottom-0 after:-right-2 after:size-2 after:bg-[radial-gradient(circle_at_top_right,transparent_70%,var(--workspace-surface,var(--background))_72%)]'
          : 'border-border bg-background shadow-sm'),
      )}
        draggable={Boolean(onReorder)} onDragStart={(event) => { event.dataTransfer.setData('text/plain', tab.id); event.dataTransfer.effectAllowed = 'move'; }}
        onDragOver={(event) => { if (onReorder) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); const source = tabs.find((item) => item.id === event.dataTransfer.getData('text/plain')); if (source) move(source, tab); }}>
        <button ref={(node) => { if (node) refs.current.set(tab.id, node); else refs.current.delete(tab.id); }} id={tab.tabId} aria-controls={tab.panelId} type="button" role="tab" aria-selected={tab.id === activeTabId} tabIndex={tab.id === activeTabId || !tabs.some((item) => item.id === activeTabId) && index === 0 ? 0 : -1}
          onClick={() => onSelect(tab.id)} onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); const step = event.key === 'ArrowLeft' ? -1 : 1; if (event.altKey) move(tab, tabs[index + step]); else selectAt(event.key === 'ArrowLeft' ? index - 1 : index + 1); }
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
