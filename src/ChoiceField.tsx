'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Checkbox, Radio } from './Controls.js';

function ids(...values: Array<string | undefined>) {
  return [...new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []))].join(' ') || undefined;
}

export type ChoiceFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'> & {
  type?: 'checkbox' | 'radio';
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  variant?: 'plain' | 'card';
  wrapperClassName?: string;
};

/** A native choice with a stable first-line alignment and an associated description.
 * Labels/descriptions must be phrasing content, without nested interactive elements.
 * className/ref apply to the input; wrapperClassName applies to the full label.
 */
export const ChoiceField = forwardRef<HTMLInputElement, ChoiceFieldProps>(function ChoiceField({
  type = 'checkbox', label, description, error, variant = 'plain', wrapperClassName,
  className, id: providedId, disabled, 'aria-label': ariaLabel,
  'aria-labelledby': labelledBy, 'aria-describedby': describedBy,
  'aria-invalid': invalid, ...props
}, ref) {
  const generatedId = useId();
  const id = providedId ?? `choice-${generatedId}`;
  const hasDescription = description != null && description !== false;
  const hasError = error != null && error !== false && error !== '';
  const Control = type === 'radio' ? Radio : Checkbox;
  return (
    <label
      htmlFor={id}
      data-toolplane-ui="choice-field"
      data-variant={variant}
      data-disabled={disabled || undefined}
      className={`ui-choice grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-3 text-sm leading-5 ${variant === 'card' ? 'rounded-lg border border-border p-4 has-[:checked]:border-ring has-[:checked]:bg-muted/40' : 'py-1'} ${wrapperClassName ?? ''}`.trim()}
    >
      <Control
        {...props}
        id={id}
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ?? (ariaLabel ? undefined : `${id}-label`)}
        aria-describedby={ids(describedBy, hasDescription ? `${id}-description` : undefined, hasError ? `${id}-error` : undefined)}
        aria-invalid={invalid ?? (hasError || undefined)}
        className={`m-0 mt-0.5 size-4 shrink-0 self-start ${className ?? ''}`.trim()}
      />
      <span className="ui-choice__content min-w-0">
        <span id={`${id}-label`} className="ui-choice__label block font-medium text-foreground">{label}</span>
        {hasDescription && <span id={`${id}-description`} className="ui-choice__description mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>}
        {hasError && <span id={`${id}-error`} className="ui-choice__error mt-1 block text-sm text-destructive-text" role="alert">{error}</span>}
      </span>
    </label>
  );
});

export type ChoiceGroupProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'title'> & {
  legend: ReactNode;
  description?: ReactNode;
};

/** Native fieldset semantics; disabled also disables every contained input. */
export const ChoiceGroup = forwardRef<HTMLFieldSetElement, ChoiceGroupProps>(function ChoiceGroup({
  legend, description, children, className, 'aria-describedby': describedBy, ...props
}, ref) {
  const descriptionId = useId();
  const hasDescription = description != null && description !== false;
  return <fieldset {...props} ref={ref} data-toolplane-ui="choice-group" aria-describedby={ids(describedBy, hasDescription ? descriptionId : undefined)} className={`ui-choice-group min-w-0 space-y-3 ${className ?? ''}`.trim()}>
    <legend className="ui-choice-group__legend mb-2 text-sm font-semibold text-foreground">{legend}</legend>
    {hasDescription && <p id={descriptionId} className="ui-choice-group__description text-sm leading-6 text-muted-foreground">{description}</p>}
    <div className="ui-choice-group__items grid gap-3">{children}</div>
  </fieldset>;
});
