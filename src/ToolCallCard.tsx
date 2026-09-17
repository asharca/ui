'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Bot, Box, Brain, CheckCircle2, ChevronRight, CircleAlert, CirclePause, Globe2, Loader2, Plug, Wrench } from 'lucide-react';
import { Button } from './Controls.js';
import { CopyButton } from './Forms.js';

export type ToolCallState = 'pending' | 'running' | 'awaiting-approval' | 'completed' | 'failed' | 'rejected' | 'cancelled';
export type ToolKind = 'web' | 'skill' | 'sandbox' | 'mcp' | 'subagent' | 'tool';
export type ToolPresentation = { label?: string; kind?: ToolKind; icon?: ReactNode; description?: string };
export type ToolCallCardLabels = {
  pending: string; running: string; awaitingApproval: string; completed: string;
  failed: string; rejected: string; cancelled: string; input: string; output: string;
  allow: string; reject: string; approvalDescription: string; approvalFailed: string;
  approvalSubmitted: string; showMore: string; showLess: string; copy: string;
};
export const toolCallCardDefaultLabels: ToolCallCardLabels = {
  pending: 'Pending', running: 'Running', awaitingApproval: 'Awaiting approval', completed: 'Completed',
  failed: 'Failed', rejected: 'Rejected', cancelled: 'Cancelled', input: 'Input', output: 'Output',
  allow: 'Allow', reject: 'Reject', approvalDescription: 'This tool needs your approval before it can run.',
  approvalFailed: 'Approval could not be submitted. Please retry.', approvalSubmitted: 'Approval submitted',
  showMore: 'Show full result', showLess: 'Show preview', copy: 'Copy visible content',
};
export type ToolCallCardProps = {
  name: string; state: ToolCallState; input?: unknown; output?: unknown;
  presentation?: ToolPresentation; labels?: Partial<ToolCallCardLabels>;
  onApprove?: (approved: boolean) => void | Promise<void>;
  previewChars?: number; className?: string; children?: ReactNode;
};

export function inferToolKind(name: string): ToolKind {
  if (/(?:^|__)(?:brave|web|firecrawl|fetch|search|crawl|scrape|extract|browser)/i.test(name)) return 'web';
  if (/skill/i.test(name)) return 'skill';
  if (/sandbox|terminal|shell|process|filesystem/i.test(name)) return 'sandbox';
  if (/sub.?agent|delegate/i.test(name)) return 'subagent';
  return name.includes('__') ? 'mcp' : 'tool';
}

// Bound traversal as well as the rendered string. A collapsed card does not
// serialize output at all; full serialization is explicitly requested by users.
export function previewToolValue(value: unknown, limit = 6000): string {
  const cap = Number.isFinite(limit) ? Math.max(128, Math.floor(limit)) : 6000;
  const seen = new WeakSet<object>();
  let budget = 200;
  const bounded = (item: unknown, depth: number): unknown => {
    if (--budget < 0 || depth > 6) return '[truncated]';
    if (typeof item === 'string') return item.length > cap ? `${item.slice(0, cap)}…` : item;
    if (typeof item === 'bigint') return String(item);
    if (!item || typeof item !== 'object') return item;
    if (seen.has(item)) return '[circular]';
    seen.add(item);
    if (Array.isArray(item)) {
      const result = item.slice(0, 40).map((entry) => bounded(entry, depth + 1));
      if (item.length > 40) result.push(`[${item.length - 40} more items]`);
      return result;
    }
    const result: Record<string, unknown> = Object.create(null);
    let count = 0;
    for (const key in item) {
      if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
      if (count++ >= 40 || budget <= 0) { result['…'] = '[truncated]'; break; }
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      result[key] = descriptor && 'value' in descriptor ? bounded(descriptor.value, depth + 1) : '[accessor]';
    }
    return result;
  };
  try {
    const text = typeof value === 'string' ? value : JSON.stringify(bounded(value, 0), null, 2) ?? String(value);
    return text.length > cap ? `${text.slice(0, cap)}\n… [truncated]` : text;
  } catch { return '[unserializable result]'; }
}

