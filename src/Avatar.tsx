'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

export const Avatar = forwardRef<ComponentRef<typeof AvatarPrimitive.Root>, ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(
  function Avatar({ className, ...props }, ref) {
    return <AvatarPrimitive.Root {...props} ref={ref} data-toolplane-ui="avatar" className={`ui-avatar ${className ?? ''}`.trim()} />;
  },
);

export const AvatarImage = forwardRef<ComponentRef<typeof AvatarPrimitive.Image>, ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  function AvatarImage({ className, ...props }, ref) {
    return <AvatarPrimitive.Image {...props} ref={ref} className={`ui-avatar-image ${className ?? ''}`.trim()} />;
  },
);

export const AvatarFallback = forwardRef<ComponentRef<typeof AvatarPrimitive.Fallback>, ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  function AvatarFallback({ className, ...props }, ref) {
    return <AvatarPrimitive.Fallback {...props} ref={ref} className={`ui-avatar-fallback ${className ?? ''}`.trim()} />;
  },
);
