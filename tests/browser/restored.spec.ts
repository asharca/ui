import { test, expect } from '@playwright/test';

test('all restored families are discoverable without changing the site layout', async ({ page }) => {
  await page.goto('components/');
  await expect(page.locator('.catalog-count')).toHaveText('61 个组件');
  await expect(page.locator('.component-card')).toHaveCount(61);
  await page.getByRole('button', { name: '工作区', exact: true }).click();
  await expect(page.locator('.catalog-count')).toHaveText('4 个组件');
  await expect(page.locator('.component-card[data-component="workspace-sidebar"]')).toBeVisible();
  await page.getByRole('button', { name: '全部', exact: true }).click();
  await page.getByRole('textbox', { name: '筛选组件' }).fill('chart-container');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Chart Container', exact: true }).last()).toBeVisible();
});

test('restored table keeps selections across pages filters and sorting', async ({ page }) => {
  await page.goto('components/data-table/');
  const preview = page.locator('.detail-preview');
  await preview.getByRole('checkbox', { name: '选择行 p1', exact: true }).check();
  await preview.getByRole('button', { name: '下一页' }).click();
  await preview.getByRole('checkbox', { name: '选择行 p5', exact: true }).check();
  await expect(preview.getByText('已选 2 项')).toBeVisible();
  const search = preview.getByRole('searchbox', { name: '搜索项目' });
  await search.fill('Alpha');
  await expect(preview.getByRole('checkbox', { name: '选择行 p1', exact: true })).toBeChecked();
  await expect(preview.getByText('已选 2 项')).toBeVisible();
  await preview.getByRole('button', { name: '清空搜索项目' }).click();
  await preview.getByRole('button', { name: '文件数' }).click();
  await expect(preview.getByRole('columnheader', { name: '文件数' })).toHaveAttribute('aria-sort', 'ascending');
  await preview.getByRole('button', { name: '处理所选' }).click();
  await expect(preview.getByText('已处理 2 个本地示例项目')).toBeVisible();
  await expect(preview.getByText('已选 2 项')).toHaveCount(0);
});

test('chart switches actual renderers and exposes its source data', async ({ page }) => {
  await page.goto('components/chart-container/');
  const preview = page.locator('.detail-preview');
  await expect(preview.locator('.recharts-bar').first()).toBeVisible();
  const size = await preview.locator('svg.recharts-surface').first().boundingBox();
  expect(size?.width).toBeGreaterThan(100);
  expect(size?.height).toBeGreaterThan(100);
  await preview.getByRole('button', { name: '面积', exact: true }).click();
  await expect(preview.locator('.recharts-area').first()).toBeVisible();
  await preview.getByText('查看数据表', { exact: true }).click();
  await expect(preview.getByRole('table', { name: '任务数量数据' })).toBeVisible();
  await expect(preview.getByRole('cell', { name: '45', exact: true })).toBeVisible();
});

test('workspace tabs select reorder close and pin through real controls', async ({ page }) => {
  await page.goto('components/workspace-tab-bar/');
  const preview = page.locator('.detail-preview');
  const list = preview.getByRole('tablist', { name: '工作区标签' });
  await list.getByRole('tab', { name: '任务列表', exact: true }).click();
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(list.getByRole('tab')).toHaveText(['概览', '任务列表', '设计文档']);
  await expect(list.getByRole('tab', { name: '任务列表', exact: true })).toHaveAttribute('aria-selected', 'true');
  await preview.getByRole('button', { name: '关闭 设计文档' }).click();
  await expect(list.getByRole('tab')).toHaveCount(2);
  await preview.getByRole('button', { name: '任务列表操作' }).click();
  await page.getByRole('menuitem', { name: '固定标签' }).click();
  await expect(preview.getByRole('button', { name: '关闭 任务列表' })).toHaveCount(0);
  await preview.getByRole('button', { name: '添加标签' }).click();
  await expect(list.getByRole('tab')).toHaveCount(3);
});

