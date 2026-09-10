import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { WorkspaceSidebar } from '../../src/WorkspaceSidebar';

afterEach(cleanup);
it('delegates navigation and collapse while separating badges from icons', async () => {
  const select = vi.fn();
  const collapse = vi.fn();
  const user = userEvent.setup();
  const props = { brand: 'Workspace', brandIcon: <svg />, brandLabel: 'Home', workspace: { icon: 'A', name: 'Design workspace' }, footer: <span>Asharca Studio</span>, activeId: 'one', items: [{ id: 'one', label: 'Overview', icon: <svg />, badge: 9 }, { id: 'two', label: 'Disabled', icon: <svg />, disabled: true }], onSelect: select, onCollapsedChange: collapse };
  const { rerender } = render(<WorkspaceSidebar {...props} collapsed={false} />);
  const sidebar = screen.getByRole('complementary');
  expect(sidebar.querySelector('.tp-workspace-sidebar__workspace')?.compareDocumentPosition(sidebar.querySelector('.tp-workspace-sidebar__footer')!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  const item = screen.getByRole('button', { name: 'Overview' });
  expect(item).toHaveAttribute('aria-current', 'page');
  expect(item.querySelector('.tp-workspace-sidebar__icon')).not.toContainElement(within(item).getByText('9'));
  await user.click(item);
  expect(select).toHaveBeenCalledWith('one');
  await user.click(screen.getByRole('button', { name: 'Disabled' }));
  expect(select).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
  expect(collapse).toHaveBeenCalledWith(true);
  rerender(<WorkspaceSidebar {...props} collapsed />);
  expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
});
