import { expect, test } from '@playwright/test';

test('rich examples provide unobstructed table and graph review views', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto('components/safe-streamdown/');
  const demo = page.locator('.detail-preview [data-demo="rich-markdown"]');
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'ready', { timeout: 25000 });
  await demo.scrollIntoViewIfNeeded();
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(demo.getByRole('button', { name: '错误回退' })).toBeInViewport();
  await expect(demo.getByRole('img')).toBeInViewport();
  await demo.screenshot({ path: testInfo.outputPath('markdown-table-flow-clean.png') });
  await demo.getByRole('button', { name: '时序图', exact: true }).click();
  await demo.getByRole('button', { name: '重置图表缩放' }).click();
  await expect(demo.locator('[data-slot="mermaid-block"]')).toHaveAttribute('data-state', 'ready');
  const source = await demo.getByRole('img').getAttribute('src');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await expect.poll(() => demo.getByRole('img').getAttribute('src')).not.toBe(source);
  await demo.scrollIntoViewIfNeeded();
  await demo.screenshot({ path: testInfo.outputPath('mermaid-sequence-clean.png') });
});
