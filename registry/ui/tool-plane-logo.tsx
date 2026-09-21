import { Layers } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from './utils';
export interface ToolPlaneLogoProps extends ComponentPropsWithoutRef<'span'> { svgSize?: number; showWordmark?: boolean; wordmarkClass?: string }
export function ToolPlaneLogo({ svgSize = 28, showWordmark = true, wordmarkClass, className, ...props }: ToolPlaneLogoProps) {
  const size = Number.isFinite(svgSize) && svgSize > 0 ? svgSize : 28;
  return <span {...props} aria-label={props['aria-label'] ?? (showWordmark ? undefined : 'ToolPlane')} className={cn('inline-flex items-center gap-2.5', className)}>
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-primary text-primary-foreground" style={{ width: size, height: size }}><Layers size={Math.round(size * 0.57)} strokeWidth={1.8} /></span>
    {showWordmark && <span className={cn('whitespace-nowrap text-lg font-semibold tracking-tight', wordmarkClass)}>Tool<span className="font-normal text-muted-foreground">Plane</span></span>}
  </span>;
}
