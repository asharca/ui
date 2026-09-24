"use client";
import { FileText, LayoutDashboard, Settings2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { WorkspaceTabBar, type WorkspaceTab } from "@/components/workspace/workspace-tab-bar";
export function WorkspaceTabBarPreview() {
  const instance = useId();
  const serial = useRef(0);
  const [tabs, setTabs] = useState<WorkspaceTab[]>([{ id: "home", title: "概览", pinned: true, icon: <LayoutDashboard /> }, { id: "draft", title: "草稿", dirty: true, icon: <FileText /> }, { id: "settings", title: "设置", icon: <Settings2 /> }]);
  const [active, setActive] = useState("home");
  return <WorkspaceShell className="h-64 rounded-xl" tabBar={<WorkspaceTabBar
    tabs={tabs.map((tab) => ({ ...tab, tabId: `${instance}-tab-${tab.id}`, panelId: `${instance}-panel-${tab.id}` }))} activeTabId={active} onSelect={setActive}
    onNewTab={() => { const id = `tab-${++serial.current}`; setTabs((items) => [...items, { id, title: `新标签 ${serial.current}` }]); setActive(id); }}
    onClose={(id) => { const next = tabs.filter((tab) => tab.id !== id); setTabs(next); if (id === active) setActive(next[0].id); }}
    onPinnedChange={(id, pinned) => setTabs((items) => items.map((tab) => tab.id === id ? { ...tab, pinned } : tab).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))))}
    onReorder={(a, b) => setTabs((items) => { const result = [...items]; const from = result.findIndex((tab) => tab.id === a); const to = result.findIndex((tab) => tab.id === b); if (from < 0 || to < 0) return items; result.splice(to, 0, result.splice(from, 1)[0]); return result; })}
  />}>
    {tabs.map((tab) => (
      // biome-ignore lint/a11y/noNoninteractiveTabindex: ARIA tabpanels need a keyboard entry point for their content.
      <div key={tab.id} role="tabpanel" id={`${instance}-panel-${tab.id}`} aria-labelledby={`${instance}-tab-${tab.id}`} hidden={active !== tab.id} tabIndex={0} className="p-6 text-sm outline-none">{tab.title}</div>))}
  </WorkspaceShell>;
}
