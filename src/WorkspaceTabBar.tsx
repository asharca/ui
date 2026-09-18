'use client';

import { ArrowLeft, ArrowRight, ExternalLink, Pin, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode } from 'react';
type Icon = ComponentType<{ className?: string }>;
export type WorkspaceTab = { id: string; icon: Icon; label: string; pinned: boolean; closable?: boolean };
export type WorkspaceTabBarLabels = {
  close: (label: string) => string; navigation: string; newTab: string;
  openInNewWindow: (label: string) => string; pin: (label: string) => string; unpin: (label: string) => string;
  moveLeft?: (label: string) => string; moveRight?: (label: string) => string;
};
export const workspaceTabBarDefaultLabels: WorkspaceTabBarLabels = {
  close: (label) => `Close ${label}`, navigation: 'Open pages', newTab: 'New tab',
  openInNewWindow: (label) => `Open ${label} in new window`, pin: (label) => `Pin ${label}`, unpin: (label) => `Unpin ${label}`,
  moveLeft: (label) => `Move ${label} left`, moveRight: (label) => `Move ${label} right`,
};
export type WorkspaceTabBarProps = {
  actions?: ReactNode; activeTabId: string; labels?: Partial<WorkspaceTabBarLabels>;
  onClose: (id: string) => void; onNewTab: () => void; onOpenInNewWindow: (id: string) => void;
  onReorder: (sourceId: string, targetId: string) => void; onSelect: (id: string) => void;
  onTogglePinned: (id: string) => void; tabs: WorkspaceTab[];
  /** Defaults preserve existing host behavior; new hosts may disable double-click close. */
  closeOnDoubleClick?: boolean; closeOnMiddleClick?: boolean; showReorderButtons?: boolean;
};
export function WorkspaceTabBar({ actions, activeTabId, labels: overrides, onClose, onNewTab, onOpenInNewWindow, onReorder, onSelect, onTogglePinned, tabs, closeOnDoubleClick = true, closeOnMiddleClick = true, showReorderButtons = false }: WorkspaceTabBarProps) {
  const labels = { ...workspaceTabBarDefaultLabels, ...overrides };
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const root = useRef<HTMLElement>(null); const closing = useRef<string | null>(null);
  useEffect(() => { buttons.current.get(activeTabId)?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); }, [activeTabId, tabs.length]);
  useEffect(() => {
    if (!closing.current || tabs.some((tab) => tab.id === closing.current)) return;
    closing.current = null;
    if (document.activeElement === document.body || root.current?.contains(document.activeElement)) {
      (buttons.current.get(activeTabId) ?? buttons.current.get(tabs[0]?.id))?.focus();
    }
  }, [tabs, activeTabId]);
  const canClose = (tab: WorkspaceTab) => tabs.length > 1 && tab.closable !== false;
  const close = (tab: WorkspaceTab) => { if (canClose(tab)) { closing.current = tab.id; onClose(tab.id); } };
  const move = (index: number, offset: number) => { const target = tabs[index + offset]; if (target) onReorder(tabs[index].id, target.id); };
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const offset = event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : event.key === 'ArrowRight' ? (rtl ? -1 : 1) : 0;
    if (offset && event.altKey && event.shiftKey) { event.preventDefault(); move(index, offset); return; }
    if (event.key === 'Delete') { event.preventDefault(); close(tabs[index]); return; }
    if (!offset && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + offset + tabs.length) % tabs.length;
    buttons.current.get(tabs[next].id)?.focus(); onSelect(tabs[next].id);
  }
  return <nav ref={root} aria-label={labels.navigation} data-toolplane-ui="workspace-tab-bar" className="flex h-11 shrink-0 bg-shell px-2">
    <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden py-1 [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab, index) => {
        const active = tab.id === activeTabId; const controls = active || draggingId === tab.id; const TabIcon = tab.icon;
        const small = 'flex size-[18px] items-center justify-center rounded-sm hover:bg-foreground/10';
        return <li key={tab.id} data-tab-id={tab.id} data-active={active ? 'true' : undefined} draggable
          onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', tab.id); setDraggingId(tab.id); }}
          onDragEnd={() => setDraggingId(null)} onDragOver={(event) => { if (draggingId && draggingId !== tab.id) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; } }}
          onDrop={(event) => { if (draggingId && draggingId !== tab.id) { event.preventDefault(); onReorder(draggingId, tab.id); setDraggingId(null); } }}
          className={`group flex h-[30px] min-w-24 max-w-64 shrink-0 items-center rounded-[10px] transition-colors ${active ? 'bg-background text-foreground ring-1 ring-border/70' : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'} ${draggingId === tab.id ? 'opacity-50' : ''}`}>
          <button ref={(element) => { if (element) buttons.current.set(tab.id, element); else buttons.current.delete(tab.id); }} type="button" aria-current={active ? 'page' : undefined} title={tab.label}
            aria-keyshortcuts="Alt+Shift+ArrowLeft Alt+Shift+ArrowRight" onKeyDown={(event) => keyboard(event, index)}
            onAuxClick={(event) => { if (event.button === 1 && closeOnMiddleClick) { event.preventDefault(); close(tab); } }}
            onDoubleClick={() => { if (closeOnDoubleClick) close(tab); }} onClick={() => onSelect(tab.id)} className="flex h-full min-w-0 flex-1 items-center gap-1.5 px-2 text-left text-xs">
            <TabIcon className="size-3.5 shrink-0" /><span className="truncate">{tab.label}</span>
          </button>
          <div className="mr-1 flex shrink-0 items-center">
            <button type="button" aria-pressed={tab.pinned} aria-label={tab.pinned ? labels.unpin(tab.label) : labels.pin(tab.label)} title={tab.pinned ? labels.unpin(tab.label) : labels.pin(tab.label)} onClick={() => onTogglePinned(tab.id)}
              className={`${small} ${tab.pinned ? 'bg-brand-soft text-accent-foreground' : controls ? '' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}><Pin aria-hidden="true" className={`size-3 ${tab.pinned ? 'fill-current' : ''}`} /></button>
            <div className={`flex items-center ${controls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}>
              {showReorderButtons && <><button type="button" className={small} disabled={index === 0} aria-label={labels.moveLeft?.(tab.label) ?? `Move ${tab.label} left`} onClick={() => move(index, -1)}><ArrowLeft aria-hidden="true" className="size-3" /></button><button type="button" className={small} disabled={index === tabs.length - 1} aria-label={labels.moveRight?.(tab.label) ?? `Move ${tab.label} right`} onClick={() => move(index, 1)}><ArrowRight aria-hidden="true" className="size-3" /></button></>}
              <button type="button" className={small} aria-label={labels.openInNewWindow(tab.label)} title={labels.openInNewWindow(tab.label)} onClick={() => onOpenInNewWindow(tab.id)}><ExternalLink aria-hidden="true" className="size-3" /></button>
              {canClose(tab) && <button type="button" className={small} aria-label={labels.close(tab.label)} title={labels.close(tab.label)} onClick={() => close(tab)}><X aria-hidden="true" className="size-3" /></button>}
            </div>
          </div>
        </li>;
      })}
      <li className="shrink-0"><button type="button" aria-label={labels.newTab} title={labels.newTab} onClick={onNewTab} className="ui-button-ghost ui-icon-button"><Plus aria-hidden="true" className="size-4" /></button></li>
    </ol>{actions}
  </nav>;
}
