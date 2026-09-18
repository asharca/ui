import { useState } from "react";
import { FileText } from "lucide-react";
import { WorkspaceTabBar, type WorkspaceTab } from "../../src/index";
export function WorkspaceDemo() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([{ id: "overview", label: "工作区概览", icon: FileText, pinned: true }, { id: "chat", label: "助手会话", icon: FileText, pinned: false }, { id: "settings", label: "设置", icon: FileText, pinned: false }]);
  const [active, setActive] = useState("overview"); const [status, setStatus] = useState("方向键切换；Alt+Shift+方向键调整顺序。");
  return <div style={{ display: "grid", gap: 16, width: "100%" }}><WorkspaceTabBar tabs={tabs} activeTabId={active} onSelect={setActive} closeOnDoubleClick={false} showReorderButtons
    labels={{ navigation: "打开的页面", newTab: "新建标签", close: (name) => `关闭 ${name}`, pin: (name) => `固定 ${name}`, unpin: (name) => `取消固定 ${name}`, openInNewWindow: (name) => `在新窗口打开 ${name}`, moveLeft: (name) => `左移 ${name}`, moveRight: (name) => `右移 ${name}` }}
    onClose={(id) => { const next = tabs.filter((tab) => tab.id !== id); if (!next.length) return; setTabs(next); if (active === id) setActive(next[0].id); }}
    onNewTab={() => { const id = crypto.randomUUID(); setTabs([...tabs, { id, label: `页面 ${tabs.length + 1}`, icon: FileText, pinned: false }]); setActive(id); }}
    onTogglePinned={(id) => setTabs(tabs.map((tab) => tab.id === id ? { ...tab, pinned: !tab.pinned } : tab))}
    onOpenInNewWindow={(id) => setStatus(`演示回调：请求在新窗口打开 ${tabs.find((tab) => tab.id === id)?.label}`)}
    onReorder={(source, target) => { const next = [...tabs]; const from = next.findIndex((tab) => tab.id === source); const to = next.findIndex((tab) => tab.id === target); if (from < 0 || to < 0) return; const [item] = next.splice(from, 1); next.splice(to, 0, item); setTabs(next); }} />
    <p role="status">{status}</p><p>当前页面：{tabs.find((tab) => tab.id === active)?.label}</p>
  </div>;
}
