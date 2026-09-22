'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogTrigger } from './dialog';

export interface ConfirmSubmitButtonProps {
  title: string;
  prompt: string;
  onConfirm: () => void | Promise<void>;
  triggerLabel?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
}
export function ConfirmSubmitButton({ title, prompt, onConfirm, triggerLabel = '删除', confirmLabel = '确认删除', cancelLabel = '取消', disabled }: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function confirm() {
    if (locked.current) return;
    locked.current = true; setPending(true); setError('');
    try { await onConfirm(); if (mounted.current) setOpen(false); }
    catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : '操作失败，请重试。'); }
    finally { locked.current = false; if (mounted.current) setPending(false); }
  }
  return <Dialog open={open} onOpenChange={(next) => { if (!locked.current) { setOpen(next); setError(''); } }}>
    <DialogTrigger asChild><Button variant="outline" disabled={disabled}>{triggerLabel}</Button></DialogTrigger>
    <DialogContent title={title} description={prompt} onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }}>
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2"><Button variant="outline" disabled={pending} onClick={() => setOpen(false)}>{cancelLabel}</Button><Button variant="danger" loading={pending} onClick={() => void confirm()}>{confirmLabel}</Button></div>
    </DialogContent>
  </Dialog>;
}
