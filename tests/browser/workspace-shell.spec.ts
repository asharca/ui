import { test, expect, type Locator } from '@playwright/test';

const shellSelector = '.detail-preview [data-demo="workspace-shell"]';

for (const width of [1440, 375]) for (const dark of [false, true]) {
  test(`inset workspace surfaces and isolated scrolling ${width}px ${dark ? 'dark' : 'light'}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
    await page.goto('components/workspace-shell/');
    const shell = page.locator(shellSelector);
    const sidebar = shell.locator('[data-slot="workspace-sidebar"]');
    const content = shell.locator('[data-slot="workspace-content"]');
    const surface = shell.locator('[data-slot="workspace-surface"]');
    const active = shell.locator('[data-slot="workspace-tab"][data-active="true"]');
    await expect(shell).toBeVisible();
    await shell.scrollIntoViewIfNeeded();
    if (width >= 640) {
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toHaveCSS('border-right-width', '0px');
      expect(await sidebar.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(await shell.evaluate((node) => getComputedStyle(node).backgroundColor));
      await expect(sidebar.locator('[data-slot="workspace-header"]')).toHaveCSS('border-bottom-width', '0px');
    } else {
      await expect(sidebar).toBeHidden();
      await expect(shell.getByRole('button', { name: '打开工作区导航' })).toBeVisible();
    }
    await expect(shell.locator('[data-slot="workspace-tab-bar"]')).toHaveCSS('border-bottom-width', '0px');
    await expect(active).toHaveCSS('box-shadow', 'none');
    expect(await active.evaluate((node) => getComputedStyle(node, '::before').backgroundImage)).not.toBe('none');
    expect(await active.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(await surface.evaluate((node) => getComputedStyle(node).backgroundColor));
    const surfaceBox = (await surface.boundingBox())!;
    const activeBox = (await active.boundingBox())!;
    expect(Math.abs(activeBox.y + activeBox.height - surfaceBox.y)).toBeLessThanOrEqual(1);
    const header = shell.locator('[data-slot="workspace-shell-header"]');
    const footer = shell.locator('[data-slot="workspace-shell-footer"]');
    const before = { header: await header.boundingBox(), footer: await footer.boundingBox(), windowY: await page.evaluate(() => window.scrollY) };
    await content.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    expect(await content.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    expect(await header.boundingBox()).toEqual(before.header);
    expect(await footer.boundingBox()).toEqual(before.footer);
    expect(await page.evaluate(() => window.scrollY)).toBe(before.windowY);
    expect(await shell.evaluate((node) => node.scrollTop)).toBe(0);
    expect(await sidebar.locator('[data-slot="workspace-nav"]').evaluate((node) => node.scrollTop)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await content.evaluate((node) => { node.scrollTop = 0; });
    await shell.screenshot({ path: testInfo.outputPath(`workspace-shell-${width}-${dark ? 'dark' : 'light'}.png`) });
  });
}

async function recordFold(shell: Locator, reverse = false) {
  return shell.evaluate(async (node, reverse) => {
    await document.fonts.ready;
    const sidebar = node.querySelector<HTMLElement>('[data-slot="workspace-sidebar"]')!;
    const body = node.querySelector<HTMLElement>('[data-slot="workspace-body"]')!;
    const toggle = sidebar.querySelector<HTMLButtonElement>('header button')!;
    const icon = sidebar.querySelector('[data-slot="workspace-icon"]')!;
    await Promise.all(sidebar.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    const read = () => {
      const side = sidebar.getBoundingClientRect();
      const panel = body.getBoundingClientRect();
      const image = icon.getBoundingClientRect();
      return { width: side.width, bodyWidth: panel.width, iconX: image.left + image.width / 2 - side.left, join: panel.left - side.right };
    };
    const firstCollapsed = sidebar.dataset.collapsed === 'true';
    const frames = [read()];
    toggle.focus({ preventScroll: true }); toggle.click();
    const start = performance.now(); let reversed = false;
    await new Promise<void>((resolve) => {
      const sample = (now: number) => {
        frames.push(read());
        if (reverse && !reversed && now - start >= 65) { toggle.click(); reversed = true; }
        if (now - start >= 400) resolve(); else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    return { frames, firstCollapsed, lastCollapsed: sidebar.dataset.collapsed === 'true', focused: document.activeElement === toggle };
  }, reverse);
}

test('inset sidebar keeps its icon axis and continuously resizes the workspace, including reversal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await expect(shell).toBeVisible();
  await shell.scrollIntoViewIfNeeded();
  const input = shell.getByRole('textbox', { name: '工作区便签' });
  await input.fill('折叠后保留的草稿');
  const sidebar = shell.locator('[data-slot="workspace-sidebar"]');
  await expect(sidebar).toHaveCSS('transition-duration', '0.2s');
  await expect(sidebar.locator('[data-slot="workspace-label"]').first()).toHaveCSS('transition-duration', '0.12s');
  for (const reverse of [false, true, false]) {
    const result = await recordFold(shell, reverse);
    const first = result.frames[0];
    for (const frame of result.frames) {
      expect(Math.abs(frame.iconX - first.iconX)).toBeLessThanOrEqual(0.75);
      expect(Math.abs(frame.join)).toBeLessThanOrEqual(0.75);
      expect(Math.abs(frame.width + frame.bodyWidth - first.width - first.bodyWidth)).toBeLessThanOrEqual(0.75);
    }
    expect(result.frames.some((frame) => frame.width > 65 && frame.width < 223)).toBe(true);
    expect(result.lastCollapsed).toBe(reverse ? result.firstCollapsed : !result.firstCollapsed);
    expect(result.focused).toBe(true);
    expect(result.frames.at(-1)!.width).toBeCloseTo(result.lastCollapsed ? 64 : 224, 0);
  }
  await expect(input).toHaveValue('折叠后保留的草稿');
});

test('new tabs remain visible in their own horizontal strip and retain keyboard/close behavior', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  const bar = shell.locator('[data-slot="workspace-tab-bar"]');
  const add = shell.getByRole('button', { name: '新建标签' });
  await expect(add).toBeVisible();
  for (let index = 0; index < 8; index++) await add.click();
  const active = bar.locator('[data-slot="workspace-tab"][data-active="true"]');
  await expect(active.getByRole('tab')).toHaveText('临时任务 8');
  const viewport = (await bar.boundingBox())!;
  const selected = (await active.boundingBox())!;
  expect(selected.x).toBeGreaterThanOrEqual(viewport.x - 1);
  expect(selected.x + selected.width).toBeLessThanOrEqual(viewport.x + viewport.width + 1);
  expect(await bar.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  const windowY = await page.evaluate(() => window.scrollY);
  await active.getByRole('button', { name: '关闭 临时任务 8' }).click();
  await expect(bar.getByRole('tab', { name: '临时任务 7' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(bar.getByRole('tab', { name: '概览', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(shell.getByRole('tabpanel', { name: '概览' })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(windowY);
});

test('inset mobile navigation stays an opaque focus-managed drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  const opener = shell.getByRole('button', { name: '打开工作区导航' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'ToolPlane导航' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('border-right-width', '1px');
  await expect(dialog.locator('[data-slot="workspace-label"]').first()).toHaveCSS('opacity', '1');
  await dialog.getByRole('button', { name: 'Skills', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(shell.getByRole('tab', { name: 'Skills', exact: true })).toHaveAttribute('aria-selected', 'true');
  await opener.click(); await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden(); await expect(opener).toBeFocused();
});

test('no-tab shell supports child-owned scrolling and a fixed message composer', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator('.detail-preview [data-demo="workspace-shell-simple"]');
  await shell.scrollIntoViewIfNeeded();
  await expect(shell.locator('[data-slot="workspace-shell-tabs"]')).toHaveCount(0);
  const surface = shell.locator('[data-slot="workspace-surface"]');
  await expect(surface).toHaveCSS('margin-top', '8px');
  await expect(shell.locator('[data-slot="workspace-content"]')).toHaveCSS('overflow-y', 'hidden');
  const messages = shell.locator('[aria-label="演示消息记录"]');
  const footer = shell.locator('[data-slot="workspace-shell-footer"]');
  for (let index = 0; index < 9; index++) {
    await shell.getByRole('textbox', { name: '演示消息' }).fill(`第 ${index + 1} 条消息。标题和输入区固定，消息区独立滚动。`);
    await shell.getByRole('button', { name: '添加演示消息' }).click();
  }
  const before = await footer.boundingBox();
  await messages.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  expect(await messages.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await footer.boundingBox()).toEqual(before);
  await expect(shell.getByRole('textbox', { name: '演示消息' })).toHaveValue('');
});

test('shared surface tokens and custom sidebar widths work without global CSS', async ({ page }) => {
  await page.goto('components/workspace-shell/');
  const shell = page.locator(shellSelector);
  await expect(shell).toBeVisible();
  await shell.evaluate((node) => {
    node.style.setProperty('--workspace-shell-background', 'rgb(232, 232, 236)');
    node.style.setProperty('--workspace-surface', 'rgb(250, 250, 252)');
    node.style.setProperty('--workspace-gap', '12px');
    node.style.setProperty('--workspace-radius', '18px');
    node.style.setProperty('--workspace-sidebar-width', '288px');
    node.style.setProperty('--workspace-sidebar-collapsed-width', '80px');
  });
  const sidebar = shell.locator('[data-slot="workspace-sidebar"]');
  const surface = shell.locator('[data-slot="workspace-surface"]');
  await expect(sidebar).toHaveCSS('width', '288px');
  await expect(sidebar).toHaveCSS('background-color', 'rgb(232, 232, 236)');
  await expect(surface).toHaveCSS('margin-left', '12px');
  await expect(surface).toHaveCSS('border-top-left-radius', '18px');
  await expect(surface).toHaveCSS('background-color', 'rgb(250, 250, 252)');
  await expect(shell.locator('[data-slot="workspace-tab"][data-active="true"]')).toHaveCSS('background-color', 'rgb(250, 250, 252)');
  await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
  await expect(sidebar).toHaveCSS('width', '80px');
});

test('inset mode respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('components/workspace-shell/');
  const sidebar = page.locator(`${shellSelector} [data-slot="workspace-sidebar"]`);
  await expect(sidebar).toHaveCSS('transition-duration', '0s');
  await expect(sidebar.locator('[data-slot="workspace-label"]').first()).toHaveCSS('transition-duration', '0s');
  await sidebar.getByRole('button', { name: '折叠工作区侧栏' }).click();
  await expect(sidebar).toHaveCSS('width', '64px');
});
