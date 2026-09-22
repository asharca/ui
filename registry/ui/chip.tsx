'use client';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn, focusRing } from './utils';
export interface ChipProps extends ComponentPropsWithoutRef<'button'> { active?: boolean }
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip({ active = false, className, ...props }, ref) {
  return <button type="button" {...props} ref={ref} aria-pressed={active} className={cn('inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-colors', focusRing, active && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90', className)} />;
});
