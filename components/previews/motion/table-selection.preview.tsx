"use client";

import { Check, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Table, type TableColumn } from "@/components/motion/table";

type Member = { id: string; name: string; email: string; status: string };

const MEMBERS: Member[] = [
  { id: "ava", name: "Ava Cole", email: "ava@example.com", status: "Invited" },
  { id: "leo", name: "Leo Frost", email: "leo@example.com", status: "Active" },
  { id: "mia", name: "Mia Vale", email: "mia@example.com", status: "Invited" },
  { id: "kai", name: "Kai Reyes", email: "kai@example.com", status: "Active" },
  { id: "zoe", name: "Zoe Sato", email: "zoe@example.com", status: "Invited" },
  { id: "eli", name: "Eli Marsh", email: "eli@example.com", status: "Active" },
];
const COLUMNS: TableColumn<Member>[] = [
  { key: "name", header: "Name", sortable: true, width: "180px" },
  { key: "email", header: "Email", width: "240px" },
  { key: "status", header: "Status", sortable: true, width: "120px" },
];

export function TableSelectionPreview() {
  const [data, setData] = useState(MEMBERS);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex w-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          Select rows to turn the header into bulk actions.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setData(MEMBERS);
            setSelected([]);
          }}
        >
          <RotateCcw aria-hidden className="size-3.5" /> Reset
        </Button>
      </div>
      <Table
        data={data}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable
        resizable
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        selectionActions={({ selectedRowIds, clearSelection }) => {
          const ids = new Set(selectedRowIds);
          return (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setData((rows) =>
                    rows.map((row) =>
                      ids.has(row.id) ? { ...row, status: "Active" } : row,
                    ),
                  );
                  clearSelection();
                }}
              >
                <Check aria-hidden className="size-3.5" /> Activate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setData((rows) => rows.filter((row) => !ids.has(row.id)));
                  clearSelection();
                }}
              >
                <Trash2 aria-hidden className="size-3.5" /> Delete
              </Button>
            </>
          );
        }}
        height={364}
        rowHeight={52}
        emptyState="No members left. Reset to try again."
        className="rounded-2xl"
      />
    </div>
  );
}
