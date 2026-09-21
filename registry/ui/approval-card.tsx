'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export interface ApprovalCardProps {
  title: string;
  description: string;
  command?: string;
  onDecision: (decision: 'approve' | 'deny') => void | Promise<void>;
  className?: string;
}
export function ApprovalCard({ title, description, command, onDecision, className }: ApprovalCardProps) {
  const locked = useRef(false);
  const mounted = useRef(true);
  const [pending, setPending] = useState<'approve' | 'deny' | null>(null);
  const [decision, setDecision] = useState<'approve' | 'deny' | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function decide(next: 'approve' | 'deny') {
    if (locked.current || decision) return;
    locked.current = true; setPending(next); setError('');
    try { await onDecision(next); if (mounted.current) setDecision(next); }
    catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : '操作未完成，请重试。'); }
    finally { locked.current = false; if (mounted.current) setPending(null); }
  }
  return <section aria-label={title} className={cn('w-full rounded-2xl border border-border bg-background p-4 text-sm', className)}>
    <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted"><ShieldCheck className="size-4" aria-hidden="true" /></span>
      <div className="min-w-0"><h3 className="font-medium leading-6">{title}</h3><p className="mt-1 leading-6 text-muted-foreground">{description}</p></div>
    </div>
    {command && <pre className="mt-4 overflow-auto rounded-lg bg-muted/70 p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-words">{command}</pre>}
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      <span role="status" className="mr-auto text-xs text-muted-foreground">{decision === 'approve' ? '已允许' : decision === 'deny' ? '已拒绝' : '等待你的确认'}</span>
      <Button size="sm" variant="outline" disabled={Boolean(pending || decision)} loading={pending === 'deny'} onClick={() => void decide('deny')}>拒绝</Button>
      <Button size="sm" disabled={Boolean(pending || decision)} loading={pending === 'approve'} onClick={() => void decide('approve')}>允许执行</Button>
    </div>
    {error && <p role="alert" className="mt-3 text-xs leading-5 text-destructive">{error}</p>}
  </section>;
}
