import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/index";
export function TabsDemo() {
  const [value, setValue] = useState("account");
  return <Tabs value={value} onValueChange={setValue}><TabsList aria-label="设置类别"><TabsTrigger value="account">账号</TabsTrigger><TabsTrigger value="security">安全</TabsTrigger><TabsTrigger value="billing" disabled>账单（不可用）</TabsTrigger></TabsList><TabsContent value="account">管理名称和工作区信息。</TabsContent><TabsContent value="security">管理安全设置和访问权限。</TabsContent><p>当前面板：{value}</p></Tabs>;
}
