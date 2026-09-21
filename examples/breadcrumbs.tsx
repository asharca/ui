'use client';
import { useId } from 'react';
import { Breadcrumbs } from '@/components/asharca/breadcrumbs';
export default function BreadcrumbsDemo() {
  const id = useId();
  return <div className="w-full max-w-sm"><Breadcrumbs items={[{ id: 'workspace', label: '工作区', href: `#${id}` }, { id: 'projects', label: '项目', href: `#${id}` }, { id: 'current', label: '界面设计系统' }]} /><p id={id} className="mt-5 text-xs leading-6 text-muted-foreground">当前位置始终可读；前面的层级使用真实链接。</p></div>;
}
