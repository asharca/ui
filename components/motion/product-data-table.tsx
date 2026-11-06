"use client";

import { type ReactNode, useEffect, useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, Columns3, Search, ListFilter, X } from "lucide-react";
import { Table, type TableColumn, type SortState } from "@/components/motion/table";
import { Button } from "@/components/motion/button";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DataTableTab<T> { id: string; label: string; matches: (row: T) => boolean }
export interface DataTableFilter<T> { id: string; label: string; matches: (row: T) => boolean }
export interface ProductDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  searchText: (row: T) => string;
  mode?: "responsive" | "virtual" | "paginated";
  label: string;
  tabs?: DataTableTab<T>[];
  filters?: DataTableFilter<T>[];
  requiredColumnKeys?: string[];
  renderMobileCard?: (row: T) => ReactNode;
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  selectedRowIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

/** Global transforms run before pagination; Table retains its virtualized renderer. */
export function ProductDataTable<T>({ data, columns, getRowId, searchText, mode = "virtual", label, tabs = [], filters = [], requiredColumnKeys = [], renderMobileCard, sort: controlledSort, onSortChange, selectedRowIds, onSelectionChange, page: controlledPage, defaultPage = 0, onPageChange, pageSize: controlledSize, defaultPageSize = 10, onPageSizeChange, className }: ProductDataTableProps<T>) {
  const id = useId();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(() => filters.map(filter => filter.id));
  const [hidden, setHidden] = useState<string[]>([]);
  const [sortState, setSort] = useState<SortState | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [pageState, setPage] = useState(defaultPage);
  const [sizeState, setSize] = useState(defaultPageSize);
  const [mobileLimit, setMobileLimit] = useState(8);
  const [mobileScope, setMobileScope] = useState(() => ({ query, tab, activeFilters }));
  if (mobileScope.query !== query || mobileScope.tab !== tab || mobileScope.activeFilters !== activeFilters) {
    setMobileScope({ query, tab, activeFilters });
    setMobileLimit(8);
  }
  const sort = controlledSort === undefined ? sortState : controlledSort;
  const selected = selectedRowIds ?? selection;
  const requestedPage = controlledPage ?? pageState;
  const size = Math.max(1, Math.floor(controlledSize ?? sizeState));
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const activeTab = tabs.find(item => item.id === tab);
    const chosenFilters = filters.filter(filter => activeFilters.includes(filter.id));
    const result = data.filter(row => (!needle || searchText(row).toLowerCase().includes(needle)) && (!activeTab || activeTab.matches(row)) && (!filters.length || chosenFilters.some(filter => filter.matches(row))));
    if (sort) {
      const column = columns.find(item => item.key === sort.key);
      if (column) result.sort((a, b) => {
        const left = column.sortValue?.(a) ?? (a as Record<string, unknown>)[column.key];
        const right = column.sortValue?.(b) ?? (b as Record<string, unknown>)[column.key];
        const comparison = typeof left === "number" && typeof right === "number" ? left - right : String(left ?? "").localeCompare(String(right ?? ""), undefined, { numeric: true });
        return sort.direction === "asc" ? comparison : -comparison;
      });
    }
    return result;
  }, [data, query, tabs, tab, filters, activeFilters, searchText, sort, columns]);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const page = Math.max(0, Math.min(Math.floor(requestedPage), pages - 1));
  useEffect(() => { if (requestedPage !== page) { if (controlledPage === undefined) setPage(page); onPageChange?.(page); } }, [requestedPage, page, controlledPage, onPageChange]);
  const shown = mode === "paginated" ? rows.slice(page * size, (page + 1) * size) : rows;
  const visible = columns.filter((column, index) => !hidden.includes(column.key) || requiredColumnKeys.includes(column.key) || index === 0);
  const changeSort = (next: SortState | null) => { if (controlledSort === undefined) setSort(next); onSortChange?.(next); };
  const changeSelection = (ids: string[]) => { if (selectedRowIds === undefined) setSelection(ids); onSelectionChange?.(ids); };
  const changePage = (next: number) => { if (controlledPage === undefined) setPage(next); onPageChange?.(next); };
  const clear = () => { setQuery(""); setTab(null); setActiveFilters(filters.map(filter => filter.id)); setHidden([]); changePage(0); };
  return <section aria-label={label} className={cn("w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-background", mode !== "responsive" && "rounded-xl", className)}>
    <div className="sr-only"><h3>{label}</h3><p role="status">{rows.length.toLocaleString()} rows · {selected.length} selected</p></div>
    <header className={cn("flex flex-col gap-3 border-b border-border px-3 pb-3 pt-3 sm:px-4 sm:pt-4 lg:flex-row lg:items-center lg:justify-between", mode !== "responsive" && "sr-only focus-within:not-sr-only")}>
    {mode === "responsive" && tabs.length ? <div role="tablist" aria-label={`${label} views`} className="flex w-max max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-muted p-1" onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus(); buttons[next]?.click();
    }}>{[{ id: null, label: `All ${label.toLowerCase()}` }, ...tabs].map(item => <button type="button" key={item.id ?? "all"} role="tab" tabIndex={tab === item.id ? 0 : -1} aria-selected={tab === item.id} aria-controls={`${id}-results`} onClick={() => { setTab(item.id); changePage(0); }} className="relative min-h-8 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground aria-selected:text-foreground sm:text-sm focus-visible:outline-2 focus-visible:outline-ring">{tab === item.id ? <motion.span layoutId={`${id}-tab`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="absolute inset-0 rounded-full bg-background shadow-sm" /> : null}<span className="relative">{item.label}</span></button>)}</div> : null}
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 lg:max-w-xl">
      <div className="relative min-w-0 flex-1 lg:max-w-64"><Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label={`Search ${label}`} value={query} onChange={event => { setQuery(event.target.value); changePage(0); }} placeholder={`Search ${label.toLowerCase()}`} className="h-10 w-full min-w-0 rounded-full border border-border bg-background pl-9 pr-9 text-sm focus-visible:outline-2 focus-visible:outline-ring" />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); changePage(0); }} className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden className="size-3.5" /></button>}</div>
      {mode === "responsive" ? <>
        {filters.length ? <AnimatedDropdown ariaLabel="Filter by Status" menuLabel="Filter by status" align="end" indicatorPosition="end" triggerClassName="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium hover:bg-muted/45" trigger={<><ListFilter aria-hidden className="size-4" /><span className="hidden sm:inline">Status</span>{activeFilters.length !== filters.length && <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums">{activeFilters.length}</span>}</>} items={filters.map(filter => ({ id: filter.id, kind: "checkbox", label: filter.label, textValue: filter.label, checked: activeFilters.includes(filter.id), onCheckedChange: checked => { setActiveFilters(current => checked ? [...current, filter.id] : current.filter(item => item !== filter.id)); changePage(0); } }))} /> : null}
        <AnimatedDropdown ariaLabel="Choose visible columns" menuLabel="Visible columns" align="end" indicatorPosition="end" triggerClassName="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium hover:bg-muted/45" trigger={<><Columns3 aria-hidden className="size-4" /><span className="hidden sm:inline">Columns</span></>} items={columns.map((column, index) => ({ id: column.key, kind: "checkbox", label: column.header, textValue: typeof column.header === "string" ? column.header : column.key, checked: !hidden.includes(column.key), disabled: index === 0 || requiredColumnKeys.includes(column.key), onCheckedChange: checked => setHidden(current => checked ? current.filter(key => key !== column.key) : [...current, column.key]) }))} />
      </> : null}
      {Boolean(query || tab || activeFilters.length !== filters.length || hidden.length) && <Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" onClick={clear}>Reset view</Button>}
      {selected.length ? <Button variant="ghost" size="sm" onClick={() => changeSelection([])}>Clear selection</Button> : null}
    </div></header>
    <div id={`${id}-results`}>
      <div className={mode === "responsive" ? "hidden md:block" : undefined}><Table data={shown} columns={visible} getRowId={getRowId} sort={sort} onSortChange={next => changeSort(next === null && mode === "responsive" && sort?.direction === "desc" ? { key: sort.key, direction: "asc" } : next)} selectable={mode === "virtual"} selectedRowIds={selected} onSelectionChange={changeSelection} rowHeight={mode === "virtual" ? 60 : 56} height={mode === "paginated" ? size * 56 + 44 : mode === "responsive" ? 436 : 448} className="border-0 [&_thead_tr]:!h-11 [&_th]:!h-11 [&_th>div]:!h-11 [&_th]:text-xs [&_table]:w-full [&_col:last-child]:hidden [&_tr>th:last-child]:hidden [&_tr>td:last-child]:hidden [&_table]:!min-w-[760px] [&>div]:[scrollbar-gutter:stable]" emptyState={<div className="space-y-2"><p>No matching rows.</p><Button onClick={clear}>Clear filters</Button></div>} /></div>
      {mode === "responsive" ? <div className="divide-y divide-border md:hidden">
        <label className="sr-only flex items-center gap-2 text-xs focus-within:not-sr-only">Sort rows<select aria-label="Mobile sort column" value={sort?.key ?? ""} onChange={event => changeSort(event.target.value ? { key: event.target.value, direction: sort?.direction ?? "asc" } : null)} className="rounded border border-border bg-background p-2"><option value="">Original order</option>{visible.filter(column => column.sortable).map(column => <option key={column.key} value={column.key}>{typeof column.header === "string" ? column.header : column.key}</option>)}</select><Button disabled={!sort} onClick={() => { if (sort) changeSort({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" }); }}>{sort?.direction === "desc" ? "Descending" : "Ascending"}</Button></label>
        {shown.slice(0, mobileLimit).map(row => <article key={getRowId(row)} className="bg-background p-4">{renderMobileCard ? renderMobileCard(row) : <><div className="min-w-0">{visible[0] && (visible[0].cell ? visible[0].cell(row) : String((row as Record<string, unknown>)[visible[0].key] ?? ""))}</div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">{visible.slice(1).map(column => <div key={column.key} className="min-w-0"><dt className="mb-1 text-xs text-muted-foreground">{column.header}</dt><dd className="truncate text-sm">{column.cell ? column.cell(row) : String((row as Record<string, unknown>)[column.key] ?? "")}</dd></div>)}</dl></>}</article>)}
        {shown.length > mobileLimit && <div className="flex justify-center bg-background p-3"><Button variant="outline" size="sm" className="h-8 rounded-full px-3 text-xs" onClick={() => setMobileLimit(current => current + 8)}>Show {Math.min(8, shown.length - mobileLimit)} more</Button></div>}
        {!shown.length ? <p className="p-4 text-sm text-muted-foreground">No matching rows. Reset the view to recover.</p> : null}
      </div> : null}
    </div>
    {mode === "responsive" && <footer className="flex justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>{rows.length} {rows.length === 1 ? "result" : "results"}</span><span>{visible.length} columns visible</span></footer>}
    {mode === "paginated" ? <footer className="flex min-h-16 flex-col gap-3 border-t border-border bg-background px-3 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-4"><span className="tabular-nums text-muted-foreground">{rows.length ? page * size + 1 : 0}–{Math.min((page + 1) * size, rows.length)} of {rows.length.toLocaleString()}</span><div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto"><nav aria-label={`${label} pagination`} className="flex items-center justify-end gap-0.5"><Button variant="ghost" disabled={page === 0} onClick={() => changePage(page - 1)} aria-label="Previous page" className="size-9 rounded-full p-0"><ChevronLeft aria-hidden className="size-4" /></Button>{Array.from(new Set([0, Math.max(0, page - 1), page, Math.min(pages - 1, page + 1), ...(page === 0 && pages > 2 ? [2] : []), pages - 1])).sort((a,b)=>a-b).map((index, position, indices)=><span key={index} className="flex items-center gap-0.5">{position > 0 && index - indices[position - 1] > 1 && <span aria-hidden className="grid size-9 place-items-center text-muted-foreground">…</span>}<button type="button" aria-label={`Page ${index+1}`} aria-current={page === index ? "page" : undefined} onClick={()=>changePage(index)} className="group grid size-9 place-items-center rounded-full text-xs"><span className={cn("grid size-7 place-items-center rounded-md tabular-nums", page === index ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:bg-muted")}>{index+1}</span></button></span>)}<Button variant="ghost" disabled={page >= pages - 1} onClick={() => changePage(page + 1)} aria-label="Next page" className="size-9 rounded-full p-0"><ChevronRight aria-hidden className="size-4" /></Button></nav><AnimatedDropdown ariaLabel="Rows per page" align="end" menuWidth={144} triggerClassName="inline-flex h-10 w-36 items-center justify-between gap-2 rounded-full border border-border bg-background px-3 text-xs font-medium tabular-nums hover:bg-muted/45" trigger={<>{size} / page<ChevronDown aria-hidden className="size-3.5 text-muted-foreground" /></>} items={Array.from(new Set([10, 25, 50, size])).sort((a,b)=>a-b).map(option => ({ id: String(option), label: `${option} / page`, textValue: `${option} / page`, onSelect: () => { if (controlledSize === undefined) setSize(option); onPageSizeChange?.(option); changePage(0); } }))} /></div></footer> : null}
  </section>;
}
