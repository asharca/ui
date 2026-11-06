"use client";

import { CalendarCheck, Repeat2, Undo2, UserRoundCheck } from "lucide-react";
import { HeaderKpiCards, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'bookings',label:'Bookings',value:38460,format:{style:'currency'},change:12.8,icon:<CalendarCheck />},{id:'renewals',label:'Renewals',value:128,change:10.3,icon:<Repeat2 />},{id:'refunds',label:'Refunds',value:840,format:{style:'currency'},change:-17.6,favorable:'down',icon:<Undo2 />},{id:'retention',label:'Retention',value:94.2,format:{style:'percent',decimals:1},change:1.4,changeUnit:'pp',icon:<UserRoundCheck />}];

export function HeaderKpiCardsPreview() {
  return <div className="w-full max-w-7xl p-4 sm:p-6"><HeaderKpiCards metrics={metrics} period="over last month" /></div>;
}
