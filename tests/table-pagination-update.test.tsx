import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { DataTable, type ColumnDef } from '../registry/ui/data-table';

const data = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }, { id: 'c', name: 'Gamma' }];
const columns: ColumnDef<(typeof data)[number]>[] = [{ accessorKey: 'name', header: '名称' }];
const props = { columns, getRowId: (row: (typeof data)[number]) => row.id, label: '项目', pageSize: 2 };

it('retains the current page when the host updates row content', async () => {
  const { rerender } = render(<DataTable {...props} data={data} />);
  await userEvent.setup().click(screen.getByRole('button', { name: '下一页' }));
  rerender(<DataTable {...props} data={data.map((row) => row.id === 'c' ? { ...row, name: '已处理 Gamma' } : row)} />);
  await waitFor(() => expect(screen.getByRole('cell', { name: '已处理 Gamma' })).toBeVisible());
  expect(screen.getByRole('button', { name: '上一页' })).toBeEnabled();
  expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
});

it('clamps a disappearing page after data removal, including an empty dataset', async () => {
  const { rerender } = render(<DataTable {...props} data={data} />);
  await userEvent.setup().click(screen.getByRole('button', { name: '下一页' }));
  rerender(<DataTable {...props} data={data.slice(0, 2)} />);
  await waitFor(() => expect(screen.getByRole('cell', { name: 'Alpha' })).toBeVisible());
  expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
  rerender(<DataTable {...props} data={[]} />);
  expect(screen.getByText('没有匹配的数据。')).toBeVisible();
  expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
});
