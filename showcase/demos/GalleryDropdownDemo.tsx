import { useState } from 'react';
import { Archive, ChevronDown, Copy, Pencil } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from '../../src/index';

export function GalleryDropdownDemo() {
  const [action, setAction] = useState('项目操作');
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" style={{ borderRadius: 999, minWidth: 126 }}>{action}<ChevronDown size={14} /></Button></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent style={{ minWidth: 184 }}><DropdownMenuItem onSelect={() => setAction('已重命名')}><Pencil size={14} />重命名</DropdownMenuItem><DropdownMenuItem onSelect={() => setAction('已创建副本')}><Copy size={14} />创建副本</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => setAction('已归档')}><Archive size={14} />归档</DropdownMenuItem></DropdownMenuContent></DropdownMenuPortal></DropdownMenu>;
}
