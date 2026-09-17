import { Fragment, createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, DataTable, SearchInput } from '@asharca/ui';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SearchInput interaction boundaries', () => {
  it.each(['disabled', 'readOnly'] as const)('does not clear a %s input', async (state) => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput label="Projects" value="design" onChange={vi.fn()} onClear={onClear} disabled={state === 'disabled'} readOnly={state === 'readOnly'} />);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(clear).toBeDisabled();
    await user.click(clear);
    fireEvent.click(clear);
    expect(onClear).not.toHaveBeenCalled();
    expect(screen.getByRole('searchbox', { name: 'Projects' })).toHaveValue('design');
  });

  it('respects a disabled fieldset', async () => {
    const onClear = vi.fn();
    render(<fieldset disabled><SearchInput label="Projects" value="design" onChange={vi.fn()} onClear={onClear} /></fieldset>);
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).not.toHaveBeenCalled();
  });

  it('restores normal clearing and input focus after being enabled', async () => {
    const ref = createRef<HTMLInputElement>();
    const onClear = vi.fn();
    const { rerender } = render(<SearchInput ref={ref} label="Projects" value="design" onChange={vi.fn()} onClear={onClear} disabled />);
    rerender(<SearchInput ref={ref} label="Projects" value="design" onChange={vi.fn()} onClear={onClear} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(ref.current).toHaveFocus();
  });
});

