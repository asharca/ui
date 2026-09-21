'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pin, PinOff, SlidersHorizontal } from 'lucide-react';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

export interface ChatComposerTool { id: string; label: string; group?: string; icon?: ReactNode; pressed?: boolean; disabled?: boolean; pinable?: boolean; onSelect: () => void | Promise<void> }
export interface ChatComposerToolbarProps {
  tools: ChatComposerTool[];
  pinnedIds: string[];
  onPinnedIdsChange: (ids: string[]) => void;
  onActionError?: (error: unknown, tool: ChatComposerTool) => void;
  className?: string;
}
export function ChatComposerToolbar({ tools, pinnedIds, onPinnedIdsChange, onActionError, className }: ChatComposerToolbarProps) {
  const executing = useRef(new Set<string>());
  const mounted = useRef(true);
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function run(tool: ChatComposerTool) {
    if (tool.disabled || executing.current.has(tool.id)) return;
    executing.current.add(tool.id); setPending([...executing.current]); setError('');
    try { await tool.onSelect(); }
    catch (cause) { if (mounted.current) setError(`${tool.label}：${cause instanceof Error ? cause.message : '执行失败，请重试。'}`); onActionError?.(cause, tool); }
    finally { executing.current.delete(tool.id); if (mounted.current) setPending([...executing.current]); }
  }
  function pin(id: string) { onPinnedIdsChange(pinnedIds.includes(id) ? pinnedIds.filter((item) => item !== id) : [...new Set([...pinnedIds, id])]); }
  const groups = [...new Set(tools.map((tool) => tool.group ?? '工具'))];
  return <div className={cn('min-w-0', className)}><div role="group" aria-label="输入工具" className="flex flex-wrap items-center gap-1.5">
    {[...new Set(pinnedIds)].map((id) => tools.find((tool) => tool.id === id)).filter((tool): tool is ChatComposerTool => Boolean(tool)).map((tool) => <Button key={tool.id} size="sm" variant={tool.pressed ? 'secondary' : 'ghost'} aria-pressed={tool.pressed} disabled={tool.disabled} loading={pending.includes(tool.id)} onClick={() => void run(tool)}>{!pending.includes(tool.id) && tool.icon}{tool.label}</Button>)}
    <Popover><PopoverTrigger asChild><IconButton label="管理输入工具" icon={<SlidersHorizontal />} className="size-8" /></PopoverTrigger><PopoverContent align="start" className="max-h-80 w-80 overflow-y-auto">
      {groups.map((group) => <section key={group} className="mb-4 last:mb-0"><h3 className="mb-2 px-1 text-[10px] text-muted-foreground">{group}</h3><div className="grid gap-1">
        {tools.filter((tool) => (tool.group ?? '工具') === group).map((tool) => <div key={tool.id} className="flex min-w-0 items-center gap-1"><Button className="min-w-0 flex-1 justify-start" variant="ghost" size="sm" disabled={tool.disabled} loading={pending.includes(tool.id)} aria-pressed={tool.pressed} onClick={() => void run(tool)}>{!pending.includes(tool.id) && tool.icon}<span className="truncate">{tool.label}</span></Button>
          {tool.pinable !== false && <IconButton label={`${pinnedIds.includes(tool.id) ? '取消固定' : '固定'} ${tool.label}`} icon={pinnedIds.includes(tool.id) ? <PinOff /> : <Pin />} className="size-7" onClick={() => pin(tool.id)} />}
        </div>)}
      </div></section>)}
    </PopoverContent></Popover>
  </div>{error && <p role="alert" className="mt-2 text-xs leading-5 text-destructive">{error}</p>}</div>;
}
