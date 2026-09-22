'use client';
import { useState } from 'react';
import { Folder, Home, Menu, Settings } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/asharca/workspace-sidebar';
const groups = [{ id: 'main', title: '工作区', items: [{ id: 'overview', label: '概览', icon: <Home /> }, { id: 'projects', label: '项目', icon: <Folder />, badge: 12 }, { id: 'settings', label: '设置', icon: <Settings /> }] }];
export default function WorkspaceSidebarDemo() {
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  return <div data-demo="workspace-sidebar" className="flex h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background">
    <WorkspaceSidebar groups={groups} activeId={active} onSelect={setActive} collapsed={collapsed} onCollapsedChange={setCollapsed} mobileOpen={mobile} onMobileOpenChange={setMobile} title="我的工作区" footer={<p className="text-[10px] text-muted-foreground">本地演示 · 未连接服务</p>} />
    <div data-demo="workspace-content" className="min-w-0 flex-1 p-5">
      <button type="button" className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs sm:hidden focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setMobile(true)}><Menu className="size-4" />打开工作区导航</button>
      <h3 className="text-sm font-medium">{groups[0].items.find((item) => item.id === active)?.label}</h3>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">图标保持在同一轴线，文字淡入淡出；手机上以抽屉打开。</p>
    </div>
  </div>;
}
