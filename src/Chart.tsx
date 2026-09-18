"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
  type DefaultLegendContentProps,
  type DefaultTooltipContentProps,
} from "recharts";

export type ChartConfig = Record<string, { label: ReactNode; color?: string }>;
export type ChartContainerProps = ComponentProps<"div"> & {
  config: ChartConfig;
};
const ChartContext = createContext<ChartConfig | null>(null);

function useChartConfig() {
  const config = useContext(ChartContext);
  if (!config)
    throw new Error("Chart content must be used inside ChartContainer.");
  return config;
}

export function ChartContainer({
  config,
  children,
  className = "",
  style,
  ...props
}: ChartContainerProps) {
  const colors = Object.fromEntries(
    Object.entries(config)
      .filter(([, item]) => item.color)
      .map(([key, item]) => [`--color-${key}`, item.color]),
  );
  return (
    <ChartContext.Provider value={config}>
      <div
        {...props}
        data-toolplane-ui="chart"
        className={`ui-chart ${className}`}
        style={{ ...colors, ...style } as CSSProperties}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 320, height: 280 }}
        >
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;
export const ChartLegend = Legend;
export type ChartTooltipContentProps = Pick<
  DefaultTooltipContentProps,
  "payload" | "label" | "formatter" | "labelFormatter"
> & {
  active?: boolean;
  hideLabel?: boolean;
  className?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  formatter,
  labelFormatter,
  className = "",
}: ChartTooltipContentProps) {
  const config = useChartConfig();
  const items =
    payload?.filter(
      (item) => item.type !== "none" && !item.hide && item.value != null,
    ) ?? [];
  if (!active || !items.length) return null;
  return (
    <div className={`ui-chart-tooltip ${className}`}>
      {!hideLabel && label != null && (
        <div className="ui-chart-tooltip__label">
          {labelFormatter ? labelFormatter(label, items) : label}
        </div>
      )}
      {items.map((item, index) => {
        const entry = config[String(item.name)] ?? config[String(item.dataKey)];
        const formatted = formatter?.(
          item.value,
          item.name,
          item,
          index,
          items,
        );
        return (
          <div
            className="ui-chart-tooltip__row"
            key={`${String(item.dataKey)}-${index}`}
          >
            <span
              className="ui-chart-swatch"
              aria-hidden="true"
              style={{ background: entry?.color ?? item.color ?? item.fill }}
            />
            <span>
              {Array.isArray(formatted)
                ? formatted[1]
                : (entry?.label ?? item.name)}
            </span>
            <strong>
              {formatted != null
                ? Array.isArray(formatted)
                  ? formatted[0]
                  : formatted
                : typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : String(item.value)}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

export type ChartLegendContentProps = Pick<
  DefaultLegendContentProps,
  "payload"
> & { className?: string };
export function ChartLegendContent({
  payload,
  className = "",
}: ChartLegendContentProps) {
  const config = useChartConfig();
  return (
    <div className={`ui-chart-legend ${className}`}>
      {payload
        ?.filter((item) => item.type !== "none")
        .map((item, index) => {
          const entry =
            config[String(item.value)] ?? config[String(item.dataKey)];
          return (
            <span key={`${String(item.dataKey)}-${index}`}>
              <span
                className="ui-chart-swatch"
                aria-hidden="true"
                style={{ background: entry?.color ?? item.color }}
              />
              {entry?.label ?? item.value}
            </span>
          );
        })}
    </div>
  );
}
