import { Entity } from "../../src/index";
export function EntityDemo() {
  return <div style={{ display: "grid", gap: 20, maxWidth: 320 }}><Entity title="Design System" description="团队共享组件" initials="DS" /><Entity title="mcp__workspace__search" description="搜索工具标识" initials="MC" mono /><Entity title="一个用于验证窄屏截断行为的较长项目名称" description="辅助说明仍保持紧凑" initials="项目" /></div>;
}
