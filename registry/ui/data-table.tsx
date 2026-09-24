'use client';
import { useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type RowSelectionState, type SortingState } from '@tanstack/react-table';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCheck, X } from 'lucide-react';
import { Checkbox } from './checkbox';
import { SearchInput } from './search-input';
import { Pagination } from './pagination';
import { Button } from './button';
import { cn, easeOut } from './utils';

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
  /** Actions replace column titles in-place. Selection remains page-independent. */
  selectionToolbar?: (context: { selectedIds: string[]; clearSelection: () => void }) => ReactNode;
  /** Use toolbar to retain the previous separate toolbar and always-visible columns. */
  selectionPresentation?: 'header' | 'toolbar';
  emptyText?: string;
  className?: string;
}

function SelectionActions({ selectedIds, clearSelection, children, containerRef, inset = false }: {
  selectedIds: string[]; clearSelection: () => void; children: ReactNode;
  containerRef: RefObject<HTMLDivElement | null>; inset?: boolean;
}) {
  const reduce = useReducedMotion();
  const present = useIsPresent();
  return <motion.div ref={containerRef} role="group" aria-label="已选行操作" aria-hidden={!present || undefined} inert={!present || undefined}
    data-slot="table-selection-actions" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: 'blur(3px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: 'blur(2px)' }}
    transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
    onKeyDown={(event) => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); clearSelection(); } }}
    className={cn('flex min-w-0 items-center gap-3 bg-background text-foreground', inset ? 'h-full px-3' : 'rounded-xl border border-border p-2.5')}>
    <CheckCheck aria-hidden="true" className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
    <span className="grid shrink-0 overflow-hidden text-xs font-medium tabular-nums" role="status" aria-live="polite" aria-atomic="true">
      <motion.span key={selectedIds.length} initial={reduce ? false : { y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.16, ease: easeOut }}>
        已选 {selectedIds.length} 项
      </motion.span>
    </span>
    <div className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:thin]">
      {children}
      <Button size="sm" variant="ghost" onClick={clearSelection} className="shrink-0"><X aria-hidden="true" className="size-3.5" />清空选择</Button>
    </div>
  </motion.div>;
}

