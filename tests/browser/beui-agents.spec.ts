import { expect, test } from '@playwright/test';

const slugs = ['agent-message-bubble', 'agent-message', 'agent-message-scroller', 'agent-prompt-input', 'agent-todo-list', 'agent-code-block', 'agent-approval-card', 'agent-file-diff', 'agent-tool-result', 'agent-streaming-response', 'agent-image-generation', 'agent-tool-approval', 'agent-citations', 'agent-activity', 'agent-loading-states', 'agent-sidebar', 'agent-chat-app'];

for (const slug of slugs) {
  test(`${slug} has an installed-source demo, complete payload and a usable phone layout`, async ({ page, request }, info) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.goto(`components/${slug}/`);
    const preview = page.locator('.detail-preview').first();
    await expect(preview).toBeVisible();
    // Wait for the actual lazy component, not its non-empty loading placeholder.
    await expect(preview.locator('.preview-placeholder')).toHaveCount(0);
    await expect(preview.getByText('正在加载组件…', { exact: true })).toHaveCount(0);
    await expect(preview).not.toContainText('示例暂时无法加载');
    await expect(preview.locator('.demo-content')).not.toBeEmpty();
    const response = await request.get(`r/${slug}.json`);
    expect(response.ok()).toBe(true);
    const payload = await response.json();
    expect(payload.files.some((file: { path: string }) => file.path === `registry/ui/${slug}.tsx`)).toBe(true);
    for (const file of payload.files) expect(file.content).not.toMatch(/from ["']@\/(components\/agents|components\/motion|lib\/)/);
    await preview.screenshot({ path: info.outputPath(`${slug}-desktop.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(preview).not.toContainText('示例暂时无法加载');
    expect(failures).toEqual([]);
    if (['agent-chat-app', 'agent-approval-card', 'agent-sidebar'].includes(slug)) {
      await preview.screenshot({ path: info.outputPath(`${slug}-phone.png`) });
    }
  });
}

test('Agent composer preserves failures and submits through the selected model', async ({ page }) => {
  await page.goto('components/agent-prompt-input/');
  const preview = page.locator('.detail-preview').first();
  const input = preview.getByRole('textbox', { name: 'Agent 输入' });
  await input.fill('保留我的定制');
  await preview.getByRole('checkbox', { name: '模拟失败' }).check();
  await preview.getByRole('button', { name: 'Send prompt' }).click();
  await expect(preview.getByRole('alert')).toContainText('草稿已保留');
  await expect(input).toHaveValue('保留我的定制');
  await preview.getByRole('checkbox', { name: '模拟失败' }).uncheck();
  await input.press('Enter');
  await expect(input).toHaveValue('');
  await expect(preview.getByRole('status')).toContainText('fast：保留我的定制');
});

test('question approval records choices and displays the host-confirmed result', async ({ page }, info) => {
  await page.goto('components/agent-approval-card/');
  const preview = page.locator('.detail-preview').first();
  await preview.getByRole('button', { name: '分步问答', exact: true }).click();
  await preview.getByText('测试环境', { exact: true }).click();
  // Single-choice questions auto-advance; do not double-advance from the test.
  await expect(preview.getByText('交付形式', { exact: true })).toBeVisible();
  await preview.getByText('源码', { exact: true }).click();
  await preview.getByText('文档', { exact: true }).click();
  await preview.getByRole('button', { name: 'Submit response', exact: true }).click();
  await expect(preview.getByText('已记录演示结果', { exact: true })).toBeVisible();
  await preview.screenshot({ path: info.outputPath('agent-approval-answered.png') });
});

test('resource tree selection, rename and keyboard navigation update local data', async ({ page }) => {
  await page.goto('components/agent-sidebar/');
  const preview = page.locator('.detail-preview').first();
  await preview.getByText('实现说明.md', { exact: true }).click();
  await expect(preview.getByText('当前资源：spec', { exact: true })).toBeVisible();
  await preview.getByText('实现说明.md', { exact: true }).dblclick();
  const rename = preview.getByRole('textbox', { name: 'Rename 实现说明.md' });
  await rename.fill('迁移验收.md'); await rename.press('Enter');
  await expect(preview.getByText('迁移验收.md', { exact: true })).toBeVisible();
  const item = preview.getByRole('treeitem').filter({ hasText: '迁移验收.md' });
  await item.focus(); await page.keyboard.press('ArrowUp');
  await expect(preview.getByRole('treeitem').filter({ hasText: '对话记录' })).toBeFocused();
});

test('message scroller does not steal the reader position when a message arrives', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('components/agent-message-scroller/');
  const preview = page.locator('.detail-preview').first();
  const viewport = preview.getByRole('region', { name: '示例消息记录' });
  await expect.poll(() => viewport.evaluate((node) => node.scrollHeight - node.clientHeight)).toBeGreaterThan(100);
  await viewport.hover(); await page.mouse.wheel(0, -2000);
  await viewport.evaluate((node) => { node.scrollTop = 0; });
  await expect.poll(() => viewport.evaluate((node) => node.scrollTop)).toBe(0);
  await preview.getByRole('button', { name: '追加消息' }).click();
  await expect(preview.getByText('消息 13', { exact: true })).toBeAttached();
  await expect.poll(() => viewport.evaluate((node) => node.scrollTop)).toBeLessThan(1);
});

test('Agent shell composes existing Markdown tables, sends messages and opens phone navigation', async ({ page }, info) => {
  await page.goto('components/agent-chat-app/');
  const preview = page.locator('.detail-preview').first();
  await expect(preview.getByRole('table', { name: 'Markdown 表格' })).toBeVisible();
  const input = preview.getByRole('textbox', { name: 'Agent 对话输入' });
  await input.fill('继续验证'); await input.press('Enter');
  await expect(preview.getByText('已收到。这是本地示例，实际模型请求由你的应用提供。', { exact: true })).toBeVisible();
  await expect(input).toHaveValue('');
  await preview.screenshot({ path: info.outputPath('agent-chat-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = preview.getByRole('button', { name: '切换 Agent 会话导航' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Agent 会话' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
