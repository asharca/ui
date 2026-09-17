import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import { Button, SidebarActionButton, SidebarActionRail } from "../../src/index";
export function SidebarActionRailDemo() {
  const [active, setActive] = useState(true); const [status, setStatus] = useState("准备就绪");
  return <div style={{ display: "grid", gap: 16 }}><div className="group" style={{ display: "flex", alignItems: "center", gap: 24, padding: 12 }}><span>设计助手</span><SidebarActionRail active={active}><SidebarActionButton aria-label="添加会话" onClick={() => setStatus("已添加会话")}><Plus size={16} /></SidebarActionButton><SidebarActionButton aria-label="助手设置" onClick={() => setStatus("已打开设置")}><Settings2 size={16} /></SidebarActionButton></SidebarActionRail></div><Button onClick={() => setActive(!active)}>{active ? "取消激活" : "激活条目"}</Button><p role="status">{status}</p></div>;
}