/** IDs are mandatory: indexes are not stable after sorting, filtering or refresh. */
export function DataTable<T>({ data, columns, getRowId, label, pageSize = 5, searchable = true, selectable = true, rowSelection, onRowSelectionChange, selectionToolbar, selectionPresentation = 'header', emptyText = '没有匹配的数据。', className }: DataTableProps<T>) {
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
    enableRowSelection: selectable, globalFilterFn: 'includesString',
    initialState: { pagination: { pageSize: Math.max(1, Math.floor(pageSize)) } },
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
  });
  const selectedIds = selectable ? Object.keys(selected).filter((id) => selected[id]) : [];
  const clearSelection = () => changeSelection({});
  const selecting = selectedIds.length > 0;
  const replacing = selecting && selectionPresentation === 'header';
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const wasSelecting = useRef(selecting);
  const [headerHeight, setHeaderHeight] = useState(52);
  const tableId = useId();
  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => setHeaderHeight(header.getBoundingClientRect().height || 52);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (wasSelecting.current && !selecting && actionsRef.current?.contains(document.activeElement)) {
      const target = selectAllRef.current;
      if (target && !target.disabled) target.focus({ preventScroll: true });
      else regionRef.current?.focus({ preventScroll: true });
    }
    wasSelecting.current = selecting;
  }, [selecting]);
  const actions = <SelectionActions selectedIds={selectedIds} clearSelection={clearSelection} containerRef={actionsRef} inset={selectionPresentation === 'header'}>
    {selectionToolbar?.({ selectedIds, clearSelection })}
  </SelectionActions>;
  return <div data-slot="data-table" className={cn('grid w-full min-w-0 gap-3 text-sm', className)}>
    {searchable && <SearchInput label={`搜索${label}`} value={query} onChange={(event) => { setQuery(event.target.value); table.setPageIndex(0); }} onClear={() => { setQuery(''); table.setPageIndex(0); }} placeholder="搜索数据…" className="w-full max-w-xs" />}
    {selectionPresentation === 'toolbar' && <AnimatePresence initial={false}>{selecting && actions}</AnimatePresence>}
    <div data-slot="table-frame" className="relative isolate min-w-0 overflow-hidden rounded-xl border border-border bg-background">
      <div ref={regionRef} role="region" aria-label={`${label}表格`} tabIndex={0} className="min-w-0 overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <table className="w-full border-collapse text-left text-xs">
          <caption className="sr-only">{label}</caption>
          <colgroup>{selectable && <col style={{ width: 44 }} />}{table.getVisibleLeafColumns().map((column) => <col key={column.id} />)}</colgroup>
          <thead ref={headerRef} data-slot="table-header" className="bg-muted/35 text-muted-foreground">
            {headerGroups.map((group, index) => <tr key={group.id}>
              {selectable && index === 0 && <th scope="col" rowSpan={headerGroups.length} className="sticky left-0 z-20 w-11 min-w-11 bg-background px-3">
                <Checkbox ref={selectAllRef} label={<span className="sr-only">选择本页全部</span>} checked={table.getIsAllPageRowsSelected() && rows.length > 0}
                  indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()} disabled={!rows.length}
                  onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)} wrapperClassName="gap-0" />
              </th>}
              {group.headers.map((header) => <th key={header.id} id={`${tableId}-${header.id}`} colSpan={header.colSpan} scope={header.colSpan > 1 ? 'colgroup' : 'col'}
                aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined}
                className="h-[52px] whitespace-nowrap px-3 py-2 font-medium">
                {/* Retain real cells and their intrinsic widths. Hide interactive
                    titles during selection, but keep static column semantics. */}
                {replacing && !header.isPlaceholder && <span className="sr-only">{typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : header.column.id}</span>}
                <motion.div data-slot="table-column-title" inert={replacing || undefined} aria-hidden={replacing || undefined} initial={false}
                  animate={{ opacity: replacing ? 0 : 1, y: reduce ? 0 : replacing ? -4 : 0 }} transition={{ duration: reduce ? 0 : 0.15, ease: easeOut }}>
                  {!header.isPlaceholder && (header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? <ArrowUp aria-hidden="true" className="size-3" /> : header.column.getIsSorted() === 'desc' ? <ArrowDown aria-hidden="true" className="size-3" /> : <ArrowUpDown aria-hidden="true" className="size-3 opacity-50" />}
                  </button> : flexRender(header.column.columnDef.header, header.getContext()))}
                </motion.div>
              </th>)}
            </tr>)}
          </thead>
          <tbody>{rows.length ? rows.map((row) => <tr key={row.id} data-selected={row.getIsSelected() || undefined} className="border-t border-border hover:bg-muted/25 data-[selected]:bg-muted/50 motion-safe:transition-colors motion-safe:duration-150">
            {selectable && <td className="px-3 py-3"><Checkbox label={<span className="sr-only">选择行 {row.id}</span>} checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={(event) => row.toggleSelected(event.target.checked)} wrapperClassName="gap-0" /></td>}
            {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-3 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
          </tr>) : <tr><td colSpan={table.getVisibleLeafColumns().length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">{emptyText}</td></tr>}</tbody>
        </table>
      </div>
      {selectionPresentation === 'header' && <div className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden pl-11" style={{ height: headerHeight }}>
        <AnimatePresence initial={false}>{selecting && <motion.div key="selection" className="pointer-events-auto h-full">{actions}</motion.div>}</AnimatePresence>
      </div>}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">共 {table.getFilteredRowModel().rows.length} 项</span><Pagination page={table.getState().pagination.pageIndex + 1} pageCount={table.getPageCount()} onPageChange={(page) => table.setPageIndex(page - 1)} /></div>
  </div>;
}
