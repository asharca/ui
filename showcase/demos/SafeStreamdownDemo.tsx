import { useState } from "react";
import { SafeStreamdown, Textarea } from "../../src/index";
export function SafeStreamdownDemo() {
  const [markdown, setMarkdown] = useState("## 发布计划\n\n- 检查组件\n- 验证构建\n\n| 状态 | 数量 |\n| --- | --- |\n| 完成 | 12 |\n\n```ts\nconst ready = true;\n```");
  return <div style={{ display: "grid", gap: 20, width: "100%" }}><Textarea aria-label="Markdown 源码" rows={6} value={markdown} onChange={(event) => setMarkdown(event.target.value)} /><SafeStreamdown mode="static">{markdown}</SafeStreamdown></div>;
}
