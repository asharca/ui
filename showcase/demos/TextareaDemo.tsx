import { useId, useState } from "react";
import { Field, FieldLabel, FieldDescription, Textarea } from "../../src/index";
export function TextareaDemo() {
  const id = useId(); const [text, setText] = useState("");
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 480 }}>
    <Field><FieldLabel htmlFor={id}>项目说明</FieldLabel><Textarea id={id} value={text} onChange={(event) => setText(event.target.value)} maxLength={200} rows={4} aria-describedby={`${id}-count`} placeholder="输入说明，可以换行…" /><FieldDescription id={`${id}-count`}>{text.length} / 200 个字符</FieldDescription></Field>
    <Textarea aria-label="只读说明" value="这段内容可以选择和复制，但不能编辑。" readOnly /><Textarea aria-label="禁用说明" placeholder="当前不可编辑" disabled />
  </div>;
}
