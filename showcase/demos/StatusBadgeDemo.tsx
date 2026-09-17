import { StatusBadge } from "../../src/index";
export function StatusBadgeDemo() {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}><StatusBadge tone="success" label="运行中" /><StatusBadge tone="warning" label="等待审批" /><StatusBadge tone="danger" label="连接失败" /><StatusBadge appearance="plain" label="未连接" /><StatusBadge dot={false} tone="brand" label="无状态点" /></div>;
}
