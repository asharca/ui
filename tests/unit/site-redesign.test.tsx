import { useState } from 'react';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { DocsApp } from '../../showcase/DocsApp';
import { DocsDirectory } from '../../showcase/DocsDirectory';
import { SiteSearch } from '../../showcase/SiteSearch';
import { catalogMetadata } from '../../showcase/catalog-data';

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); localStorage.clear(); });

it.each(['/', '/#/', '/#/home'])('opens the product homepage at %s with real form controls', async (path) => {
  window.history.replaceState(null, '', path);
  const user = userEvent.setup(); render(<DocsApp />);
  expect(await screen.findByRole('heading', { level: 1, name: /每个细节/ })).toBeVisible();
  const form = within(screen.getByRole('form', { name: '项目配置演示' }));
  const input = form.getByRole('textbox', { name: '项目名称' });
  await user.clear(input); await user.type(input, 'My product');
  await user.click(form.getByRole('radio', { name: '应用界面', exact: true }));
  expect(form.getByRole('radio', { name: 'AI 工作流', exact: true })).not.toBeChecked();
  await user.click(form.getByRole('button', { name: '保存配置', exact: true }));
  expect(form.getByText('配置已保存 · 仅本地演示')).toBeVisible();
  await user.click(form.getByRole('switch', { name: '流式响应' }));
  expect(form.queryByText('配置已保存 · 仅本地演示')).not.toBeInTheDocument();
  expect(input).toHaveValue('My product');
  expect(screen.getByRole('link', { name: '开始构建', exact: true })).toHaveAttribute('href', '#/installation');
});

it('opens command search, finds catalog content, and restores focus on Escape', async () => {
  window.history.replaceState(null, '', '/#/installation');
  const user = userEvent.setup(); render(<DocsApp />);
  const trigger = screen.getByRole('button', { name: '搜索文档', exact: true });
  await user.click(trigger);
  const dialog = await screen.findByRole('dialog', { name: '搜索文档' });
  const search = within(dialog).getByRole('searchbox', { name: '搜索文档和组件' });
  expect(search).toHaveFocus();
  await user.type(search, 'ChatComposerToolbar');
  const link = within(dialog).getByRole('link', { name: /ChatComposerToolbar/ });
  expect(link).toHaveAttribute('href', '#/components/chat-composer-toolbar');
  await user.keyboard('{ArrowDown}'); expect(link).toHaveFocus();
  await user.keyboard('{Escape}'); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await user.keyboard('{Control>}k{/Control}');
  expect(await screen.findByRole('dialog', { name: '搜索文档' })).toBeVisible();
});

it('handles empty command searches without activating an unrelated result', async () => {
  const user = userEvent.setup(); render(<SiteSearch open onOpenChange={() => undefined} />);
  const search = screen.getByRole('searchbox', { name: '搜索文档和组件' });
  await user.type(search, 'no-match-12345');
  expect(screen.getByRole('status')).toHaveTextContent('0 个结果');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  await user.keyboard('{Enter}'); expect(search).toHaveFocus();
});

it('collapses categories, reveals search matches, and reopens a newly active category', async () => {
  const group = catalogMetadata.find((doc) => doc.id === 'button')!.group;
  function Directory({ route }: { route: string }) {
    const [query, setQuery] = useState('');
    return <DocsDirectory route={route} query={query} onQueryChange={setQuery} onNavigate={() => undefined} />;
  }
  const user = userEvent.setup(); const view = render(<Directory route="#/installation" />);
  const toggle = screen.getByRole('button', { name: new RegExp(group) });
  await user.click(toggle); expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Button', exact: true })).not.toBeInTheDocument();
  await user.type(screen.getByRole('searchbox'), 'Button');
  expect(screen.getByRole('link', { name: 'Button', exact: true })).toBeVisible();
  await user.clear(screen.getByRole('searchbox'));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await act(async () => { view.rerender(<Directory route="#/components/button" />); });
  expect(screen.getByRole('link', { name: 'Button', exact: true })).toHaveAttribute('aria-current', 'page');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

it('includes the real integration contract and related components on documentation pages', async () => {
  window.history.replaceState(null, '', '/#/components/input'); render(<DocsApp />);
  const usage = screen.getByRole('heading', { name: '使用约定', level: 2 }).closest('section')!;
  const doc = catalogMetadata.find((item) => item.id === 'input')!;
  expect(usage).toHaveTextContent(doc.notes);
  expect(within(usage).getAllByRole('link').length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: '使用约定' })).toBeInTheDocument();
});

it('opens only the active category on a direct component visit', () => {
  render(<DocsDirectory route="#/components/chat-thread" query="" onQueryChange={() => undefined} onNavigate={() => undefined} />);
  expect(screen.getByRole('link', { name: 'ChatThread', exact: true })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('button', { name: /AI 聊天/ })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: /基础控件/ })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Button', exact: true })).not.toBeInTheDocument();
});
