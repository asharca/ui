import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../registry/ui/agent-prompt-input';
import { CodeBlock } from '../registry/ui/agent-code-block';
import { FileDiff } from '../registry/ui/agent-file-diff';
import { ToolResult } from '../registry/ui/agent-tool-result';
import { StreamingResponse } from '../registry/ui/agent-streaming-response';
import { ApprovalCard } from '../registry/ui/agent-approval-card';
import { ToolApproval } from '../registry/ui/agent-tool-approval';
import { CitationList } from '../registry/ui/agent-citations';
import { safeAgentHref } from '../registry/ui/agent-internal-safety';
import { AgentActivity } from '../registry/ui/agent-activity';
import { AgentProgress } from '../registry/ui/agent-loading-states';
import { AISidebar, AnimatedSidebarProvider } from '../registry/ui/agent-sidebar';

vi.mock('shiki', () => ({ createHighlighter: async () => ({ codeToTokensWithThemes: (code: string) => code.split('\n').map((content) => [{ content, offset: 0, variants: { light: { color: '#111' }, dark: { color: '#eee' } } }]) }) }));
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('Agent prompt submission contracts', () => {
  it('rejecting an async submit preserves the draft and displays failure', async () => {
    const user = userEvent.setup(); const send = vi.fn().mockRejectedValue(new Error('服务暂不可用'));
    render(<PromptInput defaultValue="保留草稿" onSubmit={send} />);
    await user.click(screen.getByRole('button', { name: 'Send prompt' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('服务暂不可用');
    expect(screen.getByRole('textbox')).toHaveValue('保留草稿');
    expect(send).toHaveBeenCalledTimes(1);
  });
  it('successful async submission clears only the submitted uncontrolled draft', async () => {
    const user = userEvent.setup(); const send = vi.fn().mockResolvedValue(undefined);
    render(<PromptInput defaultValue="  开始检查  " onSubmit={send} models={[{ value: 'local', label: '本地模型' }]} />);
    await user.click(screen.getByRole('button', { name: 'Send prompt' }));
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
    expect(send).toHaveBeenCalledWith('开始检查', 'local');
  });
  it('blocks concurrent submits until the host resolves', async () => {
    let done!: () => void;
    const send = vi.fn(() => new Promise<void>((resolve) => { done = resolve; }));
    render(<PromptInput defaultValue="test" onSubmit={send} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' }); fireEvent.keyDown(input, { key: 'Enter' });
    expect(send).toHaveBeenCalledTimes(1); expect(input).toBeDisabled();
    await act(async () => { done(); });
    expect(input).toBeEnabled();
  });
  it('does not submit IME composition or readonly content', () => {
    const send = vi.fn(); const { rerender } = render(<PromptInput defaultValue="中文" onSubmit={send} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', isComposing: true });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', keyCode: 229 });
    expect(send).not.toHaveBeenCalled();
    rerender(<PromptInput defaultValue="中文" readOnly onSubmit={send} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(send).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Send prompt' })).toBeDisabled();
  });
  it('controlled text remains owned by the caller', async () => {
    const user = userEvent.setup(); const send = vi.fn().mockResolvedValue(undefined);
    render(<PromptInput value="受控输入" onValueChange={() => undefined} onSubmit={send} />);
    await user.click(screen.getByRole('button', { name: 'Send prompt' }));
    expect(screen.getByRole('textbox')).toHaveValue('受控输入');
  });
});

describe('Agent copy failure is never false success', () => {
  it.each(['code', 'diff', 'tool', 'response'])('%s keeps readable content on failure', async (kind) => {
    const user = userEvent.setup(); const failed = vi.fn().mockRejectedValue(new Error('Denied'));
    const renderers = {
      code: <CodeBlock code="const x = 1;" onCopy={failed} />,
      diff: <FileDiff file="test.ts" status="complete" lines={[{ id: '1', type: 'added', content: 'const x = 1;' }]} copyText="test" onCopy={failed} />,
      tool: <ToolResult tool="test" title="读取结果" status="success" defaultOpen copyText="result" onCopy={failed}>result</ToolResult>,
      response: <StreamingResponse status="complete" copyText="回复" onCopy={failed}>回复</StreamingResponse>,
    };
    render(renderers[kind as keyof typeof renderers]);
    await user.click(screen.getByRole('button', { name: /^Copy / }));
    expect(await screen.findByRole('alert')).toHaveTextContent('复制失败');
    expect(screen.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument();
  });
});

describe('Approval and activity stay host-controlled', () => {
  it('does not approve an action merely by rendering a card', async () => {
    const user = userEvent.setup(); const approve = vi.fn();
    const { container, rerender } = render(<ApprovalCard title="计划确认" onApprove={approve} />);
    expect(approve).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(approve).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-state="pending"]')).toBeInTheDocument();
    rerender(<ApprovalCard title="计划确认" status="submitting" onApprove={approve} />);
    expect(screen.getByRole('button', { name: /Approve/ })).toBeDisabled();
  });
  it('tool approval keeps the requested permission choices separate', async () => {
    const user = userEvent.setup(); const approve = vi.fn(); const deny = vi.fn(); const always = vi.fn();
    render(<ToolApproval tool="read" onApprove={approve} onDeny={deny} onAlwaysAllow={always} />);
    await user.click(screen.getByRole('button', { name: 'Deny' }));
    expect(deny).toHaveBeenCalledTimes(1); expect(approve).not.toHaveBeenCalled(); expect(always).not.toHaveBeenCalled();
  });
  it('activity supports all five event types and collapsed content becomes inert', async () => {
    const user = userEvent.setup();
    render(<AgentActivity status="complete" defaultOpen summary="执行记录" items={[
      { id: 's', type: 'step', label: '检查', status: 'complete' }, { id: 't', type: 'text', content: '说明文本' },
      { id: 'q', type: 'search', query: '查询词', results: [] }, { id: 'r', type: 'tool', action: 'read', target: 'file.ts' },
      { id: 'x', type: 'trace', kind: 'run', label: '执行测试' },
    ]} />);
    expect(screen.getByText('说明文本')).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: /执行记录/ });
    await user.click(trigger); expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Citation and resource boundaries', () => {
  it.each(['javascript:alert(1)', 'data:text/html,script', 'file:///tmp/private', 'vbscript:msgbox(1)'])('rejects unsafe citation URL %s', (url) => {
    expect(safeAgentHref(url)).toBeUndefined();
    const { container } = render(<CitationList citations={[{ id: 'a', title: '引用', url }]} />);
    expect(container.querySelector('a[href]')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });
  it('uses distinct IDs for distinct citation keys and does not request favicons', () => {
    const { container } = render(<CitationList idPrefix="refs" citations={[{ id: 'a/b', title: '第一条', url: 'https://example.com/one' }, { id: 'a-b', title: '第二条', url: 'https://example.com/two' }]} />);
    const links = screen.getAllByRole('link');
    expect(links[0].id).not.toBe(links[1].id); expect(container.querySelector('img')).toBeNull();
  });
  it('resource selection waits for the host to change a controlled active ID', async () => {
    const user = userEvent.setup(); const selected = vi.fn();
    const view = (activeId: string) => <AnimatedSidebarProvider><AISidebar activeId={activeId} onActiveChange={selected} items={[{ id: 'a', kind: 'file', label: '第一条资源' }, { id: 'b', kind: 'file', label: '第二条资源' }]} /></AnimatedSidebarProvider>;
    const { rerender } = render(view('a'));
    await user.click(screen.getByText('第二条资源'));
    expect(selected).toHaveBeenCalledWith('b');
    rerender(view('b'));
    expect(screen.getByText('第二条资源')).toBeVisible();
  });
  it('progress keeps its elapsed time after pausing and resuming', async () => {
    vi.useFakeTimers(); const { rerender, container } = render(<AgentProgress initialSeconds={5} running />);
    await act(async () => { vi.advanceTimersByTime(500); });
    const before = within(container).getByRole('status').textContent;
    rerender(<AgentProgress initialSeconds={5} running={false} />);
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(within(container).getByRole('status').textContent).toBe(before);
    rerender(<AgentProgress initialSeconds={5} running />);
    await act(async () => { vi.advanceTimersByTime(100); });
    expect(container.textContent).toContain('5.6s');
  });
});
