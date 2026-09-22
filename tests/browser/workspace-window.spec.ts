import { test, expect, type Page } from '@playwright/test';
const shellSelector = '.detail-preview [data-demo="workspace-shell"]';

async function openDocumentWindow(page: Page, title: string) {
  const shell = page.locator(shellSelector);
  await shell.getByRole('button', { name: `${title}操作`, exact: true }).click();
  const opened = page.waitForEvent('popup');
  await page.getByRole('menuitem', { name: '在独立窗口打开', exact: true }).click();
  const popup = await opened;
  await expect(popup.locator('[data-demo="workspace-detached"]')).toBeVisible();
  return popup;
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`symmetric icon gutters, aligned surface edges and real detached page ${colorScheme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1600, height: 1200 });
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('components/workspace-shell/');
    const shell = page.locator(shellSelector);
    await expect(shell).toBeVisible();
    const sidebar = shell.locator('[data-slot="workspace-sidebar"]');
    const content = shell.locator('[data-slot="workspace-surface"]');
    const tabs = shell.locator('[data-slot="workspace-tab-strip"]');
    const tabBox = (await tabs.boundingBox())!;
    const panelBox = (await content.boundingBox())!;
    expect(Math.abs(tabBox.x - panelBox.x)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(tabBox.x + tabBox.width - panelBox.x - panelBox.width)).toBeLessThanOrEqual(0.5);
    const first = shell.locator('[data-slot="workspace-tab"]').first();
    expect(Math.abs((await first.boundingBox())!.x - panelBox.x)).toBeLessThanOrEqual(0.5);
    await expect(content).toHaveCSS('border-top-left-radius', '0px');
    await expect(tabs).toHaveCSS('height', '44px');
    await shell.screenshot({ path: testInfo.outputPath(`workspace-aligned-${colorScheme}.png`) });
    const before = await sidebar.locator('[data-slot="workspace-icon"]').first().boundingBox();
    await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
    await expect(sidebar).toHaveCSS('width', '64px');
    const side = (await sidebar.boundingBox())!;
    const item = (await sidebar.locator('[data-slot="workspace-item"]').first().boundingBox())!;
    const icon = (await sidebar.locator('[data-slot="workspace-icon"]').first().boundingBox())!;
    expect(item.width).toBeCloseTo(36, 1); expect(item.height).toBeCloseTo(36, 1);
    expect(icon.width).toBeCloseTo(18, 1); expect(icon.height).toBeCloseTo(18, 1);
    expect(item.x - side.x).toBeCloseTo(14, 1);
    expect(side.x + side.width - item.x - item.width).toBeCloseTo(14, 1);
    expect(icon.x - item.x).toBeCloseTo(9, 1);
    expect(item.x + item.width - icon.x - icon.width).toBeCloseTo(9, 1);
    expect(icon.x).toBeCloseTo(before!.x, 1);
    await shell.screenshot({ path: testInfo.outputPath(`workspace-compact-${colorScheme}.png`) });
    await sidebar.getByRole('button', { name: '展开工作区侧栏' }).click();
    await shell.getByRole('tab', { name: 'Agents', exact: true }).click();
    await expect(content).toHaveCSS('border-top-left-radius', '12px');
    await shell.getByRole('textbox', { name: '工作区便签' }).fill('只传递这个标签的便签，不放进 URL。');
    await shell.getByRole('button', { name: 'Agents操作', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: '在独立窗口打开' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`workspace-menu-${colorScheme}.png`) });
    await page.keyboard.press('Escape');
    const popup = await openDocumentWindow(page, 'Agents');
    await popup.emulateMedia({ colorScheme });
    await expect(popup.getByRole('heading', { name: 'Agents', exact: true })).toBeVisible();
    await expect(popup.getByRole('textbox', { name: '工作区便签' })).toHaveValue('只传递这个标签的便签，不放进 URL。');
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    expect(new URL(popup.url()).searchParams.size).toBe(1);
    expect(popup.url()).not.toContain(encodeURIComponent('便签'));
    await expect(popup.locator('.site-header, .site-dock, .docs-sidebar, .site-footer, [data-slot="workspace-sidebar"], [data-slot="workspace-tab-bar"]')).toHaveCount(0);
    await expect(shell.getByRole('tab', { name: 'Agents', exact: true })).toHaveCount(0);
    await popup.screenshot({ path: testInfo.outputPath(`workspace-detached-${colorScheme}.png`), fullPage: true });
    await popup.close();
  });
}

test('detached draft survives refresh and closing the original window', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await shell.getByRole('tab', { name: 'MCP 服务', exact: true }).click();
  await shell.getByRole('textbox', { name: '工作区便签' }).fill('原来的服务便签');
  const popup = await openDocumentWindow(page, 'MCP 服务');
  const input = popup.getByRole('textbox', { name: '工作区便签' });
  await input.fill('独立窗口编辑后的内容');
  await expect.poll(() => popup.evaluate(() => {
    const key = new URLSearchParams(location.search).get('__workspaceWindow');
    return JSON.parse(sessionStorage.getItem(`asharca:workspace-window:${key}`) || '{}').note;
  })).toBe('独立窗口编辑后的内容');
  await page.close();
  await popup.reload();
  await expect(input).toHaveValue('独立窗口编辑后的内容');
  await expect(popup.getByRole('heading', { name: 'MCP 服务', exact: true })).toBeVisible();
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
});

test('blocked popups preserve the tab and its draft and can be retried', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await shell.getByRole('tab', { name: 'Agents', exact: true }).click();
  await shell.getByRole('textbox', { name: '工作区便签' }).fill('不要丢掉这个草稿');
  await page.evaluate(() => {
    const state = window as Window & { savedOpen?: typeof window.open };
    state.savedOpen = window.open;
    window.open = () => null;
  });
  await shell.getByRole('button', { name: 'Agents操作', exact: true }).click();
  await page.getByRole('menuitem', { name: '在独立窗口打开' }).click();
  await expect(shell.getByRole('alert')).toContainText('原标签和便签已保留');
  await expect(shell.getByRole('tab', { name: 'Agents', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(shell.getByRole('textbox', { name: '工作区便签' })).toHaveValue('不要丢掉这个草稿');
  await page.evaluate(() => {
    const state = window as Window & { savedOpen?: typeof window.open };
    if (state.savedOpen) window.open = state.savedOpen;
    delete state.savedOpen;
  });
  const popup = await openDocumentWindow(page, 'Agents');
  await expect(popup.getByRole('textbox', { name: '工作区便签' })).toHaveValue('不要丢掉这个草稿');
  await expect(shell.getByRole('alert')).toHaveCount(0);
  await popup.close();
});

test('right-click and keyboard menus target the correct inactive tab', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  const target = shell.getByRole('tab', { name: 'MCP 服务', exact: true });
  await target.click({ button: 'right' });
  await expect(page.getByRole('menuitem', { name: '在独立窗口打开' })).toBeVisible();
  await expect(shell.getByRole('tab', { name: '概览', exact: true })).toHaveAttribute('aria-selected', 'true');
  const opened = page.waitForEvent('popup');
  await page.getByRole('menuitem', { name: '在独立窗口打开' }).click();
  const popup = await opened;
  await expect(popup.getByRole('heading', { name: 'MCP 服务', exact: true })).toBeVisible();
  await popup.close();
  const agents = shell.getByRole('tab', { name: 'Agents', exact: true });
  await agents.focus(); await page.keyboard.press('Shift+F10');
  await expect(page.getByRole('menuitem', { name: '在独立窗口打开' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(agents).toBeFocused();
});

test('detaching the last tab leaves a usable replacement rather than an empty shell', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await shell.getByRole('button', { name: '关闭 Agents', exact: true }).click();
  await shell.getByRole('button', { name: '关闭 MCP 服务', exact: true }).click();
  await expect(shell.getByRole('tab')).toHaveCount(1);
  const popup = await openDocumentWindow(page, '概览');
  await expect(shell.getByRole('tab')).toHaveCount(1);
  await expect(shell.getByRole('tabpanel')).toBeVisible();
  await shell.getByRole('button', { name: '新建标签' }).click();
  await expect(shell.getByRole('tab')).toHaveCount(2);
  await popup.close();
});

test('standalone tab-bar example also exposes real window actions', async ({ page }) => {
  await page.goto('components/workspace-tab-bar/');
  const preview = page.locator('.detail-preview');
  await preview.getByRole('button', { name: '设计文档操作', exact: true }).click();
  const opened = page.waitForEvent('popup');
  await page.getByRole('menuitem', { name: '在独立窗口打开' }).click();
  const popup = await opened;
  await expect(popup.getByRole('heading', { name: '设计文档', exact: true })).toBeVisible();
  await expect(preview.getByRole('tab', { name: '设计文档', exact: true })).toHaveCount(0);
  await popup.reload();
  await expect(popup.locator('[data-demo="workspace-detached"]')).toBeVisible();
  await popup.close();
});

test('mobile menu and tab strip share the same panel edges', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 1200 });
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await expect(shell).toBeVisible();
  const strip = (await shell.locator('[data-slot="workspace-tab-strip"]').boundingBox())!;
  const panel = (await shell.locator('[data-slot="workspace-surface"]').boundingBox())!;
  expect(strip.x).toBeCloseTo(panel.x, 1);
  expect(strip.width).toBeCloseTo(panel.width, 1);
  await shell.getByRole('button', { name: '概览操作', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: '在独立窗口打开' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('workspace-mobile-menu.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('invalid detached state shows recovery UI instead of a blank or fabricated page', async ({ page }) => {
  await page.goto('components/workspace-shell/?__workspaceWindow=missing');
  await expect(page.getByRole('heading', { name: '无法恢复此标签' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('状态不存在或已被清除');
  await page.getByRole('link', { name: '返回组件页面' }).click();
  await expect(page.getByRole('heading', { name: 'Workspace Shell', exact: true })).toBeVisible();
});
