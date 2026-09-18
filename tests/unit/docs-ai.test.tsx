import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, expect, it } from 'vitest';
import { DocsApp } from '../../showcase/DocsApp';
import { catalogMetadata } from '../../showcase/catalog-data';
import { componentMarkdown } from '../../showcase/component-markdown';

beforeAll(() => { execFileSync(process.execPath, ['scripts/build-ai-docs.mjs'], { stdio: 'pipe' }); });
afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });
it('generates Markdown from the same resolved catalog and actual example', () => {
  const doc = catalogMetadata.find((item) => item.id === 'choice-field')!;
  const source = readFileSync(resolve('showcase/demos', doc.demoFile), 'utf8');
  const markdown = componentMarkdown(doc, source, '0.2.2');
  expect(markdown).toContain('ChoiceFieldDemo');
  expect(markdown).toContain('@asharca/ui/choice-field');
  expect(markdown).toContain('checkbox \\| radio');
  expect(markdown).not.toContain('../../src/index');
  expect(markdown).toContain('不代表 npm');
});
it('all catalog components have generated static Markdown and valid subpath references', () => {
  for (const doc of catalogMetadata) {
    const path = resolve('showcase/public/ai/components', `${doc.id}.md`);
    expect(existsSync(path), doc.id).toBe(true);
    const text = readFileSync(path, 'utf8');
    expect(text).toContain(`# ${doc.name}`);
    expect(text).toContain(doc.notes);
    expect(text).not.toContain('../../src/index');
  }
  const index = readFileSync(resolve('showcase/public/llms.txt'), 'utf8');
  expect(index).toContain('./ai/components/choice-field.md');
  expect(readFileSync(resolve('dist/ai/llms-full.txt'), 'utf8')).toContain('ChoiceFieldDemo');
});
it('shows discoverable AI documents and truthful integration rules', async () => {
  window.history.replaceState(null, '', '/#/ai');
  render(<DocsApp />);
  expect(await screen.findByRole('heading', { name: '给 AI 使用的文档' })).toBeVisible();
  expect(screen.getByRole('link', { name: /llms-full.txt/ })).toHaveAttribute('href', expect.stringMatching(/\/llms-full\.txt$/));
  expect(screen.getByText('这是 npm 组件库，不是 shadcn CLI 注册表。')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '复制 AI 使用指南' })).toBeEnabled();
});
it('copies the current component as Markdown rather than an unrelated source file', async () => {
  const user = userEvent.setup();
  window.history.replaceState(null, '', '/#/components/checkbox');
  render(<DocsApp />);
  const button = await screen.findByRole('button', { name: '复制给 AI' });
  await user.click(button);
  await waitFor(() => expect(button).toHaveTextContent('已复制 Markdown'));
  const clipboard = await navigator.clipboard.readText();
  expect(clipboard).toContain('# Checkbox');
  expect(clipboard).toContain('CheckboxDemo');
  expect(clipboard).toContain('ChoiceGroup');
  expect(clipboard).not.toContain('../../src/index');
});
it('filters the component overview without changing the sidebar search', async () => {
  const user = userEvent.setup();
  window.history.replaceState(null, '', '/#/components');
  render(<DocsApp />);
  await user.type(screen.getByRole('searchbox', { name: '筛选组件总览' }), 'ChoiceField');
  const main = screen.getByRole('main');
  expect(within(main).getByRole('heading', { name: 'ChoiceField' })).toBeInTheDocument();
  expect(within(main).queryByRole('heading', { name: 'Button' })).not.toBeInTheDocument();
});
