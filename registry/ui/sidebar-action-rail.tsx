'use client';
import type { ComponentPropsWithoutRef } from 'react';
import { IconButton, type IconButtonProps } from './icon-button';
import { cn } from './utils';
export interface SidebarActionRailProps extends ComponentPropsWithoutRef<'div'> { active?: boolean }
export function SidebarActionRail({ active, className, ...props }: SidebarActionRailProps) {
  return <div role="group" aria-label="条目操作" {...props} className={cn('flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 motion-safe:transition-opacity', active && 'sm:opacity-100', className)} />;
}
export function SidebarActionButton({ className, ...props }: IconButtonProps) { return <IconButton {...props} className={cn('size-7 rounded-lg', className)} />; }
