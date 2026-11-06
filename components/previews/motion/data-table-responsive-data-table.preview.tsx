"use client";
import { useState } from "react";
import { ProductDataTable } from "@/components/motion/product-data-table";
import type { SortState } from "@/components/motion/table";
import { accountDemoColumns, accountDemoRows } from "./data-table-demo";
const rowId = (row: typeof accountDemoRows[number]) => row.id;
const searchText = (row: typeof accountDemoRows[number]) => `${row.name} ${row.email} ${row.status} ${row.plan}`;
export function ResponsiveDataTablePreview() {
  const [sort, setSort] = useState<SortState | null>({ key: "mrr", direction: "desc" });
  return <div className="w-full p-2 sm:p-5"><ProductDataTable<(typeof accountDemoRows)[number]> data={accountDemoRows} columns={accountDemoColumns} getRowId={rowId} searchText={searchText} mode="responsive" label="Accounts" sort={sort} onSortChange={setSort} tabs={["Direct","Partner","Product-led"].map(channel=>({id:channel,label:channel,matches:row=>row.channel===channel}))} filters={["Active","Trial","Paused"].map(status=>({id:status,label:status,matches:row=>row.status===status}))} requiredColumnKeys={["name"]} /></div>;
}
