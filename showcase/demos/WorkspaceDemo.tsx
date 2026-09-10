import { useState } from "react";
import { Plus, MessageSquare, Settings2 } from "lucide-react";
import * as UI from "../../src/index";

export function WorkspaceDemo() {
  const [tabs, setTabs] = useState([
    { id: "home", label: "概览", icon: MessageSquare, pinned: true },
    { id: "settings", label: "设置", icon: Settings2, pinned: false },
  ]);
  const [active, setActive] = useState("home");
  return (
    <div style={{ width: "100%" }}>
      <UI.WorkspaceTabBar
        tabs={tabs}
        activeTabId={active}
        onSelect={setActive}
        onClose={(id) => {
          if (tabs.length < 2) return;
          const next = tabs.filter((tab) => tab.id !== id);
          setTabs(next);
          if (active === id) setActive(next[0].id);
        }}
        onNewTab={() => {
          const id = crypto.randomUUID();
          setTabs([
            ...tabs,
            { id, label: "新标签", icon: Plus, pinned: false },
          ]);
          setActive(id);
        }}
        onTogglePinned={(id) =>
          setTabs(
            tabs
              .map((tab) =>
                tab.id === id ? { ...tab, pinned: !tab.pinned } : tab,
              )
              .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
          )
        }
        onReorder={(source, target) => {
          const a = tabs.findIndex((tab) => tab.id === source);
          const b = tabs.findIndex((tab) => tab.id === target);
          if (a < 0 || b < 0 || tabs[a].pinned !== tabs[b].pinned) return;
          const next = [...tabs];
          const [moved] = next.splice(a, 1);
          next.splice(b, 0, moved);
          setTabs(next);
        }}
        onOpenInNewWindow={() =>
          window.open(
            "?view=chat&detached=1#/examples/workspace",
            "_blank",
            "noopener,noreferrer",
          )
        }
      />
      <p style={{ padding: 24 }}>
        {tabs.find((tab) => tab.id === active)?.label}
      </p>
    </div>
  );
}

