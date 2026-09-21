import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { ReferenceShowroom } from '../../showcase/ReferenceShowroom';
import { MaterialButtonDemo } from '../../showcase/demos/MaterialButtonDemo';
import { Button } from '../../src/Controls';

afterEach(cleanup);

it('uses the real Button and preserves local state while its exact source is open', async () => {
  const user = userEvent.setup();
  render(<ReferenceShowroom />);
  await user.click(screen.getByRole('button', { name: '载入 Metallic Button 预览' }));
  await user.click(screen.getByRole('button', { name: '试试这个按钮', exact: true }));
  expect(screen.getByRole('button', { name: '已保存', exact: true })).toBeVisible();
  await user.click(screen.getByRole('button', { name: '查看 Metallic Button 源码' }));
  expect(await screen.findByRole('region', { name: 'Metallic Button 用法 TSX' })).toHaveTextContent('ui-material-button');
  await user.click(screen.getByRole('button', { name: '预览 Metallic Button' }));
  expect(screen.getByRole('button', { name: '已保存', exact: true })).toBeVisible();
  await user.click(screen.getByRole('button', { name: '重置 Metallic Button 预览' }));
  await user.click(screen.getByRole('button', { name: '载入 Metallic Button 预览' }));
  expect(screen.getByRole('button', { name: '试试这个按钮', exact: true })).toBeVisible();
});

it('keeps the new material opt-in and uses normal Button semantics', async () => {
  const user = userEvent.setup();
  render(<><MaterialButtonDemo /><Button className="ui-material-button" disabled>不可用</Button><Button className="ui-material-button" asChild><a href="#target">链接</a></Button></>);
  const button = screen.getByRole('button', { name: '试试这个按钮', exact: true });
  expect(button).toHaveAttribute('data-toolplane-ui', 'button');
  expect(button).toHaveClass('ui-material-button');
  expect(screen.getByRole('button', { name: '不可用' })).toBeDisabled();
  expect(screen.getByRole('link', { name: '链接' })).toHaveAttribute('href', '#target');
  await user.click(button);
  expect(screen.getByRole('button', { name: '已保存', exact: true })).toBeVisible();
});
