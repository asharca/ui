import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../src/index";

const data = [
  { month: "1月", desktop: 186, mobile: 80 },
  { month: "2月", desktop: 305, mobile: 200 },
  { month: "3月", desktop: 237, mobile: 120 },
  { month: "4月", desktop: 273, mobile: 190 },
  { month: "5月", desktop: 309, mobile: 230 },
];
const config = {
  desktop: { label: "桌面端", color: "var(--chart-1)" },
  mobile: { label: "移动端", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartContainerDemo() {
  return (
    <ChartContainer
      config={config}
      role="region"
      aria-label="每月访问量，桌面端与移动端比较"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, left: 12, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={3}
          isAnimationActive={false}
        />
        <Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={3}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
