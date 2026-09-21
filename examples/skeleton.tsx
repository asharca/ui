import { Skeleton } from '@/components/asharca/skeleton';
export default function SkeletonDemo() {
  return <div aria-busy="true" aria-label="加载中的项目卡片" className="grid w-full max-w-xs gap-5 rounded-2xl border border-border bg-background p-5"><div className="flex items-center gap-3"><Skeleton className="size-10 rounded-full" /><div className="grid flex-1 gap-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-2.5 w-1/2" /></div></div><div className="grid gap-2"><Skeleton className="h-2.5 w-full" /><Skeleton className="h-2.5 w-full" /><Skeleton className="h-2.5 w-3/4" /></div><span className="sr-only">内容正在加载。</span></div>;
}
