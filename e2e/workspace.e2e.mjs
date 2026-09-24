import { expect, test } from '@playwright/test';

const tabs = (page) => page.getByRole('tablist', { name: '工作区标签' });
const tab = (page, name) => tabs(page).getByRole('tab', { name, exact: true });

async function ready(page) {
  await page.goto('/workspace');
  await expect(tab(page, '概览')).toHaveAttribute('aria-selected', 'true');
  // An interaction confirms hydration instead of relying on static server text.
  await tab(page, 'Agents').click();
  await expect(page.getByRole('textbox', { name: 'Agents便签' })).toBeVisible();
  await tab(page, '概览').click();
}

for (const colorScheme of ['light', 'dark']) {
  test(`inset surface, tab shoulders and fixed controls align (${colorScheme})`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await ready(page);
    const shell = page.locator('[data-slot="workspace-shell"]');
    const surface = page.locator('[data-slot="workspace-surface"]');
    const strip = page.locator('[data-slot="workspace-tab-strip"]');
    await expect(surface).toHaveCSS('border-top-left-radius', '0px');
    const a = await surface.boundingBox();
    const b = await strip.boundingBox();
    expect(Math.abs(a.x - b.x)).toBeLessThan(1);
    expect(Math.abs(a.width - b.width)).toBeLessThan(1);
    expect(Math.abs(a.y - b.y - b.height)).toBeLessThan(1);
    await shell.screenshot({ path: info.outputPath(`workspace-${colorScheme}.png`) });
    await page.getByRole('button', { name: '折叠工作区侧栏', exact: true }).click();
    await expect(page.getByRole('button', { name: '展开工作区侧栏', exact: true })).toBeVisible();
    const collapsed = await surface.boundingBox();
    expect(collapsed.x).toBeCloseTo(64, 0);
    await tab(page, 'MCP 服务').click();
    await expect(surface).toHaveCSS('border-top-left-radius', '12px');
    await shell.screenshot({ path: info.outputPath(`workspace-${colorScheme}-compact.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1)).toBe(true);
  });
}

test('drafts and content nodes remain mounted across tab switches and sidebar folding', async ({ page }) => {
  await ready(page);
  const original = page.getByRole('textbox', { name: '概览便签' });
  await original.fill('切换标签，保持这份草稿');
  await original.evaluate((node) => { node.dataset.originalDraft = 'true'; });
  await tab(page, 'Agents').click();
  await page.getByRole('textbox', { name: 'Agents便签' }).fill('另一份草稿');
  await page.getByRole('button', { name: '折叠工作区侧栏', exact: true }).click();
  await tabs(page).getByRole('tab', { name: /概览/ }).click();
  await expect(original).toHaveValue('切换标签，保持这份草稿');
  await expect(original).toHaveAttribute('data-original-draft', 'true');
  await page.getByRole('button', { name: '保存便签', exact: true }).click();
  await expect(tab(page, '概览')).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: '新建标签', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '新标签 1便签' })).toBeVisible();
  await page.getByRole('button', { name: '关闭 新标签 1', exact: true }).click();
  await expect(tabs(page).getByRole('tab', { selected: true })).toBeFocused();
  await tab(page, '概览').click();
  await expect(original).toHaveValue('切换标签，保持这份草稿');
});

test('keyboard reordering, fixed boundary and dirty close confirmation are real', async ({ page }) => {
  await ready(page);
  await tab(page, 'Agents').focus();
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 'MCP 服务')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tab(page, '概览')).toBeFocused();
  await page.keyboard.press('Delete');
  await expect(tab(page, '概览')).toBeVisible();
  await page.keyboard.press('End');
  await expect(tab(page, 'MCP 服务')).toBeFocused();
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(tabs(page).getByRole('tab')).toHaveText(['概览', 'MCP 服务', 'Agents']);
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(tabs(page).getByRole('tab')).toHaveText(['概览', 'MCP 服务', 'Agents']);
  await page.getByRole('textbox', { name: 'MCP 服务便签' }).fill('未保存内容');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: '关闭 MCP 服务', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'MCP 服务便签' })).toHaveValue('未保存内容');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '关闭 MCP 服务', exact: true }).click();
  await expect(tabs(page).getByRole('tab')).toHaveCount(2);
  await expect(tab(page, 'Agents')).toBeFocused();
});

test('beUI action popover and context menu preserve tab identity and pin rules', async ({ page }) => {
  await ready(page);
  await page.getByRole('button', { name: 'Agents操作', exact: true }).click();
  const pin = page.getByRole('button', { name: '固定标签', exact: true });
  await expect(pin).toBeVisible();
  await pin.click();
  await expect(page.getByRole('button', { name: '关闭 Agents', exact: true })).toHaveCount(0);
  await tab(page, 'MCP 服务').focus();
  await page.keyboard.press('Shift+F10');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: '向左移动', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await page.getByRole('button', { name: 'Agents操作', exact: true }).click();
  await page.getByRole('button', { name: '取消固定', exact: true }).click();
  await expect(page.getByRole('button', { name: '关闭 Agents', exact: true })).toBeVisible();
});

test('dragging reorders only within the unpinned group', async ({ page }) => {
  await ready(page);
  const a = page.locator('[data-slot="workspace-tab"][data-tab-key="agents"]');
  const b = page.locator('[data-slot="workspace-tab"][data-tab-key="mcp"]');
  const transfer = await page.evaluateHandle(() => new DataTransfer());
  await a.dispatchEvent('dragstart', { dataTransfer: transfer });
  await b.dispatchEvent('dragover', { dataTransfer: transfer });
  await b.dispatchEvent('drop', { dataTransfer: transfer });
  await a.dispatchEvent('dragend', { dataTransfer: transfer });
  await expect(tabs(page).getByRole('tab')).toHaveText(['概览', 'MCP 服务', 'Agents']);
  await transfer.dispose();
});

test('independent window receives only its minimal snapshot and survives refresh', async ({ page }) => {
  await ready(page);
  await tab(page, 'Agents').click();
  await page.getByRole('textbox', { name: 'Agents便签' }).fill('独立窗口里的便签');
  await page.evaluate(() => sessionStorage.setItem('unrelated-private-state', 'not-for-copying'));
  await page.getByRole('button', { name: 'Agents操作', exact: true }).click();
  const popupEvent = page.waitForEvent('popup');
  await page.getByRole('button', { name: '在独立窗口打开', exact: true }).click();
  const popup = await popupEvent;
  await expect(popup.getByRole('textbox', { name: 'Agents便签' })).toHaveValue('独立窗口里的便签');
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  expect(await popup.evaluate(() => sessionStorage.getItem('unrelated-private-state'))).toBeNull();
  await popup.getByRole('textbox', { name: 'Agents便签' }).fill('刷新后继续');
  await popup.reload();
  await expect(popup.getByRole('textbox', { name: 'Agents便签' })).toHaveValue('刷新后继续');
  await expect(tabs(popup).getByRole('tab')).toHaveCount(1);
  await expect(popup.getByRole('button', { name: '关闭 Agents', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Agents便签' })).toHaveValue('独立窗口里的便签');
  await popup.close();
});

test('blocked popups report failure without deleting the original draft', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { window.open = () => null; });
  await page.getByRole('button', { name: '概览操作', exact: true }).click();
  await page.getByRole('button', { name: '在独立窗口打开', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('拦截');
  await expect(page.getByRole('textbox', { name: '概览便签' })).toHaveValue('整理本周的工作区任务');
});

test('mobile sidebar is usable and returns focus with no page overflow', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const trigger = page.getByRole('button', { name: '打开工作区导航', exact: true });
  await page.screenshot({ path: info.outputPath('workspace-phone.png') });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Asharca Workspace导航' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: '项目文件', exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('workspace-phone-navigation.png') });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('button', { name: '项目文件', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('textbox', { name: '项目文件便签' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

for (const reducedMotion of ['no-preference', 'reduce']) {
  test(`tab selection travels without shifting the content surface (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await ready(page);
    const strip = page.locator('[data-slot="workspace-tab-strip"]');
    const frames = await strip.evaluate(async (node) => {
      await document.fonts.ready;
      const surface = document.querySelector('[data-slot="workspace-surface"]');
      const target = node.querySelector('[data-tab-key="mcp"]');
      const data = [];
      const read = () => { const mark = node.querySelector('[data-slot="workspace-tab-selection"]'); data.push({ x: mark.getBoundingClientRect().x, y: surface.getBoundingClientRect().y }); };
      // Settle the prior hydration-check selection before capturing this one.
      await new Promise((resolve) => setTimeout(resolve, 550));
      read(); target.querySelector('[role="tab"]').click();
      const start = performance.now();
      while (performance.now() - start < 700) { await new Promise((resolve) => requestAnimationFrame(resolve)); read(); }
      return { data, end: target.getBoundingClientRect().x };
    });
    expect(frames.data.at(-1).x).toBeCloseTo(frames.end, 0);
    expect(frames.data.some((frame) => frame.x > frames.data[0].x + 1 && frame.x < frames.end - 1)).toBe(reducedMotion === 'no-preference');
    for (const frame of frames.data) expect(Math.abs(frame.y - frames.data[0].y)).toBeLessThan(1);
  });
}

test('workspace Registry and docs use the beUI graph but a local install URL', async ({ page, request }) => {
  for (const slug of ['workspace-shell', 'workspace-tab-bar']) {
    const response = await request.get(`/r/${slug}.json`);
    expect(response.ok()).toBe(true);
    const payload = await response.json();
    expect(payload.files.some((file) => file.path.includes(`components/workspace/${slug}.tsx`))).toBe(true);
    expect(payload.files.some((file) => /agent-internal|registry\/ui|site\/preview/.test(file.path))).toBe(false);
    expect(payload.files.some((file) => file.path.includes('components/motion/'))).toBe(true);
    await page.goto(`/components/blocks/${slug}`);
    await expect(page.getByRole('heading', { name: slug === 'workspace-shell' ? 'Workspace Shell' : 'Workspace Tab Bar', exact: true }).first()).toBeVisible();
    await expect(page.getByText(`http://localhost:3000/r/`, { exact: true }).first()).toBeVisible();
  }
});
