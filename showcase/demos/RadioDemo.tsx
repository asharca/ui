import { useId, useState } from "react";
import { Radio } from "../../src/index";
export function RadioDemo() {
  const name = useId(); const [plan, setPlan] = useState("monthly");
  return <fieldset style={{ display: "grid", gap: 12 }}><legend>计费周期</legend>
    <label><Radio name={name} value="monthly" checked={plan === "monthly"} onChange={() => setPlan("monthly")} /> 按月</label>
    <label><Radio name={name} value="yearly" checked={plan === "yearly"} onChange={() => setPlan("yearly")} /> 按年</label>
    <label><Radio name={name} value="enterprise" disabled /> 企业方案（暂不可选）</label><p role="status">当前选择：{plan === "monthly" ? "按月" : "按年"}</p>
  </fieldset>;
}
