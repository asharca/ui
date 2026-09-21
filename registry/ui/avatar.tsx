'use client';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { Avatar as Primitive } from 'radix-ui';
import { cn } from './utils';
export const Avatar = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(function Avatar({ className, ...props }, ref) {
  return <Primitive.Root {...props} ref={ref} className={cn('relative inline-flex size-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted', className)} />;
});
export const AvatarImage = forwardRef<ElementRef<typeof Primitive.Image>, ComponentPropsWithoutRef<typeof Primitive.Image>>(function AvatarImage({ className, ...props }, ref) {
  return <Primitive.Image {...props} ref={ref} className={cn('size-full object-cover', className)} />;
});
export const AvatarFallback = forwardRef<ElementRef<typeof Primitive.Fallback>, ComponentPropsWithoutRef<typeof Primitive.Fallback>>(function AvatarFallback({ className, ...props }, ref) {
  return <Primitive.Fallback {...props} ref={ref} className={cn('grid size-full place-items-center text-xs font-medium text-muted-foreground', className)} />;
});
