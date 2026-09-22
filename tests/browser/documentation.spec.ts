import { test, expect } from '@playwright/test';

const settled = async (page: import('@playwright/test').Page) => { await page.waitForTimeout(180); };
test('the fixed sidebar scrolls independently and never chains to the document', async ({ page }) => {
  await page.goto('components/');
  const rail = page.locator('.docs-sidebar-scroll');
  await expect(rail).toBeVisible();
  expect(await rail.evaluate((element) => getComputedStyle(element).scrollbarWidth)).toBe('none');
  expect(await rail.evaluate((element) => getComputedStyle(element).overscrollBehaviorY)).toBe('contain');
  const before = await rail.evaluate((element) => ({ top: element.getBoundingClientRect().top, scroll: element.scrollTop }));
  await page.mouse.move(900, 300); await page.mouse.wheel(0, 650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  expect(await rail.evaluate((element) => element.scrollTop)).toBe(before.scroll);
  expect((await rail.boundingBox())!.y).toBe(before.top);
  const mainScroll = await page.evaluate(() => scrollY);
  await rail.hover({ position: { x: 100, y: 180 } }); await page.mouse.wheel(0, 650);
  await expect.poll(() => rail.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await settled(page);
  expect(await page.evaluate(() => scrollY)).toBe(mainScroll);
  await rail.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await page.mouse.wheel(0, 1000); await settled(page);
  expect(await page.evaluate(() => scrollY)).toBe(mainScroll);
  await rail.evaluate((element) => { element.scrollTop = 0; });
  await page.mouse.wheel(0, -1000); await settled(page);
  expect(await page.evaluate(() => scrollY)).toBe(mainScroll);
  await page.mouse.move(900, 300); await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(mainScroll);
  expect(await rail.evaluate((element) => element.scrollTop)).toBe(0);
});
test('sidebar stays mounted across catalog, component and installation routes', async ({ page }) => {
  await page.goto('components/');
  const rail = page.locator('.docs-sidebar-scroll');
  await rail.evaluate((element) => { element.setAttribute('data-instance', 'persist'); element.scrollTop = element.scrollHeight; });
  await rail.getByRole('link', { name: 'ToolPlane Logo', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ToolPlane Logo');
  await expect(rail).toHaveAttribute('data-instance', 'persist');
  expect(await rail.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
  await rail.evaluate((element) => { element.scrollTop = 0; });
  await rail.getByRole('link', { name: '安装', exact: true }).click();
  await expect(rail).toHaveAttribute('data-instance', 'persist');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('把组件带进项目。');
});
test('component browsing and detail pages have no site footer; the home footer remains', async ({ page }) => {
  for (const route of ['components/', 'components/button/', 'components/data-table/', 'docs/installation/']) {
    await page.goto(route); await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.site-footer')).toHaveCount(0);
  }
  await page.goto('./'); await expect(page.locator('.site-footer')).toHaveCount(1);
});
test('API Reference exposes real defaults and required props and is in the TOC', async ({ page }) => {
  await page.goto('components/button/');
  await expect(page.locator('[data-api-component="Button"]')).toBeVisible();
  await expect(page.locator('[data-api-component="Button"] [data-prop="variant"]')).toContainText("'default'");
  await expect(page.locator('[data-api-component="Button"] [data-prop="loading"]')).toContainText('false');
  await expect(page.locator('[data-api-component="Button"] [data-prop="children"]')).toBeVisible();
  await page.getByRole('complementary', { name: '本页目录' }).getByRole('link', { name: 'API Reference' }).click();
  await expect(page.getByRole('heading', { name: 'API Reference', exact: true })).toBeInViewport();
  await page.goto('components/input/');
  await expect(page.locator('[data-api-component="Input"] [data-prop="label"]')).toContainText('必填');
  await page.goto('components/dialog/');
  await expect(page.locator('[data-api-component]')).toHaveCount(4);
  await expect(page.locator('[data-api-component="DialogContent"] [data-prop="title"]')).toContainText('必填');
});
test('Copy Page writes the exact public Markdown, not the interactive input', async ({ page, context, request }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('components/input/?private=never-share');
  await page.getByRole('textbox', { name: '工作区名称' }).fill('PRIVATE-PREVIEW-TEXT');
  const response = await request.get('components/input.md');
  const markdown = await response.text();
  expect(response.ok()).toBeTruthy(); expect(markdown).toContain('# Input\n'); expect(markdown).toContain('## API Reference');
  expect(response.headers()['content-type']).not.toContain('text/html');
  await page.getByRole('button', { name: 'Copy page as Markdown', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copy page as Markdown', exact: true })).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(markdown);
  expect(markdown).not.toContain('PRIVATE-PREVIEW-TEXT'); expect(markdown).not.toContain('never-share');
});
test('the action menu contains all four links, encoded public context and keyboard navigation', async ({ page }) => {
  await page.goto('components/input/?private=never-share');
  const trigger = page.getByRole('button', { name: 'More page actions' });
  await trigger.focus(); await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Page actions' });
  await expect(menu.getByRole('menuitem')).toHaveCount(4);
  await expect(menu.getByRole('menuitem', { name: 'View as Markdown' })).toBeFocused();
  await expect(menu.getByRole('menuitem', { name: 'View as Markdown' })).toHaveAttribute('href', /\/components\/input\.md$/);
  for (const target of ['v0', 'ChatGPT', 'Claude']) {
    const link = menu.getByRole('menuitem', { name: `Open in ${target}`, exact: true });
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.hostname).toBe({ v0:'v0.dev', ChatGPT:'chatgpt.com', Claude:'claude.ai' }[target]);
    expect(url.searchParams.get('q')).toContain('https://asharca.github.io/ui/components/input.md');
    expect(url.searchParams.get('q')).not.toMatch(/localhost|127\.0\.0\.1|private=|never-share/);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).toHaveAttribute('referrerpolicy', 'no-referrer');
  }
  await page.keyboard.press('End'); await expect(menu.getByRole('menuitem', { name: 'Open in Claude' })).toBeFocused();
  await page.keyboard.press('Home'); await expect(menu.getByRole('menuitem', { name: 'View as Markdown' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(menu).not.toBeVisible(); await expect(trigger).toBeFocused();
});
test('copy failure never reports success and supports retry after an HTML fallback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/components/button.md', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Not a document</html>' }));
  await page.goto('components/button/');
  const button = page.getByRole('button', { name: 'Copy page as Markdown', exact: true });
  await button.click(); await expect(button).toHaveText('Try again');
  await expect(page.locator('.page-copy-error')).toBeVisible();
  await page.unroute('**/components/button.md');
  await button.click(); await expect(button).toHaveText('Copied');
});
test('API fetch failures keep a retryable Reference section, and switching routes does not leak old docs', async ({ page }) => {
  await page.route('**/api-reference/input.json', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('components/input/');
  await expect(page.getByRole('heading', { name: 'API Reference', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '重试加载 API' }).click();
  await page.unroute('**/api-reference/input.json');
  await page.getByRole('button', { name: '重试加载 API' }).click();
  await expect(page.locator('[data-api-component="Input"]')).toBeVisible();
  await page.locator('.docs-sidebar-scroll').getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page.locator('[data-api-component="Button"]')).toBeVisible();
  await expect(page.locator('[data-api-component="Input"]')).toHaveCount(0);
});
test('Markdown endpoints and static entry links survive direct requests and the Pages subpath', async ({ request }) => {
  for (const route of ['components', 'components/button', 'components/chat-thread', 'docs/installation']) {
    const response = await request.get(`${route}.md`);
    expect(response.status()).toBe(200); expect(await response.text()).toMatch(/^# /);
    const html = await (await request.get(`${route}/`)).text();
    expect(html).toContain(`type="text/markdown" href="https://asharca.github.io/ui/${route}.md"`);
  }
});
for (const width of [375, 1440]) for (const dark of [false, true]) {
  test(`documentation screenshots and overflow ${width} ${dark ? 'dark' : 'light'}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce' });
    await page.goto('components/button/');
    await expect(page.locator('[data-api-component="Button"]')).toBeVisible();
    await page.getByRole('button', { name: 'More page actions' }).click();
    await expect(page.getByRole('menu', { name: 'Page actions' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`page-actions-${width}-${dark ? 'dark' : 'light'}.png`) });
    await page.keyboard.press('Escape');
    await page.locator('#api-reference').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`api-reference-${width}-${dark ? 'dark' : 'light'}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    if (width === 375) {
      await page.getByRole('button', { name: '打开导航' }).click();
      expect(await page.locator('.nav-sheet').evaluate((element) => getComputedStyle(element).scrollbarWidth)).toBe('none');
      await page.keyboard.press('Escape');
    }
  });
}
