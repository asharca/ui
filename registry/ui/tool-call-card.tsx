'use client';
import { useState } from 'react';
import { ChevronRight, Terminal } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { ApprovalCard } from './approval-card';
import { cn } from './utils';

export type ToolCallState = 'pending' | 'running' | 'awaiting-approval' | 'completed' | 'failed' | 'rejected' | 'cancelled';
export interface ToolCallCardProps {
  title: string;
  state: ToolCallState;
  input?: unknown;
  output?: unknown;
  onApprove?: (approved: boolean) => void | Promise<void>;
  onCancel?: () => void;
  previewChars?: number;
  defaultOpen?: boolean;
  className?: string;
}
const labels: Record<ToolCallState, string> = { pending: '等待中', running: '运行中', 'awaiting-approval': '等待批准', completed: '已完成', failed: '失败', rejected: '已拒绝', cancelled: '已取消' };
/** Bounded traversal; no output is serialized while the disclosure is closed. */
export function toolPreview(value: unknown, limit = 6000): string {
  let budget = limit;
  const seen = new WeakSet<object>();
  function visit(item: unknown, depth: number): unknown {
    if (budget <= 0 || depth > 6) return '…';
    if (typeof item === 'string') { const result = item.slice(0, Math.max(0, budget)); budget -= result.length; return result.length < item.length ? `${result}…` : result; }
    if (item === null || typeof item !== 'object') { budget -= 10; return typeof item === 'bigint' ? String(item) : item; }
    if (seen.has(item)) return '[循环引用]';
    seen.add(item);
    if (Array.isArray(item)) { const values = []; for (let i = 0; i < Math.min(item.length, 80) && budget > 0; i++) values.push(visit(item[i], depth + 1)); if (values.length < item.length) values.push('…'); return values; }
    const result: Record<string, unknown> = {}; let count = 0;
    for (const key of Object.keys(item)) {
      if (++count > 80 || budget <= 0) { result['…'] = '更多内容'; break; }
      budget -= key.length;
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      result[key] = descriptor && 'value' in descriptor ? visit(descriptor.value, depth + 1) : '[访问器]';
    }
    return result;
  }
  try { if (typeof value === 'string') return value.length > limit ? `${value.slice(0, limit)}…` : value; return JSON.stringify(visit(value, 0), null, 2) ?? String(value); }
  catch { return '[无法显示此结果]'; }
}
export function ToolCallCard({ title, state, input, output, onApprove, onCancel, previewChars = 6000, defaultOpen = false, className }: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen); const [expanded, setExpanded] = useState(false);
  const limit = expanded ? 1000000 : Math.max(256, Number.isFinite(previewChars) ? previewChars : 6000);
  return <div className={cn('overflow-hidden rounded-xl border border-border bg-background text-sm', className)}>
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 p-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground group-open:rotate-90 motion-safe:transition-transform" /><Terminal aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0 flex-1 truncate font-medium">{title}</span><Badge tone={state === 'failed' ? 'error' : state === 'completed' ? 'success' : 'neutral'}>{labels[state]}</Badge></summary>
      {open && <div className="space-y-3 border-t border-border p-4">
        {input !== undefined && <div><h4 className="mb-1 text-xs text-muted-foreground">输入</h4><pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-xs leading-6">{toolPreview(input, limit)}</pre></div>}
        {output !== undefined && <div><h4 className="mb-1 text-xs text-muted-foreground">输出</h4><pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-xs leading-6">{toolPreview(output, limit)}</pre></div>}
        {!expanded && (input !== undefined || output !== undefined) && <Button size="sm" variant="ghost" onClick={() => setExpanded(true)}>展开更多结果</Button>}
      </div>}
    </details>
    {state === 'awaiting-approval' && (onApprove ? <div className="border-t border-border p-3"><ApprovalCard title="需要你的确认" description="是否允许这次工具操作？实际权限仍由应用校验。" onDecision={(decision) => onApprove(decision === 'approve')} /></div> : <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">等待应用提供审批操作。</p>)}
    {state === 'running' && onCancel && <div className="border-t border-border px-3 py-2"><Button size="sm" variant="outline" onClick={onCancel}>取消运行</Button></div>}
  </div>;
}
