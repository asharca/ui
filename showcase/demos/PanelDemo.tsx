import { Button, Panel, Switch } from "../../src/index";
export function PanelDemo() {
  return <div style={{ display: "grid", gap: 16, width: "100%" }}><Panel title="运行设置" description="控制工作区默认行为" headerPresentation="bordered" actions={<Switch aria-label="自动运行" defaultChecked />}>修改设置由宿主保存。</Panel><Panel title="危险区域" description="删除前请备份数据" tone="danger"><Button variant="danger-secondary">查看删除说明</Button></Panel></div>;
}
