import { writeFile } from 'node:fs/promises';
import { test, expect, type Locator } from '@playwright/test';

// Port the pre-rewrite frame-level acceptance criteria, not only screenshots
// of the two end states. Browser-default CSS reversal must stay continuous.
async function record(sidebar: Locator, reverse = false) {
  return sidebar.evaluate(async (node, reverse) => {
    await document.fonts.ready;
    await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    const toggle = node.querySelector<HTMLButtonElement>('header button')!;
    const items = [...node.querySelectorAll<HTMLElement>('[data-slot="workspace-item"]')];
    const footer = node.querySelector<HTMLElement>('[data-slot="workspace-footer"]')!;
    const firstState = node.getAttribute('data-collapsed');
    const read = (elapsed: number) => {
      const root = node.getBoundingClientRect();
      return {
        elapsed, width: root.width, toggleRight: root.right - toggle.getBoundingClientRect().right,
        footerTop: footer.getBoundingClientRect().top - root.top, footerHeight: footer.getBoundingClientRect().height,
        opacity: Number(getComputedStyle(items[0].querySelector('[data-slot="workspace-label"]')!).opacity),
        rows: items.map((item) => {
          const box = item.getBoundingClientRect();
          const icon = item.querySelector('[data-slot="workspace-icon"]')!.getBoundingClientRect();
          return { height: box.height, x: icon.left + icon.width / 2 - root.left, y: icon.top + icon.height / 2 - root.top, iconWidth: icon.width, iconHeight: icon.height };
        }),
      };
    };
    toggle.focus({ preventScroll: true });
    const frames = [read(0)];
    const start = performance.now();
    toggle.click();
    let reversed = false;
    await new Promise<void>((done) => {
      function frame(now: number) {
        frames.push(read(now - start));
        if (reverse && !reversed && now - start >= 65) { toggle.click(); reversed = true; }
        if (now - start >= 420) done(); else requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    return { frames, initial: firstState === 'true', final: node.getAttribute('data-collapsed') === 'true', focus: document.activeElement === toggle };
  }, reverse);
}

function checkMotion(result: Awaited<ReturnType<typeof record>>, { expanded = 224, compact = 64, reverse = false, reduced = false } = {}) {
  const { frames } = result;
  const first = frames[0];
  expect(result.final).toBe(reverse ? result.initial : !result.initial);
  expect(result.focus).toBe(true);
  for (const frame of frames) {
    expect(frame.width).toBeGreaterThanOrEqual(compact - 0.5);
    expect(frame.width).toBeLessThanOrEqual(expanded + 0.5);
    expect(Math.abs(frame.toggleRight - first.toggleRight)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(frame.footerTop - first.footerTop)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(frame.footerHeight - first.footerHeight)).toBeLessThanOrEqual(0.75);
    const progress = (expanded - frame.width) / (expanded - compact);
    const expectedHeight = 40 - 4 * progress;
    expect(frame.rows).toHaveLength(first.rows.length);
    for (const [index, row] of frame.rows.entries()) {
      expect(Math.abs(row.x - first.rows[index].x)).toBeLessThanOrEqual(0.75);
      expect(row.iconWidth).toBeCloseTo(16, 1); expect(row.iconHeight).toBeCloseTo(16, 1);
      expect(Math.abs(row.height - expectedHeight)).toBeLessThanOrEqual(0.25);
      const expectedY = first.rows[0].y - first.rows[0].height / 2 + expectedHeight / 2 + index * (expectedHeight + 4);
      expect(Math.abs(row.y - expectedY)).toBeLessThanOrEqual(0.75);
    }
  }
  const last = frames.at(-1)!;
  expect(last.width).toBeCloseTo(result.final ? compact : expanded, 0);
  expect(last.opacity).toBeCloseTo(result.final ? 0 : 1, 2);
  if (!reduced) {
    expect(frames.some((frame) => frame.width > compact + 1 && frame.width < expanded - 1)).toBe(true);
    expect(frames.some((frame) => frame.opacity > 0 && frame.opacity < 1)).toBe(true);
  } else {
    expect(frames.every((frame) => Math.abs(frame.width - compact) < 1 || Math.abs(frame.width - expanded) < 1)).toBe(true);
  }
  if (!reverse) for (let i = 1; i < frames.length; i++) {
    const delta = frames[i].width - frames[i - 1].width;
    expect(result.final ? delta : -delta).toBeLessThanOrEqual(0.5);
  }
}

for (const dark of [false, true]) {
  test(`fixed icon rail, synchronized rows, stable footer and interrupted reversal ${dark ? 'dark' : 'light'}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light', reducedMotion: 'no-preference' });
    await page.goto('components/workspace-sidebar/');
    const sidebar = page.locator('.detail-preview [data-slot="workspace-sidebar"]');
    await expect(sidebar.getByRole('button', { name: '折叠工作区侧栏' })).toBeVisible();
    await sidebar.scrollIntoViewIfNeeded();
    await expect(sidebar).toHaveCSS('transition-duration', '0.2s');
    await expect(sidebar).toHaveCSS('transition-timing-function', 'ease-out');
    await expect(sidebar.locator('[data-slot="workspace-label"]').first()).toHaveCSS('transition-duration', '0.12s');
    const rounds = [];
    for (const reverse of [false, true, false, true]) { const result = await record(sidebar, reverse); checkMotion(result, { reverse }); rounds.push(result); }
    await sidebar.evaluate((node) => { node.style.setProperty('--workspace-sidebar-width', '304px'); node.style.setProperty('--workspace-sidebar-collapsed-width', '80px'); });
    const custom = await record(sidebar); checkMotion(custom, { expanded: 304, compact: 80 }); rounds.push(custom);
    const expanded = await record(sidebar); checkMotion(expanded, { expanded: 304, compact: 80 }); rounds.push(expanded);
    await writeFile(testInfo.outputPath('workspace-motion-frames.json'), JSON.stringify(rounds, null, 2));
    await page.locator('.detail-preview [data-demo="workspace-sidebar"]').screenshot({ path: testInfo.outputPath('workspace-expanded.png') });
    await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
    await expect(sidebar).toHaveCSS('width', '80px');
    await page.locator('.detail-preview [data-demo="workspace-sidebar"]').screenshot({ path: testInfo.outputPath('workspace-collapsed.png') });
  });
}

test('compact tooltips, selection and keyboard toggle preserve focus', async ({ page }) => {
  await page.goto('components/workspace-sidebar/');
  const sidebar = page.locator('.detail-preview [data-slot="workspace-sidebar"]');
  // The accessible name correctly changes after the click, so retain a stable locator.
  const toggle = sidebar.locator('header button');
  await expect(toggle).toHaveAccessibleName('折叠工作区侧栏');
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(sidebar).toHaveCSS('width', '64px');
  await expect(toggle).toHaveAccessibleName('展开工作区侧栏');
  await expect(toggle).toBeFocused();
  const project = sidebar.getByRole('button', { name: '项目', exact: true });
  await project.focus(); await expect(page.getByRole('tooltip', { name: '项目', exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(project).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.detail-preview [data-demo="workspace-content"] h3')).toHaveText('项目');
  await expect(sidebar.locator('[data-slot="workspace-footer"]')).toHaveAttribute('inert', '');
});

test('reduced motion disables desktop geometry and text transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('components/workspace-sidebar/');
  const sidebar = page.locator('.detail-preview [data-slot="workspace-sidebar"]');
  await expect(sidebar).toBeVisible();
  checkMotion(await record(sidebar), { reduced: true });
  checkMotion(await record(sidebar), { reduced: true });
  const durations = await sidebar.evaluate((node) => [node, ...node.querySelectorAll('[data-slot="workspace-item"], [data-slot="workspace-label"]')].map((element) => getComputedStyle(element).transitionDuration));
  expect(durations.every((value) => value === '0s')).toBe(true);
});

test('mobile drawer slides in and out, ignores desktop collapse and restores focus', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('components/workspace-sidebar/');
  const sidebar = page.locator('.detail-preview [data-slot="workspace-sidebar"]');
  await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
  await expect(sidebar).toHaveCSS('width', '64px');
  await page.setViewportSize({ width: 375, height: 850 });
  const opener = page.locator('.detail-preview').getByRole('button', { name: '打开工作区导航' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: '我的工作区导航' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((node) => node.getBoundingClientRect().left)).toBeCloseTo(0, 1);
  await expect(dialog.locator('[data-slot="workspace-label"]').first()).toHaveCSS('opacity', '1');
  await expect(dialog.locator('[data-slot="workspace-item"]').first()).toHaveCSS('height', '40px');
  await page.screenshot({ path: testInfo.outputPath('workspace-drawer-mobile.png') });
  await dialog.getByRole('button', { name: '关闭工作区导航' }).click();
  const xs: number[] = [];
  for (let i = 0; i < 12; i++) {
    if (!await dialog.count()) break;
    const left = await dialog.evaluate((node) => node.getBoundingClientRect().left).catch(() => null);
    if (left !== null) xs.push(left);
    await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => done())));
  }
  expect(xs.some((x) => x < -1 && x > -303)).toBe(true);
  await expect(dialog).toHaveCount(0); await expect(opener).toBeFocused();
  await expect(page.locator('[data-slot="workspace-backdrop"]')).toHaveCount(0);
  await opener.click(); await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(opener).toBeFocused();
});

test('record the actual sidebar animation for review', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, viewport: { width: 1100, height: 800 }, colorScheme: 'dark', reducedMotion: 'no-preference', recordVideo: { dir: testInfo.outputPath('video'), size: { width: 1100, height: 800 } } });
  const page = await context.newPage();
  await page.goto('components/workspace-sidebar/');
  const sidebar = page.locator('.detail-preview [data-slot="workspace-sidebar"]');
  await expect(sidebar).toBeVisible();
  // Deliberate holds make the review video readable; geometry is tested above.
  await page.waitForTimeout(600);
  for (let i = 0; i < 4; i++) { await sidebar.locator('header button').click(); await page.waitForTimeout(450); }
  await context.close();
  const path = await page.video()?.path();
  if (path) await testInfo.attach('workspace-sidebar-animation', { path, contentType: 'video/webm' });
});
