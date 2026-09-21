import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/asharca/button';
export default function ButtonDemo() {
  return <div className="flex flex-wrap items-center justify-center gap-3">
    <Button>开始构建 <ArrowUpRight className="size-4" /></Button>
    <Button variant="outline">查看源码</Button>
    <Button variant="ghost" size="sm">了解更多</Button>
  </div>;
}
