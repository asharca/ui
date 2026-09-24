'use client';
import { useState } from 'react';
import { MessageScroller } from '@/components/asharca/agent-message-scroller';
export default function Demo() { const [count, setCount] = useState(12); return <div className="w-full max-w-xl space-y-3"><MessageScroller className="h-72 rounded-xl border border-border" label="示例消息记录" viewportClassName="p-4"><div className="space-y-4">{Array.from({ length: count }, (_, index) => <article key={index} className="rounded-lg bg-muted/40 p-3"><p className="mb-2 text-xs text-muted-foreground">消息 {index + 1}</p><p>这是本地示例记录。向上滚动后，新消息不会抢走阅读位置。</p></article>)}</div></MessageScroller><button className="rounded-lg border border-border px-3 py-2 text-xs" onClick={() => setCount(count + 1)}>追加消息</button></div>; }
