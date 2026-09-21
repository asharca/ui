import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/asharca/tabs';
export default function TabsDemo() {
  return <Tabs defaultValue="overview" className="w-full max-w-xs">
    <TabsList aria-label="项目视图"><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="activity">活动</TabsTrigger><TabsTrigger value="settings">设置</TabsTrigger></TabsList>
    <TabsContent value="overview"><h3 className="font-medium">让界面回归内容。</h3><p className="mt-2 text-muted-foreground">统一的间距、轻盈的反馈，以及恰到好处的细节。</p></TabsContent>
    <TabsContent value="activity"><h3 className="font-medium">最近活动</h3><p className="mt-2 text-muted-foreground">组件已添加到你的工作区。</p></TabsContent>
    <TabsContent value="settings"><label className="grid gap-2">工作区名称<input defaultValue="我的工作区" className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" /></label></TabsContent>
  </Tabs>;
}
