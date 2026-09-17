import { useState } from "react";
import { Checkbox, SearchInput } from "../../src/index";
export function SearchDemo() {
  const [value, setValue] = useState("ToolPlane"); const [disabled, setDisabled] = useState(false); const [readOnly, setReadOnly] = useState(false);
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 440 }}><SearchInput label="搜索项目" clearLabel="清空搜索" value={value} onChange={(event) => setValue(event.target.value)} onClear={() => setValue("")} placeholder="搜索项目…" disabled={disabled} readOnly={readOnly} /><div style={{ display: "flex", gap: 16 }}><label><Checkbox checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /> 禁用</label><label><Checkbox checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} /> 只读</label></div><p>搜索词：{value || "（空）"}</p></div>;
}
