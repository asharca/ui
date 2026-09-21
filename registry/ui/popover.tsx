'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { Popover as Primitive } from 'radix-ui';
import { cn } from './utils';

export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverClose = Primitive.Close;
export const PopoverAnchor = Primitive.Anchor;
export const PopoverContent = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(function PopoverContent(
  { className, align = 'center', sideOffset = 8, collisionPadding = 16, ...props }, ref,
) {
  return <Primitive.Portal><Primitive.Content {...props} ref={ref} align={align} sideOffset={sideOffset} collisionPadding={collisionPadding}
    className={cn('z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg outline-none', className)} /></Primitive.Portal>;
});
