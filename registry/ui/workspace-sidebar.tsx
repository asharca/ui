'use client';
import { useRef, type ReactNode } from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IconButton } from './icon-button';
import { cn, focusRing } from './utils';

export interface WorkspaceSidebarItem { id: string; label: string; icon?: ReactNode; badge?: ReactNode; href?: string; disabled?: boolean }
export interface WorkspaceSidebarGroup { id: string; title?: string; items: WorkspaceSidebarItem[] }
export interface WorkspaceSidebarProps {
  groups: WorkspaceSidebarGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  title?: string;
  footer?: ReactNode;
  className?: string;
}
export function WorkspaceSidebar({ groups, activeId, onSelect, collapsed, onCollapsedChange, mobileOpen = false, onMobileOpenChange, title = '工作区', footer, className }: WorkspaceSidebarProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  function content(compact: boolean, mobile: boolean) {
    return <><header className="flex min-h-14 items-center justify-between gap-2 border-b border-border px-3">
      {!compact && <span className="truncate text-sm font-semibold">{title}</span>}
      {mobile ? <Primitive.Close asChild><IconButton label="关闭工作区导航" icon={<X />} /></Primitive.Close> : <IconButton label={compact ? '展开工作区侧栏' : '折叠工作区侧栏'} icon={compact ? <ChevronRight /> : <ChevronLeft />} onClick={() => onCollapsedChange(!compact)} />}
    </header><nav aria-label={title} className="min-h-0 flex-1 space-y-5 overflow-y-auto p-2.5">
      {groups.map((group) => <div key={group.id} className="grid gap-1">{group.title && <p className={cn('mb-1 px-2 text-[10px] text-muted-foreground', compact && 'sr-only')}>{group.title}</p>}
        {group.items.map((item) => {
          const cls = cn('flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground', focusRing, activeId === item.id && 'bg-muted text-foreground', compact && 'justify-center px-1', item.disabled && 'pointer-events-none opacity-40');
          const children = <><span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-4">{item.icon ?? <span className="size-1.5 rounded-full bg-current" />}</span><span className={cn('min-w-0 flex-1 truncate', compact && 'sr-only')}>{item.label}</span>{!compact && item.badge !== undefined && <span className="text-[10px] text-muted-foreground">{item.badge}</span>}</>;
          const choose = () => { onSelect?.(item.id); if (mobile) onMobileOpenChange?.(false); };
          return item.href && !item.disabled ? <a key={item.id} href={item.href} aria-current={activeId === item.id ? 'page' : undefined} title={compact ? item.label : undefined} className={cls} onClick={choose}>{children}</a>
            : <button key={item.id} type="button" disabled={item.disabled} aria-current={activeId === item.id ? 'page' : undefined} title={compact ? item.label : undefined} className={cls} onClick={choose}>{children}</button>;
        })}
      </div>)}
    </nav>{footer && <footer className={cn('shrink-0 border-t border-border p-3', compact && 'hidden')}>{footer}</footer>}</>;
  }
  return <><aside aria-label={`${title}侧栏`} className={cn('hidden h-full min-h-0 shrink-0 flex-col border-r border-border bg-background sm:flex motion-safe:transition-[width]', collapsed ? 'w-16' : 'w-56', className)}>{content(collapsed, false)}</aside>
    <Primitive.Root open={mobileOpen} onOpenChange={onMobileOpenChange}><Primitive.Portal><Primitive.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" /><Primitive.Content aria-describedby={undefined}
      onOpenAutoFocus={() => { returnFocus.current = document.activeElement as HTMLElement | null; }}
      onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}
      className="fixed inset-y-0 left-0 z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-r border-border bg-background text-foreground shadow-xl outline-none">
      <Primitive.Title className="sr-only">{title}导航</Primitive.Title>{content(false, true)}
    </Primitive.Content></Primitive.Portal></Primitive.Root>
  </>;
}
