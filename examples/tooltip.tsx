import { Button } from '@/components/asharca/button';
import { Tooltip } from '@/components/asharca/tooltip';
export default function TooltipDemo() {
  return <Tooltip content="源码会安装到你的项目，之后可以直接修改。"><Button variant="outline">悬停或聚焦查看说明</Button></Tooltip>;
}
