'use client';
import { useRef, useState } from 'react';
import { FileText, Home } from 'lucide-react';
import { WorkspaceTabBar, type WorkspaceTab } from '@/components/asharca/workspace-tab-bar';

const initial: WorkspaceTab[] = [{ id: 'home', title: '概览', pinned: true, icon: <Home /> }, { id: 'design', title: '设计文档', dirty: true, icon: <FileText /> }, { id: 'tasks', title: '任务列表', icon: <FileText /> }];
export default function WorkspaceTabBarDemo() {
  const [tabs, setTabs] = useState(initial);
  const [active, setActive] = useState('design');
  const [error, setError] = useState('');
  const serial = useRef(0);
  function remove(id: string) {
    const next = tabs.filter((tab) => tab.id !== id);
    if (!next.length) next.push({ id: `new-${++serial.current}`, title: '新标签' });
    setTabs(next); if (active === id) setActive(next[0].id);
  }
  function detach(id: string) {
    const tab = tabs.find((item) => item.id === id);
    if (!tab) return;
    // This site's App renders only the detached page for this query key.
    // In a consuming app, use the tab's own route and its own state persistence.
    const key = crypto.randomUUID();
    const url = new URL(window.location.href);
    url.search = ''; url.hash = ''; url.searchParams.set('__workspaceWindow', key);
    const popup = window.open('about:blank', '_blank', 'popup,width=1100,height=760');
    if (!popup) { setError('浏览器拦截了弹出窗口，原标签已保留。请允许弹窗后重试。'); return; }
    try {
      popup.opener = null;
      popup.sessionStorage.setItem(`asharca:workspace-window:${key}`, JSON.stringify({ version: 1, id, title: tab.title, note: `这是「${tab.title}」的本地演示页面。` }));
      popup.location.replace(url.href);
      setError(''); remove(id);
    } catch { popup.close(); setError('打开独立窗口失败，原标签已保留。'); }
  }
  function reorder(source: string, target: string) {
    setTabs((items) => { const next = [...items]; const from = next.findIndex((item) => item.id === source); const to = next.findIndex((item) => item.id === target); if (from >= 0 && to >= 0) next.splice(to, 0, next.splice(from, 1)[0]); return next; });
  }
  return <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background">
    <WorkspaceTabBar tabs={tabs} activeTabId={active} onSelect={setActive} onReorder={reorder} onOpenInNewWindow={detach}
      onPinnedChange={(id, pinned) => setTabs((items) => items.map((item) => item.id === id ? { ...item, pinned } : item).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))))}
      onClose={remove} />
    <div role="tabpanel" aria-label={tabs.find((tab) => tab.id === active)?.title ?? '工作区内容'} className="px-5 py-8">
      <h3 className="text-sm font-medium">{tabs.find((tab) => tab.id === active)?.title}</h3>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">点击 ⋯、右键或 Shift+F10 打开菜单，可固定、排序或弹出为独立窗口。拖动标签，或用 Alt + 左右方向键排序。真实未保存内容的关闭确认由应用接入 onClose。</p>
      {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
      <button type="button" className="mt-4 rounded-lg border border-border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { const id = `new-${++serial.current}`; setTabs((items) => [...items, { id, title: `新标签 ${serial.current}` }]); setActive(id); }}>添加标签</button>
    </div>
  </div>;
}
