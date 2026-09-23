'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { Switch as Primitive } from 'radix-ui';
import { motion, useReducedMotion } from 'motion/react';
import { cn, focusRing, layoutSpring } from './utils';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof Primitive.Root> {
  label: ReactNode;
  description?: ReactNode;
}
export const Switch = forwardRef<ElementRef<typeof Primitive.Root>, SwitchProps>(function Switch(
  { label, description, className, id: suppliedId, disabled, ...props }, ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const reduce = useReducedMotion();
  const labelledBy = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : `${id}-label`);
  return (
    <div className={cn('flex items-start gap-3 text-sm', disabled && 'opacity-50')}>
      <Primitive.Root {...props} id={id} ref={ref} disabled={disabled} aria-labelledby={labelledBy}
        aria-describedby={[props['aria-describedby'], description && `${id}-description`].filter(Boolean).join(' ') || undefined}
        className={cn('group inline-flex h-6 w-10 shrink-0 items-center justify-start rounded-full border border-border bg-muted p-[3px] shadow-xs data-[state=checked]:justify-end data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-150', focusRing, className)}>
        {/* Radix owns checked/defaultChecked/form state. Logical flex alignment
            also handles RTL without a duplicated React state or pixel offset. */}
        <Primitive.Thumb asChild>
          <motion.span initial={false} layout={reduce ? false : 'position'} transition={reduce ? { duration: 0 } : layoutSpring}
            className="pointer-events-none block size-4 shrink-0 rounded-full bg-background shadow-sm" />
        </Primitive.Thumb>
      </Primitive.Root>
      <label htmlFor={id} className={cn('min-w-0 cursor-pointer leading-6', disabled && 'cursor-not-allowed')}><span id={`${id}-label`} className="font-medium">{label}</span>{description && <span id={`${id}-description`} className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>}</label>
    </div>
  );
});
