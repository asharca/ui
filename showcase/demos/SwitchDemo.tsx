import { useId, useState } from "react";
import { Switch } from "../../src/index";
export function SwitchDemo() {
  const id = useId(); const [enabled, setEnabled] = useState(true);
  return <div style={{ display: "grid", gap: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Switch id={id} checked={enabled} onCheckedChange={setEnabled} /><label htmlFor={id}>自动保存</label></div><p role="status">自动保存{enabled ? "已开启" : "已关闭"}</p><Switch aria-label="不可用的开关" disabled /></div>;
}
