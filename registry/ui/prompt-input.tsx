'use client';

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit: (value: string) => void | Promise<void>;
  busy?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  footer?: ReactNode;
  className?: string;
}
export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  { value, defaultValue = '', onValueChange, onSubmit, busy = false, onStop, disabled = false, label = '消息', placeholder = '描述你想做的事情…', footer, className }, ref,
) {
  const id = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const submitting = useRef(false);
  const mounted = useRef(true);
  const [internal, setInternal] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const draft = value ?? internal;
  const latest = useRef(draft);
  useImperativeHandle(ref, () => textarea.current!, []);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    latest.current = draft;
    const element = textarea.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(160, Math.max(56, element.scrollHeight))}px`;
  }, [draft]);
  function update(next: string) { setInternal(next); onValueChange?.(next); }
  async function send() {
    if (submitting.current || busy || disabled || !draft.trim()) return;
    const snapshot = draft;
    submitting.current = true;
    setPending(true); setError('');
    try {
      await onSubmit(snapshot.trim());
      if (mounted.current && latest.current === snapshot) update('');
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : '发送失败，请重试。');
    } finally {
      submitting.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return <form aria-label="消息输入框" onSubmit={(event) => { event.preventDefault(); void send(); }} className={cn('w-full rounded-2xl border border-border bg-background p-3 shadow-sm focus-within:ring-2 focus-within:ring-ring/35', className)}>
    <label htmlFor={id} className="sr-only">{label}</label>
    <textarea id={id} ref={textarea} value={draft} disabled={disabled || pending} rows={2} placeholder={placeholder}
      aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)}
      onChange={(event) => update(event.target.value)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
        event.preventDefault(); event.currentTarget.form?.requestSubmit();
      }}
      className="block max-h-40 min-h-14 w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50" />
    <div className="mt-2 flex items-center justify-between gap-3">
      <div className="min-w-0 text-xs text-muted-foreground">{footer ?? 'Shift + Enter 换行'}</div>
      {busy ? <Button size="icon" aria-label="停止生成" disabled={disabled || !onStop} onClick={onStop}><Square className="size-3.5 fill-current" /></Button>
        : <Button type="submit" size="icon" aria-label="发送消息" loading={pending} disabled={disabled || !draft.trim()}>{!pending && <ArrowUp className="size-4" />}</Button>}
    </div>
    {error && <p id={`${id}-error`} role="alert" className="mt-2 px-1 text-xs leading-5 text-destructive">{error}</p>}
  </form>;
});
