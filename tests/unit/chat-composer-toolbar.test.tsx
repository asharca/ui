import { useState } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ChatComposerToolbar } from '../../src/ChatComposerToolbar';

afterEach(cleanup);

it('pins, orders, invokes and resets shortcuts while respecting disabled tools', async () => {
  const invoke = vi.fn();
  function Example() {
    const [ids, setIds] = useState<string[]>(['missing', 'attach', 'attach']);
    return <ChatComposerToolbar pinnedIds={ids} onPinnedIdsChange={setIds} tools={[
      { id: 'attach', label: 'Attach', icon: <span />, onSelect: invoke },
      { id: 'prompt', label: 'Prompt', icon: <span />, onSelect: invoke },
      { id: 'web', label: 'Search', icon: <span />, disabled: true, onSelect: invoke },
    ]} />;
  }
  const user = userEvent.setup();
  const { container } = render(<Example />);
  expect(container.querySelectorAll('[data-composer-shortcut]')).toHaveLength(1);
  await user.click(screen.getByRole('button', { name: 'Attach' }));
  expect(invoke).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Open tools' }));
  expect(screen.getByRole('menuitem', { name: 'Search' })).toHaveAttribute('data-disabled');
  expect(screen.queryByRole('menuitem', { name: 'Attach' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('menuitem', { name: 'Customize toolbar' }));
  const dialog = screen.getByRole('dialog', { name: 'Customize toolbar' });
  await user.click(within(dialog).getByRole('checkbox', { name: 'Prompt' }));
  await user.click(within(dialog).getByRole('button', { name: 'Move Prompt up' }));
  expect([...container.querySelectorAll('[data-composer-shortcut]')].map((item) => item.getAttribute('data-composer-shortcut'))).toEqual(['prompt', 'attach']);
  expect(within(dialog).getByRole('button', { name: 'Move Prompt up' })).toBeDisabled();
  await user.click(within(dialog).getByRole('button', { name: 'Reset toolbar' }));
  expect(container.querySelectorAll('[data-composer-shortcut]')).toHaveLength(0);
  await user.click(within(dialog).getByRole('button', { name: 'Close' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
