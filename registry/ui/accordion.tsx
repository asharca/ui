'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { Accordion as Primitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn, focusRing } from './utils';

export const Accordion = Primitive.Root;
export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<typeof Primitive.Item>, 'title'> { title: ReactNode }
export const AccordionItem = forwardRef<ElementRef<typeof Primitive.Item>, AccordionItemProps>(function AccordionItem({ title, children, className, ...props }, ref) {
  return <Primitive.Item {...props} ref={ref} className={cn('border-b border-border last:border-0', className)}>
    <Primitive.Header><Primitive.Trigger className={cn('group flex w-full items-center justify-between gap-4 rounded-lg py-4 text-left text-sm font-medium hover:text-muted-foreground', focusRing)}>
      <span>{title}</span><ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground group-data-[state=open]:rotate-180 motion-safe:transition-transform motion-safe:duration-200" />
    </Primitive.Trigger></Primitive.Header>
    <Primitive.Content className="overflow-hidden text-sm leading-7 text-muted-foreground"><div className="pb-4">{children}</div></Primitive.Content>
  </Primitive.Item>;
});
