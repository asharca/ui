'use client';

import { useId, useRef, useState } from 'react';
import { Bot, Boxes, Brain, LayoutDashboard, Menu, Plus, Plug, Settings2 } from 'lucide-react';
import { Button } from '@/components/asharca/button';
import { IconButton } from '@/components/asharca/icon-button';
import { WorkspaceShell } from '@/components/asharca/workspace-shell';
import { WorkspaceSidebar } from '@/components/asharca/workspace-sidebar';
import { WorkspaceTabBar, type WorkspaceTab } from '@/components/asharca/workspace-tab-bar';

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabs, setTabs] = useState(initial);
  const [active, setActive] = useState('overview');
  const [note, setNote] = useState('整理本周的工作区任务');
  const selected = tabs.find((tab) => tab.id === active)!;
  const panelId = `${instance}-panel`;
  const tabId = (id: string) => `${instance}-tab-${id}`;

  function open(id: string) {
    const item = groups.flatMap((group) => group.items).find((item) => item.id === id);
    if (!item) return;
    setTabs((current) => current.some((tab) => tab.id === id) ? current : [...current, { id, title: item.label, icon: item.icon }]);
    setActive(id);
  }
  function close(id: string) {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0 || tabs[index].pinned || tabs.length <= 1) return;
    const remaining = tabs.filter((tab) => tab.id !== id);
    const next = active === id ? remaining[Math.min(index, remaining.length - 1)].id : active;
    setTabs(remaining); setActive(next);
    requestAnimationFrame(() => document.getElementById(tabId(next))?.focus({ preventScroll: true }));
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

  return <WorkspaceShell
    data-demo="workspace-shell"
    className="h-[34rem] w-full max-w-5xl rounded-2xl"
    sidebar={<WorkspaceSidebar
      variant="inset" title="ToolPlane" groups={groups} activeId={active} onSelect={open}
      collapsed={collapsed} onCollapsedChange={setCollapsed}
      mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen}
      footer={<div className="flex items-center gap-2.5 px-1"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-background text-xs font-medium">TP</span><div className="min-w-0"><p className="truncate text-xs font-medium">个人工作区</p><p className="mt-0.5 text-[10px] text-muted-foreground">本地交互演示</p></div></div>}
    />}
    tabBar={<WorkspaceTabBar
      variant="inset" tabs={tabs.map((tab) => ({ ...tab, tabId: tabId(tab.id), panelId }))}
      activeTabId={active} onSelect={setActive} onClose={close} onReorder={reorder}
      onPinnedChange={(id, pinned) => setTabs((current) => current.map((tab) => tab.id === id ? { ...tab, pinned } : tab).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))))}
    />}
    mobileHeader={<><IconButton label="打开工作区导航" icon={<Menu />} onClick={() => setMobileOpen(true)} /><span className="text-sm font-semibold">ToolPlane</span></>}
    header={<div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="min-w-0"><p className="text-[10px] text-muted-foreground">个人工作区 / 工作台</p><h3 className="mt-1 truncate text-sm font-semibold">{selected.title}</h3></div>
      <Button size="sm" variant="secondary" onClick={() => { const id = `task-${++serial.current}`; setTabs((current) => [...current, { id, title: `临时任务 ${serial.current}`, icon: <Boxes /> }]); setActive(id); }}><Plus className="size-3.5" />新建标签</Button>
    </div>}
    footer={<div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[10px] text-muted-foreground sm:px-6"><span>演示数据 · 未连接服务</span><span>{tabs.length} 个标签</span></div>}
    contentProps={{ id: panelId, role: 'tabpanel', 'aria-labelledby': tabId(active), tabIndex: 0, className: 'px-4 pb-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-6' }}
  >
    <div className="grid grid-cols-1 gap-3 min-[1100px]:grid-cols-3">
      {[{ name: 'Agents', value: '06', icon: <Bot /> }, { name: 'MCP 服务', value: '12', icon: <Plug /> }, { name: 'Skills', value: '28', icon: <Brain /> }].map((item) => <div key={item.name} className="rounded-xl bg-muted/45 p-4"><div className="flex items-center justify-between gap-3 text-muted-foreground"><span className="text-xs">{item.name}</span><span aria-hidden="true" className="[&_svg]:size-4">{item.icon}</span></div><p className="mt-3 font-mono text-2xl tracking-tight">{item.value}</p></div>)}
    </div>
    <div className="mt-5 rounded-xl bg-muted/30 p-4"><label htmlFor={`${instance}-note`} className="text-xs font-medium">工作区便签</label><input id={`${instance}-note`} value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 h-9 w-full min-w-0 rounded-lg bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" /><p className="mt-2 text-[10px] leading-5 text-muted-foreground">折叠侧栏、切换标签时，便签不会丢失。此演示只保存在当前页面状态中。</p></div>
    <div className="mt-6"><h4 className="text-xs font-semibold">最近使用</h4><div className="mt-2 grid gap-1">{resources.map((name, index) => <div key={name} className="flex items-center gap-3 rounded-lg px-2 py-3"><span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Bot className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs">{name}</p><p className="mt-1 text-[10px] text-muted-foreground">示例 Agent · 最近访问记录</p></div><span className="shrink-0 text-[10px] text-muted-foreground">{index + 1} 小时前</span></div>)}</div></div>
  </WorkspaceShell>;
}
