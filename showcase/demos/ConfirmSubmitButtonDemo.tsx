import { useState } from "react";
import { Button, ConfirmSubmitButton } from "../../src/index";
export function ConfirmSubmitButtonDemo() {
  const [deleted, setDeleted] = useState(false);
  return <div style={{ display: "grid", gap: 16 }}>{deleted ? <><p role="status">演示项目已删除。</p><Button onClick={() => setDeleted(false)}>重置</Button></> : <form action={async () => { await new Promise((resolve) => setTimeout(resolve, 500)); setDeleted(true); }}><ConfirmSubmitButton triggerLabel="删除演示项目" confirmLabel="确认删除" cancelLabel="取消" prompt="此操作会移除演示项目，是否继续？" pendingLabel="删除中…" /></form>}<p>按 Escape 可以取消未提交的确认。</p></div>;
}
