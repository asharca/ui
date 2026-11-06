"use client";
import { useState } from "react";
import { ProductDataTable } from "@/components/motion/product-data-table";
import type { SortState } from "@/components/motion/table";
import { createCustomerDemoRows, customerDemoColumns, type CustomerDemoRow } from "./data-table-demo";
const data = createCustomerDemoRows(237).map((row, index) => ({ ...row, seats: 1 + (index * 7) % 48, plan: ["Starter", "Business", "Pro"][index % 3] }));
const columns = customerDemoColumns("MRR");
const rowId = (row: CustomerDemoRow) => row.id;
const searchText = (row: CustomerDemoRow) => `${row.name} ${row.email} ${row.status} ${row.plan}`;
export function PaginatedDataTablePreview() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState | null>({ key: "spend", direction: "desc" });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  return <div className="w-full"><ProductDataTable data={data} columns={columns} getRowId={rowId} searchText={searchText} mode="paginated" label="Customers" selectedRowIds={selected} onSelectionChange={setSelected} sort={sort} onSortChange={setSort} page={page} onPageChange={setPage} pageSize={size} onPageSizeChange={setSize} /></div>;
}
