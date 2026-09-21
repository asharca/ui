'use client';
import { useState, type ReactNode } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type RowSelectionState, type SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Checkbox } from './checkbox';
import { SearchInput } from './search-input';
import { Pagination } from './pagination';
import { Button } from './button';
import { cn } from './utils';

export type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  label: string;
  pageSize?: number;
  searchable?: boolean;
  selectable?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  selectionToolbar?: (context: { selectedIds: string[]; clearSelection: () => void }) => ReactNode;
  emptyText?: string;
  className?: string;
}

/** IDs are mandatory: indexes are not stable after sorting, filtering or refresh. */
export function DataTable<T>({ data, columns, getRowId, label, pageSize = 5, searchable = true, selectable = true, rowSelection, onRowSelectionChange, selectionToolbar, emptyText = '没有匹配的数据。', className }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [query, setQuery] = useState('');
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>({});
  const selected = rowSelection ?? internalSelection;
  const ids = data.map(getRowId);
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) throw new Error('DataTable requires non-empty unique row IDs.');
  function changeSelection(next: RowSelectionState) {
    if (rowSelection === undefined) setInternalSelection(next);
    onRowSelectionChange?.(next);
  }
  const table = useReactTable({
    data, columns, getRowId,
    state: { sorting, globalFilter: query, rowSelection: selected },
    onSortingChange: setSorting, onGlobalFilterChange: setQuery,
    onRowSelectionChange: (updater) => changeSelection(typeof updater === 'function' ? updater(selected) : updater),
    enableRowSelection: selectable,
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageSize: Math.max(1, Math.floor(pageSize)) } },
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
  });
  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const clearSelection = () => changeSelection({});
  const rows = table.getRowModel().rows;
  return <div className={cn('grid w-full min-w-0 gap-3 text-sm', className)}>
    {searchable && <SearchInput label={`搜索${label}`} value={query} onChange={(event) => { setQuery(event.target.value); table.setPageIndex(0); }} onClear={() => { setQuery(''); table.setPageIndex(0); }} placeholder="搜索数据…" className="w-full max-w-xs" />}
    {selectedIds.length > 0 && <div role="group" aria-label="已选行操作" className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 p-2.5">
      <span role="status" className="mr-auto text-xs">已选 {selectedIds.length} 项</span>{selectionToolbar?.({ selectedIds, clearSelection })}
      <Button size="sm" variant="ghost" onClick={clearSelection}>清空选择</Button>
    </div>}
    <div role="region" aria-label={`${label}表格`} tabIndex={0} className="min-w-0 overflow-x-auto rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <table className="w-full border-collapse text-left text-xs">
        <caption className="sr-only">{label}</caption>
        <thead className="bg-muted/35 text-muted-foreground">
          {table.getHeaderGroups().map((group) => <tr key={group.id}>
            {selectable && <th scope="col" className="w-10 px-3 py-3"><Checkbox label={<span className="sr-only">选择本页全部</span>} checked={table.getIsAllPageRowsSelected() && rows.length > 0} indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()} disabled={!rows.length} onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)} wrapperClassName="gap-0" /></th>}
            {group.headers.map((header) => <th key={header.id} colSpan={header.colSpan} scope="col" aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined} className="whitespace-nowrap px-3 py-3 font-medium">
              {!header.isPlaceholder && (header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? <ArrowUp aria-hidden="true" className="size-3" /> : header.column.getIsSorted() === 'desc' ? <ArrowDown aria-hidden="true" className="size-3" /> : <ArrowUpDown aria-hidden="true" className="size-3 opacity-50" />}
              </button> : flexRender(header.column.columnDef.header, header.getContext()))}
            </th>)}
          </tr>)}
        </thead>
        <tbody>{rows.length ? rows.map((row) => <tr key={row.id} data-selected={row.getIsSelected() || undefined} className="border-t border-border hover:bg-muted/25 data-[selected]:bg-muted/50">
          {selectable && <td className="px-3 py-3"><Checkbox label={<span className="sr-only">选择行 {row.id}</span>} checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={(event) => row.toggleSelected(event.target.checked)} wrapperClassName="gap-0" /></td>}
          {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-3 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
        </tr>) : <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">{emptyText}</td></tr>}</tbody>
      </table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">共 {table.getFilteredRowModel().rows.length} 项</span><Pagination page={table.getState().pagination.pageIndex + 1} pageCount={table.getPageCount()} onPageChange={(page) => table.setPageIndex(page - 1)} /></div>
  </div>;
}
