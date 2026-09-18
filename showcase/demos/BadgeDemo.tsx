import { Badge, type FeedbackTone } from "../../src/index";
export function BadgeDemo() {
  const states: [FeedbackTone, string][] = [["neutral", "草稿"], ["brand", "推荐"], ["success", "已发布"], ["warning", "待处理"], ["danger", "失败"]];
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{states.map(([tone, label]) => <Badge key={tone} tone={tone}>{label}</Badge>)}</div>;
}
