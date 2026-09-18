import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { Button, EmptyState, Entity } from "../../src/index";
export function EmptyStateDemo() {
  const [created, setCreated] = useState(false);
  return created ? <div style={{ display: "grid", gap: 16 }}><Entity title="我的第一个项目" initials="P1" description="项目已在本地演示中创建" /><Button onClick={() => setCreated(false)}>重置为空状态</Button></div> : <EmptyState icon={FolderOpen} title="暂无项目" description="创建一个项目，开始整理工具和工作流程。" actions={<Button variant="primary" onClick={() => setCreated(true)}>创建项目</Button>} />;
}
