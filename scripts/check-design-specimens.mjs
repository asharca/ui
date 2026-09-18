import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

assert(process.env.UI_BROWSER_ROOT, 'Set UI_BROWSER_ROOT to the isolated Playwright installation.');
const { chromium } = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'))('playwright');
const directory = resolve('ui-browser-artifacts/specimens');
mkdirSync(directory, { recursive: true });
const results = [];
let browser;
let server;
let failure;
function rgb(value) {
  const channels = value.match(/[\d.]+/g)?.map(Number);
  assert(channels && channels.length >= 3, `Not an RGB color: ${value}`);
  return channels;
}
function blend(color, background) { const alpha = color[3] ?? 1; return color.slice(0, 3).map((value, i) => value * alpha + background[i] * (1 - alpha)); }
function luminance(color) {
  const channels = color.slice(0, 3).map((value) => { const n = value / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
  return channels.reduce((total, value, i) => total + value * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) { const x = luminance(a); const y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
async function fits(page, label) {
  const sizes = await page.evaluate(() => {
    const main = document.querySelector('.docs-main');
    const panel = document.querySelector('.design-specimens > [data-toolplane-ui="tabs"] > [role="tabpanel"]:not([hidden])');
    return { width: innerWidth, document: document.documentElement.scrollWidth, main: main.clientWidth, scroll: main.scrollWidth, panel: panel?.clientWidth, panelScroll: panel?.scrollWidth };
  });
  assert(sizes.document <= sizes.width + 1 && sizes.scroll <= sizes.main + 1, `${label}: page overflow ${JSON.stringify(sizes)}`);
  if (sizes.panel) assert(sizes.panelScroll <= sizes.panel + 1, `${label}: specimen panel overflow`);
  return sizes;
}
async function primaryContrast(button) {
  // Convert color-mix and gradient stops via the browser, not a duplicate palette.
  const sample = await button.evaluate((node) => {
    const css = getComputedStyle(node);
    const probe = document.createElement('span');
    node.append(probe);
    const normalize = (color) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
    };
    const result = { text: normalize(css.color), background: normalize(css.backgroundColor), highlights: (css.backgroundImage.match(/(?:rgba?|hsla?)\([^)]*\)/g) ?? []).map(normalize) };
    probe.remove();
    return result;
  });
  const text = rgb(sample.text);
  const background = rgb(sample.background);
  assert.equal(background[3], 1, 'Primary backgrounds must remain opaque, including on hover');
  const ratios = [contrast(text, background), ...sample.highlights.map((color) => contrast(text, blend(rgb(color), background)))];
  assert(Math.min(...ratios) >= 4.5, `Primary/gradient text contrast is below 4.5:1: ${JSON.stringify({ sample, ratios })}`);
  return { sample, minimumRatio: Math.min(...ratios) };
}
try {
  server = await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0 } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch();
  for (const width of [375, 768, 1440]) for (const mode of ['light', 'dark']) for (const style of ['minimal', 'tech', 'glass']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce' });
    await context.addInitScript(({ style, mode }) => {
      localStorage.setItem('asharca-ui-docs-style', style);
      localStorage.setItem('asharca-ui-docs-theme', mode);
      localStorage.setItem('asharca-ui-docs-density', 'comfortable');
    }, { style, mode });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}#/themes`);
    const gallery = page.getByRole('region', { name: '设计细节画廊' });
    await gallery.waitFor();
    await page.waitForFunction((expected) => document.documentElement.dataset.uiStyle === expected, style);
    const draft = gallery.getByRole('textbox', { name: '示例名称', exact: true });
    await draft.fill('切换风格后保留这个草稿');
    await gallery.getByRole('radio', { name: '包含完整上下文的研究记录', exact: true }).check();
    const action = gallery.getByRole('button', { name: '保存样本', exact: true });
    await action.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const normal = await primaryContrast(action);
    await action.hover();
    const hovered = await primaryContrast(action);
    await action.click();
    assert(await gallery.getByText('样本已保存，切换风格不会清空这个状态。', { exact: true }).isVisible());
    assert(await gallery.getByRole('button', { name: '不可操作', exact: true }).isDisabled());
    assert(await gallery.getByRole('checkbox', { name: '由管理员统一管理', exact: true }).isDisabled());
    const controlsSize = await fits(page, 'controls');
    await gallery.screenshot({ path: join(directory, `${width}-${mode}-${style}-controls.png`) });
    await page.getByRole('combobox', { name: '视觉风格', exact: true }).selectOption(style === 'glass' ? 'tech' : 'glass');
    assert.equal(await draft.inputValue(), '切换风格后保留这个草稿');
    await page.getByRole('combobox', { name: '视觉风格', exact: true }).selectOption(style);
    await gallery.getByRole('tab', { name: 'AI 执行状态', exact: true }).click();
    assert(!(await draft.isVisible()));
    const state = gallery.getByRole('combobox', { name: '工具状态样本', exact: true });
    for (const value of ['pending', 'running', 'completed', 'failed', 'rejected', 'cancelled', 'awaiting-approval']) {
      await state.selectOption(value);
      assert.equal(await gallery.locator('.design-specimen-tool-preview details').getAttribute('data-state'), value);
      await fits(page, `tool ${value}`);
    }
    const fail = gallery.getByRole('checkbox', { name: '模拟审批提交失败', exact: true });
    await fail.check();
    await gallery.getByRole('button', { name: '模拟允许', exact: true }).click();
    await gallery.getByRole('alert').waitFor();
    assert.equal(await state.inputValue(), 'awaiting-approval');
    await gallery.screenshot({ path: join(directory, `${width}-${mode}-${style}-tools.png`) });
    await fail.uncheck();
    await gallery.getByRole('button', { name: '模拟允许', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.design-specimen-tool-preview details')?.getAttribute('data-state') === 'completed');
    await gallery.getByRole('button', { name: '重置审批样本', exact: true }).click();
    await gallery.getByRole('button', { name: '模拟拒绝', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.design-specimen-tool-preview details')?.getAttribute('data-state') === 'rejected');
    await gallery.getByRole('tab', { name: '表面与变量', exact: true }).click();
    await fits(page, 'surfaces');
    await gallery.screenshot({ path: join(directory, `${width}-${mode}-${style}-surfaces.png`) });
    assert.equal(await gallery.locator('.design-token-sample').count(), 4);
    if (width === 1440 && style === 'glass') {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-reduced-transparency', value: 'reduce' }] });
      const reduced = await gallery.locator('[data-surface="glass"]').evaluate((node) => {
        const css = getComputedStyle(node); const root = getComputedStyle(document.documentElement);
        return { matches: matchMedia('(prefers-reduced-transparency: reduce)').matches, alpha: css.getPropertyValue('--ds-surface-alpha').trim(), blur: css.backdropFilter, duration: root.getPropertyValue('--ds-duration').trim() };
      });
      assert(reduced.matches);
      assert.equal(reduced.alpha, '1');
      assert(['none', 'blur(0px)'].includes(reduced.blur), `Reduced transparency still uses blur: ${reduced.blur}`);
      assert.equal(parseFloat(reduced.duration), .01);
      await page.emulateMedia({ media: 'print' });
      const printShadow = await gallery.locator('[data-surface="elevated"]').evaluate((node) => getComputedStyle(node).boxShadow);
      assert.equal(printShadow, 'none', 'Print preference lost to skin specificity');
      await page.emulateMedia({ media: 'screen' });
    }
    await gallery.getByRole('tab', { name: '基础控件', exact: true }).click();
    assert.equal(await draft.inputValue(), '切换风格后保留这个草稿');
    assert(await gallery.getByRole('radio', { name: '包含完整上下文的研究记录', exact: true }).isChecked());
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ width, mode, style, normal, hovered, controlsSize });
    console.log(`PASS ${style} ${mode} ${width}px: three specimen panels, seven tool states, approval recovery, preserved drafts, opaque primary hover contrast.`);
    await context.close();
  }
  console.log(`PASS ${results.length * 3} specimen panel layouts, ${results.length * 7} tool-state layouts and ${results.length * 2} default/hover contrast samples; Glass reduction/print checks passed.`);
} catch (error) {
  failure = String(error.stack ?? error);
  console.error(error);
  process.exitCode = 1;
} finally {
  writeFileSync(join(directory, 'results.json'), JSON.stringify({ results, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
