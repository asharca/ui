import { expect, test } from '@playwright/test';

test('loading button holds its layout width through state changes', async ({ page }) => {
  await page.goto('components/button/');
  const button = page.locator('.detail-preview').getByRole('button', { name: '保存更改', exact: true });
  const width = await button.evaluate((node) => (node as HTMLElement).offsetWidth);
  await button.click();
  const busy = page.locator('.detail-preview button[aria-busy="true"]');
  await expect(busy).toBeDisabled();
  expect(await busy.evaluate((node) => (node as HTMLElement).offsetWidth)).toBe(width);
  const saved = page.locator('.detail-preview').getByRole('button', { name: '已保存', exact: true });
  await expect(saved).toBeVisible();
  expect(await saved.evaluate((node) => (node as HTMLElement).offsetWidth)).toBe(width);
});

test('native checkbox actually draws and clears its selected mark', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('components/checkbox/');
  const input = page.locator('.detail-preview input[type="checkbox"]').first();
  await input.check();
  const path = input.locator('xpath=..').locator('svg path').first();
  await expect.poll(async () => Number.parseFloat(await path.evaluate((node) => getComputedStyle(node).strokeDashoffset))).toBe(0);
  await input.uncheck();
  await expect.poll(async () => Number.parseFloat(await path.evaluate((node) => getComputedStyle(node).strokeDashoffset))).toBe(1);
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`accordion exit is inert and completes (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('components/accordion/');
    const preview = page.locator('.detail-preview').first();
    const trigger = preview.getByRole('button').first();
    if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(preview.locator('[data-slot="accordion-content"]').first()).toBeVisible();
    const result = await trigger.evaluate(async (node) => {
      const item = node.parentElement!.parentElement!;
      (node as HTMLButtonElement).click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const panel = item.querySelector('[data-slot="accordion-content"]');
      return !panel || (panel.hasAttribute('inert') && panel.getAttribute('aria-hidden') === 'true');
    });
    expect(result).toBe(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(preview.locator('[data-slot="accordion-content"]')).toHaveCount(0);
  });
}

test('preview width, hidden-panel state and narrow layouts stay usable', async ({ page }, testInfo) => {
  await page.goto('components/tabs/');
  const section = page.locator('.example-section').first();
  const canvas = section.locator('.preview-canvas');
  await section.getByRole('button', { name: '窄屏预览', exact: true }).click();
  await expect.poll(async () => (await canvas.boundingBox())!.width).toBeLessThanOrEqual(360);
  await section.getByRole('tab', { name: '设置', exact: true }).click();
  await section.getByRole('textbox', { name: '工作区名称' }).fill('保留这份草稿');
  await section.getByRole('tab', { name: 'Usage', exact: true }).click();
  await expect(section.getByRole('button', { name: '重置预览' })).toBeDisabled();
  await section.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(section.getByRole('textbox', { name: '工作区名称' })).toHaveValue('保留这份草稿');
  await page.screenshot({ path: testInfo.outputPath('tabs-light-desktop.png'), fullPage: true });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.screenshot({ path: testInfo.outputPath('tabs-dark-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('tabs-dark-narrow.png'), fullPage: true });
});
