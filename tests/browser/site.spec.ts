import { test, expect, type Page, type Locator } from '@playwright/test';
import { catalog } from '../../registry/catalog.mjs';

async function ready(preview: Locator) {
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator('.preview-placeholder')).toHaveCount(0);
  await expect(preview.getByText('正在加载组件…', { exact: true })).not.toBeVisible();
  await expect(preview.getByText('示例暂时无法加载，请刷新页面重试。', { exact: true })).not.toBeVisible();
  await expect(preview).not.toBeEmpty();
}
async function readyGallery(page: Page) {
  const previews = page.locator('.component-card .demo-content');
  for (let index = 0; index < await previews.count(); index++) await ready(previews.nth(index));
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); });
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
}

test('homepage, real previews and document endpoints', async ({ page, request }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('简约的组件。属于你的源码。');
  await readyGallery(page);
  await expect(page.getByRole('button', { name: '开始构建' })).toBeVisible();
  const response = await request.get('llms.txt');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(await response.text()).toContain('# Asharca UI');
  const registry = await request.get('r/button.json');
  expect(registry.ok()).toBeTruthy();
  expect((await registry.json()).files).toHaveLength(2);
  await page.screenshot({ path: testInfo.outputPath('home-light.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('every component route loads real content without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const entry of catalog) {
    await page.goto(`components/${entry.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.name);
    const previews = page.locator('.detail-preview .demo-content');
    await expect(previews).toHaveCount(entry.examples.length);
    for (let index = 0; index < entry.examples.length; index++) await ready(previews.nth(index));
  }
  expect(errors).toEqual([]);
});

test('preview survives Usage switching and exposes exact source', async ({ page }) => {
  await page.goto('components/input/');
  const input = page.getByRole('textbox', { name: '工作区名称' });
  await input.fill('保留输入状态');
  await page.getByRole('tab', { name: 'Usage', exact: true }).click();
  await expect(page.locator('.code-block code').first()).toContainText("@/components/asharca/input");
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(input).toHaveValue('保留输入状态');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.getByLabel('源码文件')).toBeVisible();
  await expect(page.locator('.code-block code').first()).toContainText('export const Input');
});

test('manual installation and package manager state are real', async ({ page }) => {
  await page.goto('components/dialog/');
  await page.getByRole('button', { name: 'npm', exact: true }).click();
  await expect(page.locator('.command-line')).toContainText('npx shadcn@latest add');
  await page.getByRole('button', { name: 'Manual', exact: true }).click();
  await expect(page.locator('.manual-install')).toContainText('npm install');
  await expect(page.getByLabel('源码文件')).toHaveValue('registry/ui/dialog.tsx');
  await page.getByLabel('源码文件').selectOption('registry/ui/utils.ts');
  await expect(page.locator('.source-files code')).toContainText('tailwind-merge');
  await page.reload();
  await expect(page.getByRole('button', { name: 'npm', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('search supports keyboard selection and Escape', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('combobox', { name: '搜索组件或文档' });
  await expect(search).toBeFocused();
  await search.fill('prompt');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prompt Input');
  await page.keyboard.press('Control+k');
  await expect(search).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).not.toBeVisible();
});

test('dialog traps focus, has a description and restores its trigger', async ({ page }) => {
  await page.goto('components/dialog/');
  const trigger = page.getByRole('button', { name: '打开对话框' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '准备发布更改？' });
  await expect(dialog).toHaveAccessibleDescription('先确认预览中的内容。这个示例不会执行实际发布。');
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('radio keyboard navigation uses native form behavior', async ({ page }) => {
  await page.goto('components/radio-group/');
  const preview = page.getByRole('radio', { name: /^预览环境/ });
  await preview.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: /^生产环境/ })).toBeChecked();
});

test('prompt composition, send and clear', async ({ page }) => {
  await page.goto('components/prompt-input/');
  const input = page.getByRole('textbox', { name: '消息', exact: true });
  await input.fill('中文输入');
  await input.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 229, isComposing: true });
  await expect(input).toHaveValue('中文输入');
  await input.press('Enter');
  await expect(page.locator('.detail-preview').getByRole('status')).toContainText('已收到：中文输入');
  await expect(input).toHaveValue('');
});

test('chat stop is an actual interactive state', async ({ page }) => {
  await page.goto('components/chat-panel/');
  await page.getByRole('textbox', { name: '消息', exact: true }).fill('测试消息');
  await page.getByRole('button', { name: '发送消息' }).click();
  await page.getByRole('button', { name: '停止生成' }).click();
  await expect(page.getByRole('log')).toContainText('已停止本地演示。');
  await expect(page.getByRole('button', { name: '发送消息' })).toBeVisible();
});

for (const width of [375, 768, 1440]) {
  for (const dark of [false, true]) {
    test(`responsive ${width}px ${dark ? 'dark' : 'light'}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 950 });
      await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce' });
      await page.goto('./');
      await readyGallery(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      await page.screenshot({ path: testInfo.outputPath(`home-${width}-${dark ? 'dark' : 'light'}.png`), fullPage: true });
      await page.goto('components/checkbox/');
      await expect(page.getByRole('checkbox', { name: /^接收项目更新/ })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      await page.screenshot({ path: testInfo.outputPath(`detail-${width}-${dark ? 'dark' : 'light'}.png`), fullPage: true });
      if (width < 900) {
        await page.getByRole('button', { name: '打开导航' }).click();
        const dialog = page.getByRole('dialog', { name: '导航', exact: true });
        await expect(dialog).toBeVisible();
        await dialog.getByRole('link', { name: 'Prompt Input', exact: true }).click();
        await expect(dialog).not.toBeVisible();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prompt Input');
      }
    });
  }
}

test('theme toggle persists and an unknown route is explicit', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  await page.getByRole('button', { name: '切换深色模式' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.goto('missing-page/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('这里还没有内容。');
});
