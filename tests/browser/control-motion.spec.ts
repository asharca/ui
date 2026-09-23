import { expect, test } from '@playwright/test';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`radio dot scales through real frames (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('components/radio/');
    const input = page.locator('.detail-preview').getByRole('radio', { name: '自动执行', exact: true });
    await expect(input).not.toBeChecked();
    const frames = await input.evaluate(async (node) => {
      const dot = node.parentElement!.querySelector('span[aria-hidden="true"]')!;
      const samples = [Number.parseFloat(getComputedStyle(dot).scale)];
      (node as HTMLInputElement).click();
      const start = performance.now();
      while (performance.now() - start < 360) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        samples.push(Number.parseFloat(getComputedStyle(dot).scale));
      }
      return samples;
    });
    expect(frames[0]).toBeCloseTo(0.5, 2);
    expect(frames.at(-1)).toBeCloseTo(1, 2);
    const intermediate = frames.some((scale) => scale > 0.51 && scale < 0.99);
    expect(intermediate).toBe(reducedMotion === 'no-preference');
  });
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`switch thumb moves inside its track (${direction})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('components/switch/');
    const control = page.locator('.detail-preview').getByRole('switch', { name: '桌面通知', exact: true });
    await control.evaluate((node, dir) => node.setAttribute('dir', dir), direction);
    const samples = await control.evaluate(async (node) => {
      const thumb = node.querySelector('span[data-state]')!;
      const position = () => thumb.getBoundingClientRect().left - node.getBoundingClientRect().left;
      const values = [position()];
      (node as HTMLButtonElement).click();
      const start = performance.now();
      while (performance.now() - start < 650) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        values.push(position());
      }
      return values;
    });
    const start = samples[0];
    const end = samples.at(-1)!;
    expect(Math.abs(end - start)).toBeGreaterThan(12);
    expect(direction === 'ltr' ? end > start : end < start).toBe(true);
    expect(samples.some((position) => position > Math.min(start, end) + 0.5 && position < Math.max(start, end) - 0.5)).toBe(true);
    expect(Math.min(...samples)).toBeGreaterThanOrEqual(2);
    expect(Math.max(...samples)).toBeLessThanOrEqual(22);
  });
}
