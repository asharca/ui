import { useState } from "react";
import { MessageSquare, Settings2 } from "lucide-react";
import * as UI from "../../src/index";

export function WorkspaceSidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  return <div className="docs-sidebar-preview"><UI.WorkspaceSidebar
    brand="Workspace" brandIcon={<Settings2 size={22} />} brandLabel="工作区首页" onBrandClick={() => setActive("overview")}
    collapsed={collapsed} onCollapsedChange={setCollapsed} activeId={active} onSelect={setActive}
    navigationLabel="工作区导航示例" sectionLabel="工作区"
    labels={{ collapse: "折叠侧边栏", expand: "展开侧边栏" }}
    workspace={{ icon: "W", name: "Design workspace", description: "Personal workspace" }}
    items={[{ id: "overview", label: "概览", icon: <MessageSquare size={18} />, badge: 9 }, { id: "settings", label: "设置", icon: <Settings2 size={18} /> }]}
    footer={<><UI.Avatar style={{ width: 30, height: 30 }}><UI.AvatarFallback>AC</UI.AvatarFallback></UI.Avatar><span>工作空间</span></>}
  /></div>;
}

