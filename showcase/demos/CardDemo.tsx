import { Badge, Button, Card } from "../../src/index";
export function CardDemo() {
  return <div style={{ display: "grid", gap: 16, width: "100%" }}><Card><h3>设计系统</h3><p>统一组件与交互规范。</p><Badge tone="success">已发布</Badge></Card><Card muted><h3>团队工作区</h3><p>弱化卡片适合次要信息。</p><Button>查看详情</Button></Card><Card padded={false}><div style={{ padding: 20 }}>自定义内容间距</div></Card></div>;
}
