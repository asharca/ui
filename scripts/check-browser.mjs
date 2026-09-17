import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, join, extname, sep } from 'node:path';

assert(process.env.UI_BROWSER_ROOT, 'Set UI_BROWSER_ROOT to the isolated Playwright installation.');
const require = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'));
const { chromium } = require('playwright');
const root = resolve('showcase-dist');
const directory = resolve('ui-browser-artifacts');
mkdirSync(directory, { recursive: true });
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith('/ui/')) throw new Error('Unknown mount');
    const path = resolve(root, pathname.slice(4) || 'index.html');
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Outside static root');
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' });
    response.end(content);
  } catch { response.writeHead(404); response.end('Not found'); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}/ui/`;
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [375, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
      await context.addInitScript((value) => localStorage.setItem('asharca-ui-docs-theme', value), theme);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const id of ['checkbox', 'radio', 'choice-field', 'button', 'switch', 'chat-composer-toolbar', 'chat-thread']) {
        await page.goto(`${base}#/components/${id}`);
        await page.locator('.docs-demo-canvas').waitFor();
        await page.waitForFunction(() => !document.querySelector('.docs-demo-canvas')?.textContent?.includes('加载组件示例'));
        if (['checkbox', 'radio', 'choice-field'].includes(id)) await page.locator('.ui-choice input').first().waitFor();
        if (id === 'chat-thread') await page.locator('[data-ui="chat.composer"] textarea').waitFor();
        const measurement = await page.evaluate(() => {
          const main = document.querySelector('.docs-main');
          return {
            viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
            mainWidth: main.clientWidth, mainScroll: main.scrollWidth,
            background: getComputedStyle(document.querySelector('.docs-site')).backgroundColor,
            choices: [...document.querySelectorAll('.ui-choice')].map((row) => {
              const input = row.querySelector('input').getBoundingClientRect();
              const label = row.querySelector('.ui-choice__label');
              const title = label.getBoundingClientRect();
              const description = row.querySelector('.ui-choice__description')?.getBoundingClientRect();
              const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
              return { width: input.width, centerDifference: Math.abs(input.top + input.height / 2 - title.top - lineHeight / 2), gap: title.left - input.right, descriptionAligned: !description || Math.abs(description.left - title.left) < 1, rowWidth: row.getBoundingClientRect().width };
            }),
          };
        });
        assert(measurement.documentWidth <= width + 1, `${id}: document overflows at ${width}`);
        assert(measurement.mainScroll <= measurement.mainWidth + 1, `${id}: main overflows at ${width}`);
        assert.notEqual(measurement.background, 'rgba(0, 0, 0, 0)', 'Documentation background must have actual theme tokens');
        for (const choice of measurement.choices) {
          assert(choice.width >= 15 && choice.width <= 17, 'Choice input was stretched');
          assert(choice.centerDifference <= 2, `${id}: choice is not aligned to the first text line`);
          assert(choice.gap >= 8 && choice.gap <= 16, `${id}: inconsistent input-to-label spacing`);
          assert(choice.descriptionAligned, `${id}: description does not align with the title`);
        }
        await page.screenshot({ path: join(directory, `${width}-${theme}-${id}.png`), fullPage: true });
        results.push({ width, theme, id, ...measurement });
      }
      await page.goto(`${base}#/components/checkbox`);
      const checkbox = page.getByRole('checkbox', { name: '接收发布通知', exact: true });
      await checkbox.waitFor();
      assert(await checkbox.isChecked());
      await page.getByText('接收发布通知', { exact: true }).click();
      assert(!(await checkbox.isChecked()), 'Clicking the label must toggle exactly once');
      assert(await page.getByRole('checkbox', { name: '管理员通知', exact: true }).isDisabled());
      await page.goto(`${base}#/components/radio`);
      const yearly = page.getByRole('radio', { name: '按年订阅', exact: true });
      await yearly.waitFor();
      await page.getByText('按年订阅', { exact: true }).click();
      assert(await yearly.isChecked());
      assert(!(await page.getByRole('radio', { name: '按月订阅', exact: true }).isChecked()));
      await yearly.focus();
      await page.keyboard.press('ArrowLeft');
      assert(await page.getByRole('radio', { name: '按月订阅', exact: true }).isChecked(), 'Native radio keyboard navigation failed');
      if (width <= 850) {
        const trigger = page.getByRole('button', { name: '打开文档导航', exact: true });
        await trigger.click();
        await page.getByRole('dialog', { name: '文档导航', exact: true }).waitFor();
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('Shift+Tab');
          assert(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')), 'Focus escaped mobile navigation');
        }
        await page.keyboard.press('Escape');
        assert(await trigger.evaluate((node) => node === document.activeElement), 'Mobile trigger focus was not restored');
      }
      await page.goto(`${base}#/examples/settings`);
      await page.getByRole('heading', { name: '工作区偏好' }).waitFor();
      await page.getByRole('button', { name: '保存偏好' }).click();
      await page.getByText('演示设置已保存。').waitFor();
      await page.screenshot({ path: join(directory, `${width}-${theme}-settings.png`), fullPage: true });
      assert.equal(errors.length, 0, errors.join('\n'));
      await context.close();
    }
  }
  const request = await browser.newContext();
  const index = await request.request.get(`${base}llms.txt`);
  assert.equal(index.status(), 200);
  const text = await index.text();
  const links = [...text.matchAll(/\]\((\.\/[^)]+)\)/g)].map((match) => match[1]);
  assert(links.length >= 56, 'AI index must include all components and both guides');
  for (const link of links) {
    const response = await request.request.get(new URL(link, base).href);
    assert.equal(response.status(), 200, `Broken AI documentation link: ${link}`);
    assert((await response.text()).startsWith('#'), `Not Markdown: ${link}`);
  }
  const full = await request.request.get(`${base}llms-full.txt`);
  assert.equal(full.status(), 200);
  assert((await full.text()).includes('ChoiceFieldDemo'));
  await request.close();
  console.log(`PASS: ${results.length} component/viewport/theme layouts, native label/radio interactions, mobile focus, settings forms and ${links.length} static AI links at a /ui/ subpath.`);
} finally {
  writeFileSync(join(directory, 'measurements.json'), JSON.stringify(results, null, 2));
  await browser.close();
  await new Promise((done) => server.close(done));
}
