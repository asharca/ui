import { Alert } from "../../src/index";
export function AlertDemo() {
  return <div style={{ display: "grid", gap: 12, width: "100%" }}><Alert tone="info">这里是本地演示，数据不会发送到服务器。</Alert><Alert tone="success">设置已保存。</Alert><Alert tone="warning">部分工具需要审批后才能运行。</Alert><Alert tone="danger">连接失败，请检查配置后重试。</Alert></div>;
}
