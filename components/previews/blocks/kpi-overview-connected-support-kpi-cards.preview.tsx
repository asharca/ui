"use client";

import { useState } from "react";
import { Inbox, CheckCheck, Clock3, ThumbsUp } from "lucide-react";
import { ConnectedSupportKpiCards, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'inbox',label:'Inbox volume',value:2186,change:5.4,icon:<Inbox />},{id:'resolved',label:'Resolved today',value:312,change:8.6,icon:<CheckCheck />},{id:'replies',label:'On-time replies',value:94,format:{style:'percent'},change:-.7,icon:<Clock3 />},{id:'helpfulness',label:'Helpfulness',value:4.7,unit:'/ 5',change:1.2,icon:<ThumbsUp />}];

export function ConnectedSupportKpiCardsPreview() {
  const [values, setValues] = useState(() => metrics.map(metric => metric.value));
  const previewMetrics = metrics.map((metric, index) => ({ ...metric, value: values[index], actions: [
    { label: "Update metric", onSelect: () => setValues(current => current.map((value, position) => position === index ? value + [12, 12, 0.5, 0.1][index] : value)) },
    { label: "Restore metric", onSelect: () => setValues(current => current.map((value, position) => position === index ? metric.value : value)) },
  ] }));
  return <div className="w-full max-w-screen-2xl p-4 sm:p-5"><ConnectedSupportKpiCards metrics={previewMetrics} period="month over month" /></div>;
}
