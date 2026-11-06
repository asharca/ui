"use client";

import { SummaryKpiCard, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'available',label:'Available budget',value:84750.25,limit:120000,format:{style:'currency',decimals:2},help:'Budget still available for this period.'},{id:'committed',label:'Committed spend',value:35249.75,format:{style:'currency',decimals:2},help:'Spend already assigned to projects.'},{id:'period',label:'Budget period',value:12,unit:'months',help:'Length of the current budget period.'}];

export function SummaryKpiCardPreview() {
  return <div className="w-full max-w-4xl p-4 sm:p-6"><SummaryKpiCard metrics={metrics} title="Budget overview" period="Last reviewed Sep 30, 2026" /></div>;
}
