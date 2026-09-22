'use client';
import { useState } from 'react';
import { Page, PageHeader } from '@/components/asharca/page';
export default function PageDemo() {
  const [count, setCount] = useState(2);
  return <Page as="div" className="max-w-md rounded-xl border border-border bg-background p-4 sm:p-5"><PageHeader headingLevel={2} title="我的项目" description="查看最近的工作与待办。" meta={<span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{count}</span>} actions={<button type="button" onClick={() => setCount((value) => value + 1)} className="rounded-lg border border-border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring">新建项目</button>} /><div className="grid gap-2 text-xs text-muted-foreground"><p>界面设计系统</p><p>工作区原型</p>{count > 2 && <p role="status">另有 {count - 2} 个本地示例项目</p>}</div></Page>;
}
