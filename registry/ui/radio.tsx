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
  const generated = useId(); const id = suppliedId ?? generated;
  return <label htmlFor={id} className={cn('grid cursor-pointer grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', wrapperClassName)}>
    <input {...props} ref={ref} id={id} type="radio" aria-describedby={[props['aria-describedby'], description && `${id}-help`].filter(Boolean).join(' ') || undefined}
      className={cn('mt-1 size-[1.125rem] appearance-none rounded-full border border-border bg-background checked:border-[5px] checked:border-primary motion-safe:transition-[border-width,border-color]', focusRing, className)} />
    <span className="min-w-0 leading-6"><span className="font-medium">{label}</span>{description && <span id={`${id}-help`} className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>}</span>
  </label>;
});
