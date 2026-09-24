import { expect, test } from '@playwright/test';

test('update guide is navigable, copyable and has a real static Markdown route', async ({ page, context, request }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('docs/installation/');
  await page.locator('#main-content').getByRole('link', { name: '阅读完整更新指南' }).click();
  await expect(page).toHaveURL(/\/docs\/updating\/?$/);
  await expect(page).toHaveTitle('更新组件 — Asharca UI');
  await expect(page.getByRole('heading', { level: 1, name: '更新组件' })).toBeVisible();
  const guide = page.locator('.update-guide');
  await expect(guide.locator('section.doc-section')).toHaveCount(10);
  for (const link of await page.getByRole('complementary', { name: '本页目录' }).getByRole('link').all()) {
    const href = await link.getAttribute('href');
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await page.getByRole('complementary', { name: '本页目录' }).getByRole('link', { name: /回退和复现/ }).click();
  await expect(page).toHaveURL(/#rollback$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: /7\. 回退和复现/ })).toBeInViewport();
  await page.getByRole('button', { name: 'Copy page as Markdown', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('# 更新组件');
  const md = await request.get('docs/updating.md');
  expect(md.ok()).toBe(true);
  const markdown = await md.text();
  expect(markdown).toContain('--diff utils.ts');
  expect(markdown).toContain('git revert UPDATE_COMMIT_SHA');
  expect(markdown).not.toMatch(/<!doctype html|\{\{RUNNER\}\}/i);
  const html = await request.get('docs/updating/index.html');
  expect(await html.text()).toContain('<title>更新组件 — Asharca UI</title>');
  await guide.screenshot({ path: testInfo.outputPath('updating-desktop.png') });
});

test('commands follow manager and origin; copying commands does not execute them', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('docs/updating/');
  const group = page.getByRole('group', { name: '更新命令包管理器' });
  const inspection = page.locator('#inspect .code-block').first();
  const base = new URL(page.url()).href.replace(/docs\/updating\/?$/, '');
  for (const [manager, runner] of [['npm', 'npx shadcn@latest'], ['pnpm', 'pnpm dlx shadcn@latest'], ['yarn', 'yarn dlx shadcn@latest'], ['bun', 'bunx --bun shadcn@latest']]) {
    await group.getByRole('button', { name: manager, exact: true }).click();
    await expect(inspection.locator('pre')).toContainText(`${runner} add ${base}r/button.json --dry-run`);
  }
  await inspection.getByRole('button', { name: '复制代码' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`bunx --bun shadcn@latest add ${base}r/button.json --diff utils.ts`);
  await page.reload();
  await expect(group.getByRole('button', { name: 'bun', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('search, component entry and mobile navigation find the update guide without overflow', async ({ page }, testInfo) => {
  await page.goto('components/button/');
  await page.locator('#installation').getByRole('link', { name: '更新组件' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '更新组件' })).toBeVisible();
  await page.getByRole('button', { name: '搜索组件与文档' }).click();
  await page.getByRole('combobox', { name: '搜索组件或文档' }).fill('回退');
  // Other components can match this keyword too; choose the document by name.
  await page.getByRole('listbox', { name: '搜索结果' }).getByRole('button', { name: /更新组件/ }).click();
  await expect(page).toHaveURL(/\/docs\/updating\/?$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.getByRole('button', { name: '打开导航', exact: true }).click();
  await page.getByRole('dialog', { name: '导航', exact: true }).getByRole('link', { name: '更新组件', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '导航', exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('updating-mobile-dark.png'), fullPage: true });
});
