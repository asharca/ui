"use client";
import { StackedUsageChart } from "@/components/charts/usage-chart-compositions";
const periods=Array.from({length:21},(_,index)=>`Mar ${index+1}`);
const series=[{id:"web",name:"Web",color:"#3b82f6",values:[4200,4829,5385,5808,6061,6135,6052,5862,5632,4356,4263,4323,4561,4972,5519,6145,6777,11000,11000,11000,11000]},{id:"mobile",name:"Mobile",color:"#f97316",values:[3100,4036,3938,4721,4399,4925,4356,3707,4008,3355,3758,3293,3941,3735,3631,4564,4522,0,0,0,0]},{id:"api",name:"API",color:"#14b8a6",values:[1800,2658,2685,2655,2552,2372,2925,2632,2322,2027,1775,2390,2280,2245,2268,2325,3184,0,0,0,0]}];
export function StackedBarChartPreview() {
  return <div className="mx-auto w-full max-w-3xl px-4 py-10"><StackedUsageChart periods={periods} unit="requests" max={17243.3} target={12000} projectedPeriods={periods.slice(17)} series={series} /></div>;
}
