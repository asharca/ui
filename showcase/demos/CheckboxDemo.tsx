import { useState } from "react";
import { Checkbox } from "../../src/index";
export function CheckboxDemo() {
  const [enabled, setEnabled] = useState(true);
  return <fieldset style={{ display: "grid", gap: 12 }}><legend>通知设置</legend>
    <label><Checkbox checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> 接收发布通知</label>
    <label><Checkbox defaultChecked /> 接收安全提醒</label><label><Checkbox disabled /> 管理员通知（不可用）</label>
    <p role="status">发布通知{enabled ? "已开启" : "已关闭"}</p>
  </fieldset>;
}
