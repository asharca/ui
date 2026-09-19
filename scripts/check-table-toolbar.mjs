import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { preview } from 'vite';

const { chromium } = createRequire(resolve(process.env.UI_BROWSER_ROOT || '.', 'package.json'))('playwright');
const output = resolve('ui-browser-artifacts/table-toolbar');
mkdirSync(output, { recursive: true });
const results = [], errors = [];
let browser, server, page;

async function motion(label, { reverse = false, reduced = false, selectAll = false } = {}) {
  const root = page.getByRole('region', { name: '项目列表', exact: true });
  const result = await root.evaluate(async (node, { reverse, selectAll }) => {
    await document.fonts.ready;
    await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    const table = node.querySelector('table'), head = node.querySelector('thead');
    const checkbox = head.querySelector('input');
    const target = selectAll ? checkbox : node.querySelector('tbody input');
    const action = node.querySelector('.ui-table__selection-toolbar');
    const content = node.querySelector('.ui-table__header-content');
    const fields = [checkbox, ...node.querySelectorAll('tbody input'), ...head.querySelectorAll('th'), ...node.querySelectorAll('tbody tr:first-child td')];
    const frames = [];
    const sample = (elapsed) => {
      const offset = node.getBoundingClientRect();
      frames.push({ elapsed, active: node.querySelector('.ui-table__surface').dataset.selectionToolbar,
        opacity: Number(getComputedStyle(action).opacity), headerOpacity: Number(getComputedStyle(content).opacity),
        boxes: fields.map((field) => { const r = field.getBoundingClientRect(); return [r.x - offset.x, r.y - offset.y, r.width, r.height]; }),
      });
    };
    target.focus({ preventScroll: true });
    sample(0);
    const start = performance.now();
    target.click();
    let reversed = false;
    await new Promise((done) => {
      const tick = (now) => {
        sample(now - start);
        if (reverse && !reversed && now - start >= 60) { target.click(); reversed = true; }
        if (now - start >= 350) done(); else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    return { frames, same: node.querySelector('table') === table && node.querySelector('thead') === head && head.querySelector('input') === checkbox,
      focus: document.activeElement === target, inert: action.inert, headerInert: content.inert };
  }, { reverse, selectAll });
  results.push({ label, ...result });
  assert(result.same, `${label}: table or select-all checkbox remounted`);
  assert(result.focus, `${label}: selection stole keyboard focus`);
  const first = result.frames[0], last = result.frames.at(-1);
  assert(result.frames.length >= 3, `${label}: missing motion frames`);
  let maxShift = 0;
  for (const frame of result.frames) for (let i = 0; i < frame.boxes.length; i++) for (let k = 0; k < 4; k++) {
    maxShift = Math.max(maxShift, Math.abs(frame.boxes[i][k] - first.boxes[i][k]));
  }
  assert(maxShift <= 0.75, `${label}: checkbox or column/body geometry shifted ${maxShift}px`);
  if (!reduced) {
    assert(result.frames.some((f) => f.opacity > 0.01 && f.opacity < 0.99), `${label}: missing toolbar transition`);
    assert(result.frames.some((f) => f.headerOpacity > 0.01 && f.headerOpacity < 0.99), `${label}: missing column label transition`);
  }
  const active = last.active === 'active';
  assert(active ? last.opacity >= .99 && last.headerOpacity <= .01 : last.opacity <= .01 && last.headerOpacity >= .99, `${label}: transition did not finish`);
  assert.equal(result.inert, !active, `${label}: hidden actions remain interactive`);
  assert.equal(result.headerInert, active, `${label}: covered header controls remain interactive`);
  console.log(`PASS ${label}: ${result.frames.length} frames, max geometry shift ${maxShift.toFixed(3)}px`);
}

try {
  server = process.env.UI_BASE_URL ? null : await preview({ configFile: resolve('showcase/vite.config.ts'), preview: { host: '127.0.0.1', port: 0, open: false } });
  const base = process.env.UI_BASE_URL || server.resolvedUrls.local[0];
  browser = await chromium.launch();
  for (const width of [375, 1440]) for (const style of ['minimal', 'tech', 'glass']) for (const dark of [false, true]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    const label = `${width}-${style}-${dark ? 'dark' : 'light'}`;
    await page.goto(`${base}#/preview/data-table?theme=${dark ? 'dark' : 'light'}&style=${style}&density=comfortable`);
    const region = page.getByRole('region', { name: '项目列表', exact: true });
    const all = region.getByRole('checkbox', { name: '全选行' });
    await all.waitFor();
    await motion(`${label}-select`);
    assert(await all.evaluate((input) => input.indeterminate), `${label}: missing partial state`);
    await region.getByRole('columnheader', { name: '项目', exact: true }).waitFor();
    await motion(`${label}-select-all`, { selectAll: true, reduced: true }); // active -> active: count only, no new animation
    assert(await all.isChecked());
    await page.screenshot({ path: join(output, `${label}-selected.png`) });
    await motion(`${label}-clear-all`, { selectAll: true });
    await motion(`${label}-reverse`, { reverse: true });
    // An action that clears selection must restore focus without replacing the input.
    await region.getByRole('checkbox', { name: '选择API Gateway' }).check();
    await region.getByRole('button', { name: '取消选择', exact: true }).click();
    assert(await all.evaluate((input) => document.activeElement === input), `${label}: action exit did not restore focus`);
    await region.getByRole('checkbox', { name: '选择API Gateway' }).check();
    const feature = page.getByRole('switch', { name: '选中后显示表头操作栏' });
    await feature.click();
    assert.equal(await region.getByRole('group', { name: '已选行操作' }).count(), 0);
    assert(await region.getByRole('checkbox', { name: '选择API Gateway' }).isChecked());
    await feature.click();
    await page.getByRole('searchbox', { name: '筛选项目' }).fill('Mobile');
    assert.equal(await region.locator('.ui-table__selection-count').textContent(), '已选择 1 项');
    assert(!(await all.isChecked()), `${label}: off-page selection affected visible select-all`);
    await page.getByRole('button', { name: '重置示例', exact: true }).click();
    if (style === 'minimal' && !dark) {
      await region.evaluate((node) => { node.dir = 'rtl'; });
      await motion(`${label}-rtl-select`);
      const geometry = await region.evaluate((node) => {
        const cell = node.querySelector('thead th').getBoundingClientRect();
        const toolbar = node.querySelector('.ui-table__selection-toolbar').getBoundingClientRect();
        return { cellLeft: cell.left, toolbarRight: toolbar.right };
      });
      assert(Math.abs(geometry.cellLeft - geometry.toolbarRight) <= 1, 'RTL actions overlap the checkbox column');
      await region.getByRole('button', { name: '取消选择', exact: true }).click();
      await region.evaluate((node) => { node.removeAttribute('dir'); });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await motion(`${label}-reduced-select`, { reduced: true });
      const duration = await region.locator('.ui-table__selection-toolbar').evaluate((node) => Math.max(...getComputedStyle(node).transitionDuration.split(',').map((v) => parseFloat(v) * 1000)));
      assert(duration <= .02, 'Ignored reduced-motion preference');
      await motion(`${label}-reduced-clear`, { reduced: true });
    }
    await context.close();
  }
  // Real sortable order headers: covered sort buttons must leave the tab order.
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}#/examples/admin`);
  const orders = page.getByRole('region', { name: '订单列表', exact: true });
  await orders.getByRole('checkbox', { name: '选择ORD-2408' }).check();
  assert.equal(await orders.getByRole('button', { name: /按金额/ }).count(), 0);
  await orders.getByRole('columnheader', { name: '金额', exact: true }).waitFor();
  await orders.getByRole('button', { name: '标记已完成', exact: true }).click();
  await orders.getByRole('button', { name: /按金额/ }).waitFor();
  assert.deepEqual(errors, [], 'Browser runtime errors');
} catch (error) {
  if (page && !page.isClosed()) await page.screenshot({ path: join(output, 'failure.png') }).catch(() => {});
  throw error;
} finally {
  writeFileSync(join(output, 'frames.json'), JSON.stringify({ results, errors }, null, 2));
  await browser?.close();
  if (server) await new Promise((done) => server.httpServer.close(done));
}
