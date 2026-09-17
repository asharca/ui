import { useEffect, useRef, useState } from "react";
import { Checkbox, Select, ToolCallCard, zhCN, type ToolCallState } from "../../src/index";
export function ToolCallCardDemo() {
  const [state, setState] = useState<ToolCallState>("awaiting-approval"); const [failApproval, setFailApproval] = useState(false); const [large, setLarge] = useState(false);
  const generation = useRef(0);
  useEffect(() => () => { generation.current += 1; }, []);
  const states: ToolCallState[] = ["pending", "running", "awaiting-approval", "completed", "failed", "rejected", "cancelled"];
  return <div style={{ display: "grid", gap: 16, width: "100%" }}>
    <p>这是本地状态演示，不会执行真实工具。</p>
    <Select aria-label="工具执行状态" value={state} onChange={(event) => { generation.current += 1; setState(event.target.value as ToolCallState); }}>{states.map((item) => <option key={item} value={item}>{item}</option>)}</Select>
    <label><Checkbox checked={failApproval} onChange={(event) => setFailApproval(event.target.checked)} /> 模拟审批失败</label><label><Checkbox checked={large} onChange={(event) => setLarge(event.target.checked)} /> 展示大结果预览</label>
    <ToolCallCard name="mcp__workspace__search" state={state} labels={zhCN.toolCall} presentation={{ label: "搜索工作区", kind: "mcp", description: "检索项目名称和最近的更新。" }}
      input={{ query: "组件优化", limit: 10 }} output={large ? Array.from({ length: 500 }, (_, index) => ({ id: index, title: `演示结果 ${index + 1}`, description: "用于验证输出预览和延迟展开。" })) : state === "completed" ? { matches: 3, summary: "找到了三个相关项目。" } : state === "failed" ? { error: "模拟连接失败" } : undefined}
      onApprove={async (approved) => { const current = ++generation.current; if (failApproval) throw new Error("Simulated approval failure"); if (!approved) { setState("rejected"); return; } setState("running"); await new Promise((resolve) => setTimeout(resolve, 700)); if (current === generation.current) setState("completed"); }} />
  </div>;
}
