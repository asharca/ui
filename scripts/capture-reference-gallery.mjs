import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

assert(process.env.UI_BROWSER_ROOT, 'Set UI_BROWSER_ROOT to isolated Playwright tooling.');
const { chromium } = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'))('playwright');
const output = resolve('ui-browser-artifacts/reference-gallery');
mkdirSync(output, { recursive: true });
const results = { local: [], references: [] };
let browser, server;
try {
  server = await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0, open: false } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch();
  for (const width of [375, 1440]) for (const mode of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce' });
    await context.addInitScript(({ mode }) => {
      localStorage.setItem('asharca-ui-docs-theme', mode);
      localStorage.setItem('asharca-ui-docs-style', 'minimal');
    }, { mode });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base);
    await page.getByRole('button', { name: '试试这个按钮', exact: true }).click();
    assert(await page.locator('[data-component="material-button"]').getByRole('button', { name: '已保存', exact: true }).isVisible());
    await page.getByRole('button', { name: '查看 Metallic Button 源码' }).click();
    const code = page.getByRole('region', { name: 'Metallic Button 用法 TSX' });
    await code.waitFor();
    assert((await code.innerText()).includes('ui-material-button'));
    await page.getByRole('button', { name: '预览 Metallic Button' }).click();
    assert(await page.locator('[data-component="material-button"]').getByRole('button', { name: '已保存', exact: true }).isVisible());
    await page.getByRole('button', { name: '重置 Metallic Button 预览' }).click();
    // The collection is deliberately lazy: scroll the stage, then interact with
    // its real component. Cover mouse, keyboard, portal focus and local state.
    const saveTile = page.locator('[data-component="button"]');
    await saveTile.scrollIntoViewIfNeeded();
    await saveTile.getByRole('button', { name: '保存更改', exact: true }).click();
    await saveTile.getByRole('button', { name: '已保存', exact: true }).waitFor();
    const switches = page.locator('[data-component="switch"]');
    await switches.scrollIntoViewIfNeeded();
    const autoSave = switches.getByRole('switch', { name: '自动保存', exact: true });
    await autoSave.click();
    assert.equal(await autoSave.getAttribute('aria-checked'), 'false');
    await switches.getByRole('button', { name: '查看 Switch 源码', exact: true }).click();
    await switches.getByRole('region', { name: 'Switch 用法 TSX', exact: true }).waitFor();
    await switches.getByRole('button', { name: '预览 Switch', exact: true }).click();
    assert.equal(await autoSave.getAttribute('aria-checked'), 'false');
    const avatars = page.locator('[data-component="avatar"]');
    await avatars.scrollIntoViewIfNeeded();
    const sam = avatars.getByRole('button', { name: 'Sam', exact: true });
    await sam.focus(); await page.keyboard.press('Space');
    assert.equal(await sam.getAttribute('aria-pressed'), 'true');
    assert.equal(await sam.evaluate((node) => getComputedStyle(node).translate), 'none', 'Reduced motion must suppress avatar travel');
    const accordion = page.locator('[data-component="accordion"]');
    await accordion.scrollIntoViewIfNeeded();
    await accordion.getByRole('button', { name: '通知', exact: true }).click();
    const notify = accordion.getByRole('switch', { name: '桌面通知', exact: true });
    await notify.click();
    assert.equal(await notify.getAttribute('aria-checked'), 'false');
    const dropdown = page.locator('[data-component="dropdown-menu"]');
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.getByRole('button', { name: '项目操作', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('menuitem', { name: '创建副本', exact: true }).click();
    const action = dropdown.getByRole('button', { name: '已创建副本', exact: true });
    await action.waitFor();
    await page.waitForFunction(() => document.activeElement?.textContent === '已创建副本');
    const categories = page.getByRole('group', { name: '展厅分类' });
    await categories.getByRole('button', { name: 'AI 交互', exact: true }).click();
    assert.equal(await page.locator('.ref-showroom .ref-tile').count(), 2);
    await categories.getByRole('button', { name: '全部', exact: true }).click();
    assert.equal(await page.locator('.ref-showroom .ref-tile').count(), 12);
    const sizes = await page.evaluate(() => {
      const main = document.querySelector('.docs-main');
      return { body: document.documentElement.scrollWidth, main: main.scrollWidth - main.clientWidth };
    });
    assert(sizes.body <= width + 1 && sizes.main <= 1, `Homepage overflow: ${JSON.stringify(sizes)}`);
    await page.locator('.docs-main').evaluate((node) => node.scrollTo(0, 0));
    await page.screenshot({ path: join(output, `${width}-${mode}-home.png`) });
    await page.goto(`${base}#/components`);
    const search = page.getByRole('searchbox', { name: '筛选组件总览' });
    await search.fill('Input');
    const tile = page.locator('[data-component="input"]');
    await tile.scrollIntoViewIfNeeded();
    await tile.getByRole('textbox', { name: '项目名称', exact: true }).fill('Preserve edit');
    await tile.getByRole('button', { name: '查看 Input 源码', exact: true }).click();
    await tile.getByRole('region', { name: 'Input 用法 TSX', exact: true }).waitFor();
    await tile.getByRole('button', { name: '预览 Input', exact: true }).click();
    assert.equal(await tile.getByRole('textbox', { name: '项目名称', exact: true }).inputValue(), 'Preserve edit');
    await search.clear();
    await page.locator('.docs-main').evaluate((node) => node.scrollTo(0, 0));
    await page.locator('[data-component="button"]').getByRole('button', { name: '保存更改', exact: true }).waitFor();
    await page.screenshot({ path: join(output, `${width}-${mode}-gallery.png`) });
    assert.equal(errors.length, 0, errors.join('\n'));
    results.local.push({ width, mode, passed: true, previewStatePreserved: true, nativeAndKeyboardInteractions: true, sizes });
    await context.close();
  }
  // Reference screenshots are advisory, never a dependency of functional checks.
  // Fresh unauthenticated contexts visit only the five public sites requested.
  for (const [name, url] of [
    ['beautifului', 'https://www.beautifului.dev/'], ['beui', 'https://beui.dev/'],
    ['transitions', 'https://transitions.dev/'], ['rareui', 'https://www.rareui.com/'],
    ['shadcn', 'https://ui.shadcn.com/'],
  ]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: join(output, `reference-${name}.png`), timeout: 10000 });
      results.references.push({ name, url, captured: true });
    } catch (error) { results.references.push({ name, url, captured: false, error: String(error) }); }
    await context.close();
  }
} catch (error) { results.failure = String(error.stack ?? error); process.exitCode = 1; }
finally {
  writeFileSync(join(output, 'results.json'), JSON.stringify(results, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
