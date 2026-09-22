'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Bot, Boxes, Brain, LayoutDashboard, Menu, Plug, Settings2 } from 'lucide-react';
import { IconButton } from '@/components/asharca/icon-button';
import { WorkspaceShell, openWorkspaceWindow } from '@/components/asharca/workspace-shell';
import { WorkspaceSidebar } from '@/components/asharca/workspace-sidebar';
import { WorkspaceTabBar, type WorkspaceTab } from '@/components/asharca/workspace-tab-bar';

// Host integration: render this example without the documentation/site chrome
// when __workspaceWindow is present. In an app use your own detached route.
// The URL carries only a random key; tab content stays in that window's sessionStorage.
const windowParam = '__workspaceWindow';
const storagePrefix = 'asharca:workspace-window:';
interface WindowSnapshot { version: 1; id: string; title: string; note: string }
function readWindow() {
  if (typeof window === 'undefined') return { detached: false, key: null, snapshot: null };
  const params = new URLSearchParams(window.location.search);
  const key = params.get(windowParam);
  let snapshot: WindowSnapshot | null = null;
  if (key && /^[a-f0-9-]{36}$/.test(key)) {
    try {
      const raw = sessionStorage.getItem(storagePrefix + key);
      const value = raw && raw.length <= 30000 ? JSON.parse(raw) as Partial<WindowSnapshot> : null;
      if (value?.version === 1 && typeof value.id === 'string' && value.id.length <= 128 && typeof value.title === 'string' && value.title.length <= 128 && typeof value.note === 'string' && value.note.length <= 20000) snapshot = value as WindowSnapshot;
    } catch { /* Show recovery UI rather than inventing the missing tab. */ }
  }
  return { detached: params.has(windowParam), key, snapshot };
}
const groups = [
  { id: 'workspace', title: '工作台', items: [
    { id: 'overview', label: '概览', icon: <LayoutDashboard /> },
    { id: 'agents', label: 'Agents', icon: <Bot />, badge: 6 },
    { id: 'mcp', label: 'MCP 服务', icon: <Plug />, badge: 12 },
    { id: 'skills', label: 'Skills', icon: <Brain /> },
  ] },
  { id: 'manage', title: '管理', items: [{ id: 'settings', label: '工作区设置', icon: <Settings2 /> }] },
];
const initial: WorkspaceTab[] = [
  { id: 'overview', title: '概览', icon: <LayoutDashboard />, pinned: true },
  { id: 'agents', title: 'Agents', icon: <Bot /> },
  { id: 'mcp', title: 'MCP 服务', icon: <Plug /> },
];
const resources = ['代码助手', '文档检索', '设计审阅', '数据分析', '任务规划', '测试助手', '项目索引', '工作流检查'];

