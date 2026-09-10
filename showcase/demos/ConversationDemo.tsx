import { useState } from "react";
import * as UI from "../../src/index";

export function ConversationDemo() {
  const [selected, setSelected] = useState("one");
  const [conversations, setConversations] = useState([{ id: "one", title: "设计讨论" }, { id: "two", title: "发布计划" }]);
  return (
    <div style={{ width: 260, height: 240 }}>
      <UI.ConversationSidebar
        activeConversationId={selected}
        groups={[
          {
            id: "assistant",
            name: "工作助手",
            conversations,
          },
        ]}
        onSelectConversation={(item) => setSelected(item.id)}
        onConversationOrderChange={(_, ids) => setConversations((items) => [...items].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)))}
      />
    </div>
  );
}

