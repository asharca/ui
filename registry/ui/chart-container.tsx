'use client';
import { createContext, useContext, type ComponentPropsWithoutRef, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from './utils';

export type ChartConfig = Record<string, { label: ReactNode; color?: string }>;
const ChartContext = createContext<ChartConfig>({});
export interface ChartContainerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> { config: ChartConfig; children: ReactElement; label: string }
export function ChartContainer({ config, children, label, className, style, ...props }: ChartContainerProps) {
  const variables = Object.fromEntries(Object.entries(config).filter(([key]) => /^[A-Za-z0-9_-]+$/.test(key)).map(([key, entry]) => [`--color-${key}`, entry.color ?? 'currentColor']));
  return <ChartContext.Provider value={config}><div {...props} role="group" aria-label={label} style={{ ...variables, ...style } as CSSProperties}
    className={cn('h-64 w-full min-w-0 text-xs text-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-tooltip-cursor]:fill-muted/50', className)}>
    <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 480, height: 256 }}>{children}</ResponsiveContainer>
  </div></ChartContext.Provider>;
}
export const ChartTooltip = Tooltip;
export const ChartLegend = Legend;
interface ChartValue { dataKey?: unknown; name?: unknown; value?: unknown; color?: string }
export function ChartTooltipContent({ active, payload, label, formatter }: { active?: boolean; payload?: readonly ChartValue[]; label?: ReactNode; formatter?: (value: unknown, key: string) => ReactNode }) {
  const config = useContext(ChartContext);
  if (!active || !payload?.length) return null;
  return <div className="min-w-32 rounded-xl border border-border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
    {label !== undefined && <p className="mb-2 font-medium">{label}</p>}
    {payload.map((item, index) => { const key = String(item.dataKey ?? item.name ?? index); return <div key={`${key}-${index}`} className="flex items-center justify-between gap-6 py-0.5">
      <span className="inline-flex items-center gap-2 text-muted-foreground"><span aria-hidden="true" className="size-2 rounded-sm" style={{ background: config[key]?.color ?? item.color ?? 'currentColor' }} />{config[key]?.label ?? key}</span>
      <span className="font-mono tabular-nums">{formatter ? formatter(item.value, key) : String(item.value ?? '—')}</span>
    </div>; })}
  </div>;
}
export function ChartLegendContent({ payload }: { payload?: readonly ChartValue[] }) {
  const config = useContext(ChartContext);
  return <div className="flex flex-wrap justify-center gap-4 pt-3 text-xs text-muted-foreground">{payload?.map((item, index) => {
    const key = String(item.dataKey ?? item.value ?? index);
    return <span key={`${key}-${index}`} className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="size-2 rounded-sm" style={{ background: config[key]?.color ?? item.color ?? 'currentColor' }} />{config[key]?.label ?? key}</span>;
  })}</div>;
}
