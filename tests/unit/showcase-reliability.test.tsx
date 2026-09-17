import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { ButtonDemo } from '../../showcase/demos/ButtonDemo';
import { DataTableDemo } from '../../showcase/demos/DataTableDemo';
import { DocsApp } from '../../showcase/DocsApp';
import { componentDocs } from '../../showcase/ComponentDemos';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
});

it('lets visitors explore button variants, sizes and interaction states', async () => {
  const user = userEvent.setup();
  render(<ButtonDemo />);
  const save = screen.getByRole('button', { name: '保存更改' });
  expect(save).toHaveClass('ui-button-primary');
  await user.selectOptions(screen.getByRole('combobox', { name: '按钮变体' }), 'outline');
  expect(save).toHaveClass('ui-button-outline');
  await user.selectOptions(screen.getByRole('combobox', { name: '按钮变体' }), 'primary');
  await user.selectOptions(screen.getByRole('combobox', { name: '按钮尺寸' }), 'lg');
  expect(save).toHaveClass('ui-button-primary', 'ui-button-lg');
  await user.click(save);
  expect(screen.getByRole('status')).toHaveTextContent('已保存');
  await user.click(screen.getByRole('checkbox', { name: '加载状态' }));
  expect(screen.getByRole('button', { name: '正在保存…' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: '重置', exact: true }));
  expect(screen.getByRole('button', { name: '保存更改' })).toBeEnabled();
  expect(screen.getByRole('button', { name: '保存更改' })).toHaveClass('ui-button-primary');
  expect(screen.getByRole('combobox', { name: '按钮变体' })).toHaveValue('primary');
  expect(screen.getByRole('combobox', { name: '按钮尺寸' })).toHaveValue('md');
  await user.click(screen.getByRole('checkbox', { name: '禁用状态' }));
  expect(screen.getByRole('button', { name: '保存更改' })).toBeDisabled();
});

it('keeps selected projects selected while the demo is sorted and filtered', async () => {
  const user = userEvent.setup();
  render(<DataTableDemo />);
  await user.click(screen.getByRole('checkbox', { name: '选择Design System' }));
  await user.click(screen.getByRole('button', { name: '按项目倒序' }));
  expect(screen.getByRole('checkbox', { name: '选择Design System' })).toBeChecked();
  await user.type(screen.getByRole('searchbox', { name: '筛选项目' }), 'API');
  expect(screen.getByRole('status')).toHaveTextContent('已选择 1 项，当前结果中选中 0 项');
  await user.click(screen.getByRole('checkbox', { name: '全选行' }));
  expect(screen.getByRole('status')).toHaveTextContent('已选择 2 项');
  await user.click(screen.getByRole('button', { name: '清除项目筛选' }));
  expect(screen.getByRole('checkbox', { name: '选择Design System' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: '选择API Gateway' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: '选择Mobile App' })).not.toBeChecked();
  await user.click(screen.getByRole('button', { name: '重置示例' }));
  expect(screen.getByRole('status')).toHaveTextContent('已选择 0 项');
});

it('shows an empty search state without a selectable placeholder row', async () => {
  const user = userEvent.setup();
  render(<DataTableDemo />);
  await user.type(screen.getByRole('searchbox', { name: '筛选项目' }), 'no-such-project');
  expect(screen.getByText('没有匹配的项目，请调整筛选条件。')).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: '全选行' })).toBeDisabled();
  expect(screen.getAllByRole('checkbox')).toHaveLength(1);
});

it.each([
  ['button', 'ButtonDemo'],
  ['data-table', 'DataTableDemo'],
])('uses the real %s demo as the displayed copyable source', async (id, name) => {
  const doc = componentDocs.find((item) => item.id === id)!;
  expect(doc.demoFile).toBe(`${name}.tsx`);
  expect(doc.code).toBe('');
  window.history.replaceState(null, '', `/#/components/${id}`);
  render(<DocsApp />);
  await userEvent.setup().click(screen.getByRole('tab', { name: '用法代码' }));
  const code = await screen.findByRole('region', { name: '用法 TSX' });
  await waitFor(() => expect(code).toHaveTextContent(`export function ${name}`));
  expect(code).toHaveTextContent('"@asharca/ui"');
  expect(code).not.toHaveTextContent('../../src/index');
  expect(code).not.toHaveTextContent('componentDocs');
  if (id === 'data-table') {
    expect(code).toHaveTextContent('const projects');
    expect(code).toHaveTextContent('const [selected, setSelected]');
    expect(code).toHaveTextContent('strictSelection');
  }
});
