import { useState } from "react";
import { Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuPortal, ContextMenuSeparator, ContextMenuTrigger } from "../../src/index";
export function ContextMenuDemo() {
  const [status, setStatus] = useState("尚未查看详情");
  return <div style={{ display: "grid", gap: 16 }}><ContextMenu><ContextMenuTrigger style={{ display: "block", padding: 40, border: "1px dashed currentColor", borderRadius: 8 }}>右键或长按这个区域</ContextMenuTrigger><ContextMenuPortal><ContextMenuContent><ContextMenuItem onSelect={() => setStatus("项目详情已打开")}>查看详情</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem disabled>删除项目</ContextMenuItem></ContextMenuContent></ContextMenuPortal></ContextMenu><Button onClick={() => setStatus("项目详情已打开")}>查看详情（键盘入口）</Button><p role="status">{status}</p></div>;
}
