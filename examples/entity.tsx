import { Entity } from '@/components/asharca/entity';
export default function EntityDemo() {
  return <div className="grid w-full max-w-sm gap-5"><Entity title="设计工作区" initials="设" description="团队空间 · 4 位成员" meta={<span className="text-[10px] text-muted-foreground">在线</span>} /><Entity title="registry/components" initials="UI" description="组件源码与安装清单" mono /><Entity title="一个可以自然截断但仍保留完整提示的较长项目名称" initials="项" description="点击页面中的实际操作继续工作。" /></div>;
}
