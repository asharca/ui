import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn, focusRing } from './utils';

export interface NavigationTabItem { id: string; label: ReactNode; href: string; disabled?: boolean }
export interface NavigationTabsProps extends ComponentPropsWithoutRef<'nav'> { items: NavigationTabItem[]; activeId: string }
export function NavigationTabs({ items, activeId, className, ...props }: NavigationTabsProps) {
  return <nav aria-label="页面导航" {...props} className={cn('max-w-full overflow-x-auto border-b border-border', className)}><div className="flex min-w-max gap-5">
    {items.map((item) => item.disabled ? <span key={item.id} aria-disabled="true" className="border-b-2 border-transparent px-1 py-3 text-sm text-muted-foreground opacity-40">{item.label}</span> : <a key={item.id} href={item.href} aria-current={activeId === item.id ? 'page' : undefined} className={cn('border-b-2 border-transparent px-1 py-3 text-sm text-muted-foreground hover:text-foreground', focusRing, activeId === item.id && 'border-primary text-foreground')}>{item.label}</a>)}
  </div></nav>;
}
