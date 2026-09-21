import { useState } from 'react';
import { Button, DataTable } from '../../src/index';

const rows = [{ id: 'design', name: 'Design System', status: '已发布' }, { id: 'app', name: 'Mobile App', status: '进行中' }, { id: 'agent', name: 'AI Workspace', status: '审核中' }];
export function GalleryTableDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return <div style={{ display: 'grid', gap: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ fontSize: 14 }}>你的项目</strong><span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{rows.length} projects</span></div><DataTable label="展厅项目" headers={[{ label: '项目' }, { label: '状态' }]} selectable strictSelection rowIds={rows.map((row) => row.id)} rowLabels={rows.map((row) => row.name)} selectedRowIds={selected} onSelectedRowIdsChange={setSelected} minWidth="18rem" selectionToolbar={({ clearSelection }) => <Button size="sm" variant="ghost" onClick={clearSelection}>取消选择</Button>}><tbody>{rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.status}</td></tr>)}</tbody></DataTable><span role="status" style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{selected.length ? `已选择 ${selected.length} 个项目` : '勾选项目，体验表头操作栏。'}</span></div>;
}
