import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WorkspaceSidebar } from '../registry/ui/workspace-sidebar';

const groups = [{ id: 'main', title: '导航分组', items: [{ id: 'home', label: '概览', badge: 3 }, { id: 'locked', label: '不可用', disabled: true }, { id: 'docs', label: '文档', href: '/docs' }] }];
function Harness() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('home');
  return <WorkspaceSidebar title="示例" groups={groups} activeId={active} onSelect={setActive} collapsed={collapsed} onCollapsedChange={setCollapsed} footer={<input aria-label="保留草稿" defaultValue="未提交内容" />} />;
}

describe('workspace sidebar stable motion structure', () => {
  it('keeps icons, labels, badges and footer mounted across a round trip', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const sidebar = screen.getByRole('complementary', { name: '示例侧栏' });
    const item = screen.getByRole('button', { name: '概览' });
    const icon = item.querySelector('[data-slot="workspace-icon"]');
    const label = item.querySelector('[data-slot="workspace-label"]');
    const badge = item.querySelector('[data-slot="workspace-badge"]');
    const input = screen.getByRole('textbox', { name: '保留草稿' });
    await user.clear(input); await user.type(input, '修改后的草稿');
    const toggle = screen.getByRole('button', { name: '折叠工作区侧栏' });
    await user.click(toggle);
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    expect(screen.getByRole('button', { name: '概览' })).toBe(item);
    expect(item.querySelector('[data-slot="workspace-icon"]')).toBe(icon);
    expect(item.querySelector('[data-slot="workspace-label"]')).toBe(label);
    expect(item.querySelector('[data-slot="workspace-badge"]')).toBe(badge);
    expect(container.querySelector('[data-slot="workspace-footer"]')).toHaveAttribute('inert');
    expect(container.querySelector('[data-slot="workspace-footer"]')).toHaveAttribute('aria-hidden', 'true');
    expect(input).toBeInTheDocument();
    await user.click(toggle);
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByRole('textbox', { name: '保留草稿' })).toBe(input);
    expect(input).toHaveValue('修改后的草稿');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps native links, disabled states and accessible names when compact', async () => {
    const select = vi.fn();
    render(<WorkspaceSidebar title="示例" groups={groups} activeId="home" onSelect={select} collapsed onCollapsedChange={() => undefined} />);
    const item = screen.getByRole('button', { name: '概览' });
    expect(item).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '文档' })).toHaveAttribute('href', '/docs');
    await userEvent.setup().click(screen.getByRole('button', { name: '不可用' }));
    expect(select).not.toHaveBeenCalled();
    fireEvent.click(item); expect(select).toHaveBeenCalledExactlyOnceWith('home');
  });

  it('moves focus out of an inert footer on an externally controlled collapse', () => {
    const props = { title: '示例', groups, onCollapsedChange: () => undefined, footer: <input aria-label="底部设置" /> };
    const { rerender } = render(<WorkspaceSidebar {...props} collapsed={false} />);
    screen.getByRole('textbox', { name: '底部设置' }).focus();
    rerender(<WorkspaceSidebar {...props} collapsed />);
    expect(screen.getByRole('button', { name: '展开工作区侧栏' })).toHaveFocus();
  });
});
