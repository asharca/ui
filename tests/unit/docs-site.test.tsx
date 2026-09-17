import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import * as UI from '../../src/index';
import { componentDocs } from '../../showcase/ComponentDemos';
import { DocsApp } from '../../showcase/DocsApp';
import pkg from '../../package.json';

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });
it('places the workspace in a separate examples section', () => {
  window.history.replaceState(null, '', '/#/examples'); render(<DocsApp />);
  expect(within(screen.getByRole('navigation', { name: '站点导航' })).queryByRole('link', { name: '组件', exact: true })).not.toBeInTheDocument();
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
it('starts on installation and filters the component directory', async () => {
  const user = userEvent.setup(); render(<DocsApp />);
  expect(screen.getByRole('heading', { name: '安装', exact: true })).toBeVisible();
  expect(screen.getByRole('region', { name: '安装命令' }).querySelector('code')).toHaveTextContent(/^pnpm add @asharca\/ui$/);
  const troubleshooting = screen.getByText('依赖未自动安装或版本冲突？').closest('details'); expect(troubleshooting).not.toHaveAttribute('open');
  await user.click(screen.getByText('依赖未自动安装或版本冲突？'));
  expect(screen.getByRole('region', { name: '完整依赖安装命令' })).toHaveTextContent('@assistant-ui/react@0.15.18');
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
