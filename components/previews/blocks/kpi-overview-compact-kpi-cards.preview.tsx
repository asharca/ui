"use client";

import { CompactKpiCards, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'revenue',label:'Recurring revenue',value:42680,format:{style:'currency'},change:9.41,history:[46,58,50,68,94,61,65]},{id:'accounts',label:'Paid accounts',value:1460,unit:'teams',change:10.77,history:[38,66,47,82,100,59,63]},{id:'trials',label:'New trials',value:324,unit:'this month',change:12.89,history:[50,72,58,90,86,53,61]},{id:'conversion',label:'Trial conversion',value:18.6,format:{style:'percent',decimals:1},change:1.4,changeUnit:'pp',history:[58,73,64,86,98,71,68]}];

export function CompactKpiCardsPreview() {
  return <div className="w-full max-w-7xl p-4 sm:p-6"><CompactKpiCards metrics={metrics.map(metric => ({ ...metric, help: `${metric.label}: comparison with the previous month.` }))} period="over last month" /></div>;
}
