'use client';
import { forwardRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Check } from 'lucide-react';
import { Button, type ButtonProps } from './button';

export interface SubmitButtonProps extends ButtonProps {
  pending?: boolean;
  saved?: boolean;
  error?: boolean | string;
  pendingLabel?: string;
  savedLabel?: string;
}
export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(function SubmitButton(
  { pending, saved = false, error = false, pendingLabel = '保存中…', savedLabel = '已保存', children = '保存', disabled, ...props }, ref,
) {
  const status = useFormStatus();
  const busy = pending ?? status.pending;
  return <Button {...props} ref={ref} type="submit" loading={busy} disabled={disabled || busy}>
    {!busy && saved && !error && <Check aria-hidden="true" className="size-4" />}
    {busy ? pendingLabel : saved && !error ? savedLabel : children}
  </Button>;
});
