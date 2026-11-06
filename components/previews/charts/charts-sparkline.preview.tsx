"use client";
import { TrendMetric } from "@/components/charts/usage-chart-compositions";
const metrics = [{ title: "Signups", values: [2159, 2188, 2174, 2231, 2217, 2260, 2303, 2289, 2332, 2375, 2361, 2418], unit: "", color: "#3b82f6", change: 12 }, { title: "Active teams", values: [828, 832, 840, 836, 844, 848, 844, 852, 856, 856, 860, 864], unit: "", color: "#14b8a6", change: 4 }, { title: "Churned", values: [42, 41, 42, 40, 41, 39, 40, 39, 38, 39, 38, 37], unit: "", color: "#f97316", change: -9 }, { title: "Avg. response", values: [207, 209, 206, 210, 208, 211, 209, 212, 210, 211, 213, 212], unit: "ms", color: "#84cc16", change: 3 }];
const labels=Array.from({length:12},(_,index)=>`Day ${index+1}`);
export function SparklineCompositionPreview() {
  return <div className="mx-auto w-full max-w-md px-4 py-8"><div className="divide-y divide-border">{metrics.map(metric=><TrendMetric key={metric.title} {...metric} labels={labels} />)}</div></div>;
}
