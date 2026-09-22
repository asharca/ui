'use client';
import { useState } from 'react';
import { Section } from '@/components/asharca/section';
export default function SectionDemo() {
  const [count, setCount] = useState(0);
  return <Section title="待办事项" count={count} description="即使没有内容，也清楚呈现数量。" className="w-full max-w-sm" actions={<button type="button" onClick={() => setCount((value) => value + 1)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-ring">添加</button>}><div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">{count ? `${count} 项待办已添加到演示。` : '当前没有待办。'}</div></Section>;
}
