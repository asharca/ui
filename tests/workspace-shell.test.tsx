import { createRef, useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WorkspaceShell } from '../registry/ui/workspace-shell';
import { WorkspaceSidebar } from '../registry/ui/workspace-sidebar';
import { WorkspaceTabBar } from '../registry/ui/workspace-tab-bar';

const groups = [{ id: 'main', title: '导航', items: [{ id: 'home', label: '概览' }, { id: 'project', label: '项目' }] }];
const tabs = [{ id: 'home', title: '概览', pinned: true, tabId: 'test-tab-home', panelId: 'test-panel' }, { id: 'project', title: '项目', tabId: 'test-tab-project', panelId: 'test-panel' }];
function Harness() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('home');
  return <WorkspaceShell
    sidebar={<WorkspaceSidebar variant="inset" title="示例" groups={groups} activeId={active} onSelect={setActive} collapsed={collapsed} onCollapsedChange={setCollapsed} footer={<input aria-label="底部草稿" defaultValue="保留" />} />}
    tabBar={<WorkspaceTabBar variant="inset" tabs={tabs} activeTabId={active} onSelect={setActive} />}
    contentProps={{ id: 'test-panel', role: 'tabpanel', 'aria-labelledby': `test-tab-${active}` }}
  ><input aria-label="正文草稿" defaultValue="未提交" /></WorkspaceShell>;
}

describe('WorkspaceShell composition', () => {
  it('forwards root/content refs and DOM props without inventing landmarks', () => {
    const root = createRef<HTMLDivElement>();
    const content = createRef<HTMLDivElement>();
    const click = vi.fn();
    const { container } = render(<main><WorkspaceShell ref={root} id="shell" className="h-96" onClick={click}
      header={<h2>标题</h2>} footer={<button>底部动作</button>}
      contentProps={{ ref: content, id: 'panel', role: 'region', 'aria-label': '内容', tabIndex: 0, className: 'p-4' }}>
      <p>正文</p>
    </WorkspaceShell></main>);
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(root.current).toBe(container.querySelector('[data-slot="workspace-shell"]'));
    expect(root.current).toHaveAttribute('id', 'shell');
    expect(root.current).toHaveClass('h-96');
    expect(content.current).toBe(screen.getByRole('region', { name: '内容' }));
    expect(content.current).toHaveClass('overflow-auto', 'overscroll-contain', 'p-4');
    expect(content.current).toHaveAttribute('tabindex', '0');
    expect(content.current).not.toContainElement(screen.getByRole('heading'));
    expect(content.current).not.toContainElement(screen.getByRole('button'));
    fireEvent.click(screen.getByText('正文'));
    expect(click).toHaveBeenCalledOnce();
  });

  it('leaves top inset without a tab bar, including conditional false slots', () => {
    const { container, rerender } = render(<WorkspaceShell tabBar={false} header={false} footer={null} mobileHeader={false}>正文</WorkspaceShell>);
    expect(container.querySelector('[data-slot="workspace-surface"]')).not.toHaveClass('mt-0');
    expect(container.querySelector('[data-slot="workspace-shell-tabs"]')).toBeNull();
    expect(container.querySelector('[data-slot="workspace-shell-header"]')).toBeNull();
    expect(container.querySelector('[data-slot="workspace-mobile-header"]')).toBeNull();
    rerender(<WorkspaceShell tabBar={<span>标签区</span>} header={0}>正文</WorkspaceShell>);
    expect(container.querySelector('[data-slot="workspace-surface"]')).toHaveClass('mt-0');
    expect(container.querySelector('[data-slot="workspace-shell-header"]')).toHaveTextContent('0');
  });

  it('supports child-owned scrolling and mobile header composition', () => {
    const { container } = render(<WorkspaceShell scroll="none" mobileHeader={<button>打开导航</button>}><div>自带滚动的编辑器</div></WorkspaceShell>);
    const content = container.querySelector('[data-slot="workspace-content"]');
    expect(content).toHaveAttribute('data-scroll', 'none');
    expect(content).toHaveClass('flex', 'flex-col', 'overflow-hidden');
    expect(content).not.toHaveClass('overflow-auto');
    expect(container.querySelector('[data-slot="workspace-mobile-header"]')).toHaveClass('sm:hidden');
  });

  it('preserves mounted input state while folding and switching tabs', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const input = screen.getByRole('textbox', { name: '正文草稿' });
    await user.clear(input); await user.type(input, '修改后的内容');
    const footerInput = screen.getByRole('textbox', { name: '底部草稿' });
    await user.click(screen.getByRole('button', { name: '折叠工作区侧栏' }));
    await user.click(screen.getByRole('tab', { name: '项目' }));
    expect(screen.getByRole('tabpanel', { name: '项目' })).toContainElement(input);
    expect(input).toHaveValue('修改后的内容');
    expect(container.querySelector('[data-slot="workspace-footer"]')).toHaveAttribute('inert');
    await user.click(screen.getByRole('button', { name: '展开工作区侧栏' }));
    expect(screen.getByRole('textbox', { name: '底部草稿' })).toBe(footerInput);
    expect(screen.getByRole('textbox', { name: '正文草稿' })).toBe(input);
  });

  it('links host-owned tabpanels with stable DOM ids and keyboard selection', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const home = screen.getByRole('tab', { name: '概览' });
    expect(home).toHaveAttribute('id', 'test-tab-home');
    expect(home).toHaveAttribute('aria-controls', 'test-panel');
    home.focus(); await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '项目' })).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: '项目' })).toHaveAttribute('id', 'test-panel');
    await user.keyboard('{Home}');
    expect(home).toHaveAttribute('aria-selected', 'true');
  });
});

