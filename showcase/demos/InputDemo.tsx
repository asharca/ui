import { useId, useState } from "react";
import { Field, FieldLabel, FieldDescription, FieldError, Input } from "../../src/index";
export function InputDemo() {
  const id = useId(); const [value, setValue] = useState(""); const invalid = value.length > 0 && value.length < 3;
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
    <Field><FieldLabel htmlFor={id}>项目名称</FieldLabel><Input id={id} value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={invalid} aria-describedby={`${id}-help${invalid ? ` ${id}-error` : ""}`} placeholder="至少输入三个字符" /><FieldDescription id={`${id}-help`}>用来辨认你的项目。</FieldDescription>{invalid && <FieldError id={`${id}-error`}>名称至少需要三个字符。</FieldError>}</Field>
    <Input aria-label="只读项目编号" value="PRJ-001" readOnly /><Input aria-label="禁用输入框" placeholder="当前不可用" disabled />
    <Input aria-label="小尺寸输入框" controlSize="sm" placeholder="小尺寸" /><Input aria-label="大尺寸输入框" controlSize="lg" placeholder="大尺寸" />
  </div>;
}
