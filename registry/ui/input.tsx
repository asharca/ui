'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn, fieldControl, focusRing } from './utils';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, description, error, id: suppliedId, className, wrapperClassName, ...props }, ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy = [props['aria-describedby'], description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('grid w-full gap-2 text-sm', wrapperClassName)}>
      <label htmlFor={id} className="font-medium leading-5">{label}</label>
      <input {...props} ref={ref} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy}
        className={cn(focusRing, fieldControl, 'h-10', className)} />
      {description && <p id={`${id}-description`} className="text-xs leading-5 text-muted-foreground">{description}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-xs leading-5 text-destructive">{error}</p>}
    </div>
  );
});
