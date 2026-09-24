import { expect, test } from '@playwright/test';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`selection header has real motion without row or column jumps (${reducedMotion})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('components/data-table/');
    const demo = page.locator('.detail-preview [data-demo="table-selection"]');
    await expect(demo.getByRole('checkbox', { name: '选择行 p1', exact: true })).toBeVisible();
    const frames = await demo.evaluate(async (node) => {
      const first = node.querySelector('tbody tr')!;
      const columns = [...first.querySelectorAll('td')];
      const read = () => ({ top: first.getBoundingClientRect().top, xs: columns.map((cell) => cell.getBoundingClientRect().left), opacity: Number(getComputedStyle(node.querySelector('[data-slot="table-selection-actions"]') ?? first).opacity) });
      const samples = [read()];
      (first.querySelector('input') as HTMLInputElement).click();
      const start = performance.now();
      while (performance.now() - start < 380) { await new Promise<void>((resolve) => requestAnimationFrame(() => resolve())); samples.push(read()); }
      return samples;
    });
    for (const frame of frames) { expect(Math.abs(frame.top - frames[0].top)).toBeLessThan(1); frame.xs.forEach((x, i) => expect(Math.abs(x - frames[0].xs[i])).toBeLessThan(1)); }
    expect(frames.some((frame) => frame.opacity > 0.01 && frame.opacity < 0.99)).toBe(reducedMotion === 'no-preference');
    await expect(demo.getByRole('group', { name: '已选行操作' })).toBeVisible();
    await expect(demo.getByRole('button', { name: '文件数', exact: true })).toHaveCount(0);
    await demo.screenshot({ path: testInfo.outputPath(`table-selected-${reducedMotion}.png`) });
    await demo.getByRole('button', { name: '清空选择' }).click();
    await expect(demo.getByRole('checkbox', { name: '选择本页全部' })).toBeFocused();
    await expect(demo.getByRole('button', { name: '文件数', exact: true })).toBeVisible();
  });
}

test('batch operations use real selected rows across pages and export local JSON', async ({ page }) => {
  await page.goto('components/data-table/');
  const demo = page.locator('.detail-preview [data-demo="table-selection"]');
  await demo.getByRole('checkbox', { name: '选择行 p2', exact: true }).check();
  await demo.getByRole('button', { name: '下一页' }).click();
  await demo.getByRole('checkbox', { name: '选择行 p5', exact: true }).check();
  const download = page.waitForEvent('download');
  await demo.getByRole('button', { name: '导出', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('selected-projects.json');
  await demo.getByRole('button', { name: '处理所选' }).click();
  await expect(demo.getByText('已处理 2 个本地示例项目')).toBeVisible();
  await expect(demo.locator('tbody tr').filter({ hasText: 'Epsilon' })).toContainText('已完成');
  await demo.getByRole('button', { name: '上一页' }).click();
  await expect(demo.locator('tbody tr').filter({ hasText: 'Beta' })).toContainText('已完成');
});

test('real Mermaid flowchart and sequence, source, zoom and dark theme', async ({ page, context }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  const block = demo.locator('[data-slot="mermaid-block"]');
  await expect(block).toHaveAttribute('data-state', 'ready', { timeout: 25000 });
  const image = block.getByRole('img', { name: 'Mermaid 图表' });
  await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(100);
  await expect(demo.getByRole('table')).toContainText('任务发布');
  await demo.screenshot({ path: testInfo.outputPath('rich-markdown-light.png') });
  await block.getByRole('button', { name: '放大图表' }).click();
  await expect(block.getByRole('button', { name: '重置图表缩放' })).toHaveText('125%');
  await block.getByRole('button', { name: '复制 Mermaid 源码' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('flowchart LR');
  await block.getByRole('button', { name: '源码', exact: true }).click();
  await expect(block.getByLabel('Mermaid 源码', { exact: true })).toContainText('审核通过');
  await block.getByRole('button', { name: '图表', exact: true }).click();
  const before = await image.getAttribute('src');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await expect.poll(() => image.getAttribute('src')).not.toBe(before);
  await demo.getByRole('button', { name: '时序图', exact: true }).click();
  await expect(block).toHaveAttribute('data-state', 'ready');
  await demo.screenshot({ path: testInfo.outputPath('mermaid-sequence-dark.png') });
  await expect(page.locator('[data-mermaid-measure]')).toHaveCount(0);
});

test('streaming and invalid diagrams keep source, block external assets and do not crash the chat', async ({ page }) => {
  const failures: string[] = []; page.on('pageerror', (error) => failures.push(error.message));
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  await demo.getByRole('button', { name: '错误回退' }).click();
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'error');
  await expect(demo.getByLabel('Mermaid 源码', { exact: true })).toContainText('未完成节点');
  await demo.getByRole('button', { name: '模拟流式' }).click();
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'streaming');
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'ready', { timeout: 20000 });
  await demo.getByText('编辑示例内容', { exact: true }).click();
  let requests = 0; await page.route('https://diagram-tracker.invalid/**', (route) => { requests++; return route.abort(); });
  await demo.getByRole('textbox', { name: '示例 Markdown' }).fill('```mermaid\nflowchart LR\n A@{ img: "https://diagram-tracker.invalid/pixel" }\n```');
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'error');
  expect(requests).toBe(0); expect(failures).toEqual([]);
  await demo.getByRole('button', { name: '关闭图表渲染' }).click();
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveCount(0);
  await expect(demo.locator('code.language-mermaid')).toBeVisible();
});

test('rich conversation displays user and assistant content and stays within a phone screen', async ({ page }, testInfo) => {
  await page.goto('components/chat-thread/');
  const demo = page.locator('.detail-preview [data-demo="rich-chat"]');
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'ready', { timeout: 25000 });
  const log = demo.getByRole('log');
  await log.evaluate((node) => { node.scrollTop = 0; });
  await expect(demo.getByRole('article', { name: '用户消息' })).toContainText('请用表格');
  await expect(demo.getByRole('article', { name: '助手消息' }).getByRole('table')).toContainText('需求确认');
  await demo.screenshot({ path: testInfo.outputPath('rich-chat-desktop.png') });
  await log.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await demo.screenshot({ path: testInfo.outputPath('rich-chat-answer.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('rich-chat-mobile.png'), fullPage: true });
});

test('selection actions are scrollable on mobile without widening the page', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('components/data-table/');
  const demo = page.locator('.detail-preview [data-demo="table-selection"]');
  await demo.getByRole('checkbox', { name: '选择行 p1', exact: true }).check();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await demo.getByRole('button', { name: '清空选择' }).click();
  await expect(demo.getByRole('checkbox', { name: '选择行 p1', exact: true })).not.toBeChecked();
  await demo.screenshot({ path: testInfo.outputPath('table-mobile.png') });
});

test('record table selection and clear transitions for visual review', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference', recordVideo: { dir: testInfo.outputPath('video'), size: { width: 1280, height: 900 } } });
  const page = await context.newPage();
  await page.goto('components/data-table/');
  const demo = page.locator('.detail-preview [data-demo="table-selection"]');
  await expect(demo).toBeVisible(); await demo.scrollIntoViewIfNeeded();
  await demo.screenshot({ path: testInfo.outputPath('table-default.png') });
  // Short holds make the real browser recording readable; frame geometry and
  // reduced-motion behavior are asserted in the tests above.
  await page.waitForTimeout(500);
  for (let index = 0; index < 3; index++) {
    await demo.getByRole('checkbox', { name: '选择行 p1', exact: true }).check();
    await page.waitForTimeout(400);
    await demo.getByRole('checkbox', { name: '选择行 p2', exact: true }).check();
    await page.waitForTimeout(600);
    await demo.getByRole('button', { name: '清空选择' }).click();
    await page.waitForTimeout(500);
  }
  await context.close();
  const path = await page.video()?.path();
  if (path) await testInfo.attach('table-selection-motion', { path, contentType: 'video/webm' });
});