describe('Button asChild interaction boundaries', () => {
  it.each(['disabled', 'loading'] as const)('blocks child and wrapper activation when %s', (state) => {
    const childAction = vi.fn();
    const wrapperAction = vi.fn();
    render(
      <Button asChild disabled={state === 'disabled'} loading={state === 'loading'} onClick={wrapperAction} onClickCapture={wrapperAction} onKeyDown={wrapperAction} onKeyUp={wrapperAction} onPointerDown={wrapperAction}>
        <a href="#settings" tabIndex={0} aria-disabled={false} onClick={childAction} onClickCapture={childAction} onAuxClick={childAction} onDoubleClick={childAction} onPointerDown={childAction} onPointerDownCapture={childAction} onKeyDown={childAction} onKeyDownCapture={childAction} onKeyUp={childAction}>
          Settings
        </a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    if (state === 'loading') expect(link).toHaveAttribute('aria-busy', 'true');
    expect(fireEvent.click(link)).toBe(false);
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }));
    fireEvent.doubleClick(link);
    fireEvent.pointerDown(link);
    for (const key of ['Enter', ' ']) {
      expect(fireEvent.keyDown(link, { key })).toBe(false);
      expect(fireEvent.keyUp(link, { key })).toBe(false);
    }
    expect(fireEvent.keyDown(link, { key: 'Tab' })).toBe(true);
    expect(childAction).not.toHaveBeenCalled();
    expect(wrapperAction).not.toHaveBeenCalled();
  });

  it('uses native disabled semantics for a slotted button', async () => {
    const action = vi.fn();
    render(<Button asChild disabled><button onClick={action}>Save</button></Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    await userEvent.setup().click(button);
    expect(action).not.toHaveBeenCalled();
  });

  it('keeps a disabled link out of sequential keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<><button>Before</button><Button asChild disabled><a href="#settings">Settings</a></Button><button>After</button></>);
    await user.click(screen.getByRole('button', { name: 'Before' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('preserves enabled child callbacks, refs and preventDefault', async () => {
    const childAction = vi.fn();
    const wrapperAction = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(<Button asChild ref={ref} onClick={wrapperAction}><button onClick={childAction}>Save</button></Button>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
    await userEvent.setup().click(ref.current!);
    expect(childAction).toHaveBeenCalledOnce();
    expect(wrapperAction).toHaveBeenCalledOnce();
    wrapperAction.mockClear();
    rerender(<Button asChild onClick={wrapperAction}><button onClick={(event) => event.preventDefault()}>Save</button></Button>);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Save' }));
    expect(wrapperAction).not.toHaveBeenCalled();
  });
});

describe('DataTable selection contracts', () => {
  const headers = [{ label: 'Project' }];

  it('keeps IDs stable after reordering and supports fragments', async () => {
    const onChange = vi.fn();
    const table = (ids: string[]) => (
      <DataTable headers={headers} selectable strictSelection rowIds={ids} rowLabels={ids} selectedRowIds={['a']} onSelectedRowIdsChange={onChange}>
        <tbody data-testid="body" aria-label="Project rows">
          {ids.map((id) => <Fragment key={id}><tr><td>{id}</td></tr></Fragment>)}
        </tbody>
      </DataTable>
    );
    const { rerender } = render(table(['a', 'b']));
    expect(screen.getByRole('checkbox', { name: '选择a' })).toBeChecked();
    rerender(table(['b', 'a']));
    expect(screen.getByRole('checkbox', { name: '选择a' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '选择b' })).not.toBeChecked();
    expect(screen.getByTestId('body')).toHaveAttribute('aria-label', 'Project rows');
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '选择b' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('selects only visible rows without discarding hidden selections', async () => {
    const onChange = vi.fn();
    const table = (selected: string[]) => (
      <DataTable headers={headers} selectable strictSelection rowIds={['b']} selectedRowIds={selected} onSelectedRowIdsChange={onChange}>
        <tr><td>b</td></tr>
      </DataTable>
    );
    const { rerender } = render(table(['a', 'other-page']));
    const user = userEvent.setup();
    await user.click(screen.getByRole('checkbox', { name: '全选行' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'other-page', 'b']);
    rerender(table(['a', 'other-page', 'b']));
    await user.click(screen.getByRole('checkbox', { name: '全选行' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'other-page']);
  });

  it.each([['duplicate', 'duplicate'], ['only-one'], ['', 'b']])('disables ambiguous IDs: %j', async (...ids: string[]) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onChange = vi.fn();
    render(<DataTable headers={headers} selectable rowIds={ids} onSelectedRowIdsChange={onChange}><tr><td>a</td></tr><tr><td>b</td></tr></DataTable>);
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeDisabled();
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '全选行' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables positional IDs in strict mode but preserves the legacy fallback', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onChange = vi.fn();
    const { rerender } = render(<DataTable headers={headers} selectable strictSelection onSelectedRowIdsChange={onChange}><tr><td>a</td></tr></DataTable>);
    expect(screen.getByRole('checkbox', { name: '选择第 1 行' })).toBeDisabled();
    rerender(<DataTable headers={headers} selectable onSelectedRowIdsChange={onChange}><tr><td>a</td></tr></DataTable>);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: '选择第 1 行' }));
    expect(onChange).toHaveBeenCalledWith(['0']);
  });

  it('disables select-all on an empty table or without a change handler', () => {
    const { rerender } = render(<DataTable headers={headers} selectable rowIds={[]} onSelectedRowIdsChange={vi.fn()}><tbody /></DataTable>);
    expect(screen.getByRole('checkbox', { name: '全选行' })).toBeDisabled();
    rerender(<DataTable headers={headers} selectable rowIds={['a']}><tr><td>a</td></tr></DataTable>);
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeDisabled();
  });

  it('does not stringify React elements into accessible names and permits translations', () => {
    const { rerender } = render(<DataTable headers={headers} selectable rowIds={['a']} rowLabels={[<strong key="label">A</strong>]} onSelectedRowIdsChange={vi.fn()}><tr><td>a</td></tr></DataTable>);
    expect(screen.getByRole('checkbox', { name: '选择第 1 行' })).toBeInTheDocument();
    rerender(<DataTable headers={headers} selectable rowIds={['a']} selectionLabels={{ selectAll: 'Select visible rows', selectRow: (id) => `Select ${id}` }} onSelectedRowIdsChange={vi.fn()}><tr><td>a</td></tr></DataTable>);
    expect(screen.getByRole('checkbox', { name: 'Select visible rows' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select a' })).toBeInTheDocument();
  });

  it('does not guess the structure of custom row components', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    function CustomRow() { return <tr><td>a</td></tr>; }
    render(<DataTable headers={headers} selectable rowIds={['a']} onSelectedRowIdsChange={vi.fn()}><CustomRow /></DataTable>);
    expect(screen.getByRole('checkbox', { name: '全选行' })).toBeDisabled();
  });
});
