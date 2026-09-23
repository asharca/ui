'use client';

import { forwardRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { LoaderCircle } from 'lucide-react';
import { cn, fadeTransition, focusRing, pressSpring } from './utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}
const variants = {
  default: 'border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  secondary: 'border-border/50 bg-muted text-foreground hover:bg-muted/75',
  outline: 'border-border bg-background text-foreground shadow-xs hover:border-foreground/20 hover:bg-muted/50',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-muted',
  danger: 'border-transparent bg-destructive text-white shadow-xs hover:bg-destructive/90',
};
const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-sm', icon: 'size-9 p-0' };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'md', loading = false, disabled, type = 'button', className, children, whileTap, transition, ...props }, ref,
) {
  const reduce = useReducedMotion();
  const blocked = disabled || loading;
  return (
    <motion.button
      {...props} ref={ref} type={type} disabled={blocked} aria-busy={loading || undefined}
      whileTap={reduce || blocked ? undefined : (whileTap ?? { scale: 0.98 })}
      transition={transition ?? pressSpring}
      className={cn('relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] border font-medium motion-safe:transition-[color,background-color,border-color,box-shadow] motion-safe:duration-150 disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0', focusRing, variants[variant], sizes[size], className)}
    >
      {/* Keep the original label in flow and in the accessibility tree. Loading
          must neither resize the button nor remove its accessible name. */}
      <motion.span data-slot="button-label" initial={false} animate={{ opacity: loading ? 0 : 1 }} transition={fadeTransition}
        className="inline-flex min-w-0 items-center justify-center gap-2">
        {children}
      </motion.span>
      <AnimatePresence initial={false}>
        {loading && <motion.span key="spinner" aria-hidden="true" data-slot="button-spinner"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fadeTransition}
          className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <LoaderCircle className="size-4 motion-safe:animate-spin" />
        </motion.span>}
      </AnimatePresence>
    </motion.button>
  );
});