describe('opt-in workspace surfaces', () => {
  it('keeps standalone defaults bordered and isolates inset styling', () => {
    const props = { groups, collapsed: false, onCollapsedChange: () => undefined, footer: <span>账户</span> };
    const { container } = render(<>
      <WorkspaceSidebar {...props} title="默认" />
      <WorkspaceShell sidebar={<WorkspaceSidebar {...props} variant="inset" title="内嵌" />} />
      <WorkspaceTabBar tabs={tabs} activeTabId="home" onSelect={() => undefined} />
      <WorkspaceTabBar variant="inset" tabs={[]} activeTabId="" onSelect={() => undefined} />
    </>);
    const normal = screen.getByRole('complementary', { name: '默认侧栏' });
    const inset = screen.getByRole('complementary', { name: '内嵌侧栏' });
    expect(normal).toHaveClass('border-r', 'bg-background');
    expect(inset).not.toHaveClass('border-r', 'bg-background');
    expect(inset.querySelector('[data-slot="workspace-header"]')).not.toHaveClass('border-b');
    expect(inset.querySelector('[data-slot="workspace-footer"]')).not.toHaveClass('border-t');
    expect(normal).toHaveClass('[--workspace-sidebar-border:1px]');
    expect(inset).toHaveClass('[--workspace-sidebar-border:0px]');
    expect(container.querySelector('[data-slot="workspace-tab-bar"][data-variant="default"]')).toHaveClass('border-b');
    expect(container.querySelector('[data-slot="workspace-tab-bar"][data-variant="inset"]')).not.toHaveClass('border-b');
  });

  it('retains the opaque, bordered, expanded mobile drawer in inset mode', async () => {
    const close = vi.fn();
    const { container } = render(<WorkspaceSidebar variant="inset" groups={groups} collapsed onCollapsedChange={() => undefined} mobileOpen onMobileOpenChange={close} title="手机" footer={<span>账户</span>} />);
    const dialog = screen.getByRole('dialog', { name: '手机导航' });
    expect(dialog).toHaveClass('bg-background', 'border-r', 'shadow-xl');
    expect(dialog.querySelector('[data-slot="workspace-header"]')).toHaveClass('border-b');
    expect(dialog.querySelector('[data-slot="workspace-label"]')).toHaveClass('opacity-100');
    expect(container.querySelector('[data-slot="workspace-sidebar"]')).toHaveAttribute('data-collapsed', 'true');
    await userEvent.setup().click(within(dialog).getByRole('button', { name: '项目' }));
    expect(close).toHaveBeenCalledWith(false);
  });

  it('retains close, pin-boundary and keyboard-reorder callbacks in inset mode', async () => {
    const reorder = vi.fn(); const close = vi.fn(); const select = vi.fn();
    const items = [...tabs, { id: 'third', title: '第三页' }];
    render(<WorkspaceTabBar variant="inset" tabs={items} activeTabId="project" onSelect={select} onClose={close} onReorder={reorder} />);
    expect(screen.queryByRole('button', { name: '关闭 概览' })).toBeNull();
    const project = screen.getByRole('tab', { name: '项目' });
    fireEvent.keyDown(project, { key: 'ArrowLeft', altKey: true });
    expect(reorder).not.toHaveBeenCalled();
    fireEvent.keyDown(project, { key: 'ArrowRight', altKey: true });
    expect(reorder).toHaveBeenCalledExactlyOnceWith('project', 'third');
    await userEvent.setup().click(screen.getByRole('button', { name: '关闭 项目' }));
    expect(close).toHaveBeenCalledExactlyOnceWith('project');
  });
});
