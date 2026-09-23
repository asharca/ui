import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/asharca/tabs';

export default function TabsVariantsDemo() {
  return <div className="grid w-full max-w-sm gap-7">
    <Tabs defaultValue="overview">
      <TabsList variant="underline" aria-label="下划线标签"><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="activity">活动</TabsTrigger><TabsTrigger value="settings">设置</TabsTrigger></TabsList>
      <TabsContent value="overview">把内容放在前面，导航只保留一条轻盈的线。</TabsContent>
      <TabsContent value="activity">指示器沿当前位置移动，不会影响其他标签组。</TabsContent>
      <TabsContent value="settings">方向键、Home 和 End 仍由 Radix 处理。</TabsContent>
    </Tabs>
    <Tabs defaultValue="day">
      <TabsList variant="pill" aria-label="胶囊标签"><TabsTrigger value="day">日</TabsTrigger><TabsTrigger value="week">周</TabsTrigger><TabsTrigger value="month">月</TabsTrigger></TabsList>
      <TabsContent value="day">今日的工作，一目了然。</TabsContent>
      <TabsContent value="week">查看本周进展。</TabsContent>
      <TabsContent value="month">查看本月汇总。</TabsContent>
    </Tabs>
  </div>;
}
