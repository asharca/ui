'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';
export interface PaginationProps { page: number; pageCount: number; onPageChange: (page: number) => void; disabled?: boolean; className?: string }
export function Pagination({ page, pageCount, onPageChange, disabled, className }: PaginationProps) {
  const total = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
  const current = total ? Math.max(1, Math.min(total, Number.isFinite(page) ? Math.floor(page) : 1)) : 0;
  return <nav aria-label="分页" className={cn('flex flex-wrap items-center justify-between gap-3 text-xs', className)}>
    <span aria-live="polite" className="text-muted-foreground">第 {current} / {total} 页</span>
    <div className="flex gap-1.5"><Button variant="outline" size="sm" disabled={disabled || current <= 1} onClick={() => onPageChange(current - 1)} aria-label="上一页"><ChevronLeft aria-hidden="true" className="size-3.5" />上一页</Button><Button variant="outline" size="sm" disabled={disabled || current >= total} onClick={() => onPageChange(current + 1)} aria-label="下一页">下一页<ChevronRight aria-hidden="true" className="size-3.5" /></Button></div>
  </nav>;
}
