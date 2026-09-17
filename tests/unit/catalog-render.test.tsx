import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { componentDocs } from '../../showcase/ComponentDemos';

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() });
});
afterEach(() => cleanup());
afterAll(() => vi.unstubAllGlobals());
it.each(componentDocs)('mounts the $name demo from the actual catalog', async (doc) => {
  const { container } = render(doc.preview);
  await waitFor(() => expect(screen.queryByRole('status', { name: '加载组件示例' })).not.toBeInTheDocument(), { timeout: 4000 });
  expect(screen.queryByText('示例加载失败，请刷新页面重试。')).not.toBeInTheDocument();
  expect(container.firstElementChild).not.toBeNull();
});