export default function WorkspaceShellDemo() {
  const instance = useId();
  const serial = useRef(0);
  const [windowState] = useState(readWindow);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => windowState.snapshot ? [{ id: windowState.snapshot.id, title: windowState.snapshot.title, icon: <Boxes /> }] : initial);
  const [active, setActive] = useState(windowState.snapshot?.id ?? 'overview');
  const [notes, setNotes] = useState<Record<string, string>>(() => windowState.snapshot ? { [windowState.snapshot.id]: windowState.snapshot.note } : { overview: '整理本周的工作区任务' });
  const [error, setError] = useState('');
  const selected = tabs.find((tab) => tab.id === active)!;
  const note = notes[active] ?? '';
  const panelId = `${instance}-panel`;
  const tabId = (id: string) => `${instance}-tab-${id}`;

  useEffect(() => {
    if (!windowState.detached || !windowState.snapshot || !windowState.key) return;
    document.title = `${selected.title} — Workspace`;
    try {
      sessionStorage.setItem(storagePrefix + windowState.key, JSON.stringify({ version: 1, id: selected.id, title: selected.title, note } satisfies WindowSnapshot));
    } catch { setError('无法保存此窗口的状态；刷新前请保留便签内容。'); }
  }, [windowState, selected.id, selected.title, note]);

  function open(id: string) {
    const item = groups.flatMap((group) => group.items).find((item) => item.id === id);
    if (!item) return;
    setTabs((current) => current.some((tab) => tab.id === id) ? current : [...current, { id, title: item.label, icon: item.icon }]);
    setActive(id);
  }
  function remove(id: string) {
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    // Detaching the last page leaves a valid replacement, as in ToolPlane.
    if (!remaining.length) remaining.push({ ...initial[0], id: `overview-${++serial.current}` });
    const next = active === id ? remaining[Math.min(Math.max(index, 0), remaining.length - 1)].id : active;
    setTabs(remaining); setActive(next);
    requestAnimationFrame(() => document.getElementById(tabId(next))?.focus({ preventScroll: true }));
  }
  function close(id: string) {
    const tab = tabs.find((item) => item.id === id);
    if (tab && !tab.pinned && tabs.length > 1) remove(id);
  }
  function detach(id: string) {
    const tab = tabs.find((item) => item.id === id);
    if (!tab) return;
    setError('');
    try {
      const key = crypto.randomUUID();
      const url = new URL(window.location.href);
      url.search = ''; url.hash = ''; url.searchParams.set(windowParam, key);
      const snapshot: WindowSnapshot = { version: 1, id: tab.id, title: tab.title, note: notes[id] ?? '' };
      const popup = openWorkspaceWindow(url, (child) => child.sessionStorage.setItem(storagePrefix + key, JSON.stringify(snapshot)));
      if (!popup) { setError('浏览器拦截了弹出窗口。原标签和便签已保留，请允许弹窗后重试。'); return; }
      remove(id);
    } catch { setError('独立窗口未能打开。原标签和便签已保留，请重试。'); }
  }
  function reorder(source: string, target: string) {
    setTabs((current) => {
      const next = [...current];
      const from = next.findIndex((tab) => tab.id === source);
      const to = next.findIndex((tab) => tab.id === target);
      if (from >= 0 && to >= 0 && Boolean(next[from].pinned) === Boolean(next[to].pinned)) next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }
  function newTab() {
    const id = `task-${++serial.current}`;
    setTabs((current) => [...current, { id, title: `临时任务 ${serial.current}`, icon: <Boxes /> }]); setActive(id);
  }

  if (windowState.detached && !windowState.snapshot) return <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground"><div className="max-w-md"><h1 className="text-lg font-semibold">无法恢复此标签</h1><p role="alert" className="mt-3 text-sm leading-7 text-muted-foreground">此窗口的状态不存在或已被清除。请回到组件页面重新打开，原应用中的其他标签不受影响。</p><a href={window.location.pathname} className="mt-5 inline-block text-sm underline underline-offset-4">返回组件页面</a></div></main>;

  const pageContent = <>
    <div className="grid grid-cols-1 gap-3 min-[1100px]:grid-cols-3">
      {[{ name: 'Agents', value: '06', icon: <Bot /> }, { name: 'MCP 服务', value: '12', icon: <Plug /> }, { name: 'Skills', value: '28', icon: <Brain /> }].map((item) => <div key={item.name} className="rounded-xl bg-muted/45 p-4"><div className="flex items-center justify-between gap-3 text-muted-foreground"><span className="text-xs">{item.name}</span><span aria-hidden="true" className="[&_svg]:size-4">{item.icon}</span></div><p className="mt-3 font-mono text-2xl tracking-tight">{item.value}</p></div>)}
    </div>
    <div className="mt-5 rounded-xl bg-muted/30 p-4"><label htmlFor={`${instance}-note`} className="text-xs font-medium">工作区便签</label><input id={`${instance}-note`} value={note} maxLength={20000} onChange={(event) => setNotes((current) => ({ ...current, [active]: event.target.value }))} className="mt-2 h-9 w-full min-w-0 rounded-lg bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" /><p className="mt-2 text-[10px] leading-5 text-muted-foreground">每个标签保留自己的便签。弹出后只显示当前页，刷新仍可恢复，不与原窗口实时同步。</p></div>
    <div className="mt-6"><h4 className="text-xs font-semibold">{selected.id === 'agents' ? 'Agent 列表' : selected.id === 'mcp' ? '服务记录' : '最近使用'}</h4><div className="mt-2 grid gap-1">{resources.map((name, index) => <div key={name} className="flex items-center gap-3 rounded-lg px-2 py-3"><span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Bot className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs">{name}</p><p className="mt-1 text-[10px] text-muted-foreground">示例资源 · {selected.title}</p></div><span className="shrink-0 text-[10px] text-muted-foreground">{index + 1} 小时前</span></div>)}</div></div>
  </>;
  const heading = <div className="px-4 py-4 sm:px-6"><p className="text-[10px] text-muted-foreground">{windowState.detached ? '独立窗口' : '个人工作区 / 工作台'}</p><h3 className="mt-1 truncate text-sm font-semibold">{selected.title}</h3>{error && <p role="alert" className="mt-2 text-xs leading-6 text-destructive">{error}</p>}</div>;
  if (windowState.detached) return <main data-demo="workspace-detached" className="flex h-dvh min-w-0 flex-col overflow-hidden bg-background text-foreground">
    {heading}<div className="min-h-0 flex-1 overflow-auto overscroll-contain px-4 pb-5 sm:px-6">{pageContent}</div>
    <p className="shrink-0 px-4 py-2 text-[10px] text-muted-foreground sm:px-6">独立本地演示 · 可以关闭原窗口 · 未连接服务</p>
  </main>;

  return <WorkspaceShell data-demo="workspace-shell" className="h-[34rem] w-full max-w-5xl rounded-2xl"
    sidebar={<WorkspaceSidebar variant="inset" title="ToolPlane" groups={groups} activeId={active} onSelect={open} collapsed={collapsed} onCollapsedChange={setCollapsed} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen}
      footer={<div className="flex items-center gap-2"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-background text-xs font-medium">TP</span><div className="min-w-0"><p className="truncate text-xs font-medium">个人工作区</p><p className="mt-0.5 text-[10px] text-muted-foreground">本地交互演示</p></div></div>} />}
    tabBar={<WorkspaceTabBar variant="inset" tabs={tabs.map((tab) => ({ ...tab, tabId: tabId(tab.id), panelId }))} activeTabId={active} onSelect={setActive} onClose={close} onReorder={reorder} onNewTab={newTab} onOpenInNewWindow={detach}
      onPinnedChange={(id, pinned) => setTabs((current) => current.map((tab) => tab.id === id ? { ...tab, pinned } : tab).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))))} />}
    mobileHeader={<><IconButton label="打开工作区导航" icon={<Menu />} onClick={() => setMobileOpen(true)} /><span className="text-sm font-semibold">ToolPlane</span></>}
    header={heading}
    footer={<div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[10px] text-muted-foreground sm:px-6"><span>演示数据 · 未连接服务</span><span>{tabs.length} 个标签</span></div>}
    contentProps={{ id: panelId, role: 'tabpanel', 'aria-labelledby': tabId(active), tabIndex: 0, className: 'px-4 pb-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-6' }}
  >{pageContent}</WorkspaceShell>;
}
