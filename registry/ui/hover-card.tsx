'use client';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { HoverCard as Primitive } from 'radix-ui';
import { cn } from './utils';
export const HoverCard = Primitive.Root;
export const HoverCardTrigger = Primitive.Trigger;
export const HoverCardContent = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(function HoverCardContent({ className, sideOffset = 8, ...props }, ref) {
  return <Primitive.Portal><Primitive.Content {...props} ref={ref} sideOffset={sideOffset} collisionPadding={12} className={cn('z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg', className)} /></Primitive.Portal>;
});
