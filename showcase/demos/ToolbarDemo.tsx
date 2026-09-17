import { useState } from "react";
import { Brain, Globe2, Paperclip, TerminalSquare } from "lucide-react";
import { ChatComposerToolbar } from "../../src/index";
export function ToolbarDemo() {
  const [pinned, setPinned] = useState(["web", "attachments"]); const [web, setWeb] = useState(true); const [status, setStatus] = useState("准备就绪");
  return <div style={{ display: "grid", gap: 16 }}><ChatComposerToolbar pinnedIds={pinned} onPinnedIdsChange={setPinned}
    labels={{ open: "添加工具", customize: "自定义工具栏", close: "关闭", reset: "重置工具栏", moveUp: (name) => `上移 ${name}`, moveDown: (name) => `下移 ${name}`, actionFailed: "演示工具执行失败，可以重试。" }}
    tools={[
      { id: "attachments", label: "添加附件", icon: <Paperclip />, group: "上下文", onSelect: () => setStatus("此独立演示未连接附件适配器。") },
      { id: "web", label: "联网搜索", icon: <Globe2 />, pressed: web, group: "工具", onSelect: () => { setWeb(!web); setStatus(web ? "联网搜索已关闭" : "联网搜索已开启"); } },
      { id: "skill", label: "运行技能", icon: <Brain />, group: "工具", description: "异步动作，执行中禁止重复点击", onSelect: async () => { setStatus("技能执行中…"); await new Promise((resolve) => setTimeout(resolve, 700)); setStatus("演示技能已完成"); } },
      { id: "terminal", label: "终端（权限不足）", icon: <TerminalSquare />, group: "沙箱", disabled: true, onSelect: () => {} },
    ]} /><p role="status">{status}</p><p>固定顺序只保存在此示例的内存中。</p></div>;
}
