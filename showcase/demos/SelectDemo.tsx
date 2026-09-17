import { useId, useState } from "react";
import { Field, FieldLabel, NativeSelect, Select } from "../../src/index";
export function SelectDemo() {
  const id = useId(); const [environment, setEnvironment] = useState("dev");
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}>
    <Field><FieldLabel htmlFor={id}>发布环境</FieldLabel><Select id={id} value={environment} onChange={(event) => setEnvironment(event.target.value)}><option value="dev">开发环境</option><option value="staging">预发布环境</option><option value="production">生产环境</option></Select></Field>
    <p role="status">当前环境：{environment}</p><NativeSelect aria-label="禁用选择器" disabled><option>权限不足</option></NativeSelect>
  </div>;
}
