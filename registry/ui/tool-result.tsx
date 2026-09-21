'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, CircleAlert, LoaderCircle, Terminal } from 'lucide-react';
import { Badge } from './badge';
import { cn } from './utils';

export interface ToolResultProps {
  title: string;
  status: 'running' | 'success' | 'error';
  output: string;
  defaultOpen?: boolean;
  className?: string;
}
export function ToolResult({ title, status, output, defaultOpen, className }: ToolResultProps) {
  const [open, setOpen] = useState(defaultOpen ?? status !== 'success');
  const lastStatus = useRef(status);
  useEffect(() => {
    if (lastStatus.current === status) return;
    lastStatus.current = status;
    setOpen(status !== 'success');
  }, [status]);
  const label = { running: '运行中', success: '已完成', error: '失败' }[status];
  return <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className={cn('group w-full overflow-hidden rounded-xl border border-border bg-muted/20 text-sm', className)}>
    <summary className="flex cursor-pointer list-none items-center gap-2.5 p-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
      <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground group-open:rotate-90 motion-safe:transition-transform" />
      <Terminal aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /><span className="min-w-0 flex-1 truncate font-medium">{title}</span>
      <Badge tone={status === 'success' ? 'success' : status === 'error' ? 'error' : 'neutral'}><span aria-live="polite" className="inline-flex items-center gap-1.5">
        {status === 'running' ? <LoaderCircle aria-hidden="true" className="size-3 motion-safe:animate-spin" /> : status === 'success' ? <Check aria-hidden="true" className="size-3" /> : <CircleAlert aria-hidden="true" className="size-3" />}{label}
      </span></Badge>
    </summary>
    <pre className="max-h-64 overflow-auto border-t border-border bg-background/70 p-4 font-mono text-xs leading-6 whitespace-pre-wrap break-words">{output || '等待输出…'}</pre>
  </details>;
}
