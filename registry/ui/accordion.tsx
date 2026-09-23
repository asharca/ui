'use client';

import { createContext, forwardRef, useContext, useState, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { Accordion as Primitive } from 'radix-ui';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn, disclosureTransition, fadeTransition, focusRing } from './utils';

const AccordionContext = createContext<string[] | null>(null);
export const Accordion = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(function Accordion(props, ref) {
  const [internal, setInternal] = useState<string | string[]>(props.defaultValue ?? (props.type === 'multiple' ? [] : ''));
  const current = props.value ?? internal;
  const openValues = Array.isArray(current) ? current : current ? [current] : [];
  // Keep the original discriminated single/multiple API and let Radix retain
  // roving focus, disabled items, orientation and collapsible semantics.
  const root = props.type === 'multiple'
    ? <Primitive.Root {...props} ref={ref} value={Array.isArray(current) ? current : []} onValueChange={(next) => {
      if (props.value === undefined) setInternal(next);
      props.onValueChange?.(next);
    }} />
    : <Primitive.Root {...props} ref={ref} value={typeof current === 'string' ? current : ''} onValueChange={(next) => {
      if (props.value === undefined) setInternal(next);
      props.onValueChange?.(next);
    }} />;
  return <AccordionContext.Provider value={openValues}>{root}</AccordionContext.Provider>;
});

function AccordionBody({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const present = useIsPresent();
  return <Primitive.Content forceMount asChild>
    <motion.div data-slot="accordion-content" inert={!present || undefined} aria-hidden={!present || undefined}
      initial={reduce ? false : { height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={reduce ? { duration: 0 } : { ...disclosureTransition, opacity: fadeTransition }}
      className="overflow-hidden text-sm leading-7 text-muted-foreground">
      <div className="pb-4 pr-8">{children}</div>
    </motion.div>
  </Primitive.Content>;
}

export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<typeof Primitive.Item>, 'title'> { title: ReactNode }
export const AccordionItem = forwardRef<ElementRef<typeof Primitive.Item>, AccordionItemProps>(function AccordionItem({ title, value, children, className, ...props }, ref) {
  const values = useContext(AccordionContext);
  if (!values) throw new Error('AccordionItem must be rendered inside Accordion.');
  const open = values.includes(value);
  return <Primitive.Item {...props} value={value} ref={ref} className={cn('border-b border-border/75 last:border-0', className)}>
    <Primitive.Header><Primitive.Trigger className={cn('group flex w-full items-center justify-between gap-4 rounded-lg py-4 text-left text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors hover:text-foreground/75', focusRing)}>
      <span className="min-w-0">{title}</span>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground group-hover:bg-muted motion-safe:transition-colors">
        <ChevronDown aria-hidden="true" className="size-3.5 group-data-[state=open]:rotate-180 motion-safe:transition-transform motion-safe:duration-200" />
      </span>
    </Primitive.Trigger></Primitive.Header>
    <AnimatePresence initial={false}>{open && <AccordionBody key="content">{children}</AccordionBody>}</AnimatePresence>
  </Primitive.Item>;
});
