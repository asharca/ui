"use client";

import { PerformanceReport, type PerformancePeriod, type PerformanceRecord } from "@/components/motion/performance-report";

// Clearly sample host records. Arrays are apportioned from these sample totals,
// never generated inside the reusable report or represented as live observations.
const periods: PerformancePeriod[] = [
  { id: "current", label: "Last 28 days", start: "2026-09-03", end: "2026-09-30", expectedDays: 28, comparisonPeriodId: "previous" },
  { id: "previous", label: "Previous period", start: "2026-08-06", end: "2026-09-02", expectedDays: 28 },
  { id: "empty", label: "No observations", start: "2026-10-01", end: "2026-10-28", expectedDays: 28 },
  { id: "edge", label: "Coverage and tied-rank cases", start: "2026-11-01", end: "2026-11-07", expectedDays: 7, comparisonPeriodId: "edge-prior" },
  { id: "edge-prior", label: "Zero baseline cases", start: "2026-10-25", end: "2026-10-31", expectedDays: 7 },
];
function apportion(total: number, length: number, offset: number) {
  const weights = Array.from({length}, (_, index) => [1.1,1.04,1.08,1.15,1.22,.65,.58][(index + offset)%7]);
  const scale = weights.reduce((sum,value)=>sum+value,0);
  const values = weights.map(weight=>Math.floor(total*weight/scale));
  values[length-1] += total-values.reduce((sum,value)=>sum+value,0);
  return values;
}
const members = ["Marin Cole","Robin Shah","Nico Bell","Tess Navarro","Elliot Reed","June Park"];
const revenue = [2782,2719,1617,1467,2328,2304,2378,2527,2699,1867,1924,2854,2738,2595,2483,2450,1542,1682,2821,2961,3022,2986,2866,1740,1606,2515,2548,2662];
const previousRevenue = [2685,2541,1486,1492,2558,2707,2854,2943,2938,1869,1710,2517,2406,2385,2457,2591,1762,1854,2828,2737,2583,2418,2301,1303,1372,2480,2636,2751];
const sampleRecords: PerformanceRecord[] = ["current","previous"].flatMap((periodId,periodIndex)=>members.map((member,index)=>{
  const delivered = (periodIndex ? [309,283,256,236,212,187] : [321,296,272,247,222,203])[index];
  const replies = [321,286,251,226,193,147][index];
  const reviews = [300,270,235,210,175,131][index];
  const dailyDelivered = apportion(delivered,28,index);
  const dailyHoursLogged = apportion([620,610,590,570,540,500][index] * (periodIndex ? .931 : 1),28,index);
  const dailyOnTimeDeliveries = apportion(Math.round(delivered * (periodIndex ? .933 : .942)),28,index);
  const dailyReplies = apportion(replies,28,index);
  const dailyReplyMinutes = dailyReplies.map(value=>value*[26.4,24.1,21.8,19.5,17.5,15.6][index]);
  const sourceRevenue = periodIndex ? previousRevenue : revenue;
  const dailyCollectedRevenue = Array.from({length:28},(_,day)=> (sourceRevenue[day%sourceRevenue.length] ?? 0)/6);
  return { id: periodId+index, periodId, member, team:index<3?"Operations":"Customer care", delivered, replies, reviews, replyMinutes:dailyReplyMinutes.reduce((sum,value)=>sum+value,0),reviewMinutes:reviews*5,dailyDelivered,hoursLogged:dailyHoursLogged.reduce((sum,value)=>sum+value,0),onTimeDeliveries:dailyOnTimeDeliveries.reduce((sum,value)=>sum+value,0),collectedRevenue:dailyCollectedRevenue.reduce((sum,value)=>sum+value,0),onTimeReplies:replies-[2,8,4,4,2,4][index],reviewsPassed:reviews-[0,1,3,3,2,1][index],dailyHoursLogged,dailyOnTimeDeliveries,dailyCollectedRevenue,dailyReplies,dailyReplyMinutes };
}));
const records: PerformanceRecord[] = [...sampleRecords, ...[{"id":"a1","periodId":"edge","team":"Care","member":"Mara Chen","delivered":42,"replies":20,"replyMinutes":60,"reviews":10,"reviewMinutes":50,"dailyDelivered":[5,7,6,8,5,6,5]},{"id":"a2","periodId":"edge","team":"Care","member":"Noah Patel","delivered":42,"replies":10,"replyMinutes":40,"reviews":4,"reviewMinutes":24,"dailyDelivered":[6,6,5,7,8,4,6]},{"id":"a3","periodId":"edge","team":"Platform","member":"Inez Okafor","delivered":31,"replies":0,"replyMinutes":0,"reviews":0,"reviewMinutes":0,"dailyDelivered":[4,6,3,null,7,5,6]},{"id":"b1","periodId":"edge-prior","team":"Care","member":"Mara Chen","delivered":32,"replies":16,"replyMinutes":64,"reviews":8,"reviewMinutes":48,"dailyDelivered":[4,4,5,5,4,6,4]},{"id":"b2","periodId":"edge-prior","team":"Care","member":"Noah Patel","delivered":0,"replies":0,"replyMinutes":0,"reviews":0,"reviewMinutes":0,"dailyDelivered":[0,0,0,0,0,0,0]}]];
export function PeriodComparisonPreview() {
  return <div className="w-full max-w-7xl p-4 sm:p-6"><PerformanceReport variant="period-comparison" periods={periods} records={records} currency="USD" /><p className="mt-4 text-xs text-muted-foreground">Sample workspace · Daily observations through Sep 30, 2026</p></div>;
}
