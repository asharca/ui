'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<ComponentRef<typeof AccordionPrimitive.Item>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  function AccordionItem({ className, ...props }, ref) {
    return <AccordionPrimitive.Item {...props} ref={ref} data-toolplane-ui="accordion-item" className={`ui-accordion-item ${className ?? ''}`.trim()} />;
  },
);

export const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  function AccordionTrigger({ children, className, ...props }, ref) {
    return <AccordionPrimitive.Header className="ui-accordion-header">
      <AccordionPrimitive.Trigger {...props} ref={ref} className={`ui-accordion-trigger ${className ?? ''}`.trim()}>
        {children}<ChevronDown aria-hidden="true" className="ui-accordion-chevron" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>;
  },
);

export const AccordionContent = forwardRef<ComponentRef<typeof AccordionPrimitive.Content>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  function AccordionContent({ className, ...props }, ref) {
    return <AccordionPrimitive.Content {...props} ref={ref} className={`ui-accordion-content ${className ?? ''}`.trim()} />;
  },
);
