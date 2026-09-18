'use client';

import { Children, Fragment, cloneElement, isValidElement, useEffect, useRef } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from 'react';

type RowElement = ReactElement<{ children?: ReactNode }>;
type BodyElement = ReactElement<HTMLAttributes<HTMLTableSectionElement>>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type DataTableHeader = {
  align?: 'left' | 'right';
  className?: string;
  colSpan?: number;
  label?: ReactNode;
};

export type DataTableSelectionLabels = {
  selectAll: string;
  selectRow: (rowId: string, index: number) => string;
};

export type DataTableProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  headers: readonly DataTableHeader[];
  label?: string;
  minWidth?: string;
  panel?: boolean;
  /** Stable business IDs in the same order as the rendered native tr elements. */
  rowIds?: readonly string[];
  rowLabels?: readonly ReactNode[];
  selectedRowIds?: readonly string[];
  onSelectedRowIdsChange?: (rowIds: string[]) => void;
  selectable?: boolean;
  selectionLabels?: Partial<DataTableSelectionLabels>;
  /** Reject positional fallback IDs. Recommended for sortable/filterable tables. */
  strictSelection?: boolean;
  tableClassName?: string;
};

// Traverse only fragments and native rows; never invoke arbitrary components.
// Keeping fragments in the output preserves their React reconciliation keys.
function mapRows(children: ReactNode, visit: (row: RowElement) => ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    if (child.type === Fragment) {
      return cloneElement(child, {}, mapRows(child.props.children, visit));
    }
    return child.type === 'tr' ? visit(child) : child;
  });
}

function collectRows(children: ReactNode, rows: RowElement[]): boolean {
  let unsupported = false;
  Children.forEach(children, (child) => {
    if (child == null || typeof child === 'boolean') return;
    if (!isValidElement<{ children?: ReactNode }>(child)) {
      if (typeof child !== 'string' || child.trim()) unsupported = true;
      return;
    }
    if (child.type === Fragment) {
      unsupported = collectRows(child.props.children, rows) || unsupported;
    } else if (child.type === 'tr') {
      rows.push(child);
    } else {
      unsupported = true;
    }
  });
  return unsupported;
}

function SelectionCheckbox({ indeterminate = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return <input {...props} ref={ref} type="checkbox" className={cx('ui-checkbox ui-table__checkbox', props.className)} />;
}

export function DataTable({
  children,
  className,
  headers,
  label,
  minWidth = '40rem',
  panel = true,
  rowIds,
  rowLabels,
  selectedRowIds = [],
  onSelectedRowIdsChange,
  selectable = false,
  selectionLabels,
  strictSelection = false,
  tableClassName,
  ...props
}: DataTableProps) {
  const childList = Children.toArray(children);
  const bodyChild = childList.length === 1 && isValidElement(childList[0]) && childList[0].type === 'tbody'
    ? childList[0] as BodyElement
    : undefined;
  const rows = bodyChild ? bodyChild.props.children : children;
  const selectableRows: RowElement[] = [];
  const unsupportedRows = selectable && collectRows(rows, selectableRows);
  const invalidIds = selectable && rowIds !== undefined && (
    rowIds.length !== selectableRows.length ||
    rowIds.some((id) => typeof id !== 'string' || id.trim().length === 0) ||
    new Set(rowIds).size !== rowIds.length
  );
  const missingIds = selectable && rowIds === undefined && selectableRows.length > 0;
  const issue = unsupportedRows
    ? 'Selection requires native <tr> children, optionally inside a single <tbody> and fragments. Custom row components cannot be inspected.'
    : invalidIds
      ? 'rowIds must contain one unique, non-empty ID per rendered row. Selection is disabled until the IDs are valid.'
      : missingIds
        ? 'Provide stable rowIds before sorting, filtering or paginating. Positional IDs are legacy-only; strictSelection disables this fallback.'
        : '';

  useEffect(() => {
    if (issue && process.env.NODE_ENV !== 'production') {
      console.warn(`[DataTable] ${issue}`);
    }
  }, [issue]);

  const canSelect = selectable && !unsupportedRows && !invalidIds &&
    !(strictSelection && missingIds) && Boolean(onSelectedRowIdsChange);
  // Preserve existing positional IDs for static-table consumers; strictSelection
  // lets hosts opt into a stable-ID contract without a breaking API change.
  const ids = selectableRows.map((_, index) => {
    const id = rowIds?.[index];
    return typeof id === 'string' ? id : String(index);
  });
  const visibleIds = new Set(ids);
  const selected = new Set(selectedRowIds);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = ids.some((id) => selected.has(id));
  const toggle = (id: string) => {
    if (!canSelect) return;
    onSelectedRowIdsChange?.(selected.has(id)
      ? selectedRowIds.filter((value) => value !== id)
      : [...new Set([...selectedRowIds, id])]);
  };
  const toggleAll = () => {
    if (!canSelect || ids.length === 0) return;
    // Select-all affects only visible rows, preserving selections on other pages.
    onSelectedRowIdsChange?.(allSelected
      ? selectedRowIds.filter((id) => !visibleIds.has(id))
      : [...new Set([...selectedRowIds, ...ids])]);
  };
  let rowIndex = 0;
  const tableChildren = selectable ? mapRows(rows, (row) => {
    const index = rowIndex++;
    const id = ids[index];
    const rowLabel = rowLabels?.[index];
    const accessibleLabel = selectionLabels?.selectRow?.(id, index) ??
      `选择${typeof rowLabel === 'string' || typeof rowLabel === 'number' ? rowLabel : `第 ${index + 1} 行`}`;
    return cloneElement(row, {}, [
      <td key="selection" className="ui-table__selection">
        <SelectionCheckbox
          checked={selected.has(id)}
          disabled={!canSelect}
          onChange={() => toggle(id)}
          aria-label={accessibleLabel}
        />
      </td>,
      ...Children.toArray(row.props.children),
    ]);
  }) : rows;
  const bodyClassName = cx('divide-y divide-border', bodyChild?.props.className);

  return (
    <div
      {...props}
      data-toolplane-ui="data-table"
      role={label ? 'region' : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      className={cx(
        panel && 'ui-panel',
        'relative overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <table className={cx('ui-table', tableClassName)} style={{ minWidth }}>
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" className="ui-table__selection">
                <SelectionCheckbox
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  disabled={!canSelect || ids.length === 0}
                  onChange={toggleAll}
                  aria-label={selectionLabels?.selectAll ?? '全选行'}
                />
              </th>
            ) : null}
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                colSpan={header.colSpan}
                className={cx('px-4 py-3 font-medium', header.align === 'right' && 'text-right', header.className)}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        {bodyChild
          ? cloneElement(bodyChild, { className: bodyClassName }, tableChildren)
          : <tbody className={bodyClassName}>{tableChildren}</tbody>}
      </table>
    </div>
  );
}