function ToolValue({ value, label, copy, previewChars }: { value: unknown; label: string; copy: ToolCallCardLabels; previewChars: number }) {
  const [full, setFull] = useState(false);
  const preview = useMemo(() => previewToolValue(value, previewChars), [value, previewChars]);
  const text = useMemo(() => {
    if (!full) return preview;
    try { return typeof value === 'string' ? value : JSON.stringify(value, null, 2) ?? String(value); }
    catch { return preview; }
  }, [value, full, preview]);
  return <section>
    <header><strong>{label}</strong><CopyButton text={text} label={copy.copy} iconOnly /></header>
    <pre>{text}</pre>
    <Button size="sm" variant="ghost" aria-expanded={full} onClick={() => setFull(!full)}>{full ? copy.showLess : copy.showMore}</Button>
  </section>;
}

export function ToolCallCard({ name, state, input, output, presentation, labels, onApprove, previewChars = 6000, className, children }: ToolCallCardProps) {
  const copy = { ...toolCallCardDefaultLabels, ...labels };
  const [manualOpen, setManualOpen] = useState<boolean | undefined>();
  const [pending, setPending] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (state !== 'awaiting-approval') { setSubmitted(false); setError(false); }
  }, [state]);
  const open = manualOpen ?? (state === 'running' || state === 'awaiting-approval' || state === 'failed');
  const kind = presentation?.kind ?? inferToolKind(name);
  const Icon = { web: Globe2, skill: Brain, sandbox: Box, mcp: Plug, subagent: Bot, tool: Wrench }[kind];
  const StateIcon = state === 'running' ? Loader2 : state === 'completed' ? CheckCircle2 : state === 'cancelled' || state === 'rejected' ? CirclePause : CircleAlert;
  const statusLabel = state === 'awaiting-approval' ? copy.awaitingApproval : copy[state];
  async function approve(approved: boolean) {
    if (!onApprove || state !== 'awaiting-approval' || lock.current || submitted) return;
    lock.current = true;
    setPending(approved); setError(false);
    try { await onApprove(approved); if (mounted.current) setSubmitted(true); }
    catch { if (mounted.current) setError(true); }
    finally { lock.current = false; if (mounted.current) setPending(null); }
  }
  return <details data-toolplane-ui="tool-call" data-state={state} className={`ui-tool-call ${className ?? ''}`} open={open}
    onToggle={(event) => { if (event.currentTarget.open !== open) setManualOpen(event.currentTarget.open); }}>
    <summary>
      <ChevronRight aria-hidden="true" className="ui-tool-call__chevron" />
      <span aria-hidden="true" className="ui-tool-call__icon">{presentation?.icon ?? <Icon />}</span>
      <span className="ui-tool-call__name"><strong>{presentation?.label ?? name}</strong><small>{kind === 'mcp' ? 'MCP' : kind}</small></span>
      <span className="ui-tool-call__state" role="status"><StateIcon aria-hidden="true" className={state === 'running' ? 'animate-spin' : ''} />{statusLabel}</span>
    </summary>
    {open && <div className="ui-tool-call__body">
      {presentation?.description && <p>{presentation.description}</p>}
      {input !== undefined && <ToolValue value={input} label={copy.input} copy={copy} previewChars={previewChars} />}
      {state === 'awaiting-approval' && <div className="ui-tool-call__approval">
        <p>{copy.approvalDescription}</p>
        <div>
          <Button size="sm" variant="primary" disabled={!onApprove || pending !== null || submitted} loading={pending === true} onClick={() => void approve(true)}>{copy.allow}</Button>
          <Button size="sm" disabled={!onApprove || pending !== null || submitted} loading={pending === false} onClick={() => void approve(false)}>{copy.reject}</Button>
        </div>
        {submitted && <p role="status">{copy.approvalSubmitted}</p>}
        {error && <p role="alert" className="ui-tool-call__error">{copy.approvalFailed}</p>}
      </div>}
      {output !== undefined && <ToolValue value={output} label={copy.output} copy={copy} previewChars={previewChars} />}
      {children}
    </div>}
  </details>;
}
