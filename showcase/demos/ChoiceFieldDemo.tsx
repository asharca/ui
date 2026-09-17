import { useId, useState } from "react";
import { Button, ChoiceField, ChoiceGroup } from "../../src/index";

export function ChoiceFieldDemo() {
  const name = useId();
  const [mode, setMode] = useState("review");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return <form className="demo-choice-stack" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
    <ChoiceGroup legend="工具执行方式" description="这里是界面演示，不会执行任何真实工具。">
      <ChoiceField type="radio" variant="card" name={name} value="review" label="逐次确认" description="每次运行前展示工具名称、参数和审批按钮。适合需要明确掌控操作的场景。" checked={mode === "review"} onChange={(event) => setMode(event.target.value)} />
      <ChoiceField type="radio" variant="card" name={name} value="readonly" label="只读预览" description="仅展示参数与结果，不提供执行操作。" checked={mode === "readonly"} onChange={(event) => setMode(event.target.value)} />
      <ChoiceField type="radio" variant="card" name={name} value="managed" label="组织策略" description="由工作区管理员统一配置。" disabled />
    </ChoiceGroup>
    <ChoiceField name="acknowledged" label="我已了解所选执行方式" description="确认只影响当前演示，不会修改真实权限。" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} error={submitted && !agreed ? "请先勾选确认项。" : undefined} />
    <Button type="submit" variant="primary">保存演示设置</Button>
    {submitted && agreed && <p role="status" className="demo-status">设置已保存到本地演示状态。</p>}
  </form>;
}
