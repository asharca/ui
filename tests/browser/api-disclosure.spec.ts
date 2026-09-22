import { test, expect } from '@playwright/test';

test('inherited props are complete but rendered only when expanded', async ({ page }) => {
  await page.goto('components/button/');
  const component = page.locator('[data-api-component="Button"]');
  await expect(component).toBeVisible();
  await expect(component.locator('.api-props').first().locator('[data-prop="variant"]')).toBeVisible();
  await expect(component.getByRole('table', { name: 'Button inherited props', exact: true })).toHaveCount(0);
  await component.locator('.api-inherited summary').click();
  const inherited = component.getByRole('table', { name: 'Button inherited props', exact: true });
  await expect(inherited).toBeVisible();
  await expect(inherited.locator('[data-prop="style"]')).toBeVisible();
  await component.locator('.api-inherited summary').click();
  await expect(inherited).toHaveCount(0);
});
for (const width of [375, 1440]) for (const dark of [false, true]) {
  test(`API heading and focused prop table ${width} ${dark ? 'dark' : 'light'}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce' });
    await page.goto('components/button/');
    await expect(page.locator('[data-api-component="Button"]')).toBeVisible();
    await page.locator('#api-reference').evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await expect(page.getByRole('heading', { name: 'API Reference', exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`focused-api-${width}-${dark ? 'dark' : 'light'}.png`) });
  });
}
