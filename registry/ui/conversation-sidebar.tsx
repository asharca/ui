'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, MessageSquare, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Input } from './input';
import { SearchInput } from './search-input';
import { Dialog, DialogContent } from './dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { motion, useReducedMotion } from 'motion/react';
import { cn, focusRing, layoutSpring } from './utils';

export interface ConversationSidebarItem { id: string; title: string; meta?: string }
export interface ConversationSidebarGroup { id: string; label: string; conversations: ConversationSidebarItem[] }
export interface ConversationSidebarProps {
  groups: ConversationSidebarGroup[];
  activeConversationId?: string;
  onSelect: (id: string) => void;
  onNew?: () => void;
  onRename?: (id: string, title: string) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
  onConversationOrderChange?: (groupId: string, ids: string[]) => void;
  className?: string;
}
export function ConversationSidebar({ groups, activeConversationId, onSelect, onNew, onRename, onDelete, onConversationOrderChange, className }: ConversationSidebarProps) {
  const selectionId = useId();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [mutation, setMutation] = useState<{ kind: 'rename' | 'delete'; item: ConversationSidebarItem } | null>(null);
  const [name, setName] = useState(''); const [pending, setPending] = useState(false); const [error, setError] = useState('');
  const lock = useRef(false); const mounted = useRef(true); const rowRefs = useRef(new Map<string, HTMLButtonElement>()); const restoreId = useRef('');
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const filtered = groups.map((group) => ({ ...group, visible: group.conversations.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())) }));
  function move(group: ConversationSidebarGroup, id: string, targetId: string | undefined) {
    if (!targetId || targetId === id) return;
    const ids = group.conversations.map((item) => item.id); const source = ids.indexOf(id); const target = ids.indexOf(targetId);
    if (source < 0 || target < 0) return;
    ids.splice(target, 0, ids.splice(source, 1)[0]);
    onConversationOrderChange?.(group.id, ids);
    rowRefs.current.get(id)?.focus();
  }
  function start(kind: 'rename' | 'delete', item: ConversationSidebarItem) {
    restoreId.current = item.id; setName(item.title); setError('');
    requestAnimationFrame(() => { if (mounted.current) setMutation({ kind, item }); });
  }
  async function save() {
    if (!mutation || lock.current || mutation.kind === 'rename' && !name.trim()) return;
    lock.current = true; setPending(true); setError('');
    try {
      if (mutation.kind === 'rename') await onRename?.(mutation.item.id, name.trim()); else await onDelete?.(mutation.item.id);
      if (mounted.current) setMutation(null);
    } catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : '操作失败，请重试。'); }
    finally { lock.current = false; if (mounted.current) setPending(false); }
  }
  return <section aria-label="会话列表" className={cn('flex h-full min-h-0 flex-col bg-background text-sm', className)}>
    <header className="grid shrink-0 gap-3 border-b border-border p-3.5">{onNew && <Button variant="outline" size="sm" onClick={onNew}><Plus className="size-3.5" />新建会话</Button>}<SearchInput label="搜索会话" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="搜索会话…" /></header>
    <motion.div layoutRoot layoutScroll className="min-h-0 min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-2.5">{filtered.map((group) => group.visible.length > 0 && <section key={group.id}><h3 className="px-2 pb-2 text-[10px] text-muted-foreground">{group.label}</h3><div className="grid gap-1">
      {group.visible.map((item, index) => <div key={item.id} className={cn('group relative isolate flex min-w-0 items-center rounded-lg hover:bg-muted/50', activeConversationId === item.id && 'hover:bg-transparent')}
        draggable={Boolean(onConversationOrderChange)} onDragStart={(event) => event.dataTransfer.setData('text/plain', item.id)} onDragOver={(event) => { if (onConversationOrderChange) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); move(group, event.dataTransfer.getData('text/plain'), item.id); }}>
        {activeConversationId === item.id && <motion.span aria-hidden="true" data-slot="conversation-selection" initial={false}
          layoutId={reduce ? undefined : `${selectionId}-selection`} transition={reduce ? { duration: 0 } : layoutSpring}
          className="pointer-events-none absolute inset-0 -z-10 bg-muted" style={{ borderRadius: 8 }} />}
        <button ref={(node) => { if (node) rowRefs.current.set(item.id, node); else rowRefs.current.delete(item.id); }} type="button" aria-current={activeConversationId === item.id ? 'page' : undefined} onClick={() => onSelect(item.id)}
          onKeyDown={(event) => { if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) { event.preventDefault(); move(group, item.id, group.visible[index + (event.key === 'ArrowUp' ? -1 : 1)]?.id); } }}
          className={cn('flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2.5 text-left', focusRing)}><MessageSquare aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" /><span className="min-w-0 flex-1"><span title={item.title} className="block truncate text-xs">{item.title}</span>{item.meta && <span className="mt-1 block truncate text-[10px] text-muted-foreground">{item.meta}</span>}</span></button>
        {(onRename || onDelete || onConversationOrderChange) && <DropdownMenu><DropdownMenuTrigger asChild><IconButton label={`${item.title}更多操作`} icon={<MoreHorizontal />} className="mr-1 size-7" /></DropdownMenuTrigger><DropdownMenuContent>
          {onRename && <DropdownMenuItem onSelect={() => start('rename', item)}><Pencil />重命名</DropdownMenuItem>}
          {onConversationOrderChange && <><DropdownMenuItem disabled={!group.visible[index - 1]} onSelect={() => move(group, item.id, group.visible[index - 1]?.id)}><ArrowUp />上移</DropdownMenuItem><DropdownMenuItem disabled={!group.visible[index + 1]} onSelect={() => move(group, item.id, group.visible[index + 1]?.id)}><ArrowDown />下移</DropdownMenuItem></>}
          {onDelete && <DropdownMenuItem danger onSelect={() => start('delete', item)}><Trash2 />删除会话</DropdownMenuItem>}
        </DropdownMenuContent></DropdownMenu>}
      </div>)}
    </div></section>)}{filtered.every((group) => !group.visible.length) && <p className="px-4 py-10 text-center text-xs text-muted-foreground">没有匹配的会话。</p>}</motion.div>
    <Dialog open={Boolean(mutation)} onOpenChange={(open) => { if (!open && !lock.current) setMutation(null); }}><DialogContent title={mutation?.kind === 'delete' ? '删除会话？' : '重命名会话'} description={mutation?.kind === 'delete' ? `将删除“${mutation.item.title}”。由应用处理实际数据。` : '输入新的会话名称。'} onCloseAutoFocus={(event) => { event.preventDefault(); rowRefs.current.get(restoreId.current)?.focus(); }}>
      <form onSubmit={(event) => { event.preventDefault(); void save(); }}>{mutation?.kind === 'rename' && <Input label="会话名称" value={name} onChange={(event) => setName(event.target.value)} disabled={pending} required />}{error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
        <div className="mt-5 flex justify-end gap-2"><Button variant="outline" disabled={pending} onClick={() => setMutation(null)}>取消</Button><Button type="submit" variant={mutation?.kind === 'delete' ? 'danger' : 'default'} loading={pending} disabled={mutation?.kind === 'rename' && !name.trim()}>{mutation?.kind === 'delete' ? '确认删除' : '保存名称'}</Button></div>
      </form>
    </DialogContent></Dialog>
  </section>;
}
