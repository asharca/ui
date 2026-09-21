'use client';
import { useId, useState } from 'react';
import { Toolbar } from '@/components/asharca/toolbar';
export default function ToolbarDemo() {
  const id = useId(); const [query, setQuery] = useState(''); const [count, setCount] = useState(4);
  return <div className="grid w-full max-w-lg gap-4"><Toolbar actions={<button type="button" onClick={() => setCount((value) => value + 1)} className="rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring">添加项目</button>}><label htmlFor={id} className="sr-only">筛选项目</label><input id={id} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选项目…" className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" /></Toolbar><p role="status" className="text-xs text-muted-foreground">{query ? `筛选词：${query}` : `${count} 个项目`}</p></div>;
}
