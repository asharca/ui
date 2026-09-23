'use client';

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn, focusRing } from './utils';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  wrapperClassName?: string;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, wrapperClassName, className, id: suppliedId, ...props }, ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => { if (input.current) input.current.indeterminate = indeterminate; }, [indeterminate]);
  const describedBy = [props['aria-describedby'], description && `${id}-description`].filter(Boolean).join(' ') || undefined;
  const labelledBy = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : `${id}-label`);
  return (
    <label htmlFor={id} className={cn('grid cursor-pointer grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-x-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', wrapperClassName)}>
      <span className="relative mt-[3px] inline-grid size-[1.125rem] place-items-center">
        <input {...props} id={id} ref={input} type="checkbox" aria-labelledby={labelledBy} aria-describedby={describedBy}
          className={cn('peer m-0 size-[1.125rem] appearance-none rounded-[5px] border border-border bg-background shadow-xs enabled:hover:border-foreground/40 checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-150 forced-colors:appearance-auto', focusRing, className)} />
        {/* Native :checked remains the source of truth, including form.reset(). */}
        <svg aria-hidden="true" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          className="pointer-events-none absolute size-[1.125rem] scale-75 text-primary-foreground opacity-0 peer-checked:scale-100 peer-checked:opacity-100 peer-checked:[&_path]:[stroke-dashoffset:0] peer-indeterminate:scale-75 peer-indeterminate:opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-150 forced-colors:hidden">
          <path d="m4.5 9 3 3 6-6" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-200 motion-safe:ease-out" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
          className="pointer-events-none absolute size-[1.125rem] scale-75 text-primary-foreground opacity-0 peer-indeterminate:scale-100 peer-indeterminate:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-150 forced-colors:hidden">
          <path d="M5 9h8" />
        </svg>
      </span>
      <span className="min-w-0 leading-6"><span id={`${id}-label`} className="font-medium">{label}</span>{description && <span id={`${id}-description`} className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>}</span>
    </label>
  );
});
