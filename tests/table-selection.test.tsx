import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type ColumnDef } from '../registry/ui/data-table';

const data = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }, { id: 'c', name: 'Gamma' }];
const columns: ColumnDef<(typeof data)[number]>[] = [{ accessorKey: 'name', header: '名称' }];
const props = { data, columns, getRowId: (row: (typeof data)[number]) => row.id, label: '项目', pageSize: 2 };

describe('in-place selection header', () => {
  it('retains semantic headers while making hidden sort controls inert', async () => {
    const { container } = render(<DataTable {...props} />);
    const header = screen.getByRole('columnheader', { name: '名称' });
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '选择行 a' }));
    expect(screen.getByRole('group', { name: '已选行操作' })).toHaveTextContent('已选 1 项');
    expect(screen.getByRole('columnheader', { name: '名称' })).toBe(header);
    expect(screen.queryByRole('button', { name: '名称' })).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-column-title"]')).toHaveAttribute('inert');
    expect(screen.getByRole('checkbox', { name: '选择本页全部' })).toBeEnabled();
  });
  it('restores the selected sort and keyboard focus after clearing', async () => {
    const interaction = userEvent.setup(); render(<DataTable {...props} />);
    await interaction.click(screen.getByRole('button', { name: '名称' }));
    await interaction.click(screen.getByRole('checkbox', { name: '选择行 a' }));
    const clear = screen.getByRole('button', { name: '清空选择' });
    clear.focus(); await interaction.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument());
    expect(screen.getByRole('columnheader', { name: '名称' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('checkbox', { name: '选择本页全部' })).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: '选择行 a' })).not.toBeChecked();
  });
  it('delivers all selected IDs including other pages and filtered-out rows', async () => {
    const act = vi.fn(); const interaction = userEvent.setup();
    render(<DataTable {...props} selectionToolbar={({ selectedIds }) => <button onClick={() => act(selectedIds)}>导出选择</button>} />);
    await interaction.click(screen.getByRole('checkbox', { name: '选择行 a' }));
    await interaction.click(screen.getByRole('button', { name: '下一页' }));
    await interaction.click(screen.getByRole('checkbox', { name: '选择行 c' }));
    await interaction.type(screen.getByRole('searchbox'), 'no match');
    expect(screen.getByText('没有匹配的数据。')).toBeVisible();
    expect(screen.getByRole('checkbox', { name: '选择本页全部' })).toBeDisabled();
    await interaction.click(screen.getByRole('button', { name: '导出选择' }));
    expect(act).toHaveBeenCalledExactlyOnceWith(['a', 'c']);
  });
  it('respects controlled selection and does not invent internal changes', async () => {
    const change = vi.fn();
    const { rerender } = render(<DataTable {...props} rowSelection={{}} onRowSelectionChange={change} />);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '选择行 a' }));
    expect(change).toHaveBeenCalledWith({ a: true });
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
    rerender(<DataTable {...props} rowSelection={{ a: true }} onRowSelectionChange={change} />);
    expect(screen.getByRole('group', { name: '已选行操作' })).toHaveTextContent('已选 1 项');
    fireEvent.click(screen.getByRole('button', { name: '清空选择' }));
    expect(change).toHaveBeenLastCalledWith({});
    expect(screen.getByRole('checkbox', { name: '选择行 a' })).toBeChecked();
  });
  it('has one page-select control for grouped headers and correct empty colspan', () => {
    const grouped: typeof columns = [{ header: '分组', columns: [{ accessorKey: 'name', header: '名称' }, { accessorKey: 'id', header: '编号' }] }];
    const { container } = render(<DataTable {...props} columns={grouped} data={[]} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('checkbox').closest('th')).toHaveAttribute('rowspan', '2');
    expect(container.querySelector('tbody td')).toHaveAttribute('colspan', '3');
  });
  it('keeps legacy toolbar sorting available and suppresses actions when not selectable', () => {
    const { rerender } = render(<DataTable {...props} selectionPresentation="toolbar" rowSelection={{ a: true }} />);
    expect(screen.getByRole('button', { name: '名称' })).toBeVisible();
    expect(within(screen.getByRole('group', { name: '已选行操作' })).getByText('已选 1 项')).toBeVisible();
    rerender(<DataTable {...props} selectable={false} rowSelection={{ a: true }} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: '已选行操作' })).not.toBeInTheDocument();
  });
});
