import { expect, test } from '@playwright/test';

for (const modal of [
  { slug: 'morphing-modal', trigger: 'Open wallet options', panel: '[data-framer-portal-id="morphing-modal"] > div', backdrop: 'Close modal' },
  { slug: 'center-morph-modal', trigger: 'Open modal', panel: '[role="dialog"]', backdrop: 'Dismiss modal' },
]) {
  test(`${modal.slug} exits without repainting its open state`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/components/motion/${modal.slug}`);
    await page.getByRole('button', { name: modal.trigger, exact: true }).click();
    const panel = page.locator(modal.panel);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('opacity', '1');
    if (modal.slug === 'center-morph-modal') {
      await expect(panel).toHaveCSS('clip-path', 'inset(0% round 30px)');
    }

    // Keep the original nodes through exit. A DOM-only test misses the native
    // animation cancellation that briefly repainted the old styles in Chrome.
    const samples = await page.evaluate(async ({ panel: selector, backdrop: label }) => {
      const surface = document.querySelector(selector);
      const backdrop = document.querySelector(`button[aria-label="${label}"]`);
      const rows = [];
      const { promise, resolve, reject } = Promise.withResolvers();
      const deadline = performance.now() + 3000;
      function sample() {
        const style = getComputedStyle(surface);
        rows.push({
          panel: surface.isConnected ? Number(style.opacity) : 0,
          backdrop: backdrop.isConnected ? Number(getComputedStyle(backdrop).opacity) : 0,
          inset: surface.isConnected ? Number.parseFloat(style.clipPath.slice(6)) || 0 : 50,
        });
        if (!surface.isConnected && !backdrop.isConnected) resolve(rows);
        else if (performance.now() > deadline) reject(new Error('Modal did not finish exiting'));
        else requestAnimationFrame(sample);
      }
      backdrop.click();
      requestAnimationFrame(sample);
      return promise;
    }, modal);

    for (let i = 1; i < samples.length; i++) {
      expect(samples[i].backdrop, `backdrop reappeared at frame ${i}`).toBeLessThanOrEqual(samples[i - 1].backdrop + 0.001);
      expect(samples[i].panel, `panel reappeared at frame ${i}`).toBeLessThanOrEqual(samples[i - 1].panel + 0.001);
      if (modal.slug === 'center-morph-modal') {
        expect(samples[i].inset, `panel unfolded during exit at frame ${i}`).toBeGreaterThanOrEqual(samples[i - 1].inset - 0.001);
      }
    }
    // Also reject a "fix" that silently removes the fade/fold animation.
    expect(samples.some(row => row.backdrop > 0 && row.backdrop < 0.9)).toBe(true);
    if (modal.slug === 'center-morph-modal') {
      expect(samples.some(row => row.inset > 5 && row.inset < 45)).toBe(true);
    } else {
      expect(samples.some(row => row.panel > 0 && row.panel < 0.9)).toBe(true);
    }
    await expect(panel).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });
}
