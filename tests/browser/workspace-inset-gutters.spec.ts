import { test, expect } from '@playwright/test';

for (const width of [64, 80]) {
  test(`the ${width}px compact icon rail is centered against the content edge, not just inside its aside`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('components/workspace-shell/');
    const shell = page.locator('.detail-preview [data-demo="workspace-shell"]');
    await expect(shell).toBeVisible();
    const sidebar = shell.locator('[data-slot="workspace-sidebar"]');
    const surface = shell.locator('[data-slot="workspace-surface"]');
    const tabs = shell.locator('[data-slot="workspace-tab-strip"]');
    await shell.evaluate((node, width) => node.style.setProperty('--workspace-sidebar-collapsed-width', `${width}px`), width);
    await expect(surface).toHaveCSS('margin-left', '0px');
    const initialSidebar = (await sidebar.boundingBox())!;
    expect((await surface.boundingBox())!.x).toBeCloseTo(initialSidebar.x + initialSidebar.width, 1);
    await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
    await expect(sidebar).toHaveCSS('width', `${width}px`);
    const box = (await shell.boundingBox())!;
    const icon = (await sidebar.locator('[data-slot="workspace-icon"]').first().boundingBox())!;
    const panel = (await surface.boundingBox())!;
    const strip = (await tabs.boundingBox())!;
    const left = icon.x - box.x;
    const right = panel.x - icon.x - icon.width;
    expect(Math.abs(left - right)).toBeLessThanOrEqual(0.5);
    expect(panel.x - box.x).toBeCloseTo(width, 1);
    expect(strip.x).toBeCloseTo(panel.x, 1);
    expect(strip.width).toBeCloseTo(panel.width, 1);
    await shell.screenshot({ path: testInfo.outputPath(`workspace-balanced-rail-${width}.png`) });
  });
}

test('mobile keeps its own outer gutter after the desktop sidebar disappears', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator('.detail-preview [data-demo="workspace-shell"]');
  await expect(shell).toBeVisible();
  const surface = shell.locator('[data-slot="workspace-surface"]');
  await expect(surface).toHaveCSS('margin-left', '0px');
  await page.setViewportSize({ width: 375, height: 950 });
  await expect(shell.locator('[data-slot="workspace-sidebar"]')).toBeHidden();
  await expect(surface).toHaveCSS('margin-left', '8px');
  const panel = (await surface.boundingBox())!;
  const strip = (await shell.locator('[data-slot="workspace-tab-strip"]').boundingBox())!;
  expect(strip.x).toBeCloseTo(panel.x, 1);
  expect(strip.width).toBeCloseTo(panel.width, 1);
});
