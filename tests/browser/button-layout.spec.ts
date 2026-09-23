import { expect, test } from '@playwright/test';

test('loading label wrapper preserves host gap and full-width alignment', async ({ page }) => {
  await page.goto('components/button/');
  const button = page.locator('.detail-preview').getByRole('button', { name: '开始构建', exact: true });
  const layout = await button.evaluate((node) => {
    const button = node as HTMLButtonElement;
    button.style.width = '240px';
    button.style.gap = '20px';
    button.style.justifyContent = 'space-between';
    const label = button.querySelector('[data-slot="button-label"]')!;
    const icon = label.querySelector('svg')!;
    const style = getComputedStyle(button);
    const labelStyle = getComputedStyle(label);
    const contentRight = button.getBoundingClientRect().right - Number.parseFloat(style.paddingRight) - Number.parseFloat(style.borderRightWidth);
    return { gap: labelStyle.gap, alignment: labelStyle.justifyContent, iconRightGap: Math.abs(icon.getBoundingClientRect().right - contentRight) };
  });
  expect(layout.gap).toBe('20px');
  expect(layout.alignment).toBe('space-between');
  expect(layout.iconRightGap).toBeLessThan(1);
});
