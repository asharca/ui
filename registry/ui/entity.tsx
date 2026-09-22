import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from './utils';
export interface EntityProps { title: string; description?: ReactNode; initials?: string; image?: string; meta?: ReactNode; mono?: boolean; className?: string }
export function Entity({ title, description, initials, image, meta, mono = false, className }: EntityProps) {
  return <div className={cn('flex min-w-0 items-center gap-3', className)}><Avatar><AvatarImage src={image} alt="" /><AvatarFallback>{Array.from(initials ?? title).slice(0, 2).join('')}</AvatarFallback></Avatar>
    <div className="min-w-0 flex-1"><p title={title} className={cn('truncate text-sm font-medium', mono && 'font-mono')}>{title}</p>{description && <div className="mt-0.5 truncate text-xs text-muted-foreground">{description}</div>}</div>{meta}
  </div>;
}
