'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn, focusRing } from './utils';

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  wrapperClassName?: string;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, id: suppliedId, className, wrapperClassName, ...props }, ref,
) {
  const generated = useId();
  const id = suppliedId ?? generated;
  const labelledBy = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : `${id}-label`);
  return <label htmlFor={id} className={cn('grid cursor-pointer grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-x-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', wrapperClassName)}>
    <span className="relative mt-[3px] inline-grid size-[1.125rem] place-items-center">
      <input {...props} ref={ref} id={id} type="radio" aria-labelledby={labelledBy}
        aria-describedby={[props['aria-describedby'], description && `${id}-help`].filter(Boolean).join(' ') || undefined}
        className={cn('peer m-0 size-[1.125rem] appearance-none rounded-full border border-border bg-background shadow-xs enabled:hover:border-foreground/40 checked:border-primary motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150 forced-colors:appearance-auto', focusRing, className)} />
      <span aria-hidden="true" className="pointer-events-none absolute size-2 scale-50 rounded-full bg-primary opacity-0 peer-checked:scale-100 peer-checked:opacity-100 motion-safe:transition-[scale,opacity] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(.16,1,.3,1)] forced-colors:hidden" />
    </span>
    <span className="min-w-0 leading-6"><span id={`${id}-label`} className="font-medium">{label}</span>{description && <span id={`${id}-help`} className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>}</span>
  </label>;
});
