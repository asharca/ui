import { Layers3 } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

export type ToolPlaneLogoProps = ComponentPropsWithoutRef<'span'> & {
  svgSize?: number;
  wordmarkClass?: string;
  hideWordmarkOnMobile?: boolean;
  showWordmark?: boolean;
};
export function ToolPlaneLogo({ svgSize = 28, wordmarkClass = 'text-2xl', hideWordmarkOnMobile = false, showWordmark = true, className, ...props }: ToolPlaneLogoProps) {
  const size = Number.isFinite(svgSize) && svgSize > 0 ? svgSize : 28;
  return <span {...props} data-toolplane-ui="logo" className={`inline-flex items-center gap-2 ${className ?? ''}`.trim()}>
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand ring-1 ring-inset ring-brand/15 transition-colors group-hover:bg-brand group-hover:text-brand-foreground" style={{ width: size, height: size }}>
      <Layers3 size={Math.round(size * .57)} strokeWidth={1.9} />
    </span>
    {showWordmark && <span className={`${hideWordmarkOnMobile ? 'hidden sm:inline' : 'inline'} whitespace-nowrap font-sans font-semibold text-foreground ${wordmarkClass}`}>Tool<span className="font-medium text-muted-foreground">Plane</span></span>}
  </span>;
}
