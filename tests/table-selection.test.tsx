import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Table } from "@/components/motion/table";
import type { TableProps } from "@/components/motion/table";

const data = [
  { id: "a", name: "Ava" },
  { id: "b", name: "Leo" },
];
const columns = [
  { key: "name", header: "Name", sortable: true, width: "180px" },
];
const getRowId = (row: (typeof data)[number]) => row.id;

afterEach(cleanup);

test("uncontrolled selection replaces controls, preserves sorting, and returns focus on clear", () => {
  let actedOn: string[] = [];
  const { getByRole, queryByRole, container } = render(
    <Table
      data={data}
      columns={columns}
      getRowId={getRowId}
      selectable
      resizable
      selectionActions={({ selectedRows, clearSelection }) => (
        <button
          type="button"
          onClick={() => {
            actedOn = selectedRows.map((row) => row.id);
            clearSelection();
          }}
        >
          Apply
        </button>
      )}
    />,
  );
  fireEvent.click(getByRole("button", { name: "Name" }));
  const header = getByRole("columnheader", { name: "Name" });
  const originalWidth = container.querySelector("table")?.style.minWidth;
  fireEvent.click(getByRole("checkbox", { name: "Select all rows" }));
  expect(getByRole("status").textContent).toBe("2 selected");
  expect(queryByRole("button", { name: "Name" })).toBeNull();
  expect(queryByRole("button", { name: "Resize name column" })).toBeNull();
  expect(getByRole("columnheader", { name: "Name" })).toBe(header);
  expect(header.getAttribute("aria-sort")).toBe("ascending");
  expect(container.querySelector("table")?.style.minWidth).toBe(originalWidth);
  const apply = getByRole("button", { name: "Apply" });
  apply.focus();
  fireEvent.click(apply);
  expect(actedOn).toEqual(["a", "b"]);
  expect(queryByRole("group", { name: "Selection actions" })).toBeNull();
  expect(getByRole("button", { name: "Name" })).toBeTruthy();
  expect(header.getAttribute("aria-sort")).toBe("ascending");
  expect(document.activeElement).toBe(
    getByRole("checkbox", { name: "Select all rows" }),
  );
});

test("controlled actions receive only loaded selection in sort order and clear every id", () => {
  let changed: string[] | undefined;
  let received: string[] = [];
  const props: TableProps<(typeof data)[number]> = {
    data,
    columns,
    getRowId,
    selectable: true,
    selectedRowIds: ["missing", "a", "b"],
    defaultSort: { key: "name", direction: "desc" },
    onSelectionChange: (ids) => {
      changed = ids;
    },
    selectionActions: ({ selectedRowIds }) => {
      received = selectedRowIds;
      return <button type="button">Archive</button>;
    },
  };
  const { getByRole, queryByRole, rerender } = render(<Table {...props} />);
  expect(received).toEqual(["b", "a"]);
  expect(getByRole("status").textContent).toBe("2 selected");
  fireEvent.click(getByRole("button", { name: "Clear selection" }));
  expect(changed).toEqual([]);
  expect(getByRole("status").textContent).toBe("2 selected");
  rerender(<Table {...props} selectedRowIds={["a", "missing"]} />);
  expect(getByRole("status").textContent).toBe("1 selected");
  expect(
    getByRole("checkbox", { name: "Select all rows" }).getAttribute(
      "aria-checked",
    ),
  ).toBe("mixed");
  rerender(<Table {...props} selectedRowIds={["missing"]} />);
  expect(queryByRole("group", { name: "Selection actions" })).toBeNull();
  expect(getByRole("button", { name: "Name" })).toBeTruthy();
});

test("ordinary selectable tables keep column controls without the extension", () => {
  const { getByRole, queryByRole } = render(
    <Table data={data} columns={columns} getRowId={getRowId} selectable />,
  );
  fireEvent.click(getByRole("checkbox", { name: "Select all rows" }));
  expect(getByRole("button", { name: "Name" })).toBeTruthy();
  expect(queryByRole("group", { name: "Selection actions" })).toBeNull();
});
