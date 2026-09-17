import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

assert(process.env.UI_BROWSER_ROOT, 'Use the isolated Playwright installation.');
const { chromium } = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'))('playwright');
const directory = resolve('ui-browser-artifacts/review');
mkdirSync(directory, { recursive: true });
const captures = [];
let browser;
let server;
let failure;

// The docs use an inner scroller. Element screenshots taller than that viewport
// otherwise capture clipped panels or unrelated content below the panel. Keep
// width unchanged and temporarily extend viewport height for a full-panel image.
// Layout/interaction assertions run separately at the original 1000px height.
async function capturePanel(page, locator, name) {
  const viewport = page.viewportSize();
  const original = await locator.boundingBox();
  assert(original, `Missing panel ${name}`);
  try {
    await page.setViewportSize({ width: viewport.width, height: Math.max(viewport.height, Math.ceil(original.height) + 200) });
    await locator.evaluate((node) => node.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }));
    const geometry = await locator.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const clip = node.closest('.docs-main').getBoundingClientRect();
      return { width: innerWidth, height: innerHeight, top: bounds.top, bottom: bounds.bottom, clipTop: clip.top, clipBottom: clip.bottom };
    });
    assert(geometry.top >= geometry.clipTop - 1 && geometry.bottom <= geometry.clipBottom + 1, `Panel is clipped: ${name} ${JSON.stringify(geometry)}`);
    await locator.screenshot({ path: join(directory, `${name}.png`) });
    captures.push({ name, type: 'full-panel', ...geometry });
  } finally {
    await page.setViewportSize(viewport);
  }
}

try {
  server = await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0 } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch();
  for (const width of [375, 1440]) for (const [style, mode] of [['minimal', 'light'], ['tech', 'dark'], ['glass', 'dark']]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce' });
    await context.addInitScript(({ style, mode }) => {
      localStorage.setItem('asharca-ui-docs-style', style);
      localStorage.setItem('asharca-ui-docs-theme', mode);
      localStorage.setItem('asharca-ui-docs-density', 'comfortable');
    }, { style, mode });
    const page = await context.newPage();
    const prefix = `${width}-${mode}-${style}`;
    await page.goto(`${base}#/home`);
    await page.getByRole('link', { name: '开始构建', exact: true }).waitFor();
    await page.screenshot({ path: join(directory, `${prefix}-home.png`) });
    captures.push({ name: `${prefix}-home`, type: 'viewport', width, height: 1000 });
    await page.goto(`${base}#/themes`);
    await page.getByRole('textbox', { name: '助手名称', exact: true }).waitFor();
    await capturePanel(page, page.locator('.design-console'), `${prefix}-workspace`);
    const gallery = page.getByRole('region', { name: '设计细节画廊', exact: true });
    for (const [tab, suffix] of [['基础控件', 'controls'], ['AI 执行状态', 'tools'], ['表面与变量', 'surfaces']]) {
      await gallery.getByRole('tab', { name: tab, exact: true }).click();
      const numbers = await gallery.locator('.design-specimen-heading > span:visible').evaluateAll((nodes) => nodes.map((node) => {
        const style = getComputedStyle(node);
        return { height: node.getBoundingClientRect().height, lineHeight: parseFloat(style.lineHeight), padding: parseFloat(style.paddingTop), nowrap: style.whiteSpace === 'nowrap' };
      }));
      assert(numbers.length >= 2);
      assert(numbers.every((item) => item.nowrap && item.height <= item.lineHeight + item.padding + 1), 'Specimen numbering wraps to multiple lines');
      await capturePanel(page, gallery, `${prefix}-${suffix}`);
    }
    await context.close();
  }
  console.log(`PASS ${captures.length} review captures: original-width home viewports and unclipped full panels; phone/desktop numbering does not wrap.`);
} catch (error) {
  failure = String(error.stack ?? error);
  console.error(error);
  process.exitCode = 1;
} finally {
  writeFileSync(join(directory, 'captures.json'), JSON.stringify({ captures, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
