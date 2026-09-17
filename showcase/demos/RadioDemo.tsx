import { useId, useState } from "react";
import { ChoiceField, ChoiceGroup } from "../../src/index";

export function RadioDemo() {
  const name = useId();
  const [plan, setPlan] = useState("monthly");
  return <div className="demo-choice-stack">
    <ChoiceGroup legend="订阅周期" description="同组只能选择一个选项，可使用方向键切换。">
      <ChoiceField type="radio" name={name} value="monthly" label="按月订阅" description="每月结算，适合短期使用。" checked={plan === "monthly"} onChange={(event) => setPlan(event.target.value)} />
      <ChoiceField type="radio" name={name} value="yearly" label="按年订阅" description="按年统一结算，适合有长期使用计划的团队。" checked={plan === "yearly"} onChange={(event) => setPlan(event.target.value)} />
      <ChoiceField type="radio" name={name} value="enterprise" label="企业定制" description="需要先联系管理员，此选项暂不可用。" disabled />
    </ChoiceGroup>
    <p role="status" className="demo-status">当前选择：{plan === "monthly" ? "按月订阅" : "按年订阅"}</p>
  </div>;
}
