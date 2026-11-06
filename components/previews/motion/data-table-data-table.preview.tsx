"use client";
import { useState } from "react";
import { ProductDataTable } from "@/components/motion/product-data-table";
import type { SortState } from "@/components/motion/table";
import { createCustomerDemoRows, customerDemoColumns, type CustomerDemoRow } from "./data-table-demo";
const data = createCustomerDemoRows(10000);
const columns = customerDemoColumns("Spend");
const rowId = (row: CustomerDemoRow) => row.id;
const searchText = (row: CustomerDemoRow) => `${row.name} ${row.email} ${row.status} ${row.plan}`;
export function VirtualDataTablePreview() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState | null>({ key: "spend", direction: "desc" });
  return <div className="w-full"><ProductDataTable data={data} columns={columns} getRowId={rowId} searchText={searchText} mode="virtual" label="Customers" selectedRowIds={selected} onSelectionChange={setSelected} sort={sort} onSortChange={setSort} /></div>;
}
