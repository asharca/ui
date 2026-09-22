'use client';
import { useState } from 'react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/components/asharca/context-menu';
export default function ContextMenuDemo() {
  const [action, setAction] = useState('右键或长按卡片');
  return <div className="grid w-full max-w-xs gap-3"><ContextMenu><ContextMenuTrigger asChild><div tabIndex={0} className="rounded-xl border border-dashed border-border bg-muted/20 px-5 py-9 text-center text-xs text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">项目文件 · context.txt</div></ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={() => setAction('已打开文件预览')}>打开预览</ContextMenuItem><ContextMenuItem onSelect={() => setAction('已复制文件路径（演示）')}>复制路径</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem disabled>共享设置</ContextMenuItem></ContextMenuContent></ContextMenu><button type="button" onClick={() => setAction('已打开文件预览')} className="justify-self-start rounded text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">打开预览</button><p role="status" className="text-xs text-muted-foreground">{action}</p></div>;
}
