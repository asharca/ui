'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn, focusRing } from './utils';

export interface RadioOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }
export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange'> {
  label: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { label, options, value, defaultValue, onValueChange, name: suppliedName, className, required, ...props }, ref,
) {
  const generatedName = useId();
  const name = suppliedName ?? generatedName;
  return (
    <fieldset {...props} ref={ref} className={cn('grid min-w-0 gap-3 text-sm', className)}>
      <legend className="mb-3 font-medium">{label}</legend>
      {options.map((option, index) => (
        <label key={option.value} className="grid cursor-pointer grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-x-3 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
          <input type="radio" name={name} value={option.value} disabled={option.disabled} required={required}
            {...(value !== undefined ? { checked: value === option.value } : { defaultChecked: defaultValue === option.value })}
            onChange={() => onValueChange?.(option.value)}
            aria-describedby={option.description ? `${generatedName}-${index}` : undefined}
            className={cn('mt-1 size-[1.125rem] shrink-0 appearance-none rounded-full border border-border bg-background checked:border-[5px] checked:border-primary motion-safe:transition-[border-width,border-color]', focusRing)} />
          <span className="min-w-0 leading-6"><span className="font-medium">{option.label}</span>{option.description && <span id={`${generatedName}-${index}`} className="mt-0.5 block text-xs leading-5 text-muted-foreground">{option.description}</span>}</span>
        </label>
      ))}
    </fieldset>
  );
});