test('conversation rename and delete change the actual local model', async ({ page }) => {
  await page.goto('components/conversation-sidebar/');
  const preview = page.locator('.detail-preview');
  await preview.getByRole('button', { name: '设计一个简约的界面更多操作' }).click();
  await page.getByRole('menuitem', { name: '重命名', exact: true }).click();
  await page.getByRole('textbox', { name: '会话名称' }).fill('重命名后的讨论');
  await page.getByRole('button', { name: '保存名称' }).click();
  await expect(preview.getByRole('button', { name: '重命名后的讨论更多操作' })).toBeVisible();
  await preview.getByRole('button', { name: '重命名后的讨论更多操作' }).click();
  await page.getByRole('menuitem', { name: '删除会话', exact: true }).click();
  await page.getByRole('button', { name: '确认删除' }).click();
  await expect(preview.getByRole('button', { name: '重命名后的讨论更多操作' })).toHaveCount(0);
  await preview.getByRole('button', { name: '新建会话' }).click();
  await expect(preview.getByRole('button', { name: '新会话 1更多操作' })).toBeVisible();
});

test('rich chat handles editing branches approval attachments and local streaming', async ({ page }) => {
  await page.goto('components/chat-thread/');
  const preview = page.locator('.detail-preview');
  await preview.getByRole('button', { name: '编辑', exact: true }).click();
  await preview.getByRole('textbox', { name: '编辑消息' }).fill('请保留原来的组件。');
  await preview.getByRole('button', { name: '保存编辑' }).click();
  await expect(preview.getByRole('log')).toContainText('请保留原来的组件。');
  await preview.getByRole('button', { name: '下一分支' }).click();
  await expect(preview.getByRole('log')).toContainText('表格与工作区布局');
  await preview.getByRole('button', { name: '允许执行' }).click();
  await expect(preview.getByRole('log')).toContainText('已完成');
  await preview.getByLabel('添加附件').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('local example') });
  await expect(preview.getByRole('log')).toContainText('notes.txt');
  await preview.getByRole('textbox', { name: '消息', exact: true }).fill('再写一段说明');
  await preview.getByRole('button', { name: '发送消息' }).click();
  await expect(preview.getByRole('button', { name: '停止生成' })).toBeVisible();
  await expect(preview.getByRole('log')).toContainText('实际模型请求由你的应用提供');
  await expect(preview.getByRole('button', { name: '发送消息' })).toBeVisible();
});

test('mobile workspace drawer closes and restores its opener focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 950 });
  await page.goto('components/workspace-sidebar/');
  const opener = page.locator('.detail-preview').getByRole('button', { name: '打开工作区导航' });
  await opener.click();
  const drawer = page.getByRole('dialog', { name: '我的工作区导航' });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: '设置', exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator('.detail-preview').getByRole('heading', { name: '设置', exact: true })).toBeVisible();
});

for (const width of [375, 1440]) {
  for (const mode of ['light', 'dark'] as const) {
    test(`restored complex layouts ${width}px ${mode}`, async ({ page }, testInfo) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme: mode, reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const slug of ['data-table', 'chart-container', 'chat-thread', 'workspace-tab-bar', 'workspace-sidebar', 'conversation-sidebar']) {
        await page.goto(`components/${slug}/`);
        await page.mouse.move(0, 0);
        const preview = page.locator('.detail-preview .demo-content').first();
        await preview.scrollIntoViewIfNeeded();
        await expect(preview.locator('.preview-placeholder')).toHaveCount(0);
        await expect(preview.getByText('正在加载组件…', { exact: true })).not.toBeVisible();
        await expect(preview.getByRole('alert')).toHaveCount(0);
        if (slug === 'chart-container') await expect(preview.locator('.recharts-bar').first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} overflow at ${width}`).toBeTruthy();
        await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); });
        await page.screenshot({ path: testInfo.outputPath(`${slug}-${width}-${mode}.png`), fullPage: true });
      }
      expect(errors).toEqual([]);
    });
  }
}
