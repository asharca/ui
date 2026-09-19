import { Fragment, useState } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableProps, type DataTableSelectionContext } from '@asharca/ui';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

const actions = ({ clearSelection }: DataTableSelectionContext) => <button onClick={clearSelection}>Cancel selection</button>;
function Demo({ selectionToolbar, ...props }: Partial<DataTableProps>) {
  const [selected, setSelected] = useState<string[]>([]);
  return <DataTable label="Projects" headers={[{ label: <button>Sort project</button> }, { label: 'Owner' }]}
    selectable strictSelection rowIds={['a', 'b']} rowLabels={['A', 'B']}
    selectedRowIds={selected} onSelectedRowIdsChange={setSelected} selectionToolbar={selectionToolbar} {...props}>
    <tbody data-testid="original-body"><Fragment><tr><td>A</td><td>Ava</td></tr><tr><td>B</td><td>Leo</td></tr></Fragment></tbody>
  </DataTable>;
}

describe('DataTable optional selection header', () => {
  it.each([undefined, false, null])('preserves the normal header when the option is %s', async (selectionToolbar) => {
    render(<Demo selectionToolbar={selectionToolbar} />);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '选择A' }));
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort project' })).toBeVisible();
  });

  it('retains the checkbox, thead, tbody and native column names through selection', async () => {
    render(<Demo selectionToolbar={actions} />);
    const user = userEvent.setup();
    const table = screen.getByRole('table');
    const head = table.querySelector('thead');
    const body = screen.getByTestId('original-body');
    const all = screen.getByRole('checkbox', { name: '全选行' });
    const a = screen.getByRole('checkbox', { name: '选择A' });
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
    expect(table.parentElement?.querySelector('.ui-table__selection-toolbar')).toHaveAttribute('inert');
    await user.click(a);
    expect(all).toBePartiallyChecked();
    expect(a).toHaveFocus();
    const group = screen.getByRole('group', { name: '已选行操作' });
    expect(group).not.toHaveAttribute('inert');
    expect(within(group).getByText('已选择 1 项')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Sort project' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sort project' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Owner' })).toBeInTheDocument();
    expect(table.querySelector('thead')).toBe(head);
    expect(screen.getByTestId('original-body')).toBe(body);
    await user.click(all);
    expect(all).toBeChecked();
    expect(all).toHaveFocus();
    expect(within(group).getByText('已选择 2 项')).toBeInTheDocument();
    await user.click(all);
    expect(all).not.toBeChecked();
    expect(all).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: '全选行' })).toBe(all);
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
    expect(group).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: 'Sort project' })).toBeVisible();
  });

  it('returns keyboard focus from a disappearing action to the same select-all input', async () => {
    render(<Demo selectionToolbar={actions} />);
    const user = userEvent.setup();
    const all = screen.getByRole('checkbox', { name: '全选行' });
    await user.click(all);
    await user.click(screen.getByRole('button', { name: 'Cancel selection' }));
    expect(all).toHaveFocus();
    expect(all).not.toBeChecked();
  });

  it('uses distinct global and visible selections and clears all pages', async () => {
    const onChange = vi.fn();
    const renderActions = vi.fn(actions);
    const selected = Object.freeze(['a', 'outside', 'a']);
    render(<Demo selectedRowIds={selected} onSelectedRowIdsChange={onChange} selectionToolbar={renderActions}
      selectionLabels={{ selectedCount: (n) => `${n} selected`, actions: 'Bulk actions' }} />);
    expect(screen.getByRole('group', { name: 'Bulk actions' })).toHaveTextContent('2 selected');
    const context = renderActions.mock.calls.at(-1)![0];
    expect(context.selectedRowIds).toEqual(['a', 'outside']);
    expect(context.selectedVisibleRowIds).toEqual(['a']);
    expect(context.selectedCount).toBe(2);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Cancel selection' }));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(selected).toEqual(['a', 'outside', 'a']);
  });

  it('keeps actions available for off-page selections even when the visible body is empty', async () => {
    const change = vi.fn();
    render(<DataTable label="Empty results" headers={[{ label: 'Name' }]} selectable strictSelection rowIds={[]}
      selectedRowIds={['elsewhere']} onSelectedRowIdsChange={change} selectionToolbar={actions}><tbody /></DataTable>);
    expect(screen.getByRole('checkbox', { name: '全选行' })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Cancel selection' }));
    expect(change).toHaveBeenCalledWith([]);
  });

  it('supports static actions, colSpan and explicit accessible column names', () => {
    render(<Demo selectedRowIds={['a']} headers={[{ label: <span>★</span>, ariaLabel: 'Project details', colSpan: 2 }]}
      selectionToolbar={<button>Archive</button>} />);
    expect(screen.getByRole('columnheader', { name: 'Project details' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('group', { name: '已选行操作' })).toContainElement(screen.getByRole('button', { name: 'Archive' }));
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('can disable the feature while retaining selection and checkbox identity', async () => {
    const { rerender } = render(<Demo selectionToolbar={actions} />);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '全选行' }));
    const all = screen.getByRole('checkbox', { name: '全选行' });
    rerender(<Demo selectionToolbar={false} />);
    expect(screen.getByRole('checkbox', { name: '全选行' })).toBe(all);
    expect(all).toBeChecked();
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort project' })).toBeVisible();
  });

  it.each([{ selectable: false }, { onSelectedRowIdsChange: undefined }, { rowIds: ['a', 'a'] }])('never enables actions for a disabled selection contract: %j', (props) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Demo {...props} selectedRowIds={['a']} selectionToolbar={actions} />);
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
  });
});
