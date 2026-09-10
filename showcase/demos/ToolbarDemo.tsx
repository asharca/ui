import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import * as UI from "../../src/index";

export function ToolbarDemo() {
  const [ids, setIds] = useState<string[]>([]);
  const [message, setMessage] = useState("准备就绪");
  return (
    <div>
      <UI.ChatComposerToolbar
        pinnedIds={ids}
        onPinnedIdsChange={setIds}
        tools={[
          {
            id: "new",
            label: "新建会话",
            icon: <Plus size={16} />,
            onSelect: () => setMessage("已新建会话"),
          },
          {
            id: "settings",
            label: "偏好设置",
            icon: <Settings2 size={16} />,
            onSelect: () => setMessage("已选择偏好设置"),
          },
        ]}
      />
      <p role="status">{message}</p>
    </div>
  );
}

