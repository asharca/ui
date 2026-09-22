'use client';
import { useRef, useState } from 'react';
import { FileText, Home } from 'lucide-react';
import { WorkspaceTabBar, type WorkspaceTab } from '@/components/asharca/workspace-tab-bar';
const initial: WorkspaceTab[] = [{ id: 'home', title: '概览', pinned: true, icon: <Home /> }, { id: 'design', title: '设计文档', dirty: true, icon: <FileText /> }, { id: 'tasks', title: '任务列表', icon: <FileText /> }];
export default function WorkspaceTabBarDemo() {
  const [tabs, setTabs] = useState(initial); const [active, setActive] = useState('design'); const serial = useRef(0);
  function reorder(source: string, target: string) { setTabs((items) => { const next = [...items]; const from = next.findIndex((item) => item.id === source); const to = next.findIndex((item) => item.id === target); if (from >= 0 && to >= 0) next.splice(to, 0, next.splice(from, 1)[0]); return next; }); }
  return <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background"><WorkspaceTabBar tabs={tabs} activeTabId={active} onSelect={setActive} onReorder={reorder}
    onPinnedChange={(id, pinned) => setTabs((items) => items.map((item) => item.id === id ? { ...item, pinned } : item).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))))}
    onClose={(id) => { const next = tabs.filter((item) => item.id !== id); if (!next.length) return; setTabs(next); if (active === id) setActive(next[0].id); }} />
    <div role="tabpanel" aria-label={tabs.find((tab) => tab.id === active)?.title ?? '工作区内容'} className="px-5 py-8"><h3 className="text-sm font-medium">{tabs.find((tab) => tab.id === active)?.title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">拖动标签，或用 Alt + 左右方向键排序。固定标签不会被关闭。</p><button type="button" className="mt-4 rounded-lg border border-border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { const id = `new-${++serial.current}`; setTabs((items) => [...items, { id, title: `新标签 ${serial.current}` }]); setActive(id); }}>添加标签</button></div>
  </div>;
}
