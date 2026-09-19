import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

assert(process.env.UI_BROWSER_ROOT, 'Set UI_BROWSER_ROOT to the isolated Playwright installation.');
const { chromium } = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'))('playwright');
const output = resolve('ui-browser-artifacts/sidebar-motion');
mkdirSync(output, { recursive: true });
const results = [];
const errors = [];
let browser, server, page;

// Record the actual React component on every animation frame. End-state-only
// screenshots miss the first-frame auto-margin jump this regression protects.
async function recordMotion(label, { reverse = false, reduced = false, expanded = 256, collapsed = 64 } = {}) {
  const sidebar = page.locator('.tp-workspace-sidebar');
  const toggle = sidebar.locator('.tp-workspace-sidebar__toggle');
  await toggle.focus();
  const motion = await sidebar.evaluate(async (node, reverse) => {
    await document.fonts.ready;
    await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    const toggle = node.querySelector('.tp-workspace-sidebar__toggle');
    const icons = [...node.querySelectorAll('.tp-workspace-sidebar__icon'), node.querySelector('.tp-workspace-sidebar__workspace-icon'), node.querySelector('.tp-workspace-sidebar__footer > :first-child')].filter(Boolean);
    const label = node.querySelector('.tp-workspace-sidebar__label');
    const initial = node.dataset.collapsed === 'true';
    const frames = [];
    const measure = (elapsed) => {
      const root = node.getBoundingClientRect();
      frames.push({
        elapsed, width: root.width,
        opacity: Number(getComputedStyle(label).opacity),
        icons: icons.map((icon) => {
          const rect = icon.getBoundingClientRect();
          return { x: rect.left + rect.width / 2 - root.left, y: rect.top + rect.height / 2 - root.top, width: rect.width, height: rect.height };
        }),
      });
    };
    measure(0);
    const start = performance.now();
    toggle.click();
    let reversed = false;
    await new Promise((done) => {
      function sample(now) {
        measure(now - start);
        if (reverse && !reversed && now - start >= 60) {
          toggle.click();
          reversed = true;
        }
        if (now - start >= 400) done();
        else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    return { initial, final: node.dataset.collapsed === 'true', focus: document.activeElement === toggle, frames };
  }, reverse);
  results.push({ label, ...motion });
  assert(motion.frames.length >= 3, `${label}: insufficient animation samples`);
  assert(motion.frames[0].icons.length >= 3, `${label}: no sidebar icons to measure`);
  assert.equal(motion.final, reverse ? motion.initial : !motion.initial, `${label}: wrong final collapse state`);
  assert(motion.focus, `${label}: keyboard focus was lost`);
  let maxDrift = 0;
  for (const frame of motion.frames) {
    assert(frame.width >= collapsed - 1 && frame.width <= expanded + 1, `${label}: sidebar width overshoot`);
    for (const [index, icon] of frame.icons.entries()) {
      const origin = motion.frames[0].icons[index];
      const drift = Math.max(Math.abs(icon.x - origin.x), Math.abs(icon.y - origin.y));
      maxDrift = Math.max(maxDrift, drift);
      assert(drift <= 0.75, `${label}: icon ${index} moved ${drift}px at ${frame.elapsed}ms`);
      assert(icon.width > 0 && icon.height > 0, `${label}: icon disappeared`);
    }
  }
  const last = motion.frames.at(-1);
  assert(Math.abs(last.width - (motion.final ? collapsed : expanded)) <= 1, `${label}: final width`);
  assert(motion.final ? last.opacity <= 0.01 : last.opacity >= 0.99, `${label}: label fade did not finish`);
  if (!reduced) {
    assert(motion.frames.some((frame) => frame.width > collapsed + 1 && frame.width < expanded - 1), `${label}: width transition was removed`);
  } else {
    const duration = await sidebar.evaluate((node) => Math.max(...getComputedStyle(node).transitionDuration.split(',').map((value) => parseFloat(value) * 1000)));
    assert(duration <= 0.02, `${label}: ignored reduced motion preference`);
  }
  if (!reverse) {
    for (let i = 1; i < motion.frames.length; i++) {
      const delta = motion.frames[i].width - motion.frames[i - 1].width;
      assert(motion.final ? delta <= 0.75 : delta >= -0.75, `${label}: width moved in the wrong direction`);
    }
  }
  console.log(`PASS ${label}: ${motion.frames.length} frames, max icon drift ${maxDrift.toFixed(3)}px`);
}

try {
  server = process.env.UI_BASE_URL ? null : await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0, open: false } });
  const base = process.env.UI_BASE_URL || server.resolvedUrls.local[0];
  browser = await chromium.launch();
  for (const route of ['workspace', 'component']) {
    for (const style of ['minimal', 'tech', 'glass']) for (const dark of [false, true]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
      await context.addInitScript(({ style, dark }) => {
        localStorage.setItem('asharca-ui-docs-style', style);
        localStorage.setItem('asharca-ui-docs-theme', dark ? 'dark' : 'light');
        localStorage.setItem('asharca-ui-docs-density', 'comfortable');
        localStorage.removeItem('asharca-ui:sidebar-collapsed');
      }, { style, dark });
      page = await context.newPage();
      page.on('pageerror', (error) => errors.push(error.message));
      const path = route === 'workspace' ? '#/examples/workspace' : `#/preview/workspace-sidebar?theme=${dark ? 'dark' : 'light'}&style=${style}&density=comfortable`;
      await page.goto(`${base}${path}`);
      const sidebar = page.locator('.tp-workspace-sidebar');
      await sidebar.locator('.tp-workspace-sidebar__toggle').waitFor();
      const label = `${route}-${style}-${dark ? 'dark' : 'light'}`;
      await recordMotion(`${label}-collapse`);
      await page.screenshot({ path: join(output, `${label}-collapsed.png`) });
      // Focusing a collapsed item still reveals its accessible label.
      const item = sidebar.locator('.tp-workspace-sidebar__item').first();
      const accessibleName = await item.getAttribute('aria-label');
      await item.focus();
      await page.getByRole('tooltip', { name: accessibleName, exact: true }).waitFor();
      await recordMotion(`${label}-expand`);
      await recordMotion(`${label}-reverse`, { reverse: true });
      await page.screenshot({ path: join(output, `${label}-expanded.png`) });
      if (style === 'minimal' && !dark) {
        await page.setViewportSize({ width: 1024, height: 900 });
        await sidebar.evaluate((node) => {
          node.style.setProperty('--workspace-sidebar-width', '304px');
          node.style.setProperty('--workspace-sidebar-collapsed-width', '80px');
        });
        await recordMotion(`${label}-custom-collapse`, { expanded: 304, collapsed: 80 });
        await recordMotion(`${label}-custom-expand`, { expanded: 304, collapsed: 80 });
        await sidebar.evaluate((node) => {
          node.style.removeProperty('--workspace-sidebar-width');
          node.style.removeProperty('--workspace-sidebar-collapsed-width');
        });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await recordMotion(`${label}-reduced-collapse`, { reduced: true });
        await recordMotion(`${label}-reduced-expand`, { reduced: true });
        await recordMotion(`${label}-reduced-mobile-setup`, { reduced: true });
        // Persisted desktop collapse must not hide labels in the mobile drawer.
        for (const width of [375, 768]) {
          await page.setViewportSize({ width, height: 900 });
          const trigger = page.getByRole('button', { name: '打开导航', exact: true });
          await trigger.click();
          await sidebar.waitFor({ state: 'visible' });
          // Visibility alone is true before the transform has reached its end,
          // even with a .01ms reduced-motion transition (it needs a paint frame).
          await page.waitForFunction(() => {
            const node = document.querySelector('.tp-workspace-sidebar');
            const rect = node.getBoundingClientRect();
            return node.dataset.mobileOpen === 'true' && rect.left >= -1 && rect.right <= innerWidth + 1
              && [...node.querySelectorAll('.tp-workspace-sidebar__label')].every((label) => Number(getComputedStyle(label).opacity) === 1);
          }, undefined, { timeout: 5000 });
          const geometry = await sidebar.evaluate((node) => {
            const rect = node.getBoundingClientRect();
            return { left: rect.left, right: rect.right, viewport: innerWidth, labels: [...node.querySelectorAll('.tp-workspace-sidebar__label')].map((label) => Number(getComputedStyle(label).opacity)) };
          });
          assert(geometry.left >= -1 && geometry.right <= geometry.viewport + 1, `${route}: clipped mobile drawer ${JSON.stringify(geometry)}`);
          assert(geometry.labels.every((opacity) => opacity === 1), `${route}: collapsed desktop hid mobile labels`);
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => document.activeElement?.textContent === '打开导航' || document.activeElement?.getAttribute('aria-label') === '打开导航');
          assert(await trigger.evaluate((node) => document.activeElement === node), `${route}: mobile focus not restored`);
        }
      }
      await context.close();
    }
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
} catch (error) {
  if (page && !page.isClosed()) await page.screenshot({ path: join(output, 'failure.png') }).catch(() => {});
  throw error;
} finally {
  writeFileSync(join(output, 'frames.json'), JSON.stringify({ results, errors }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
