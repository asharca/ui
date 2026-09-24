import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SafeStreamdown } from '../registry/ui/safe-streamdown';
import { WorkspaceSidebar } from '../registry/ui/workspace-sidebar';

const markdown = '| 模块 | 完成率 |\n| --- | ---: |\n| 成果审核 | 75% |';
describe('ToolPlane-style table presentation', () => {
  it('retains table semantics and alignment with actionable controls', () => {
    render(<SafeStreamdown>{markdown}</SafeStreamdown>);
    const table = screen.getByRole('table', { name: 'Markdown 表格' });
    expect(within(table).getByRole('columnheader', { name: '完成率' })).toHaveStyle({ textAlign: 'right' });
    expect(within(table).getByRole('cell', { name: '75%' })).toHaveStyle({ textAlign: 'right' });
    expect(screen.getByRole('button', { name: '复制表格' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '下载表格 CSV' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '展开表格' })).toBeEnabled();
  });
  it('copies actual cells, not the action labels or markup', async () => {
    const user = userEvent.setup();
    render(<SafeStreamdown>{markdown}</SafeStreamdown>);
    await user.click(screen.getByRole('button', { name: '复制表格' }));
    expect(await navigator.clipboard.readText()).toBe('模块\t完成率\n成果审核\t75%');
    expect(screen.getByRole('status')).toHaveTextContent('表格已复制');
  });
  it('reports clipboard failures without destroying readable content', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Denied'));
    render(<SafeStreamdown>{markdown}</SafeStreamdown>);
    await user.click(screen.getByRole('button', { name: '复制表格' }));
    expect(screen.getByRole('status')).toHaveTextContent('复制失败');
    expect(screen.getByRole('cell', { name: '成果审核' })).toBeVisible();
  });
});

const groups = [{ id: 'main', items: [{ id: 'a', label: '概览' }, { id: 'b', label: '项目' }, { id: 'c', label: '禁用', disabled: true }] }];
describe('beUI-style selection surfaces', () => {
  it('waits for controlled selection and keeps links and focus intact', async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const view = (activeId: string) => <WorkspaceSidebar groups={groups} activeId={activeId} onSelect={change} collapsed={false} onCollapsedChange={() => undefined} />;
    const { container, rerender } = render(view('a'));
    const first = screen.getByRole('button', { name: '概览', hidden: true });
    const second = screen.getByRole('button', { name: '项目', hidden: true });
    await user.click(second);
    expect(change).toHaveBeenCalledExactlyOnceWith('b');
    expect(first).toHaveAttribute('aria-current', 'page');
    rerender(view('b'));
    expect(second).toHaveAttribute('aria-current', 'page');
    expect(second).toHaveFocus();
    expect(container.querySelectorAll('[data-slot="workspace-selection"]')).toHaveLength(1);
    expect(second.querySelector('[data-slot="workspace-selection"]')).toHaveAttribute('aria-hidden', 'true');
    await user.click(screen.getByRole('button', { name: '禁用', hidden: true }));
    expect(change).toHaveBeenCalledTimes(1);
  });
});
