import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import * as UI from '../../src/index';
import { componentDocs } from '../../showcase/ComponentDemos';
import { DocsApp } from '../../showcase/DocsApp';
import pkg from '../../package.json';

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

it.each(['#/guide', '#/guide?from=bookmark'])('redirects the legacy %s entry to the canonical documentation', (hash) => {
  window.history.replaceState({ source: 'bookmark' }, '', `/?site=docs${hash}`);
  const historyLength = window.history.length;
  render(<DocsApp />);
  expect(window.location.hash).toBe(hash.replace('#/guide', '#/installation'));
  expect(window.location.search).toBe('?site=docs');
  expect(window.history.state).toEqual({ source: 'bookmark' });
  expect(window.history.length).toBe(historyLength);
  expect(screen.getByRole('heading', { name: '安装', exact: true, level: 1 })).toBeVisible();
  expect(screen.getByRole('link', { name: '安装与快速开始' })).toHaveAttribute('aria-current', 'page');
  expect(screen.queryByRole('link', { name: '使用手册' })).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: '手册目录' })).not.toBeInTheDocument();
  expect(document.title).toBe('安装 — Asharca UI');
});

it('handles legacy links again after navigating within the documentation', async () => {
  window.history.replaceState(null, '', '/#/components/button');
  const user = userEvent.setup(); render(<DocsApp />);
  for (const hash of ['#/guide', '#/guide?from=old-link']) {
    await act(async () => { window.location.hash = hash; });
    await waitFor(() => expect(window.location.hash).toBe(hash.replace('#/guide', '#/installation')));
    expect(screen.getByRole('heading', { name: '安装', exact: true, level: 1 })).toBeVisible();
    const sidebar = within(screen.getByRole('complementary', { name: '文档导航' }));
    await user.click(sidebar.getByRole('link', { name: 'Button', exact: true }));
    expect(await screen.findByRole('heading', { name: 'Button', level: 1 })).toBeVisible();
  }
});

