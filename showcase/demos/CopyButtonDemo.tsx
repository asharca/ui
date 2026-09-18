import { useState } from "react";
import { CopyButton, Textarea } from "../../src/index";
export function CopyButtonDemo() {
  const [text, setText] = useState("pnpm add @asharca/ui");
  return <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 440 }}><Textarea aria-label="要复制的内容" value={text} onChange={(event) => setText(event.target.value)} /><div style={{ display: "flex", gap: 12 }}><CopyButton text={text} label="复制内容" copiedLabel="已复制" failedLabel="复制失败" copyingLabel="复制中…" /><CopyButton text={text} label="复制命令" copiedLabel="已复制" failedLabel="复制失败" iconOnly /></div><p>浏览器拒绝权限时会显示失败状态。</p></div>;
}
