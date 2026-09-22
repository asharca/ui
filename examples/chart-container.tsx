'use client';
import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/asharca/chart-container';

const data = [{ day: '周一', completed: 24, pending: 10 }, { day: '周二', completed: 32, pending: 14 }, { day: '周三', completed: 28, pending: 8 }, { day: '周四', completed: 45, pending: 16 }, { day: '周五', completed: 38, pending: 12 }];
const config = { completed: { label: '已完成', color: 'var(--chart-1, #737373)' }, pending: { label: '待处理', color: 'var(--chart-2, #b0b0b0)' } };
export default function ChartContainerDemo() {
  const [mode, setMode] = useState<'bar' | 'area'>('bar');
  const common = <><CartesianGrid vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} /><YAxis width={30} tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} /></>;
  return <div className="w-full max-w-2xl"><div className="mb-5 flex items-center justify-between gap-4"><div><h3 className="text-sm font-medium">任务概览</h3><p className="mt-1 text-xs text-muted-foreground">最近五天 · 示例数据</p></div><div role="group" aria-label="图表类型" className="flex gap-1 rounded-lg bg-muted p-1">{(['bar', 'area'] as const).map((kind) => <button key={kind} type="button" aria-pressed={mode === kind} onClick={() => setMode(kind)} className="rounded-md px-2 py-1 text-[10px] text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{kind === 'bar' ? '柱形' : '面积'}</button>)}</div></div>
    <ChartContainer config={config} label="最近五天已完成和待处理任务数量" className="h-60">
      {mode === 'bar' ? <BarChart accessibilityLayer data={data} margin={{ left: 0, right: 8, top: 8 }}>{common}<Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} isAnimationActive={false} /><Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} isAnimationActive={false} /></BarChart>
        : <AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 8, top: 8 }}>{common}<Area type="monotone" dataKey="completed" stroke="var(--color-completed)" fill="var(--color-completed)" fillOpacity={0.15} isAnimationActive={false} /><Area type="monotone" dataKey="pending" stroke="var(--color-pending)" fill="var(--color-pending)" fillOpacity={0.1} isAnimationActive={false} /></AreaChart>}
    </ChartContainer>
    <details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-ring">查看数据表</summary><div className="mt-3 overflow-auto"><table className="w-full text-left"><caption className="sr-only">任务数量数据</caption><thead><tr><th scope="col" className="py-2">日期</th><th scope="col">已完成</th><th scope="col">待处理</th></tr></thead><tbody>{data.map((item) => <tr key={item.day} className="border-t border-border"><th scope="row" className="py-2 font-normal">{item.day}</th><td>{item.completed}</td><td>{item.pending}</td></tr>)}</tbody></table></div></details>
  </div>;
}
