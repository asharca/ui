import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('table copy, CSV and expanded view preserve content and restore focus', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  const table = demo.locator('[data-slot="markdown-table"]');
  await table.getByRole('button', { name: '复制表格', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('任务发布\t林一\t已完成\t100%');
  const downloaded = page.waitForEvent('download');
  await table.getByRole('button', { name: '下载表格 CSV' }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('table.csv');
  const csv = await readFile((await download.path())!, 'utf8');
  expect(csv.startsWith('\uFEFF')).toBe(true);
  expect(csv).toContain('"任务发布","林一","已完成","100%"');
  await table.getByRole('button', { name: '展开表格' }).click();
  const dialog = page.getByRole('dialog', { name: '表格预览', exact: true });
  await expect(dialog.getByRole('cell', { name: '任务发布', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '复制表格', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('成果审核');
  await dialog.screenshot({ path: info.outputPath('table-expanded.png') });
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(table.getByRole('button', { name: '展开表格' })).toBeFocused();
  await table.getByRole('button', { name: '复制表格', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('交付归档');
});

test('CSV protects formulas and quotes commas, quotes and Unicode', async ({ page }) => {
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  await demo.getByText('编辑示例内容', { exact: true }).click();
  await demo.getByRole('textbox', { name: '示例 Markdown' }).fill('| 值 |\n| --- |\n| =1+2 |\n| 中文,"引号" |');
  const downloaded = page.waitForEvent('download');
  await demo.getByRole('button', { name: '下载表格 CSV' }).click();
  const csv = await readFile((await (await downloaded).path())!, 'utf8');
  expect(csv).toContain('"\'=1+2"');
  expect(csv).toContain('"中文,""引号"""');
});

test('diagram canvas fits, expands, drags and downloads only the sanitized SVG', async ({ page }, info) => {
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  const block = demo.locator('[data-slot="mermaid-block"]');
  await expect(block).toHaveAttribute('data-state', 'ready', { timeout: 25000 });
  await expect.poll(() => block.getByRole('img').evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(100);
  await block.getByRole('button', { name: '展开 Mermaid 图表' }).click();
  const dialog = page.getByRole('dialog', { name: 'Mermaid 图表预览' });
  await expect(dialog.getByRole('img')).toBeVisible();
  for (let i = 0; i < 8; i++) await dialog.getByRole('button', { name: '放大图表' }).click();
  const canvas = dialog.locator('[data-slot="mermaid-canvas"]');
  await expect.poll(() => canvas.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeGreaterThan(0);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2 - 80, { steps: 8 }); await page.mouse.up();
  expect(await canvas.evaluate((node) => node.scrollLeft + node.scrollTop)).toBeGreaterThan(0);
  await canvas.focus(); await page.keyboard.press('0');
  await expect(dialog.getByRole('button', { name: '重置图表缩放' })).toHaveText('100%');
  const downloaded = page.waitForEvent('download');
  await dialog.getByRole('button', { name: '下载 Mermaid SVG' }).click();
  const download = await downloaded;
  const svg = await readFile((await download.path())!, 'utf8');
  expect(download.suggestedFilename()).toBe('diagram.svg');
  expect(svg).toContain('<svg'); expect(svg).not.toMatch(/<script|<foreignObject|<image|onload=/i);
  await page.mouse.move(0, 0); await dialog.screenshot({ path: info.outputPath('mermaid-expanded.png') });
  await page.keyboard.press('Escape');
  await expect(block.getByRole('button', { name: '展开 Mermaid 图表' })).toBeFocused();
  await page.mouse.move(0, 0); await demo.screenshot({ path: info.outputPath('toolplane-rich-content.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await demo.screenshot({ path: info.outputPath('toolplane-rich-content-mobile.png') });
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`workspace selection surface travels without moving icons (${reducedMotion})`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('components/workspace-sidebar/');
    const nav = page.locator('.detail-preview [data-slot="workspace-sidebar"] [data-slot="workspace-nav"]');
    await expect(nav.getByRole('button', { name: '项目', exact: true })).toBeVisible();
    const frames = await nav.evaluate(async (node) => {
      await document.fonts.ready;
      const target = node.querySelector<HTMLButtonElement>('[data-item-id="settings"]')!;
      const icon = node.querySelector('[data-slot="workspace-icon"]')!;
      const read = () => ({ y: node.querySelector('[data-slot="workspace-selection"]')!.getBoundingClientRect().top, iconX: icon.getBoundingClientRect().left });
      const data = [read()]; target.click();
      const start = performance.now();
      while (performance.now() - start < 700) { await new Promise<void>((resolve) => requestAnimationFrame(() => resolve())); data.push(read()); }
      return { data, target: target.getBoundingClientRect().top };
    });
    const start = frames.data[0];
    expect(frames.data.at(-1)!.y).toBeCloseTo(frames.target, 0);
    expect(frames.data.some((frame) => frame.y > start.y + 1 && frame.y < frames.target - 1)).toBe(reducedMotion === 'no-preference');
    for (const frame of frames.data) expect(Math.abs(frame.iconX - start.iconX)).toBeLessThan(0.75);
    await nav.screenshot({ path: info.outputPath(`sidebar-selection-${reducedMotion}.png`) });
  });
}

test('documentation sidebar animates between routes with an independent indicator', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('components/button/');
  const nav = page.locator('.docs-sidebar .side-nav');
  await expect(nav.getByRole('link', { name: 'Input', exact: true })).toBeVisible();
  const samples = await nav.evaluate(async (node) => {
    const target = node.querySelector<HTMLAnchorElement>('a[href$="/components/input"]')!;
    const first = node.querySelector('[data-slot="docs-sidebar-selection"]')!.getBoundingClientRect().top;
    const ys = [first]; target.click(); const start = performance.now();
    while (performance.now() - start < 700) { await new Promise<void>((resolve) => requestAnimationFrame(() => resolve())); const pill = node.querySelector('[data-slot="docs-sidebar-selection"]'); if (pill) ys.push(pill.getBoundingClientRect().top); }
    return { ys, end: target.getBoundingClientRect().top };
  });
  expect(samples.ys.at(-1)).toBeCloseTo(samples.end, 0);
  expect(samples.ys.some((y) => y > samples.ys[0] + 1 && y < samples.end - 1)).toBe(true);
  await expect(nav.getByRole('link', { name: 'Input', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(nav.locator('[data-slot="docs-sidebar-selection"]')).toHaveCount(1);
});

test('record beUI-style selection travel in the workspace and docs', async ({ browser }, info) => {
  const context = await browser.newContext({ baseURL: info.project.use.baseURL, viewport: { width: 1280, height: 850 }, reducedMotion: 'no-preference', recordVideo: { dir: info.outputPath('video'), size: { width: 1280, height: 850 } } });
  const page = await context.newPage();
  try {
    await page.goto('components/workspace-sidebar/');
    const nav = page.locator('.detail-preview [data-slot="workspace-sidebar"] [data-slot="workspace-nav"]');
    await nav.scrollIntoViewIfNeeded();
    for (const name of ['项目', '设置', '概览', '设置', '项目', '概览']) {
      await nav.getByRole('button', { name, exact: true }).click();
      // Holds are for the review video; intermediate geometry is asserted above.
      await page.waitForTimeout(550);
    }
  } finally { await context.close(); }
  const path = await page.video()?.path();
  if (path) await info.attach('sidebar-selection-travel', { path, contentType: 'video/webm' });
});
