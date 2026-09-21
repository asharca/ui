'use client';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/asharca/dropdown-menu';
export default function DropdownMenuDemo() {
  const [details, setDetails] = useState(true); const [action, setAction] = useState('还没有执行操作');
  return <div className="grid justify-items-center gap-4"><DropdownMenu><DropdownMenuTrigger asChild><button type="button" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs focus-visible:outline-2 focus-visible:outline-ring">项目操作<MoreHorizontal className="size-4" /></button></DropdownMenuTrigger><DropdownMenuContent align="center"><DropdownMenuLabel>当前项目</DropdownMenuLabel><DropdownMenuItem onSelect={() => setAction('已在本地演示中复制项目')}>复制项目</DropdownMenuItem><DropdownMenuCheckboxItem checked={details} onCheckedChange={(checked) => setDetails(checked === true)}>显示详细信息</DropdownMenuCheckboxItem><DropdownMenuSeparator /><DropdownMenuItem disabled>管理员设置</DropdownMenuItem><DropdownMenuItem danger onSelect={() => setAction('已在本地演示中归档项目')}>归档项目</DropdownMenuItem></DropdownMenuContent></DropdownMenu><p role="status" className="text-xs text-muted-foreground">{action}{details ? ' · 详情已显示' : ''}</p></div>;
}
