'use client';

import { createContext, forwardRef, useContext, useId, useState, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { Tabs as Primitive } from 'radix-ui';
import { motion, useReducedMotion } from 'motion/react';
import { cn, focusRing, layoutSpring } from './utils';

const TabContext = createContext<{ id: string; value?: string } | null>(null);
type TabsVariant = 'soft' | 'underline' | 'pill';
const ListContext = createContext<{ id: string; variant: TabsVariant } | null>(null);

export const Tabs = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(function Tabs(
  { value, defaultValue, onValueChange, ...props }, ref,
) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return <TabContext.Provider value={{ id, value: current }}><Primitive.Root {...props} ref={ref} value={current}
    onValueChange={(next) => { if (value === undefined) setInternal(next); onValueChange?.(next); }} /></TabContext.Provider>;
});

export interface TabsListProps extends ComponentPropsWithoutRef<typeof Primitive.List> {
  /** Existing inset surface, quiet underline, or rounded pills. */
  variant?: TabsVariant;
}
const listStyles = {
  soft: 'gap-1 rounded-xl bg-muted/75 p-1',
  underline: 'gap-4 rounded-none border-b border-border bg-transparent p-0',
  pill: 'gap-1 rounded-full border border-border/70 bg-muted/40 p-1',
};
export const TabsList = forwardRef<ElementRef<typeof Primitive.List>, TabsListProps>(function TabsList({ className, variant = 'soft', ...props }, ref) {
  const id = useId();
  return <ListContext.Provider value={{ id, variant }}>
    <Primitive.List {...props} ref={ref} data-variant={variant}
      className={cn('inline-flex max-w-full items-center', listStyles[variant], className)} />
  </ListContext.Provider>;
});

export const TabsTrigger = forwardRef<ElementRef<typeof Primitive.Trigger>, ComponentPropsWithoutRef<typeof Primitive.Trigger>>(function TabsTrigger({ className, value, children, ...props }, ref) {
  const context = useContext(TabContext);
  const list = useContext(ListContext);
  const reduce = useReducedMotion();
  if (!context) throw new Error('TabsTrigger must be rendered inside Tabs.');
  const variant = list?.variant ?? 'soft';
  return <Primitive.Trigger {...props} ref={ref} value={value}
    className={cn('relative isolate inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground disabled:pointer-events-none disabled:opacity-45 motion-safe:transition-colors motion-safe:duration-150', variant === 'underline' && 'h-10 rounded-none px-1', variant === 'pill' && 'rounded-full', focusRing, className)}>
    {context.value === value && <motion.span aria-hidden="true" data-slot="tab-indicator" initial={false}
      layoutId={reduce ? undefined : `tab-${context.id}-${list?.id ?? 'default'}`}
      transition={reduce ? { duration: 0 } : layoutSpring}
      className={cn('pointer-events-none absolute -z-10', variant === 'underline' ? 'inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-foreground' : 'inset-0 rounded-lg bg-background shadow-xs ring-1 ring-border/50', variant === 'pill' && 'rounded-full')} />}
    {children}
  </Primitive.Trigger>;
});

export const TabsContent = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(function TabsContent({ className, ...props }, ref) {
  return <Primitive.Content {...props} ref={ref} className={cn('mt-4 min-w-0 rounded-xl text-sm leading-6', focusRing, className)} />;
});
