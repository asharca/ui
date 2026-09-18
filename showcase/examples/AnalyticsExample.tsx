import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Banknote, ShoppingCart, Users } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  DataTable,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type ChartConfig,
} from "../../src/index";

const daily = [
  3820, 4290, 3680, 5180, 4720, 6240, 5680, 4960, 6380, 5820, 7160, 6480, 7820,
  8640,
].map((revenue, index) => ({
  day: `9/${index + 5}`,
  revenue,
  expenses: Math.round(revenue * (0.42 + (index % 3) * 0.05)),
  visitors: 920 + index * 57 + (index % 4) * 80,
  orders: Math.round(revenue / 180),
}));
const config = {
  revenue: { label: "收入", color: "var(--chart-1)" },
  expenses: { label: "成本", color: "var(--chart-2)" },
  visitors: { label: "访问量", color: "var(--chart-1)" },
  orders: { label: "订单", color: "var(--chart-4)" },
  team: { label: "团队版", color: "var(--chart-1)" },
  personal: { label: "个人版", color: "var(--chart-2)" },
  enterprise: { label: "企业版", color: "var(--chart-3)" },
} satisfies ChartConfig;
const currency = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);

export function AnalyticsExample() {
  const [range, setRange] = useState("7");
  const [metric, setMetric] = useState("revenue");
  const [view, setView] = useState("charts");
  const data = daily.slice(-Number(range));
  const revenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const visitors = data.reduce((sum, item) => sum + item.visitors, 0);
  const orders = data.reduce((sum, item) => sum + item.orders, 0);
  const distribution = [
    {
      name: "team",
      value: Math.round(revenue * 0.52),
      fill: "var(--color-team)",
    },
    {
      name: "personal",
      value: Math.round(revenue * 0.28),
      fill: "var(--color-personal)",
    },
    {
      name: "enterprise",
      value: revenue - Math.round(revenue * 0.52) - Math.round(revenue * 0.28),
      fill: "var(--color-enterprise)",
    },
  ];
  const channels = [
    { name: "自然搜索", orders: Math.round(orders * 0.41) },
    { name: "直接访问", orders: Math.round(orders * 0.3) },
    { name: "社交媒体", orders: Math.round(orders * 0.18) },
    {
      name: "其他渠道",
      orders:
        orders -
        Math.round(orders * 0.41) -
        Math.round(orders * 0.3) -
        Math.round(orders * 0.18),
    },
  ];
  return (
    <div className="example-content">
      <header className="example-heading">
        <div>
          <p className="example-eyebrow">ASTER / ANALYTICS</p>
          <h1>数据分析</h1>
          <p>2026 年 {data[0].day.replace("/", " 月 ")} 日至 9 月 18 日</p>
        </div>
        <Select
          aria-label="统计周期"
          value={range}
          onChange={(event) => setRange(event.target.value)}
        >
          <option value="7">最近 7 天</option>
          <option value="14">最近 14 天</option>
        </Select>
      </header>
      <dl className="example-metrics">
        <div>
          <dt>
            <Banknote size={16} />
            总收入
          </dt>
          <dd>{currency(revenue)}</dd>
          <small>已支付订单金额</small>
        </div>
        <div>
          <dt>
            <ShoppingCart size={16} />
            成交订单
          </dt>
          <dd>{orders.toLocaleString()}</dd>
          <small>所选时间范围</small>
        </div>
        <div>
          <dt>
            <Users size={16} />
            总访问量
          </dt>
          <dd>{visitors.toLocaleString()}</dd>
          <small>累计访问次数</small>
        </div>
        <div>
          <dt>
            <Activity size={16} />
            转化率
          </dt>
          <dd>
            {((orders / visitors) * 100).toFixed(2)}
            <small>%</small>
          </dd>
          <small>订单 / 访问量</small>
        </div>
      </dl>
      <Tabs value={view} onValueChange={setView}>
        <div className="example-section-heading">
          <TabsList data-variant="underline" aria-label="分析视图">
            <TabsTrigger value="charts">图表</TabsTrigger>
            <TabsTrigger value="data">数据明细</TabsTrigger>
          </TabsList>
          <span className="example-demo-label">演示数据</span>
        </div>
        <TabsContent value="charts">
          <section className="example-section" aria-labelledby="trend-title">
            <div className="example-section-heading">
              <div>
                <h2 id="trend-title">
                  {metric === "revenue" ? "收入趋势" : "访问趋势"}
                </h2>
                <p>按日统计 · {metric === "revenue" ? "人民币" : "访问次数"}</p>
              </div>
              <Select
                aria-label="趋势指标"
                controlSize="sm"
                value={metric}
                onChange={(event) => setMetric(event.target.value)}
              >
                <option value="revenue">收入与成本</option>
                <option value="visitors">访问量</option>
              </Select>
            </div>
            <ChartContainer
              config={config}
              className="example-trend-chart"
              role="region"
              aria-label={
                metric === "revenue"
                  ? "每日收入与成本面积图"
                  : "每日访问量面积图"
              }
            >
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{ top: 16, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                  tickMargin={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${value / 1000}k` : String(value)
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        metric === "revenue"
                          ? currency(Number(value))
                          : Number(value).toLocaleString()
                      }
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={`var(--color-${metric})`}
                  fill={`var(--color-${metric})`}
                  fillOpacity={0.12}
                  strokeWidth={2.5}
                  isAnimationActive={false}
                />
                {metric === "revenue" && (
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    fill="var(--color-expenses)"
                    fillOpacity={0.04}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    isAnimationActive={false}
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </section>
          <div className="example-chart-columns">
            <section
              className="example-section"
              aria-labelledby="channel-title"
            >
              <div className="example-section-heading">
                <div>
                  <h2 id="channel-title">订单来源</h2>
                  <p>按获客渠道</p>
                </div>
                <span>{orders} 笔</span>
              </div>
              <ChartContainer
                config={config}
                role="region"
                aria-label="各渠道订单数量柱状图"
              >
                <BarChart
                  accessibilityLayer
                  data={channels}
                  margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={52}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ChartContainer>
            </section>
            <section className="example-section" aria-labelledby="plan-title">
              <div className="example-section-heading">
                <div>
                  <h2 id="plan-title">收入构成</h2>
                  <p>按订阅方案</p>
                </div>
                <span>3 种方案</span>
              </div>
              <ChartContainer
                config={config}
                role="region"
                aria-label="各订阅方案收入环形图"
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value) => currency(Number(value))}
                      />
                    }
                  />
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={3}
                    stroke="none"
                    isAnimationActive={false}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="data">
          <section className="example-section">
            <h2 className="example-data-title">每日数据</h2>
            <DataTable
              panel={false}
              label="每日数据明细"
              minWidth="560px"
              headers={[
                { label: "日期" },
                { label: "收入", align: "right" },
                { label: "成本", align: "right" },
                { label: "访问量", align: "right" },
                { label: "订单", align: "right" },
              ]}
            >
              {data.map((item) => (
                <tr key={item.day}>
                  <td>2026/{item.day}</td>
                  <td className="example-number">{currency(item.revenue)}</td>
                  <td className="example-number">{currency(item.expenses)}</td>
                  <td className="example-number">
                    {item.visitors.toLocaleString()}
                  </td>
                  <td className="example-number">{item.orders}</td>
                </tr>
              ))}
            </DataTable>
          </section>
          <div className="example-chart-columns">
            <section className="example-section">
              <h2 className="example-data-title">订单来源</h2>
              <DataTable
                panel={false}
                label="订单来源明细"
                minWidth="240px"
                headers={[{ label: "渠道" }, { label: "订单", align: "right" }]}
              >
                {channels.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td className="example-number">{item.orders}</td>
                  </tr>
                ))}
              </DataTable>
            </section>
            <section className="example-section">
              <h2 className="example-data-title">收入构成</h2>
              <DataTable
                panel={false}
                label="收入构成明细"
                minWidth="240px"
                headers={[{ label: "方案" }, { label: "收入", align: "right" }]}
              >
                {distribution.map((item) => (
                  <tr key={item.name}>
                    <td>{config[item.name as keyof typeof config].label}</td>
                    <td className="example-number">{currency(item.value)}</td>
                  </tr>
                ))}
              </DataTable>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
