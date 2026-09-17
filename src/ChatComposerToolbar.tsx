'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Button, IconButton } from './Controls.js';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './Dialog.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from './Overlays.js';

export type ChatComposerTool = {
  id: string; label: string; icon: ReactNode; description?: string; disabled?: boolean;
  pressed?: boolean; group?: string; pinable?: boolean;
  onSelect: () => void | Promise<void>;
};
export type ChatComposerToolbarLabels = {
  open: string; customize: string; close: string; reset: string;
  moveUp: (label: string) => string; moveDown: (label: string) => string;
  actionFailed?: string;
};
export type ChatComposerToolbarProps = {
  tools: readonly ChatComposerTool[]; pinnedIds: readonly string[];
  onPinnedIdsChange: (ids: string[]) => void; disabled?: boolean;
  labels?: Partial<ChatComposerToolbarLabels>;
  onActionError?: (error: unknown, tool: ChatComposerTool) => void;
  onActionComplete?: (tool: ChatComposerTool) => void;
};

export function ChatComposerToolbar({ tools, pinnedIds, onPinnedIdsChange, disabled, labels, onActionError, onActionComplete }: ChatComposerToolbarProps) {
  const [customizing, setCustomizing] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const pending = useRef(new Set<string>());
  const mounted = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const copy = {
    open: 'Open tools', customize: 'Customize toolbar', close: 'Close', reset: 'Reset toolbar',
    actionFailed: 'The tool action failed. Please retry.',
    moveUp: (label: string) => `Move ${label} up`, moveDown: (label: string) => `Move ${label} down`, ...labels,
  };
  const uniqueTools = [...new Map(tools.map((tool) => [tool.id, tool])).values()];
  const byId = new Map(uniqueTools.map((tool) => [tool.id, tool]));
  const pinned = [...new Set(pinnedIds)].flatMap((id) => {
    const tool = byId.get(id); return tool && tool.pinable !== false ? [tool] : [];
  });
  const ids = pinned.map((tool) => tool.id);
  const unpinned = uniqueTools.filter((tool) => !ids.includes(tool.id));
  const move = (index: number, offset: number) => {
    if (disabled || index + offset < 0 || index + offset >= ids.length) return;
    const next = [...ids]; const [id] = next.splice(index, 1); next.splice(index + offset, 0, id); onPinnedIdsChange(next);
  };
  async function invoke(tool: ChatComposerTool) {
    if (disabled || tool.disabled || pending.current.has(tool.id)) return;
    pending.current.add(tool.id); setPendingIds([...pending.current]); setFailed(false);
    try { await tool.onSelect(); if (mounted.current) onActionComplete?.(tool); }
    catch (error) { if (mounted.current) { setFailed(true); onActionError?.(error, tool); } }
    finally { pending.current.delete(tool.id); if (mounted.current) setPendingIds([...pending.current]); }
  }
  return <>
    <div className="ui-composer-toolbar" data-toolplane-ui="composer-toolbar" data-chat-ui="composer-toolbar">
      <DropdownMenu>
        <DropdownMenuTrigger asChild><button ref={trigger} type="button" className="ui-composer-tool" aria-label={copy.open} title={copy.open} disabled={disabled}><Plus aria-hidden="true" size={18} /></button></DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="ui-composer-menu" aria-label={copy.open}>
            {unpinned.map((tool, index) => <div key={tool.id} role="presentation">
              {tool.group && tool.group !== unpinned[index - 1]?.group && <DropdownMenuLabel>{tool.group}</DropdownMenuLabel>}
              <DropdownMenuItem disabled={disabled || tool.disabled || pendingIds.includes(tool.id)} onSelect={() => { void invoke(tool); }} data-pressed={tool.pressed || undefined}>
                <span aria-hidden="true">{tool.icon}</span><span>{tool.label}{tool.description && <small>{tool.description}</small>}</span>
              </DropdownMenuItem>
            </div>)}
            {unpinned.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem disabled={disabled} onSelect={() => setCustomizing(true)}><SlidersHorizontal aria-hidden="true" size={16} />{copy.customize}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <div className="ui-composer-shortcuts" role="group" aria-label={copy.customize}>
        {pinned.map((tool) => <button type="button" key={tool.id} className="ui-composer-tool" data-composer-shortcut={tool.id} data-pending={pendingIds.includes(tool.id) || undefined}
          disabled={disabled || tool.disabled || pendingIds.includes(tool.id)} aria-busy={pendingIds.includes(tool.id) || undefined} aria-label={tool.label} title={tool.label} aria-pressed={tool.pressed}
          onClick={() => { void invoke(tool); }}>{pendingIds.includes(tool.id) ? <Loader2 aria-hidden="true" className="animate-spin" /> : <span aria-hidden="true">{tool.icon}</span>}</button>)}
      </div>
    </div>
    {failed && <p role="alert" className="ui-composer-error">{copy.actionFailed}</p>}
    <Dialog open={customizing} onOpenChange={setCustomizing}>
      <DialogPortal><DialogOverlay /><DialogContent className="ui-composer-customize" aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}>
        <header><DialogTitle>{copy.customize}</DialogTitle><DialogClose asChild><IconButton variant="ghost" label={copy.close} icon={<X size={16} />} /></DialogClose></header>
        <div>{[...pinned, ...unpinned.filter((tool) => tool.pinable !== false)].map((tool) => {
          const index = ids.indexOf(tool.id);
          return <div className="ui-composer-option" key={tool.id}>
            <label><input type="checkbox" checked={index >= 0} disabled={disabled} onChange={(event) => { if (!disabled) onPinnedIdsChange(event.target.checked ? [...ids, tool.id] : ids.filter((id) => id !== tool.id)); }} /><span aria-hidden="true">{tool.icon}</span><span>{tool.label}</span></label>
            {index >= 0 && <>
              <IconButton variant="ghost" label={copy.moveUp(tool.label)} icon={<ArrowUp size={14} />} disabled={disabled || index === 0} onClick={() => move(index, -1)} />
              <IconButton variant="ghost" label={copy.moveDown(tool.label)} icon={<ArrowDown size={14} />} disabled={disabled || index === ids.length - 1} onClick={() => move(index, 1)} />
            </>}
          </div>;
        })}</div>
        <footer><Button variant="outline" disabled={disabled || !ids.length} onClick={() => onPinnedIdsChange([])}><RotateCcw aria-hidden="true" size={14} />{copy.reset}</Button></footer>
      </DialogContent></DialogPortal>
    </Dialog>
  </>;
}
