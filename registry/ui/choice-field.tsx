'use client';
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { cn } from './utils';

export interface ChoiceFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  type?: 'checkbox' | 'radio';
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  variant?: 'plain' | 'card';
  indeterminate?: boolean;
  wrapperClassName?: string;
}
export const ChoiceField = forwardRef<HTMLInputElement, ChoiceFieldProps>(function ChoiceField(
  { type = 'checkbox', variant = 'plain', error, description, indeterminate, wrapperClassName, ...props }, ref,
) {
  const id = useId();
  const shared = {
    ...props, ref, description,
    wrapperClassName: cn(variant === 'card' && 'rounded-xl border border-border bg-background p-3.5 has-[:checked]:border-primary has-[:checked]:bg-muted/40 motion-safe:transition-colors', wrapperClassName),
    'aria-invalid': error ? true : props['aria-invalid'],
    'aria-describedby': [props['aria-describedby'], error && `${id}-error`].filter(Boolean).join(' ') || undefined,
  };
  return <div className="grid gap-1.5">{type === 'radio' ? <Radio {...shared} /> : <Checkbox {...shared} indeterminate={indeterminate} />}
    {error && <p id={`${id}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
  </div>;
});
export interface ChoiceGroupProps extends ComponentPropsWithoutRef<'fieldset'> { label: ReactNode; description?: ReactNode }
export const ChoiceGroup = forwardRef<HTMLFieldSetElement, ChoiceGroupProps>(function ChoiceGroup({ label, description, children, className, ...props }, ref) {
  const id = useId();
  return <fieldset {...props} ref={ref} aria-describedby={[props['aria-describedby'], description && id].filter(Boolean).join(' ') || undefined} className={cn('grid min-w-0 gap-3', className)}>
    <legend className="mb-3 text-sm font-medium">{label}</legend>
    {description && <p id={id} className="text-xs leading-5 text-muted-foreground">{description}</p>}{children}
  </fieldset>;
});
