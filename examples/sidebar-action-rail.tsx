'use client';
import { useState } from 'react';
import { SidebarActionRail, SidebarActionButton } from '@/components/asharca/sidebar-action-rail';
export default function SidebarActionRailDemo() {
  const [pinned, setPinned] = useState(false); const [count, setCount] = useState(0);
  return <div className="w-full max-w-xs"><div className="group flex items-center gap-2 rounded-xl border border-border bg-background p-3"><span className="min-w-0 flex-1 truncate text-xs">界面设计讨论</span><SidebarActionRail active={pinned}><SidebarActionButton label={pinned ? '取消固定会话' : '固定会话'} icon={<span>☆</span>} onClick={() => setPinned(!pinned)} /><SidebarActionButton label="添加标记" icon={<span>+</span>} onClick={() => setCount((value) => value + 1)} /></SidebarActionRail></div><p role="status" className="mt-3 text-xs text-muted-foreground">{pinned ? '已固定' : '悬停或按 Tab 查看操作'} · {count} 个标记</p></div>;
}
