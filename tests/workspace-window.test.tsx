import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceTabBar } from '../registry/ui/workspace-tab-bar';
import { openWorkspaceWindow } from '../registry/ui/workspace-shell';

const tabs = [{ id: 'home', title: '概览', pinned: true }, { id: 'doc', title: '文档' }];
const middleClick = (element: HTMLElement) => fireEvent(element, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }));
afterEach(() => vi.restoreAllMocks());

describe('workspace window transport', () => {
  it('opens synchronously, removes opener and prepares only the new window before navigation', () => {
    const replace = vi.fn();
    const popup = { opener: window, location: { replace }, close: vi.fn() } as unknown as Window;
    const open = vi.spyOn(window, 'open').mockReturnValue(popup);
    const prepare = vi.fn((child: Window) => { expect(child.opener).toBeNull(); expect(replace).not.toHaveBeenCalled(); });
    const target = new URL('/workspace?tab=doc', window.location.href);
    expect(openWorkspaceWindow(target, prepare)).toBe(popup);
    expect(open).toHaveBeenCalledExactlyOnceWith('about:blank', '_blank', 'popup,width=1100,height=760');
    expect(prepare).toHaveBeenCalledExactlyOnceWith(popup);
    expect(replace).toHaveBeenCalledExactlyOnceWith(target.href);
  });
  it('returns null when blocked, without preparing state or claiming success', () => {
    vi.spyOn(window, 'open').mockReturnValue(null);
    const prepare = vi.fn();
    expect(openWorkspaceWindow('/workspace', prepare)).toBeNull();
    expect(prepare).not.toHaveBeenCalled();
  });
  it('rejects external, script and credential-bearing URLs before opening', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    for (const href of ['javascript:alert(1)', 'data:text/html,test', 'https://other.example/workspace', 'https://user:pass@other.example/']) {
      expect(() => openWorkspaceWindow(href)).toThrow('同源');
    }
    expect(open).not.toHaveBeenCalled();
  });
  it('closes the blank window when preparation or navigation fails', () => {
    const close = vi.fn(); const replace = vi.fn();
    const popup = { opener: window, location: { replace }, close } as unknown as Window;
    vi.spyOn(window, 'open').mockReturnValue(popup);
    expect(() => openWorkspaceWindow('/workspace', () => { throw new Error('storage denied'); })).toThrow('storage denied');
    expect(close).toHaveBeenCalledOnce(); expect(replace).not.toHaveBeenCalled();
    replace.mockImplementation(() => { throw new Error('navigation failed'); });
    expect(() => openWorkspaceWindow('/workspace')).toThrow('navigation failed');
    expect(close).toHaveBeenCalledTimes(2);
  });
});

describe('workspace tab actions', () => {
  it('shows the menu even when detaching is the only supplied action', async () => {
    const detach = vi.fn(); const user = userEvent.setup();
    render(<WorkspaceTabBar tabs={tabs} activeTabId="home" onSelect={() => undefined} onOpenInNewWindow={detach} />);
    await user.click(screen.getByRole('button', { name: '文档操作' }));
    await user.click(screen.getByRole('menuitem', { name: '在独立窗口打开' }));
    expect(detach).toHaveBeenCalledExactlyOnceWith('doc');
  });
  it('right-click targets the clicked inactive tab, without selecting a different page', async () => {
    const select = vi.fn(); const detach = vi.fn();
    render(<WorkspaceTabBar tabs={tabs} activeTabId="home" onSelect={select} onOpenInNewWindow={detach} />);
    fireEvent.contextMenu(screen.getByRole('tab', { name: '文档' }));
    await userEvent.setup().click(await screen.findByRole('menuitem', { name: '在独立窗口打开' }));
    expect(detach).toHaveBeenCalledExactlyOnceWith('doc'); expect(select).not.toHaveBeenCalled();
  });
  it('supports keyboard context menus and restores focus to the tab', async () => {
    const user = userEvent.setup();
    render(<WorkspaceTabBar tabs={tabs} activeTabId="home" onSelect={() => undefined} onOpenInNewWindow={() => undefined} />);
    const tab = screen.getByRole('tab', { name: '文档' }); tab.focus();
    await user.keyboard('{Shift>}{F10}{/Shift}');
    expect(await screen.findByRole('menuitem', { name: '在独立窗口打开' })).toBeVisible();
    await user.keyboard('{Escape}'); await waitFor(() => expect(tab).toHaveFocus());
  });
  it('respects detachable, pinned, closable and last-tab constraints', async () => {
    const user = userEvent.setup(); const detach = vi.fn(); const close = vi.fn();
    const { rerender } = render(<WorkspaceTabBar tabs={[{ ...tabs[0], detachable: false }]} activeTabId="home" onSelect={() => undefined} onOpenInNewWindow={detach} onClose={close} />);
    await user.click(screen.getByRole('button', { name: '概览操作' }));
    expect(screen.getByRole('menuitem', { name: '在独立窗口打开' })).toHaveAttribute('data-disabled');
    expect(screen.getByRole('menuitem', { name: '关闭标签' })).toHaveAttribute('data-disabled');
    await user.keyboard('{Escape}');
    fireEvent.keyDown(screen.getByRole('tab'), { key: 'Delete' });
    expect(close).not.toHaveBeenCalled();
    rerender(<WorkspaceTabBar tabs={[tabs[0], { ...tabs[1], closable: false }]} activeTabId="doc" onSelect={() => undefined} onClose={close} />);
    middleClick(screen.getByRole('tab', { name: '文档' }));
    expect(close).not.toHaveBeenCalled();
  });
  it('provides the new-tab action and optional middle/double-click closing', async () => {
    const close = vi.fn(); const add = vi.fn();
    const { rerender } = render(<WorkspaceTabBar tabs={tabs} activeTabId="doc" onSelect={() => undefined} onClose={close} onNewTab={add} />);
    await userEvent.setup().click(screen.getByRole('button', { name: '新建标签' })); expect(add).toHaveBeenCalledOnce();
    middleClick(screen.getByRole('tab', { name: '文档' })); expect(close).toHaveBeenCalledExactlyOnceWith('doc');
    fireEvent.doubleClick(screen.getByRole('tab', { name: '文档' })); expect(close).toHaveBeenCalledOnce();
    rerender(<WorkspaceTabBar tabs={tabs} activeTabId="doc" onSelect={() => undefined} onClose={close} closeOnMiddleClick={false} closeOnDoubleClick />);
    middleClick(screen.getByRole('tab', { name: '文档' })); expect(close).toHaveBeenCalledOnce();
    fireEvent.doubleClick(screen.getByRole('tab', { name: '文档' })); expect(close).toHaveBeenCalledTimes(2);
  });
});
