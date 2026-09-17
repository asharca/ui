import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChatComposerToolbar, CopyButton, ToolCallCard, WorkspaceTabBar, previewToolValue, zhCN, type ToolCallState, type WorkspaceTab } from '../../src/index';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe('ToolPlane-inspired tool cards', () => {
  it.each<ToolCallState>(['pending', 'running', 'awaiting-approval', 'completed', 'failed', 'rejected', 'cancelled'])('exposes the %s state without conflating it with completion', (state) => {
    const { container } = render(<ToolCallCard name="search" state={state} labels={zhCN.toolCall} />);
    expect(container.querySelector('details')).toHaveAttribute('data-state', state);
    expect(container.querySelector('.ui-tool-call__state')).not.toBeEmptyDOMElement();
  });
  it('does not serialize collapsed results and limits expanded previews', async () => {
    const getter = vi.fn(() => 'must not execute'); const result = { payload: 'x'.repeat(20000) };
    Object.defineProperty(result, 'secret', { enumerable: true, get: getter });
    const { container } = render(<ToolCallCard name="search" state="completed" output={result} previewChars={256} />);
    expect(container.querySelector('pre')).toBeNull(); expect(getter).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByText('search', { selector: 'strong' }));
    await waitFor(() => expect(container.querySelector('pre')).not.toBeNull());
    expect(container.querySelector('pre')!.textContent!.length).toBeLessThan(350);
    expect(getter).not.toHaveBeenCalled();
  });
  it('bounds deep, cyclic and large collections without throwing', () => {
    const cyclic: { self?: unknown; list: unknown[] } = { list: Array.from({ length: 500 }, (_, id) => ({ id })) }; cyclic.self = cyclic;
    const text = previewToolValue(cyclic, 1000);
    expect(text.length).toBeLessThan(1100); expect(text).not.toContain('"id": 499');
    expect(previewToolValue(1n)).toContain('1');
    expect(previewToolValue({ get dangerous() { throw new Error('getter'); } })).toContain('[accessor]');
  });
  it('prevents duplicate approval submissions and allows retry after rejection', async () => {
    let reject: (reason?: unknown) => void = () => {};
    const approval = vi.fn(() => new Promise<void>((_, no) => { reject = no; }));
    const user = userEvent.setup(); render(<ToolCallCard name="shell" state="awaiting-approval" onApprove={approval} />);
    const allow = screen.getByRole('button', { name: 'Allow', exact: true });
    await user.click(allow); await user.click(allow);
    expect(approval).toHaveBeenCalledTimes(1); expect(approval).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Reject', exact: true })).toBeDisabled();
    await act(async () => reject(new Error('offline')));
    expect(await screen.findByRole('alert')).toHaveTextContent('Approval could not be submitted');
    expect(allow).toBeEnabled(); await user.click(screen.getByRole('button', { name: 'Reject', exact: true }));
    expect(approval).toHaveBeenLastCalledWith(false);
  });
  it('does not enable approval without a host callback', () => {
    render(<ToolCallCard name="shell" state="awaiting-approval" />);
    expect(screen.getByRole('button', { name: 'Allow', exact: true })).toBeDisabled();
  });
});
describe('composer tool execution', () => {
  it('shows groups and excludes non-pinable tools from customization', async () => {
    const user = userEvent.setup(); render(<ChatComposerToolbar tools={[{ id: 'a', label: 'Search', icon: '+', group: 'MCP', onSelect() {} }, { id: 'b', label: 'Settings', icon: '+', pinable: false, onSelect() {} }]} pinnedIds={['b']} onPinnedIdsChange={vi.fn()} />);
    expect(document.querySelector('[data-composer-shortcut="b"]')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open tools' }));
    expect(screen.getByText('MCP')).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Customize toolbar' }));
    expect(screen.getByRole('checkbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Settings' })).not.toBeInTheDocument();
  });
  it('catches asynchronous tool failures and prevents repeated execution', async () => {
    let reject: (reason?: unknown) => void = () => {};
    const action = vi.fn(() => new Promise<void>((_, no) => { reject = no; })); const onError = vi.fn(); const user = userEvent.setup();
    render(<ChatComposerToolbar tools={[{ id: 'search', label: 'Search', icon: '+', onSelect: action }]} pinnedIds={['search']} onPinnedIdsChange={vi.fn()} onActionError={onError} />);
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button); await user.click(button); expect(action).toHaveBeenCalledTimes(1); expect(button).toBeDisabled();
    await act(async () => reject(new Error('offline')));
    expect(await screen.findByRole('alert')).toHaveTextContent('tool action failed'); expect(button).toBeEnabled(); expect(onError).toHaveBeenCalledTimes(1);
  });
});
describe('workspace keyboard controls', () => {
  const icon = () => <span />;
  it('navigates, reorders and protects non-closable tabs', async () => {
    const user = userEvent.setup(); const onReorder = vi.fn(); const onClose = vi.fn();
    function Harness() { const [active, setActive] = useState('a'); const tabs: WorkspaceTab[] = [{ id: 'a', label: 'Alpha', icon, pinned: false, closable: false }, { id: 'b', label: 'Beta', icon, pinned: false }];
      return <WorkspaceTabBar tabs={tabs} activeTabId={active} onSelect={setActive} onClose={onClose} onReorder={onReorder} onNewTab={vi.fn()} onOpenInNewWindow={vi.fn()} onTogglePinned={vi.fn()} closeOnDoubleClick={false} />;
    }
    render(<Harness />); screen.getByRole('button', { name: 'Alpha', exact: true }).focus();
    await user.keyboard('{ArrowRight}'); expect(screen.getByRole('button', { name: 'Beta', exact: true })).toHaveFocus();
    await user.keyboard('{Alt>}{Shift>}{ArrowLeft}{/Shift}{/Alt}'); expect(onReorder).toHaveBeenCalledWith('b', 'a');
    await user.keyboard('{Home}{Delete}'); expect(onClose).not.toHaveBeenCalled();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Beta', exact: true })); expect(onClose).not.toHaveBeenCalled();
  });
});
describe('clipboard fallback', () => {
  it('reports failure without leaking a temporary textarea or losing focus', async () => {
    const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard'); const exec = Object.getOwnPropertyDescriptor(document, 'execCommand');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => { throw new Error('blocked'); } });
    try {
      render(<CopyButton text="example" />); const button = screen.getByRole('button', { name: 'Copy', exact: true }); button.focus(); fireEvent.click(button);
      expect(await screen.findByText('Copy failed')).toBeInTheDocument(); expect(button).toHaveFocus(); expect(document.querySelector('textarea')).toBeNull();
    } finally {
      if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard); else Reflect.deleteProperty(navigator, 'clipboard');
      if (exec) Object.defineProperty(document, 'execCommand', exec); else Reflect.deleteProperty(document, 'execCommand');
    }
  });
});
