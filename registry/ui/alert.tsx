import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CircleCheck, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { cn } from './utils';

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> { title: ReactNode; tone?: 'info' | 'success' | 'warning' | 'danger'; actions?: ReactNode }
const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert };
export function Alert({ title, tone = 'info', actions, children, className, ...props }: AlertProps) {
  const Icon = icons[tone];
  return <div role={tone === 'danger' ? 'alert' : 'status'} {...props} className={cn('flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm', tone === 'danger' && 'border-destructive/30', className)}>
    <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0 text-muted-foreground', tone === 'danger' && 'text-destructive', tone === 'success' && 'text-emerald-600 dark:text-emerald-400', tone === 'warning' && 'text-amber-600 dark:text-amber-400')} />
    <div className="min-w-0 flex-1"><div className="font-medium leading-5">{title}</div>{children && <div className="mt-1.5 text-xs leading-6 text-muted-foreground">{children}</div>}{actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}</div>
  </div>;
}
