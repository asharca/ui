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
    return { document: document.documentElement.scrollWidth, main: main.scrollWidth - main.clientWidth, header: top.scrollWidth - top.clientWidth };
  });
  assert(value.document <= width + 1 && value.main <= 1 && value.header <= 1, `${label}: overflow ${JSON.stringify(value)}`);
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
    await page.getByRole('heading', { level: 1, name: /更少的复杂/ }).waitFor();
    await page.getByRole('textbox', { name: '项目名称', exact: true }).fill('My product');
    await page.getByRole('radio', { name: '应用界面', exact: true }).check();
    await page.getByRole('button', { name: '保存配置', exact: true }).click();
    assert(await page.getByText('配置已保存 · 仅本地演示', { exact: true }).isVisible());
    await page.getByRole('switch', { name: '流式响应' }).click();
    assert(await page.getByRole('button', { name: '保存配置', exact: true }).isVisible());
    await fits(page, width, 'home');
    await page.locator('.docs-main').evaluate((node) => node.scrollTo(0, 0));
    await page.screenshot({ path: join(output, `${width}-${mode}-home.png`) });
    const trigger = page.getByRole('button', { name: '搜索文档', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: '搜索文档', exact: true });
    await dialog.waitFor();
    const search = dialog.getByRole('searchbox', { name: '搜索文档和组件', exact: true });
    assert(await search.evaluate((node) => document.activeElement === node));
    await search.fill('ChoiceField');
    await page.keyboard.press('ArrowDown');
    assert(await dialog.getByRole('link', { name: /ChoiceField/ }).evaluate((node) => document.activeElement === node));
    await page.screenshot({ path: join(output, `${width}-${mode}-search.png`) });
    await page.keyboard.press('Escape');
    assert(await trigger.evaluate((node) => document.activeElement === node), 'Search must restore trigger focus');
    await page.keyboard.press('Control+k');
    await dialog.waitFor();
    await search.fill('Button'); await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Button', exact: true, level: 1 }).waitFor();
    await page.getByRole('button', { name: '保存更改', exact: true }).waitFor();
    assert(await page.getByRole('heading', { name: '使用约定', exact: true }).count());
    await fits(page, width, 'button docs');
    await page.screenshot({ path: join(output, `${width}-${mode}-button.png`) });
    if (width > 850) {
      const side = page.getByRole('complementary', { name: '文档导航', exact: true });
      const group = side.locator('.docs-nav-group').filter({ has: page.locator('a[href="#/components/button"]') });
      const toggle = group.getByRole('button');
      await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      const filter = side.getByRole('searchbox'); await filter.fill('Button');
      assert(await side.getByRole('link', { name: 'Button', exact: true }).isVisible());
      await filter.clear(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await page.getByRole('button', { name: 'API 与接入边界', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.docs-toc button[aria-current="location"]')?.textContent === 'API 与接入边界');
    }
    await page.goto(`${base}#/installation`);
    await page.getByRole('heading', { name: '安装', exact: true, level: 1 }).waitFor();
    await fits(page, width, 'installation');
    await page.screenshot({ path: join(output, `${width}-${mode}-installation.png`) });
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ width, mode, status: 'passed' });
    console.log(`PASS redesign ${width}px ${mode}: root homepage, native form, search keyboard/focus, docs, navigation and layout`);
    await context.close();
  }
} catch (error) { failure = String(error.stack ?? error); console.error(error); process.exitCode = 1; }
finally {
  writeFileSync(join(output, 'results.json'), JSON.stringify({ results, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
