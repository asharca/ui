import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ConversationSidebar } from '../../src/ConversationSidebar';

afterEach(cleanup);
it('reorders before and after targets and ignores external, disabled and cross-group drags', () => {
  const change = vi.fn();
  const select = vi.fn();
  const { container } = render(<ConversationSidebar activeConversationId="a" onSelectConversation={select} onConversationOrderChange={change} groups={[
    { id: 'g', name: 'Assistant', conversations: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }, { id: 'locked', title: 'Locked', disabled: true }] },
    { id: 'other', name: 'Other', conversations: [{ id: 'd', title: 'D' }] },
  ]} />);
  const row = (id: string) => container.querySelector(`[data-conversation-id="${id}"]`)!;
  const transfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' };
  const dragAt = (type: string, clientY: number) => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientY });
    Object.defineProperty(event, 'dataTransfer', { value: transfer });
    fireEvent(row('c'), event);
  };
  vi.spyOn(row('c'), 'getBoundingClientRect').mockReturnValue({ top: 100, height: 40 } as DOMRect);
  fireEvent.dragStart(row('a'), { dataTransfer: transfer });
  dragAt('dragover', 105);
  expect(row('c')).toHaveAttribute('data-drop-edge', 'before');
  dragAt('drop', 105);
  expect(change).toHaveBeenLastCalledWith('g', ['b', 'a', 'c', 'locked']);
  fireEvent.dragStart(row('a'), { dataTransfer: transfer });
  dragAt('drop', 135);
  expect(change).toHaveBeenLastCalledWith('g', ['b', 'c', 'a', 'locked']);
  change.mockClear();
  fireEvent.drop(row('c'), { dataTransfer: transfer });
  fireEvent.dragStart(row('a'), { dataTransfer: transfer });
  fireEvent.drop(row('d'), { dataTransfer: transfer });
  fireEvent.dragStart(row('locked'), { dataTransfer: transfer });
  fireEvent.drop(row('b'), { dataTransfer: transfer });
  expect(change).not.toHaveBeenCalled();
  expect(select).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'A', exact: true })).toHaveAttribute('aria-current', 'page');
  fireEvent.keyDown(screen.getByRole('button', { name: 'A', exact: true }), { altKey: true, key: 'ArrowDown' });
  expect(change).toHaveBeenLastCalledWith('g', ['b', 'a', 'c', 'locked']);
  expect(screen.queryByRole('button', { name: 'Move up: A' })).not.toBeInTheDocument();
});
