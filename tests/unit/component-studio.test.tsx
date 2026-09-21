import { createRef, useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/Navigation';
import { ComponentGallery, ComponentTile } from '../../showcase/ComponentGallery';
import { componentDocs } from '../../showcase/ComponentDemos';
import { AgentSpecimen } from '../../showcase/StudioSpecimens';
import { DocsApp } from '../../showcase/DocsApp';

afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); window.history.replaceState(null, '', '/'); });

it('combines catalog filters and changes layout without losing the query', async () => {
  const user = userEvent.setup(); const { container } = render(<ComponentGallery />);
  expect(container.querySelectorAll('.studio-tile-link')).toHaveLength(componentDocs.length);
  await user.selectOptions(screen.getByRole('combobox', { name: '组件分类' }), 'AI 聊天');
  const query = screen.getByRole('searchbox', { name: '筛选组件总览' });
  await user.type(query, 'ChatThread');
  expect(container.querySelectorAll('.studio-tile-link')).toHaveLength(1);
  await user.click(screen.getByRole('button', { name: '列表展示' }));
  expect(screen.getByRole('button', { name: '列表展示' })).toHaveAttribute('aria-pressed', 'true');
  expect(query).toHaveValue('ChatThread');
  expect(container.querySelectorAll('.studio-tile-preview')).toHaveLength(0);
  await user.click(screen.getByRole('button', { name: '网格展示' }));
  expect(container.querySelectorAll('.studio-tile-preview')).toHaveLength(1);
  await user.type(query, '-no-such-component');
  expect(screen.getByRole('heading', { name: '还没有找到匹配的组件' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: '清除筛选' }));
  expect(query).toHaveValue(''); expect(container.querySelectorAll('.studio-tile-link')).toHaveLength(componentDocs.length);
});

it('offers manual preview loading without IntersectionObserver and resets only that tile', async () => {
  function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Count {count}</button>; }
  const user = userEvent.setup(); const doc = { ...componentDocs[0], name: 'Counter', preview: <Counter /> };
  const { container } = render(<ComponentTile doc={doc} />);
  await user.click(screen.getByRole('button', { name: '载入 Counter 预览' }));
  await user.click(screen.getByRole('button', { name: 'Count 0' }));
  expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
  expect(container.querySelector('.studio-tile-link button')).toBeNull();
  await user.click(screen.getByRole('button', { name: '重置 Counter 预览' }));
  await user.click(screen.getByRole('button', { name: '载入 Counter 预览' }));
  expect(screen.getByRole('button', { name: 'Count 0' })).toBeVisible();
});

it('retains TabsList asChild, its DOM ref, native focus and manual activation', async () => {
  const ref = createRef<HTMLDivElement>(); const user = userEvent.setup();
  const view = render(<Tabs defaultValue="one" activationMode="manual"><TabsList ref={ref} asChild aria-label="Example"><div data-testid="list"><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></div></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent></Tabs>);
  expect(ref.current).toBe(screen.getByRole('tablist'));
  expect(ref.current?.children).toHaveLength(2); // The moving indicator is decorative CSS, not a third focus target.
  const first = screen.getByRole('tab', { name: 'One' });
  const second = screen.getByRole('tab', { name: 'Two' });
  first.focus(); await user.keyboard('{ArrowRight}'); expect(second).toHaveFocus();
  expect(first).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{Enter}'); expect(second).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Second');
  view.unmount(); expect(ref.current).toBeNull();
});

it('switches preview backgrounds without remounting the live demo', async () => {
  window.history.replaceState(null, '', '/#/components/input');
  const user = userEvent.setup(); render(<DocsApp />);
  const input = await screen.findByRole('textbox', { name: '项目名称', exact: true });
  await user.type(input, 'Keep this edit');
  const background = screen.getByRole('group', { name: '预览背景' });
  await user.click(within(background).getByRole('button', { name: '网格' }));
  expect(within(background).getByRole('button', { name: '网格' })).toHaveAttribute('aria-pressed', 'true');
  expect(input).toHaveValue('Keep this edit');
  // Radix activates on primary mousedown, not click. Dispatch that native
  // contract explicitly in jsdom; Chromium also covers complete pointer input.
  const codeTab = screen.getByRole('tab', { name: '用法代码' });
  fireEvent.mouseDown(codeTab, { button: 0, ctrlKey: false });
  await waitFor(() => expect(codeTab).toHaveAttribute('aria-selected', 'true'));
  expect(screen.queryByRole('group', { name: '预览背景' })).not.toBeInTheDocument();
  const previewTab = screen.getByRole('tab', { name: '预览', exact: true });
  fireEvent.mouseDown(previewTab, { button: 0, ctrlKey: false });
  await waitFor(() => expect(previewTab).toHaveAttribute('aria-selected', 'true'));
  expect(input).toHaveValue('Keep this edit');
});

it('labels the AI interaction as local and advances only its simulated state', () => {
  vi.useFakeTimers(); render(<AgentSpecimen />);
  const send = screen.getByRole('button', { name: '运行助手演示' });
  const input = screen.getByRole('textbox', { name: '向演示助手发送任务' });
  fireEvent.change(input, { target: { value: '   ' } }); expect(send).toBeDisabled();
  fireEvent.change(input, { target: { value: 'Build a form' } }); fireEvent.click(send);
  expect(send).toBeDisabled(); expect(screen.getByText('正在运行本地演示', { exact: true })).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(1100); });
  expect(send).not.toBeDisabled(); expect(screen.getByText('本地演示已完成', { exact: true })).toBeInTheDocument();
  expect(screen.getByText('演示数据 · 不连接模型或外部服务')).toBeVisible();
});


it('preserves explicit RTL keyboard navigation through the Radix direction contract', async () => {
  const user = userEvent.setup();
  render(<Tabs dir="rtl" defaultValue="one"><TabsList aria-label="RTL example"><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent></Tabs>);
  screen.getByRole('tab', { name: 'One' }).focus();
  await user.keyboard('{ArrowLeft}');
  expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
  expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
});
