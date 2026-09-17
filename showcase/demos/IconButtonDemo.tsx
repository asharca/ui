import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { IconButton } from "../../src/index";
export function IconButtonDemo() {
  const [count, setCount] = useState(0);
  return <div style={{ display: "grid", gap: 16 }}><div style={{ display: "flex", gap: 12 }}>
    <IconButton label="添加项目" icon={<Plus />} onClick={() => setCount(count + 1)} />
    <IconButton label="确认" icon={<Check />} variant="primary" />
    <IconButton label="删除不可用" icon={<Trash2 />} variant="danger" disabled />
    <IconButton label="正在处理" icon={<Plus />} loading />
  </div><p role="status">已添加 {count} 项</p></div>;
}
