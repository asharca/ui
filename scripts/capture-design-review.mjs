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

// Keep the real 1000px viewport and component CSS unchanged. A long element
// inside .docs-main is clipped by that scroller, even in a full-page screenshot.
// Capture its visible sections while scrolling, then join the genuine pixels.
async function capturePanel(page, locator, name) {
  const viewport = page.viewportSize();
  const originalScroll = await locator.evaluate((node) => node.closest('.docs-main').scrollTop);
  const tiles = [];
  let dimensions;
  try {
    let offset = 0;
    for (let attempt = 0; attempt < 30; attempt++) {
      await locator.evaluate((node, offset) => {
        const main = node.closest('.docs-main');
        const position = node.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
        main.scrollTop = position + offset;
      }, offset);
      await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
      const geometry = await locator.evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        const clip = node.closest('.docs-main').getBoundingClientRect();
        const x = Math.max(0, bounds.left, clip.left);
        const y = Math.max(0, bounds.top, clip.top);
        return {
          x, y, width: Math.min(innerWidth, bounds.right, clip.right) - x,
          height: Math.min(innerHeight, bounds.bottom, clip.bottom) - y,
          outputY: y - bounds.top, panelWidth: bounds.width, panelHeight: bounds.height,
        };
      });
      assert(geometry.height > 0 && geometry.width > 0, `No visible panel pixels: ${name}`);
      assert(geometry.width >= geometry.panelWidth - 1, `Panel is horizontally clipped: ${name}`);
      dimensions = { width: Math.ceil(geometry.panelWidth), height: Math.ceil(geometry.panelHeight) };
      const png = await page.screenshot({ clip: { x: geometry.x, y: geometry.y, width: geometry.width, height: geometry.height }, animations: 'disabled' });
      const y = Math.round(geometry.outputY);
      tiles.push({ y, height: Math.ceil(geometry.height), image: png.toString('base64') });
      if (y + geometry.height >= geometry.panelHeight - 1) break;
      const next = Math.floor(geometry.outputY + geometry.height) - 24;
      assert(next > offset, `Scrolling did not advance: ${name}`);
      offset = next;
    }
    let covered = 0;
    for (const tile of tiles) {
      assert(tile.y <= covered + 1, `A screenshot section is missing: ${name}`);
      covered = Math.max(covered, tile.y + tile.height);
    }
    assert(covered >= dimensions.height - 1, `The panel bottom was not captured: ${name}`);
    const image = await page.evaluate(async ({ dimensions, tiles }) => {
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext('2d');
      for (const tile of tiles) {
        const image = new Image();
        image.src = `data:image/png;base64,${tile.image}`;
        await image.decode();
        context.drawImage(image, 0, tile.y);
      }
      return canvas.toDataURL('image/png').split(',')[1];
    }, { dimensions, tiles });
    writeFileSync(join(directory, `${name}.png`), Buffer.from(image, 'base64'));
    captures.push({ name, type: 'stitched-original-viewport', viewport, ...dimensions, segments: tiles.map(({ y, height }) => ({ y, height })) });
  } finally {
    await locator.evaluate((node, value) => { node.closest('.docs-main').scrollTop = value; }, originalScroll);
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
    await page.getByRole('heading', { level: 1, name: '组件与交互', exact: true }).waitFor();
    await page.getByRole('button', { name: '试试这个按钮', exact: true }).waitFor();
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
  console.log(`PASS ${captures.length} review captures: original home viewports and complete stitched scroll panels; phone/desktop numbering does not wrap.`);
} catch (error) {
  failure = String(error.stack ?? error);
  console.error(error);
  process.exitCode = 1;
} finally {
  writeFileSync(join(directory, 'captures.json'), JSON.stringify({ captures, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
