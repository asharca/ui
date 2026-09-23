'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Radio } from './radio';
import { cn } from './utils';

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
      <legend className="mb-3 font-medium leading-5">{label}</legend>
      {options.map((option) => (
        <Radio key={option.value} name={name} value={option.value} label={option.label} description={option.description}
          disabled={option.disabled} required={required}
          {...(value !== undefined ? { checked: value === option.value } : { defaultChecked: defaultValue === option.value })}
          onChange={() => onValueChange?.(option.value)} />
      ))}
    </fieldset>
  );
});
