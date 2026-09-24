import { expect, test } from '@playwright/test';

test('mobile tables scroll instead of breaking short headers and cells into pieces', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('components/safe-streamdown/');
  const table = page.locator('.detail-preview [data-demo="rich-markdown"] [data-slot="markdown-table"]');
  await expect(table.getByRole('columnheader', { name: '负责人' })).toHaveCSS('white-space', 'nowrap');
  const region = table.getByRole('region');
  await expect.poll(() => region.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await table.screenshot({ path: info.outputPath('table-mobile-readable.png') });
});
