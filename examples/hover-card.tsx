import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/asharca/hover-card';
export default function HoverCardDemo() {
  return <HoverCard openDelay={200}><HoverCardTrigger asChild><a href="https://github.com/asharca/ui" target="_blank" rel="noreferrer" className="rounded text-sm font-medium underline decoration-border underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">asharca/ui 源码仓库</a></HoverCardTrigger><HoverCardContent><div className="mb-3 grid size-10 place-items-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground">UI</div><h3 className="text-sm font-semibold">Asharca UI</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">组件源码与真实预览。链接本身始终可用，不把重要操作藏进悬停面板。</p></HoverCardContent></HoverCard>;
}
