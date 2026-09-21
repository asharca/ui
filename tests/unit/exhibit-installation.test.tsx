import { readFileSync, existsSync } from 'node:fs';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Installation, packageCommands } from '../../showcase/Installation';
import { DocsApp } from '../../showcase/DocsApp';

afterEach(() => { cleanup(); localStorage.clear(); window.history.replaceState(null, '', '/'); });

it.each(Object.entries(packageCommands))('copies a real %s package-manager command', async (manager, command) => {
  const user = userEvent.setup(); render(<Installation />);
  fireEvent.mouseDown(screen.getByRole('tab', { name: manager, exact: true }), { button: 0 });
  const region = screen.getByRole('region', { name: '安装命令', exact: true });
  await waitFor(() => expect(region.querySelector('code')).toHaveTextContent(`${command} @asharca/ui`));
  await user.click(screen.getByRole('button', { name: '复制 安装命令', exact: true }));
  expect(await navigator.clipboard.readText()).toBe(`${command} @asharca/ui`);
});

it('ships the documented skill and keeps styling instructions in dependency order', () => {
  render(<Installation />);
  const css = screen.getByRole('region', { name: 'app.css' }).textContent!;
  expect(css.indexOf('tailwindcss')).toBeLessThan(css.indexOf('@asharca/ui/styles.css'));
  expect(css.indexOf('@asharca/ui/styles.css')).toBeLessThan(css.indexOf('@asharca/ui/themes.css'));
  const skill = readFileSync('skills/asharca-ui/SKILL.md', 'utf8');
  expect(skill).toContain('name: asharca-ui');
  expect(skill).toContain('data-ui-style="minimal"');
  expect(screen.getByRole('region', { name: '安装 Skill' })).toHaveTextContent('npx skills add asharca/ui');
  expect(screen.queryByText(/shadcn@latest add/)).not.toBeInTheDocument();
});

it('keeps the demo mounted while reading CSS and installation, with API collapsed initially', async () => {
  window.history.replaceState(null, '', '/#/components/input');
  const user = userEvent.setup(); render(<DocsApp />);
  const input = await screen.findByRole('textbox', { name: '项目名称', exact: true });
  await user.type(input, 'Keep this');
  const api = screen.getByRole('region', { name: 'Input 属性说明', hidden: true });
  expect(api.closest('details')).not.toHaveAttribute('open');
  expect(api).not.toBeVisible();
  fireEvent.mouseDown(screen.getByRole('tab', { name: 'CSS', exact: true }), { button: 0 });
  expect(await screen.findByRole('region', { name: '主题 CSS' })).toHaveTextContent('@asharca/ui/themes.css');
  // Keep measurable geometry for responsive charts while hiding focus/content.
  expect(input.closest('[role="tabpanel"]')).toHaveStyle({ visibility: 'hidden', position: 'absolute' });
  expect(input.closest('[role="tabpanel"]')).toHaveAttribute('inert');
  fireEvent.mouseDown(screen.getByRole('tab', { name: '安装', exact: true }), { button: 0 });
  expect(await screen.findByRole('region', { name: '组件安装命令' })).toHaveTextContent('pnpm add @asharca/ui');
  fireEvent.mouseDown(screen.getByRole('tab', { name: '预览', exact: true }), { button: 0 });
  expect(screen.getByRole('textbox', { name: '项目名称', exact: true })).toBe(input);
  expect(input).toHaveValue('Keep this');
  await user.click(screen.getByRole('button', { name: 'API 参考' }));
  expect(screen.getByRole('region', { name: 'Input 属性说明' })).toHaveTextContent('controlSize');
});

it('does not load any of the retired site styles or the former showroom', () => {
  for (const name of ['docs.css', 'ui-polish.css', 'design-experience.css', 'site-redesign.css', 'reference-gallery.css', 'ReferenceShowroom.tsx']) {
    expect(existsSync(`showcase/${name}`)).toBe(false);
  }
  expect(readFileSync('showcase/DocsApp.tsx', 'utf8')).toContain("import './exhibit.css'");
});
