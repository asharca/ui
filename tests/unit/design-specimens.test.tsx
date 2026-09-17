import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { DesignSpecimens } from '../../showcase/DesignSpecimens';

afterEach(cleanup);

it('keeps editable drafts and native selections when switching specimen panels', async () => {
  const user = userEvent.setup();
  render(<DesignSpecimens />);
  const name = screen.getByRole('textbox', { name: '示例名称' });
  await user.clear(name);
  await user.type(name, '不要丢失我的草稿');
  await user.click(screen.getByRole('radio', { name: '包含完整上下文的研究记录' }));
  await user.click(screen.getByRole('checkbox', { name: '在完成后通知我' }));
  await user.click(screen.getByRole('tab', { name: 'AI 执行状态' }));
  expect(name).not.toBeVisible();
  expect(screen.queryByRole('textbox', { name: '示例名称' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('tab', { name: '基础控件' }));
  expect(name).toHaveValue('不要丢失我的草稿');
  expect(screen.getByRole('radio', { name: '包含完整上下文的研究记录' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: '在完成后通知我' })).not.toBeChecked();
});

it('shows a recoverable simulated approval error instead of reporting success', async () => {
  const user = userEvent.setup();
  render(<DesignSpecimens />);
  await user.click(screen.getByRole('tab', { name: 'AI 执行状态' }));
  await user.click(screen.getByRole('checkbox', { name: '模拟审批提交失败' }));
  await user.click(screen.getByRole('button', { name: '模拟允许' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('模拟提交失败');
  expect(screen.getByRole('combobox', { name: '工具状态样本' })).toHaveValue('awaiting-approval');
  await user.click(screen.getByRole('checkbox', { name: '模拟审批提交失败' }));
  await user.click(screen.getByRole('button', { name: '模拟允许' }));
  await waitFor(() => expect(screen.getByRole('combobox', { name: '工具状态样本' })).toHaveValue('completed'));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '重置审批样本' }));
  await user.click(screen.getByRole('button', { name: '模拟拒绝' }));
  await waitFor(() => expect(screen.getByRole('combobox', { name: '工具状态样本' })).toHaveValue('rejected'));
});

it('provides all seven state samples and resets stale expanded card state', async () => {
  const user = userEvent.setup();
  render(<DesignSpecimens />);
  await user.click(screen.getByRole('tab', { name: 'AI 执行状态' }));
  const select = screen.getByRole('combobox', { name: '工具状态样本' });
  expect(within(select).getAllByRole('option')).toHaveLength(7);
  for (const state of ['pending', 'running', 'completed', 'failed', 'rejected', 'cancelled', 'awaiting-approval']) {
    await user.selectOptions(select, state);
    expect(document.querySelector('.design-specimen-tool-preview details')).toHaveAttribute('data-state', state);
  }
  expect(screen.getByRole('button', { name: '模拟允许' })).toBeEnabled();
});

it('keeps disabled and loading samples noninteractive with descriptions attached', () => {
  render(<DesignSpecimens />);
  expect(screen.getByRole('button', { name: '不可操作' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '加载样本' })).toBeDisabled();
  expect(screen.getByRole('checkbox', { name: '由管理员统一管理' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: '只读内容' })).toHaveAttribute('readonly');
  expect(screen.getByRole('textbox', { name: '错误状态样本' })).toHaveAccessibleDescription('这是用于比较错误外观的样本，不会提交数据。');
});

it('exposes real surface tokens and keyboard-backed navigation samples', async () => {
  const user = userEvent.setup();
  render(<DesignSpecimens />);
  await user.click(screen.getByRole('tab', { name: '表面与变量' }));
  expect(screen.getByText('轻透明表面')).toBeVisible();
  expect(document.querySelectorAll('.design-token-sample')).toHaveLength(4);
  const tabs = screen.getByRole('tablist', { name: 'underline 标签样本' });
  await user.click(within(tabs).getByRole('tab', { name: '详情' }));
  expect(within(tabs).getByRole('tab', { name: '详情' })).toHaveAttribute('aria-selected', 'true');
  expect(within(tabs).getByRole('tab', { name: '受限' })).toBeDisabled();
  expect(screen.getByRole('link', { name: '聊天、输入与流式回复' })).toHaveAttribute('href', '#/components/chat-thread');
});
