'use client';
import { useState } from 'react';
import { DataTable, type ColumnDef } from '@/components/asharca/data-table';

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
  const [feedback, setFeedback] = useState('');
  return <div className="w-full max-w-3xl"><DataTable label="项目" data={projects} columns={columns} getRowId={(row) => row.id} pageSize={4}
    selectionToolbar={({ selectedIds, clearSelection }) => <button type="button" className="rounded-lg border border-border px-2.5 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setFeedback(`已处理 ${selectedIds.length} 个本地示例项目`); clearSelection(); }}>处理所选</button>} />
    <p role="status" className="mt-3 min-h-5 text-xs text-muted-foreground">{feedback || '排序和翻页不会改变行 ID，选择状态可以跨页保留。'}</p>
  </div>;
}