it('places the workspace in a separate examples section', () => {
  window.history.replaceState(null, '', '/#/examples'); render(<DocsApp />);
  expect(within(screen.getByRole('navigation', { name: '站点导航' })).getByRole('link', { name: '组件', exact: true })).toHaveAttribute('href', '#/components');
  expect(screen.getByRole('navigation', { name: '组件目录' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '示例', level: 1 })).toBeVisible();
  expect(screen.getByRole('link', { name: '打开工作区示例' })).toHaveAttribute('href', '#/examples/workspace');
  expect(screen.getByRole('img', { name: /工作区示例/ })).toHaveAttribute('src', './workspace-preview.png');
  expect(screen.queryByText('本页目录')).not.toBeInTheDocument();
  const sidebar = screen.getByRole('complementary', { name: '文档导航' });
  expect(sidebar.querySelector('a[href^="#/examples"]')).toBeNull();
  expect(within(sidebar).queryByRole('heading', { name: '示例' })).not.toBeInTheDocument();
  expect(within(screen.getByRole('navigation', { name: '站点导航' })).getByRole('link', { name: '示例' })).toHaveAttribute('href', '#/examples');
});
it('has real source files and public imports for every component page', () => {
  expect(new Set(componentDocs.map((doc) => doc.id)).size).toBe(componentDocs.length);
  expect(new Set(componentDocs.map((doc) => doc.demoFile)).size).toBe(componentDocs.length);
  for (const doc of componentDocs) {
    expect(existsSync(resolve('src', doc.file)), doc.name).toBe(true);
    expect(doc.name in UI, doc.name).toBe(true);
    expect(doc.module ? `./${doc.module}` in pkg.exports : '.' in pkg.exports, doc.name).toBe(true);
    expect(doc.preview).not.toBeNull(); expect(doc.api.length, doc.name).toBeGreaterThan(0); expect(doc.notes.length).toBeGreaterThan(0);
    const demo = readFileSync(resolve('showcase/demos', doc.demoFile), 'utf8');
    expect(demo).not.toContain('componentDocs'); expect(demo).not.toContain('./ChatExample');
    expect(demo.match(/export function /g)).toHaveLength(1);
    expect(demo).toContain(`export function ${doc.demoFile.replace('.tsx', '')}`);
    expect(doc.code).toBe('');
  }
});
it("shows only the current component's demo source", async () => {
  window.history.replaceState(null, '', '/#/components/chat-shell'); const user = userEvent.setup(); render(<DocsApp />);
  expect(screen.queryByRole('tab', { name: '演示源码' })).not.toBeInTheDocument();
  await user.click(await screen.findByRole('button', { name: '发布计划', exact: true }));
  expect(document.querySelector('[data-chat-ui="chat-shell"]')).toBeVisible();
  await user.click(document.querySelector('.tp-chat-shell__toggle--desktop')!);
  expect(document.querySelector('[data-chat-ui="chat-shell"]')).toHaveAttribute('data-sidebar-open', 'false');
  await user.click(screen.getByRole('tab', { name: '用法代码' }));
  const code = await screen.findByRole('region', { name: '用法 TSX' });
  await waitFor(() => expect(code).toHaveTextContent('export function ShellDemo'));
  expect(code).toHaveTextContent('"@asharca/ui"'); expect(code).not.toHaveTextContent('ConversationDemo'); expect(code).not.toHaveTextContent('WorkspaceDemo'); expect(code).not.toHaveTextContent('componentDocs');
});
it('keeps explicit installation and filters the component directory', async () => {
  window.history.replaceState(null, '', '/#/installation');
  const user = userEvent.setup(); render(<DocsApp />);
  expect(screen.getByRole('heading', { name: '安装', exact: true })).toBeVisible();
  expect(screen.getByRole('region', { name: '安装命令' }).querySelector('code')).toHaveTextContent(/^pnpm add @asharca\/ui$/);
  const troubleshooting = screen.getByText('依赖未自动安装或版本冲突？').closest('details'); expect(troubleshooting).not.toHaveAttribute('open');
  await user.click(screen.getByText('依赖未自动安装或版本冲突？'));
  expect(screen.getByRole('region', { name: '完整依赖安装命令' })).toHaveTextContent(`@assistant-ui/react@${pkg.devDependencies['@assistant-ui/react']}`);
  await user.selectOptions(screen.getByRole('combobox', { name: '包管理器' }), 'npm');
  expect(screen.getByRole('region', { name: '安装命令' }).querySelector('code')).toHaveTextContent(/^npm install @asharca\/ui$/);
  await user.type(screen.getByRole('searchbox', { name: '搜索组件文档' }), 'ChatComposerToolbar');
  expect(screen.getByRole('link', { name: 'ChatComposerToolbar' })).toHaveAttribute('href', '#/components/chat-composer-toolbar');
  expect(screen.queryByRole('link', { name: 'Accordion', exact: true })).not.toBeInTheDocument();
});
it('uses independent viewport previews and documents each component API', async () => {
  window.history.replaceState(null, '', '/#/components/input'); const user = userEvent.setup(); render(<DocsApp />);
  expect(screen.getByRole('region', { name: 'Input 属性说明' })).toHaveTextContent('controlSize');
  expect(screen.getByText('查看组件实现').closest('details')).not.toHaveAttribute('open');
  await user.selectOptions(screen.getByRole('combobox', { name: '预览视口' }), '375');
  const frame = screen.getByTitle('Input 375px 预览'); expect(frame).toHaveStyle({ width: '375px' });
  expect(frame.getAttribute('src')).toContain('#/preview/input?theme=');
  expect(screen.getByRole('link', { name: '独立打开示例' }).getAttribute('href')).toContain('#/preview/input?theme=');
});
it('renders standalone previews without another copy of the navigation', async () => {
  window.history.replaceState(null, '', '/#/preview/input?theme=dark'); render(<DocsApp />);
  expect(await screen.findByRole('textbox', { name: '项目名称' })).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: '组件目录' })).not.toBeInTheDocument();
  expect(document.documentElement).toHaveClass('dark');
});

it('preserves demo edits across code tabs and resets only when requested', async () => {
  window.history.replaceState(null, '', '/#/components/input');
  const user = userEvent.setup(); render(<DocsApp />);
  const input = await screen.findByRole('textbox', { name: '项目名称' });
  await user.type(input, 'Release notes');
  await user.click(screen.getByRole('tab', { name: '用法代码' }));
  expect(await screen.findByRole('region', { name: '用法 TSX' })).toHaveTextContent('InputDemo');
  expect(screen.queryByRole('textbox', { name: '项目名称' })).not.toBeInTheDocument();
  expect(screen.queryByRole('combobox', { name: '视觉风格' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('tab', { name: '预览', exact: true }));
  expect(screen.getByRole('textbox', { name: '项目名称' })).toHaveValue('Release notes');
  await user.click(screen.getByRole('button', { name: '重置组件预览' }));
  expect(await screen.findByRole('textbox', { name: '项目名称' })).toHaveValue('');
});

it('groups the catalog and combines category and text filters', async () => {
  window.history.replaceState(null, '', '/#/components');
  const user = userEvent.setup(); render(<DocsApp />);
  const main = within(screen.getByRole('main'));
  expect(main.getByRole('region', { name: '基础控件' })).toBeVisible();
  await user.selectOptions(main.getByRole('combobox', { name: '组件分类' }), 'AI 聊天');
  expect(main.queryByRole('heading', { name: 'Button', exact: true })).not.toBeInTheDocument();
  expect(main.getByRole('heading', { name: 'ChatThread', level: 3 })).toBeVisible();
  await user.type(main.getByRole('searchbox'), '不存在的组件');
  expect(main.getByRole('status')).toHaveTextContent('0 个组件');
  expect(main.queryByRole('region', { name: 'AI 聊天' })).not.toBeInTheDocument();
});
