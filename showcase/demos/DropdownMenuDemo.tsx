import { useState } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from "../../src/index";
export function DropdownMenuDemo() {
  const [action, setAction] = useState("尚未执行操作");
  return <div><DropdownMenu><DropdownMenuTrigger asChild><Button>更多操作</Button></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent><DropdownMenuLabel>项目操作</DropdownMenuLabel><DropdownMenuGroup><DropdownMenuItem onSelect={() => setAction("已创建项目副本")}>创建副本</DropdownMenuItem><DropdownMenuItem onSelect={() => setAction("项目已归档")}>归档</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem disabled>删除（权限不足）</DropdownMenuItem></DropdownMenuContent></DropdownMenuPortal></DropdownMenu><p role="status">{action}</p></div>;
}
