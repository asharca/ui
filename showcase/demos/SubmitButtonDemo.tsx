import { useState } from "react";
import { Checkbox, SubmitButton } from "../../src/index";
export function SubmitButtonDemo() {
  const [fail, setFail] = useState(false); const [error, setError] = useState("");
  return <form action={async () => { setError(""); await new Promise((resolve) => setTimeout(resolve, 700)); setError(fail ? "模拟保存失败，请重试。" : ""); }} style={{ display: "grid", gap: 16 }}><label><Checkbox checked={fail} onChange={(event) => setFail(event.target.checked)} /> 模拟失败</label><SubmitButton pendingLabel="保存中…" savedLabel="已保存" error={error}>保存设置</SubmitButton>{error && <p role="alert">{error}</p>}</form>;
}
