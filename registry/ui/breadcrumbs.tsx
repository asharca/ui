import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from './utils';
export interface BreadcrumbItem { id: string; label: ReactNode; href?: string }
export interface BreadcrumbsProps extends ComponentPropsWithoutRef<'nav'> { items: BreadcrumbItem[] }
export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return <nav aria-label="面包屑导航" {...props} className={cn('text-xs', className)}><ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
    {items.map((item, index) => <Fragment key={item.id}>{index > 0 && <li aria-hidden="true"><ChevronRight className="size-3" /></li>}<li className="min-w-0">{index === items.length - 1 ? <span aria-current="page" className="text-foreground">{item.label}</span> : item.href ? <a href={item.href} className="rounded hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{item.label}</a> : <span>{item.label}</span>}</li></Fragment>)}
  </ol></nav>;
}
