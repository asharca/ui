import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

assert(process.env.UI_BROWSER_ROOT, 'Set UI_BROWSER_ROOT to the isolated Playwright installation.');
const require = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'));
const { chromium } = require('playwright');
const output = resolve('ui-browser-artifacts/design');
mkdirSync(output, { recursive: true });
const measurements = [];
let server;
let browser;
let failure;
function rgb(value) { const values = value.match(/[\d.]+/g)?.map(Number); assert(values && values.length >= 3, `Not an RGB color: ${value}`); return values; }
function composite(color, under) { const a = color[3] ?? 1; return color.slice(0, 3).map((channel, i) => channel * a + under[i] * (1 - a)); }
function luminance(color) { const c = color.slice(0, 3).map((v) => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }); return c[0] * .2126 + c[1] * .7152 + c[2] * .0722; }
function contrast(a, b) { const x = luminance(a); const y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
async function fits(page, label) {
  const box = await page.evaluate(() => { const main = document.querySelector('.docs-main'); return { width: innerWidth, document: document.documentElement.scrollWidth, main: main.clientWidth, scroll: main.scrollWidth }; });
  assert(box.document <= box.width + 1 && box.scroll <= box.main + 1, `${label} overflows: ${JSON.stringify(box)}`);
}
try {
  server = await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0 } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch();
  for (const width of [375, 768, 1440]) {
    for (const mode of ['light', 'dark']) {
      for (const style of ['minimal', 'tech', 'glass']) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce' });
        await context.addInitScript(({ style, mode }) => {
          if (window !== window.top || sessionStorage.getItem('design-seeded')) return;
          localStorage.setItem('asharca-ui-docs-style', style);
          localStorage.setItem('asharca-ui-docs-theme', mode);
          localStorage.setItem('asharca-ui-docs-density', 'comfortable');
          sessionStorage.setItem('design-seeded', 'true');
        }, { style, mode });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`${base}#/themes`);
        const input = page.getByRole('textbox', { name: '助手名称', exact: true });
        await input.waitFor();
        await page.waitForFunction((value) => document.documentElement.dataset.uiStyle === value, style);
        const sample = await page.evaluate(() => {
          const css = (selector) => getComputedStyle(document.querySelector(selector));
          const field = css('.design-form-card input');
          const card = css('.design-form-card');
          const action = css('.design-form-actions .ui-button-primary');
          const helper = css('.design-form-card .ui-field-description');
          return { page: css('.docs-site').backgroundColor, shell: css('.design-console').backgroundColor, card: card.backgroundColor, foreground: card.color, helper: helper.color, primary: action.backgroundColor, primaryText: action.color, controlHeight: parseFloat(action.minHeight), radius: field.borderRadius };
        });
        const surface = composite(rgb(sample.card), rgb(sample.shell));
        const ratios = { foreground: contrast(rgb(sample.foreground), surface), helper: contrast(rgb(sample.helper), surface), primary: contrast(rgb(sample.primaryText), rgb(sample.primary)) };
        measurements.push({ width, mode, style, sample, ratios });
        await page.screenshot({ path: join(output, `${width}-${mode}-${style}-studio.png`) });
        await fits(page, `${style}/${mode}/${width} studio`);
        assert(ratios.foreground >= 4.5 && ratios.helper >= 4.5 && ratios.primary >= 4.5, `Insufficient sampled text contrast: ${JSON.stringify({ style, mode, ratios })}`);
        assert(sample.controlHeight >= 40, `Comfortable controls must be at least 40px: ${sample.controlHeight}`);
        if (width === 1440) await page.locator('.design-console').screenshot({ path: join(output, `${mode}-${style}-workspace.png`) });
        await input.fill('保留我的编辑内容');
        const next = style === 'glass' ? 'minimal' : 'glass';
        await page.getByRole('combobox', { name: '视觉风格' }).selectOption(next);
        assert.equal(await input.inputValue(), '保留我的编辑内容');
        await page.getByRole('combobox', { name: '视觉风格' }).selectOption(style);
        await page.getByRole('combobox', { name: '界面密度' }).selectOption('compact');
        const compact = await page.locator('.design-form-actions .ui-button-primary').evaluate((node) => parseFloat(getComputedStyle(node).minHeight));
        assert.equal(compact, 36, 'Compact density must not be overridden by palette specificity');
        assert.equal(await input.inputValue(), '保留我的编辑内容');
        await page.getByRole('button', { name: '工作区设置', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: '预览工作区设置', exact: true });
        await dialog.waitFor();
        await page.mouse.move(0, 0);
        const bounds = await dialog.boundingBox();
        assert(bounds && bounds.x >= -1 && bounds.x + bounds.width <= width + 1, 'Dialog does not fit the viewport');
        const dialogBrand = await dialog.getByRole('button', { name: '完成预览' }).evaluate((node) => getComputedStyle(node).backgroundColor);
        assert.equal(dialogBrand, sample.primary, 'Body-mounted Portal did not receive the chosen skin');
        await page.keyboard.press('Escape');
        await page.getByRole('tab', { name: '控件状态', exact: true }).click();
        assert.equal(await page.getByRole('textbox', { name: '错误状态', exact: true }).getAttribute('aria-invalid'), 'true');
        assert(await page.getByRole('textbox', { name: '禁用状态', exact: true }).isDisabled());
        if (width === 1440) {
          await page.getByRole('button', { name: '运行演示', exact: true }).click();
          await page.getByRole('button', { name: '停止演示', exact: true }).click();
          await page.waitForTimeout(1500);
          assert(await page.getByText('演示已停止', { exact: true }).isVisible(), 'Cancelled timer updated the state');
          await page.locator('.design-console').screenshot({ path: join(output, `${mode}-${style}-controls.png`) });
        }
        await page.goto(`${base}#/components/button`);
        await page.getByRole('button', { name: '保存更改', exact: true }).waitFor();
        await page.getByRole('combobox', { name: '视觉风格' }).selectOption(style);
        await page.getByRole('combobox', { name: '预览视口' }).selectOption('375');
        const frame = page.frameLocator('.docs-preview-frame');
        await frame.getByRole('button', { name: '保存更改', exact: true }).waitFor();
        assert.equal(await frame.locator('html').getAttribute('data-ui-style'), style);
        assert.equal(await frame.locator('html').getAttribute('data-ui-density'), 'compact');
        assert.equal(await frame.locator('html').evaluate((node) => node.classList.contains('dark')), mode === 'dark');
        assert.equal(await page.evaluate(() => localStorage.getItem('asharca-ui-docs-density')), 'compact', 'Preview must not overwrite parent preferences');
        await page.goto(`${base}#/home`);
        const cta = page.locator('.ref-browse').getByRole('link', { name: '全部组件', exact: true });
        await cta.waitFor();
        assert.equal(await cta.getAttribute('href'), '#/components', 'Home must link to the component catalog');
        await page.mouse.move(0, 0);
        await fits(page, `${style}/${mode}/${width} home`);
        const linkColors = await cta.evaluate((node) => {
          const backgrounds = [];
          for (let current = node; current; current = current.parentElement) {
            backgrounds.unshift(getComputedStyle(current).backgroundColor);
          }
          return { text: getComputedStyle(node).color, backgrounds };
        });
        // The new text link is transparent; sample its actual ancestor-composited surface.
        const linkBackground = linkColors.backgrounds.reduce((under, color) => composite(rgb(color), under), [255, 255, 255]);
        const linkContrast = contrast(composite(rgb(linkColors.text), linkBackground), linkBackground);
        measurements[measurements.length - 1].linkContrast = linkContrast;
        assert(linkContrast >= 4.5, `Home catalog link text contrast too low: ${style} ${mode} ${linkContrast}`);
        await page.screenshot({ path: join(output, `${width}-${mode}-${style}-home.png`) });
        for (const id of ['checkbox', 'radio', 'chat-thread', 'tool-call-card']) {
          await page.goto(`${base}#/components/${id}`);
          const canvas = page.locator('.docs-demo-canvas');
          await canvas.waitFor();
          await page.waitForFunction(() => !document.querySelector('.docs-demo-canvas')?.textContent?.includes('加载组件示例'));
          if (id === 'chat-thread') await page.locator('[data-ui="chat.composer"] textarea').waitFor();
          if (id === 'tool-call-card') await page.locator('.ui-tool-call').first().waitFor();
          if (id === 'checkbox' || id === 'radio') await page.locator('.ui-choice input').first().waitFor();
          await fits(page, `${style}/${mode}/${width} ${id}`);
          if (width === 1440) await canvas.screenshot({ path: join(output, `${mode}-${style}-${id}.png`) });
        }
        assert.equal(errors.length, 0, errors.join('\n'));
        await context.close();
        console.log(`PASS ${style} ${mode} ${width}px: studio/home, four component pages, contrast samples, density, preserved edits, Portal and iframe.`);
      }
    }
  }
  assert.equal(new Set(measurements.filter((item) => item.width === 1440).map((item) => `${item.sample.page}/${item.sample.primary}`)).size, 6, 'The six palettes should be visually distinct');
  console.log(`PASS ${measurements.length} style/mode/viewport combinations and 72 component-page layouts. Screenshots and sampled contrast ratios saved.`);
} catch (error) {
  failure = String(error.stack ?? error);
  console.error(error);
  process.exitCode = 1;
} finally {
  writeFileSync(join(output, 'results.json'), JSON.stringify({ measurements, failure }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
