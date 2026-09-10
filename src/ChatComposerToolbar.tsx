'use client';

import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Button, IconButton } from './Controls.tsx';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './Dialog.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from './Overlays.tsx';

export type ChatComposerTool = {
  id: string;
  label: string;
  icon: ReactNode;
  description?: string;
  disabled?: boolean;
  pressed?: boolean;
  onSelect: () => void;
};

export type ChatComposerToolbarLabels = {
  open: string;
  customize: string;
  close: string;
  reset: string;
  moveUp: (label: string) => string;
  moveDown: (label: string) => string;
};

export type ChatComposerToolbarProps = {
  tools: readonly ChatComposerTool[];
  pinnedIds: readonly string[];
  onPinnedIdsChange: (ids: string[]) => void;
  disabled?: boolean;
  labels?: Partial<ChatComposerToolbarLabels>;
};

export function ChatComposerToolbar({ tools, pinnedIds, onPinnedIdsChange, disabled, labels }: ChatComposerToolbarProps) {
  const [customizing, setCustomizing] = useState(false);
  const copy = {
    open: 'Open tools', customize: 'Customize toolbar', close: 'Close', reset: 'Reset toolbar',
    moveUp: (label: string) => `Move ${label} up`, moveDown: (label: string) => `Move ${label} down`, ...labels,
  };
  const pinned = [...new Set(pinnedIds)].flatMap((id) => tools.find((tool) => tool.id === id) ?? []);
  const ids = pinned.map((tool) => tool.id);
  const unpinned = tools.filter((tool) => !ids.includes(tool.id));
  const move = (index: number, offset: number) => {
    const next = [...ids];
    const [id] = next.splice(index, 1);
    next.splice(index + offset, 0, id);
    onPinnedIdsChange(next);
  };
  return <>
    <div className="ui-composer-toolbar" data-chat-ui="composer-toolbar">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="ui-composer-tool" aria-label={copy.open} title={copy.open} disabled={disabled}><Plus size={18} /></button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="ui-composer-menu" aria-label={copy.open}>
            {unpinned.map((tool) => <DropdownMenuItem key={tool.id} disabled={disabled || tool.disabled} onSelect={tool.onSelect}>
              {tool.icon}<span>{tool.label}{tool.description && <small>{tool.description}</small>}</span>
            </DropdownMenuItem>)}
            {unpinned.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem disabled={disabled} onSelect={() => setCustomizing(true)}><SlidersHorizontal size={16} />{copy.customize}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <div className="ui-composer-shortcuts">
        {pinned.map((tool) => <button type="button" key={tool.id} className="ui-composer-tool" data-composer-shortcut={tool.id} disabled={disabled || tool.disabled} aria-label={tool.label} title={tool.label} aria-pressed={tool.pressed} onClick={tool.onSelect}>{tool.icon}</button>)}
      </div>
    </div>
    <Dialog open={customizing} onOpenChange={setCustomizing}>
      <DialogPortal><DialogOverlay /><DialogContent className="ui-composer-customize" aria-describedby={undefined}>
        <header><DialogTitle>{copy.customize}</DialogTitle><DialogClose asChild><IconButton variant="ghost" label={copy.close} icon={<X size={16} />} /></DialogClose></header>
        <div>{[...pinned, ...unpinned].map((tool) => {
          const index = ids.indexOf(tool.id);
          return <div className="ui-composer-option" key={tool.id}>
            <label><input type="checkbox" checked={index >= 0} disabled={disabled} onChange={(event) => onPinnedIdsChange(event.target.checked ? [...ids, tool.id] : ids.filter((id) => id !== tool.id))} />{tool.icon}<span>{tool.label}</span></label>
            {index >= 0 && <>
              <IconButton variant="ghost" label={copy.moveUp(tool.label)} icon={<ArrowUp size={14} />} disabled={disabled || index === 0} onClick={() => move(index, -1)} />
              <IconButton variant="ghost" label={copy.moveDown(tool.label)} icon={<ArrowDown size={14} />} disabled={disabled || index === ids.length - 1} onClick={() => move(index, 1)} />
            </>}
          </div>;
        })}</div>
        <footer><Button variant="outline" disabled={disabled || !ids.length} onClick={() => onPinnedIdsChange([])}><RotateCcw size={14} />{copy.reset}</Button></footer>
      </DialogContent></DialogPortal>
    </Dialog>
  </>;
}
