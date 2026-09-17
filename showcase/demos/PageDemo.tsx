import { useState } from "react";
import { Button, Card, Page, PageHeader } from "../../src/index";
export function PageDemo() {
  const [count, setCount] = useState(3);
  return <Page as="div"><PageHeader title="项目管理" description="查看团队项目，并创建新的工作空间。" meta={`${count} 个项目`} actions={<Button variant="primary" onClick={() => setCount(count + 1)}>新建项目</Button>} /><Card><p role="status">当前有 {count} 个项目。</p></Card></Page>;
}
