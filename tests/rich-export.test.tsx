import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { SafeStreamdown } from '../registry/ui/safe-streamdown';

it('copies formula-like table cells as spreadsheet text without changing the visible content', async () => {
  const user = userEvent.setup();
  render(<SafeStreamdown>{'| 值 |\n| --- |\n| =1+2 |'}</SafeStreamdown>);
  await user.click(screen.getByRole('button', { name: '复制表格' }));
  expect(await navigator.clipboard.readText()).toBe("值\n'=1+2");
  expect(screen.getByRole('cell', { name: '=1+2' })).toBeVisible();
});
