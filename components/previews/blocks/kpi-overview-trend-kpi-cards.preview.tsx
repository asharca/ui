"use client";

import { Wallet, Landmark, ArrowDownToLine } from "lucide-react";
import { TrendKpiCards, type KpiMetric } from "@/components/motion/kpi-overview";

const metrics: KpiMetric[] = [{id:'balance',label:'Cash balance',value:58432.76,format:{style:'currency',decimals:2},icon:<Wallet />,note:'+$15,252.76 · 35.32% this month',history:[43180,45140,43220,43480,46240,45910,44620,46410,48260,46940,47210,50180,49810,48760,50620,52110,51320,51980,54060,54410,53740,55190,56540,56080,56620,57910,58120,58210,58305,58432.76],historyLabels:Array.from({length:30},(_,i)=>'Sep '+(i+1))},{id:'reserved',label:'Reserved funds',value:18250.4,format:{style:'currency',decimals:2},icon:<Landmark />,note:'Assigned to 4 budgets'},{id:'payouts',label:'Pending payouts',value:842.35,format:{style:'currency',decimals:2},icon:<ArrowDownToLine />,note:'Arriving in 2 business days'}];

export function TrendKpiCardsPreview() {
  return <div className="w-full max-w-screen-2xl p-4 sm:p-6"><TrendKpiCards metrics={metrics}  /></div>;
}
