'use client';

import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, Copy, Loader2 } from 'lucide-react';

export type SubmitButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  pendingLabel?: string; savedLabel?: string; flash?: boolean;
  error?: string | boolean | null; ariaLabel?: string;
};
export function SubmitButton({ children = 'Save', className = 'ui-button-primary', pendingLabel = 'Saving…', savedLabel = 'Saved', flash = true, error, disabled = false, ariaLabel, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);
  useEffect(() => {
    const completed = wasPending.current && !pending;
    wasPending.current = pending;
    if (pending || error || !flash) { setSaved(false); return; }
    if (completed) { setSaved(true); const timer = setTimeout(() => setSaved(false), 1600); return () => clearTimeout(timer); }
  }, [pending, error, flash]);
  return <button {...props} type="submit" disabled={pending || disabled} aria-busy={pending || undefined} aria-label={ariaLabel ?? props['aria-label']}
    data-toolplane-ui="submit-button" className={`${className} disabled:opacity-70 ${pending ? 'cursor-wait' : 'disabled:cursor-not-allowed'}`}>
    <span className="inline-flex items-center gap-1.5">{pending ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : saved ? <Check aria-hidden="true" className="size-3.5" /> : null}{pending ? pendingLabel : saved ? savedLabel : children}</span>
  </button>;
}
export type ConfirmSubmitButtonProps = {
  triggerLabel: ReactNode; triggerAriaLabel?: string; triggerTitle?: string;
  confirmLabel: ReactNode; cancelLabel: ReactNode; prompt: ReactNode;
  pendingLabel?: ReactNode; disabled?: boolean; className?: string;
  triggerClassName?: string; confirmClassName?: string; cancelClassName?: string; promptClassName?: string;
};
export function ConfirmSubmitButton({ triggerLabel, triggerAriaLabel, triggerTitle, confirmLabel, cancelLabel, prompt, pendingLabel, disabled = false,
  className = 'items-center', triggerClassName = 'ui-button-secondary', confirmClassName = 'ui-button-primary', cancelClassName = 'ui-button-ghost', promptClassName = 'text-sm text-muted-foreground' }: ConfirmSubmitButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending } = useFormStatus();
  const promptId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null); const confirmRef = useRef<HTMLButtonElement>(null);
  const restore = useRef(false); const wasPending = useRef(false);
  useEffect(() => { if (confirming) confirmRef.current?.focus(); else if (restore.current) { restore.current = false; triggerRef.current?.focus(); } }, [confirming]);
  useEffect(() => { if (pending) { wasPending.current = true; return; } if (wasPending.current) { wasPending.current = false; restore.current = true; setConfirming(false); } }, [pending]);
  const cancel = () => { if (!pending) { restore.current = true; setConfirming(false); } };
  return <span data-toolplane-ui="confirm-submit-button" className={`inline-flex flex-wrap gap-2 ${className}`} onKeyDown={(event) => { if (event.key === 'Escape' && confirming && !pending) { event.preventDefault(); event.stopPropagation(); cancel(); } }}>
    {confirming ? <>
      <span id={promptId} className={promptClassName}>{prompt}</span>
      <button ref={confirmRef} type="submit" disabled={disabled || pending} aria-busy={pending || undefined} aria-describedby={promptId} data-toolplane-ui="confirm-submit-confirm" className={`${confirmClassName} disabled:opacity-70`}>{pending ? pendingLabel ?? confirmLabel : confirmLabel}</button>
      <button type="button" disabled={disabled || pending} onClick={cancel} data-toolplane-ui="confirm-submit-cancel" className={`${cancelClassName} disabled:opacity-70`}>{cancelLabel}</button>
    </> : <button ref={triggerRef} type="button" disabled={disabled || pending} onClick={() => setConfirming(true)} aria-label={triggerAriaLabel} title={triggerTitle} data-toolplane-ui="confirm-submit-trigger" className={`${triggerClassName} disabled:opacity-60`}>{triggerLabel}</button>}
  </span>;
}

async function writeText(text: string): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    if (navigator.clipboard?.writeText) {
      await Promise.race([navigator.clipboard.writeText(text), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Clipboard timeout')), 2000); })]);
      return true;
    }
  } catch { /* Fall back for unavailable permissions or non-secure contexts. */ }
  finally { if (timer) clearTimeout(timer); }
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const inputSelection = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
    ? { element: active, start: active.selectionStart, end: active.selectionEnd, direction: active.selectionDirection } : null;
  const selection = window.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  const textarea = document.createElement('textarea');
  textarea.value = text; textarea.readOnly = true; textarea.setAttribute('aria-hidden', 'true');
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
  try {
    (active?.closest('[role="dialog"]') ?? document.body).appendChild(textarea);
    textarea.focus(); textarea.select(); textarea.setSelectionRange(0, text.length);
    return typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch { return false; }
  finally {
    textarea.remove(); active?.focus({ preventScroll: true });
    try {
      if (inputSelection?.start != null && inputSelection.end != null) inputSelection.element.setSelectionRange(inputSelection.start, inputSelection.end, inputSelection.direction ?? undefined);
      else if (selection) { selection.removeAllRanges(); for (const range of ranges) selection.addRange(range); }
    } catch { /* The host may have removed the previous selection. */ }
  }
}
export type CopyButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'onClick'> & {
  text: string; label?: string; copiedLabel?: string; failedLabel?: string;
  copyingLabel?: string; iconOnly?: boolean; onCopyResult?: (success: boolean) => void;
};
export function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied', failedLabel = 'Copy failed', copyingLabel = 'Copying…', className, iconOnly = false, disabled, onCopyResult, ...props }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null); const mounted = useRef(false); const inFlight = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (reset.current) clearTimeout(reset.current); }; }, []);
  const statusLabel = status === 'copied' ? copiedLabel : status === 'failed' ? failedLabel : status === 'copying' ? copyingLabel : label;
  async function copy() {
    if (disabled || inFlight.current) return;
    inFlight.current = true; if (reset.current) clearTimeout(reset.current); setStatus('copying');
    const success = await writeText(text);
    inFlight.current = false;
    if (!mounted.current) return;
    setStatus(success ? 'copied' : 'failed'); onCopyResult?.(success);
    reset.current = setTimeout(() => setStatus('idle'), 1500);
  }
  return <button {...props} type="button" onClick={() => { void copy(); }} disabled={disabled || status === 'copying'} aria-busy={status === 'copying' || undefined}
    aria-label={iconOnly ? statusLabel : props['aria-label']} title={iconOnly ? statusLabel : props.title} data-toolplane-ui="copy-button" className={`ui-copy-button ${className ?? 'ui-button-secondary ui-button-sm'}`}>
    {status === 'copied' ? <Check aria-hidden="true" className="size-4" /> : status === 'copying' ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Copy aria-hidden="true" className="size-4" />}
    <span className={iconOnly ? 'sr-only' : undefined} role="status" aria-live="polite">{statusLabel}</span>
  </button>;
}
