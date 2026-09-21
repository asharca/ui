import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

if (!process.env.UI_BROWSER_ROOT) throw new Error('UI_BROWSER_ROOT must point to isolated Playwright tooling.');
const { chromium } = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'))('playwright');
const output = resolve('ui-browser-artifacts/site-redesign');
mkdirSync(output, { recursive: true });
let browser, server;
const results = [];
let failure = null;
async function fits(page, width, label) {
  const value = await page.evaluate(() => {
    const main = document.querySelector('.docs-main');
    const top = document.querySelector('.docs-top');
    return { document: document.documentElement.scrollWidth, main: main.scrollWidth - main.clientWidth, scrollbar: getComputedStyle(main).scrollbarWidth, header: top.scrollWidth - top.clientWidth, headerTop: top.getBoundingClientRect().top };
  });
  assert(value.document <= width + 1 && value.main <= 1 && value.header <= 1, `${label}: overflow ${JSON.stringify(value)}`);
  assert.equal(value.scrollbar, 'none', `${label}: main content must not show a competing scrollbar`);
  assert(Math.abs(value.headerTop) <= 1, `${label}: ancestor scrolling moved the site header (${value.headerTop}px)`);
}
async function searchFits(dialog, width, label) {
  const box = await dialog.boundingBox();
  assert(box && box.x >= -1 && box.y >= -1, `${label}: search is clipped outside the viewport`);
  assert(box.x + box.width <= width + 1 && box.y + box.height <= 1001, `${label}: search exceeds viewport bounds`);
  assert(Math.abs(box.x + box.width / 2 - width / 2) <= 1, `${label}: search must be horizontally centered`);
}
try {
  server = await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0, open: false } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch();
  for (const width of [375, 768, 1440]) for (const mode of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce' });
    await context.addInitScript(({ mode }) => {
      localStorage.setItem('asharca-ui-docs-theme', mode);
      localStorage.setItem('asharca-ui-docs-style', mode === 'dark' ? 'tech' : 'minimal');
    }, { mode });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base);
    await page.getByRole('heading', { level: 1, name: /每个细节/ }).waitFor();
    await page.getByRole('textbox', { name: '项目名称', exact: true }).fill('My product');
    await page.getByRole('radio', { name: '应用界面', exact: true }).check();
    await page.getByRole('button', { name: '保存配置', exact: true }).click();
    assert(await page.getByText('配置已保存 · 仅本地演示', { exact: true }).isVisible());
    await page.getByRole('switch', { name: '流式响应' }).click();
    assert(await page.getByRole('button', { name: '保存配置', exact: true }).isVisible());
    await fits(page, width, 'home');
    await page.locator('.docs-main').evaluate((node) => node.scrollTo(0, 0));
    await page.screenshot({ path: join(output, `${width}-${mode}-home.png`) });
    // Capture complete real specimens as well as the normal first viewport.
    const full = await page.addStyleTag({ content: '.docs-site.is-home { height: auto; } .is-home .docs-main { overflow: visible !important; } .is-home .docs-body { min-height: auto; }' });
    await page.screenshot({ path: join(output, `${width}-${mode}-home-full.png`), fullPage: true });
    await full.evaluate((node) => node.remove());
    await page.locator('.docs-main').evaluate((node) => node.scrollTo(0, 0));
    const trigger = page.getByRole('button', { name: '搜索文档', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: '搜索文档', exact: true });
    await dialog.waitFor();
    await searchFits(dialog, width, 'initial results');
    const search = dialog.getByRole('searchbox', { name: '搜索文档和组件', exact: true });
    assert(await search.evaluate((node) => document.activeElement === node));
    await search.fill('ChoiceField');
    await searchFits(dialog, width, 'filtered results');
    await page.keyboard.press('ArrowDown');
    assert(await dialog.getByRole('link', { name: /ChoiceField/ }).evaluate((node) => document.activeElement === node));
    await page.screenshot({ path: join(output, `${width}-${mode}-search.png`) });
    await page.keyboard.press('Escape');
    // Radix restores focus after its unmount cleanup. Wait for that lifecycle
    // instead of racing an immediate evaluate against the Escape key event.
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => document.activeElement?.matches('button.docs-search-trigger'), undefined, { timeout: 5000 });
    assert(await trigger.evaluate((node) => document.activeElement === node), 'Search must restore trigger focus');
    await page.keyboard.press('Control+k');
    await dialog.waitFor();
    await search.fill('Button'); await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Button', exact: true, level: 1 }).waitFor();
    await page.getByRole('button', { name: '保存更改', exact: true }).waitFor();
    assert(await page.getByRole('heading', { name: '使用约定', exact: true }).count());
    await fits(page, width, 'button docs');
    await page.screenshot({ path: join(output, `${width}-${mode}-button.png`) });
    const main = page.locator('.docs-main');
    const sidebarTop = await page.locator('.docs-sidebar').evaluate((node) => node.scrollTop);
    await main.hover({ position: { x: 12, y: 80 } });
    await page.mouse.wheel(0, 400);
    await page.waitForFunction(() => document.querySelector('.docs-main').scrollTop > 0);
    const wheelTop = await main.evaluate((node) => node.scrollTop);
    await main.focus(); await page.keyboard.press('PageDown');
    await page.waitForFunction((previous) => document.querySelector('.docs-main').scrollTop > previous, wheelTop);
    assert.equal(await page.locator('.docs-sidebar').evaluate((node) => node.scrollTop), sidebarTop, 'Content scrolling must not scroll the directory');
    assert.notEqual(await page.locator('.docs-sidebar').evaluate((node) => getComputedStyle(node).scrollbarWidth), 'none', 'Keep the directory scrollbar');
    await main.evaluate((node) => node.scrollTo(0, 0));
    if (width > 850) {
      const side = page.getByRole('complementary', { name: '文档导航', exact: true });
      const group = side.locator('.docs-nav-group').filter({ has: page.locator('a[href="#/components/button"]') });
      const toggle = group.getByRole('button');
      await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      const filter = side.getByRole('searchbox'); await filter.fill('Button');
      assert(await side.getByRole('link', { name: 'Button', exact: true }).isVisible());
      await filter.clear(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await page.getByRole('button', { name: 'API 参考', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.docs-toc button[aria-current="location"]')?.textContent === 'API 参考');
      await fits(page, width, 'after table of contents navigation');
    }
    await page.goto(`${base}#/components/input`);
    const input = page.getByRole('textbox', { name: '项目名称', exact: true });
    await input.fill('Release notes');
    await page.getByRole('group', { name: '预览背景' }).getByRole('button', { name: '网格', exact: true }).click();
    assert.equal(await input.inputValue(), 'Release notes', 'Background changes must preserve edits');
    assert.equal(await page.locator('.docs-preview-catalog').getAttribute('data-canvas'), 'grid');
    await page.getByRole('tab', { name: '用法代码', exact: true }).click();
    await page.getByRole('region', { name: '用法 TSX', exact: true }).waitFor();
    assert(!(await input.isVisible()), 'Inactive preview must not be visible or keyboard-accessible');
    assert(!(await page.getByRole('combobox', { name: '预览视口' }).count()), 'Hide preview tools while reading code');
    await fits(page, width, 'code view');
    await page.getByRole('tab', { name: '预览', exact: true }).click();
    assert.equal(await input.inputValue(), 'Release notes', 'Reading code must preserve preview edits');
    await page.getByRole('button', { name: '重置组件预览' }).click();
    assert.equal(await input.inputValue(), '', 'Explicit reset must clear the demo');
    await page.goto(`${base}#/components`);
    await page.getByRole('heading', { name: '组件', exact: true, level: 1 }).waitFor();
    await fits(page, width, 'grouped catalog');
    await page.screenshot({ path: join(output, `${width}-${mode}-catalog.png`) });
    await page.getByRole('combobox', { name: '组件分类' }).selectOption('AI 聊天');
    await page.getByRole('searchbox', { name: '筛选组件总览' }).fill('ChatThread');
    assert.equal(await page.locator('.studio-tile-link').count(), 1, 'Combine category and text filters');
    await page.getByRole('button', { name: '列表展示', exact: true }).click();
    assert.equal(await page.locator('.studio-tile-preview').count(), 0);
    assert.equal(await page.getByRole('searchbox', { name: '筛选组件总览' }).inputValue(), 'ChatThread');
    await page.getByRole('button', { name: '网格展示', exact: true }).click();
    assert.equal(await page.locator('.studio-tile-preview').count(), 1);
    await page.locator('.studio-tile-link').click();
    await page.getByRole('heading', { name: 'ChatThread', exact: true, level: 1 }).waitFor();
    await fits(page, width, 'catalog navigation');
    if (width <= 850) {
      await page.getByRole('button', { name: '打开文档导航' }).click();
      const navigation = page.getByRole('dialog', { name: '文档导航' });
      assert.equal(await navigation.getByRole('button', { name: /AI 聊天/ }).getAttribute('aria-expanded'), 'true');
      await navigation.getByRole('link', { name: '示例', exact: true }).click();
      await navigation.waitFor({ state: 'hidden' });
      await page.getByRole('heading', { name: '示例', exact: true, level: 1 }).waitFor();
    }
    await page.goto(`${base}#/installation`);
    await page.getByRole('heading', { name: '安装', exact: true, level: 1 }).waitFor();
    await fits(page, width, 'installation');
    await page.screenshot({ path: join(output, `${width}-${mode}-installation.png`) });
    await page.goto(`${base}#/components`);
    await page.getByRole('heading', { name: '组件', exact: true, level: 1 }).waitFor();
    await page.goto(`${base}#/guide?from=bookmark`);
    await page.waitForURL(`${base}#/installation?from=bookmark`);
    await page.getByRole('heading', { name: '安装', exact: true, level: 1 }).waitFor();
    assert.equal(await page.locator('a[href="#/guide"]').count(), 0, 'Only canonical documentation links should remain');
    assert.equal(await page.getByRole('navigation', { name: '手册目录' }).count(), 0, 'Do not nest another manual navigation');
    await fits(page, width, 'legacy documentation redirect');
    await page.goBack();
    await page.getByRole('heading', { name: '组件', exact: true, level: 1 }).waitFor();
    assert(new URL(page.url()).hash === '#/components', 'Redirect must not insert an extra history entry');
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ width, mode, status: 'passed' });
    console.log(`PASS redesign ${width}px ${mode}: root homepage, native form, search keyboard/focus, docs, navigation and layout`);
    await context.close();
  }
  const motion = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
  const page = await motion.newPage();
  await page.goto(base);
  const tabs = page.getByRole('tablist', { name: '动效体验' });
  await tabs.waitFor(); await tabs.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[aria-label="动效体验"]')?.getAttribute('data-indicator') === 'ready');
  const position = () => tabs.evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node, '::before').transform).m41);
  const start = await position();
  await tabs.getByRole('tab', { name: '设置', exact: true }).click();
  const samples = await tabs.evaluate((node) => new Promise((done) => {
    const values = []; let frame = 0;
    const sample = () => { values.push(new DOMMatrixReadOnly(getComputedStyle(node, '::before').transform).m41); if (++frame < 24) requestAnimationFrame(sample); else done(values); };
    requestAnimationFrame(sample);
  }));
  const end = samples.at(-1);
  assert(Math.abs(end - start) > 30, 'Selected marker must move between tabs');
  assert(samples.some((value) => value > Math.min(start, end) + 2 && value < Math.max(start, end) - 2), 'Marker must interpolate, not jump');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await tabs.evaluate((node) => getComputedStyle(node, '::before').transitionDuration), '0s', 'Reduced motion must disable marker travel');
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  await page.waitForFunction(() => {
    const list = document.querySelector('[aria-label="动效体验"]');
    const selected = list.querySelector('[data-state="active"]');
    const x = new DOMMatrixReadOnly(getComputedStyle(list, '::before').transform).m41;
    return Math.abs(x - (selected.getBoundingClientRect().left - list.getBoundingClientRect().left - list.clientLeft)) < 1;
  });
  await tabs.getByRole('tab', { name: '概览', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  assert(await tabs.getByRole('tab', { name: '活动', exact: true }).evaluate((node) => document.activeElement === node), 'Radix must retain RTL keyboard navigation');
  results.push({ type: 'shared-tab-motion', status: 'passed', samples });
  await motion.close();
} catch (error) { failure = String(error.stack ?? error); console.error(error); process.exitCode = 1; }
finally {
  writeFileSync(join(output, 'results.json'), JSON.stringify({ results, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
