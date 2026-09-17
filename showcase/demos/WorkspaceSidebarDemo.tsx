import { useEffect, useRef, useState } from "react";
import { MessageSquare, Settings2 } from "lucide-react";
import { Avatar, AvatarFallback, Button, WorkspaceSidebar } from "../../src/index";
export function WorkspaceSidebarDemo() {
  const [collapsed, setCollapsed] = useState(false); const [active, setActive] = useState("overview"); const [mobileOpen, setMobileOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null); const close = useRef<HTMLButtonElement>(null); const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    close.current?.focus();
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMobileOpen(false); }
      if (event.key !== "Tab") return;
      const nodes = Array.from(sidebar.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]') ?? []).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); trigger.current?.focus(); };
  }, [mobileOpen]);
  return <div style={{ display: "flex", minHeight: 360, width: "100%", borderRadius: 8, overflow: "hidden" }}>
    {mobileOpen && <button type="button" aria-label="关闭导航遮罩" onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "#0006", zIndex: 29 }} />}
    <WorkspaceSidebar ref={sidebar} mobileCloseRef={close} brand="Workspace" brandIcon={<Settings2 size={22} />} brandLabel="工作区首页" onBrandClick={() => setActive("overview")}
      collapsed={collapsed} onCollapsedChange={setCollapsed} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} activeId={active} onSelect={(id) => { setActive(id); setMobileOpen(false); }}
      navigationLabel="工作区导航示例" sectionLabel="工作区" labels={{ collapse: "折叠侧边栏", expand: "展开侧边栏", close: "关闭导航" }}
      workspace={{ icon: "W", name: "Design workspace", description: "个人工作区" }}
      items={[{ id: "overview", label: "概览", icon: <MessageSquare size={18} />, badge: 9 }, { id: "settings", label: "设置", icon: <Settings2 size={18} /> }, { id: "locked", label: "受限页面", icon: <Settings2 size={18} />, disabled: true }]}
      footer={<><Avatar style={{ width: 30, height: 30 }}><AvatarFallback>AC</AvatarFallback></Avatar><span>工作空间</span></>} />
    <div inert={mobileOpen} style={{ padding: 20, flex: 1, minWidth: 0 }}><Button ref={trigger} className="demo-mobile-action" onClick={() => setMobileOpen(true)}>打开导航</Button><p role="status">当前页面：{active === "overview" ? "概览" : "设置"}</p><p>试试折叠和窄屏预览。</p></div>
  </div>;
}
