'use client';
import { useState } from 'react';
import { CheckCheck, Download } from 'lucide-react';
import { DataTable, type ColumnDef } from '@/components/asharca/data-table';
import { Button } from '@/components/asharca/button';

type Project = { id: string; name: string; status: string; files: number };
const projects: Project[] = [
  { id: 'p1', name: 'Alpha', status: '已完成', files: 24 },
  { id: 'p2', name: 'Beta', status: '进行中', files: 12 },
  { id: 'p3', name: 'Gamma', status: '待检查', files: 8 },
  { id: 'p4', name: 'Delta', status: '已完成', files: 36 },
  { id: 'p5', name: 'Epsilon', status: '进行中', files: 18 },
  { id: 'p6', name: 'Zeta', status: '待检查', files: 6 },
  { id: 'p7', name: 'Eta', status: '已完成', files: 42 },
  { id: 'p8', name: 'Theta', status: '进行中', files: 15 },
];
const columns: ColumnDef<Project>[] = [
  { accessorKey: 'name', header: '项目', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: 'status', header: '状态', cell: ({ row }) => <span className="whitespace-nowrap rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">{row.original.status}</span> },
  { accessorKey: 'files', header: '文件数', cell: ({ row }) => <span className="font-mono tabular-nums">{row.original.files}</span> },
];
export default function DataTableDemo() {
  const [data, setData] = useState(projects);
  const [feedback, setFeedback] = useState('');
  const [presentation, setPresentation] = useState<'header' | 'toolbar'>('header');
  function exportRows(ids: string[]) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data.filter((row) => ids.includes(row.id)), null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'selected-projects.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback(`已导出 ${ids.length} 个本地示例项目`);
  }
  return <div className="w-full max-w-3xl" data-demo="table-selection">
    <div role="group" aria-label="选择操作展示方式" className="mb-4 flex flex-wrap items-center gap-1">
      <Button variant={presentation === 'header' ? 'secondary' : 'ghost'} size="sm" aria-pressed={presentation === 'header'} onClick={() => setPresentation('header')}>表头切换</Button>
      <Button variant={presentation === 'toolbar' ? 'secondary' : 'ghost'} size="sm" aria-pressed={presentation === 'toolbar'} onClick={() => setPresentation('toolbar')}>独立工具栏</Button>
    </div>
    <DataTable label="项目" data={data} columns={columns} getRowId={(row) => row.id} pageSize={4} selectionPresentation={presentation}
      selectionToolbar={({ selectedIds, clearSelection }) => <>
        <Button size="sm" variant="secondary" onClick={() => { setData((items) => items.map((row) => selectedIds.includes(row.id) ? { ...row, status: '已完成' } : row)); setFeedback(`已处理 ${selectedIds.length} 个本地示例项目`); clearSelection(); }}><CheckCheck aria-hidden="true" className="size-3.5" />处理所选</Button>
        <Button size="sm" variant="ghost" onClick={() => exportRows(selectedIds)}><Download aria-hidden="true" className="size-3.5" />导出</Button>
      </>} />
    <p role="status" className="mt-3 min-h-5 text-xs leading-5 text-muted-foreground">{feedback || '勾选后表头原位切换；选择跨页保留，操作仅修改本地演示数据。'}</p>
  </div>;
}
