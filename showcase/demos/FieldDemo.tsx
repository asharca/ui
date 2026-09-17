import { useId, useState } from "react";
import { Button, Field, FieldDescription, FieldError, FieldLabel, Input } from "../../src/index";
export function FieldDemo() {
  const id = useId(); const [value, setValue] = useState(""); const [submitted, setSubmitted] = useState(false); const invalid = submitted && !value.trim();
  return <form noValidate onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}><Field><FieldLabel htmlFor={id}>工作区名称</FieldLabel><Input id={id} value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={invalid} aria-describedby={`${id}-help${invalid ? ` ${id}-error` : ""}`} required /><FieldDescription id={`${id}-help`}>输入一个方便团队辨认的名字。</FieldDescription>{invalid && <FieldError id={`${id}-error`}>名称不能为空。</FieldError>}</Field><Button type="submit" variant="primary">验证表单</Button>{submitted && !invalid && <p role="status">验证通过，未提交到服务器。</p>}</form>;
}
