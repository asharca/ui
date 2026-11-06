"use client";

import { useState } from "react";
import { GaugeKpiCards, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'jobs',label:'Processed jobs',value:864,unit:'per day',limit:1200,note:'Daily target: 1,200',color:'#13775b',help:'Jobs completed today against the daily target.'},{id:'seats',label:'Active seats',value:38,unit:'of 50',limit:50,note:'Plan capacity',color:'#008bea',help:'Active seats compared with your plan capacity.'},{id:'automation',label:'Automation rate',value:84.2,format:{style:'percent',decimals:1},limit:90,note:'Quarterly target: 90%',color:'#16b4a5',help:'Share of eligible work completed automatically.'}];

export function GaugeKpiCardsPreview() {
  const [values, setValues] = useState(() => metrics.map(metric => metric.value));
  const previewMetrics = metrics.map((metric, index) => ({ ...metric, value: values[index], actions: [
    { label: "Update metric", onSelect: () => setValues(current => current.map((value, position) => position === index ? value + [24, 2, 0.8][index] : value)) },
    { label: "Restore metric", onSelect: () => setValues(current => current.map((value, position) => position === index ? metric.value : value)) },
  ] }));
  return <div className="w-full max-w-6xl p-4 sm:p-6"><GaugeKpiCards metrics={previewMetrics} /></div>;
}
