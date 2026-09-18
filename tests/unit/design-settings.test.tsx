import { cleanup, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { DocsApp } from '../../showcase/DocsApp';
import { DesignShowcase } from '../../showcase/DesignShowcase';
import { DENSITY_KEY, STYLE_KEY, normalizeDensity, normalizeStyle, previewHref, themeSetup, useDesignSettings } from '../../showcase/design-settings';

afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); window.history.replaceState(null, '', '/'); document.documentElement.removeAttribute('data-ui-style'); document.documentElement.removeAttribute('data-ui-density'); document.documentElement.classList.remove('dark'); });

it.each(['minimal', 'tech', 'glass'] as const)('keeps the valid %s skin', (style) => { expect(normalizeStyle(style)).toBe(style); });
it('validates untrusted URL/storage values instead of interpolating arbitrary CSS', () => {
  expect(normalizeStyle('url(evil)')).toBe('minimal'); expect(normalizeStyle(null)).toBe('minimal');
  expect(normalizeDensity('compact')).toBe('compact'); expect(normalizeDensity('other')).toBe('comfortable');
});
it('includes all three independent preferences in standalone preview URLs', () => {
  expect(previewHref('button', true, 'glass', 'compact')).toBe('#/preview/button?theme=dark&style=glass&density=compact');
  expect(themeSetup(false, 'minimal', 'comfortable')).toContain('@asharca/ui/themes.css');
  expect(themeSetup(false, 'minimal', 'comfortable')).toContain('data-ui-style="minimal"');
});
it('preview parameters do not overwrite parent preferences and root changes clean up', () => {
  localStorage.setItem(STYLE_KEY, 'minimal'); localStorage.setItem(DENSITY_KEY, 'comfortable');
  const { result, unmount } = renderHook(() => useDesignSettings('style=glass&density=compact'));
  expect(result.current.style).toBe('glass'); expect(document.documentElement.dataset.uiDensity).toBe('compact');
  expect(localStorage.getItem(STYLE_KEY)).toBe('minimal'); expect(localStorage.getItem(DENSITY_KEY)).toBe('comfortable');
  unmount(); expect(document.documentElement.hasAttribute('data-ui-style')).toBe(false);
});
it('remains usable when browser storage throws', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  const { result } = renderHook(() => useDesignSettings(null)); expect(result.current.style).toBe('minimal');
});
it('lets visitors change a skin without discarding their current form edits', async () => {
  window.history.replaceState(null, '', '/#/themes'); const user = userEvent.setup(); render(<DocsApp />);
  const input = await screen.findByRole('textbox', { name: '助手名称', exact: true });
  await user.clear(input); await user.type(input, '我的研究助手');
  await user.selectOptions(screen.getByRole('combobox', { name: '视觉风格' }), 'glass');
  expect(input).toHaveValue('我的研究助手'); expect(document.documentElement).toHaveAttribute('data-ui-style', 'glass');
  await user.selectOptions(screen.getByRole('combobox', { name: '界面密度' }), 'compact');
  expect(document.documentElement).toHaveAttribute('data-ui-density', 'compact');
  await user.click(screen.getByRole('button', { name: '深色模式' }));
  expect(document.documentElement).toHaveClass('dark'); expect(input).toHaveValue('我的研究助手');
  expect(localStorage.getItem(STYLE_KEY)).toBe('glass');
});
it('provides a real home entry and a keyboard-operable local workspace', async () => {
  window.history.replaceState(null, '', '/#/home'); render(<DocsApp />);
  expect(await screen.findByRole('link', { name: '开始构建' })).toHaveAttribute('href', '#/installation');
  expect(screen.getByRole('link', { name: '探索三套风格' })).toHaveAttribute('href', '#/themes');
});
it('supports real tab states and a locally cancellable demonstration', async () => {
  const user = userEvent.setup(); render(<DesignShowcase />);
  await user.click(screen.getByRole('tab', { name: '控件状态' }));
  expect(screen.getByRole('textbox', { name: '错误状态' })).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('textbox', { name: '禁用状态' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: '运行演示' }));
  await user.click(screen.getByRole('button', { name: '停止演示' }));
  await waitFor(() => expect(screen.getByText('演示已停止')).toBeInTheDocument());
});
