import { useState } from "react";
import { Button, DataTable, SearchInput, Switch } from "../../src/index";

const projects = [
  { id: "design", name: "Design System", status: "已发布", owner: "Ava" },
  { id: "mobile", name: "Mobile App", status: "进行中", owner: "Leo" },
  { id: "api", name: "API Gateway", status: "风险", owner: "Mia" },
];

export function DataTableDemo() {
  const [data, setData] = useState(projects);
  const [toolbarEnabled, setToolbarEnabled] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(true);
  const normalizedQuery = query.trim().toLowerCase();
  const rows = data
    .filter((project) => `${project.name} ${project.status} ${project.owner}`.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => (ascending ? 1 : -1) * left.name.localeCompare(right.name));
  const visibleSelectedCount = rows.filter((row) => selected.includes(row.id)).length;

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <SearchInput
          label="筛选项目"
          clearLabel="清除项目筛选"
          placeholder="搜索项目、状态或负责人…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
        <Button size="sm" onClick={() => setAscending((value) => !value)}>
          {ascending ? "按项目倒序" : "按项目正序"}
        </Button>
        <Button size="sm" variant="ghost" disabled={selected.length === 0} onClick={() => setSelected([])}>
          清除选择
        </Button>
        <Button size="sm" variant="ghost" onClick={() => {
          setSelected([]);
          setQuery("");
          setAscending(true);
          setData(projects);
          setToolbarEnabled(true);
        }}>重置示例</Button>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
        <Switch checked={toolbarEnabled} onCheckedChange={setToolbarEnabled} aria-label="选中后显示表头操作栏" />
        选中后显示表头操作栏
      </label>
      <p role="status" style={{ margin: 0, fontSize: 13 }}>
        已选择 {selected.length} 项，当前结果中选中 {visibleSelectedCount} 项。
      </p>
      <DataTable
        label="项目列表"
        headers={[{ label: "项目" }, { label: "状态" }, { label: "负责人" }]}
        selectable
        strictSelection
        rowIds={rows.map((row) => row.id)}
        rowLabels={rows.map((row) => row.name)}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        selectionToolbar={toolbarEnabled && (({ selectedRowIds, clearSelection }) => (
          <>
            <Button size="sm" onClick={() => {
              setData((current) => current.map((row) => selectedRowIds.includes(row.id) ? { ...row, status: "已发布" } : row));
              clearSelection();
            }}>标记已发布</Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>取消选择</Button>
          </>
        ))}
        minWidth="32rem"
      >
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {rows.length === 0 && <p>没有匹配的项目，请调整筛选条件。</p>}
      <p style={{ margin: 0, fontSize: 12 }}>
        使用稳定的业务 ID 保持选择。排序和筛选不会改变已选对象，全选仅影响当前显示的行。开启上方选项可在表头显示批量操作，取消选择后平滑恢复列名。
      </p>
    </div>
  );
}
