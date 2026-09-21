import { createRef, useState } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from '../registry/ui/textarea';
import { ChoiceField, ChoiceGroup } from '../registry/ui/choice-field';
import { Slider } from '../registry/ui/slider';
import { SearchInput } from '../registry/ui/search-input';
import { SubmitButton } from '../registry/ui/submit-button';
import { ConfirmSubmitButton } from '../registry/ui/confirm-submit-button';
import { CopyButton } from '../registry/ui/copy-button';
import { Progress } from '../registry/ui/progress';
import { Alert } from '../registry/ui/alert';
import { DataTable, type ColumnDef } from '../registry/ui/data-table';
import { Pagination } from '../registry/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '../registry/ui/dropdown-menu';
import { WorkspaceTabBar } from '../registry/ui/workspace-tab-bar';
import { ConversationSidebar } from '../registry/ui/conversation-sidebar';
import { ToolCallCard, toolPreview } from '../registry/ui/tool-call-card';
import { ChatComposerToolbar } from '../registry/ui/chat-composer-toolbar';
import { ChatThread } from '../registry/ui/chat-thread';
import { SafeStreamdown } from '../registry/ui/safe-streamdown';
import { Avatar, AvatarFallback } from '../registry/ui/avatar';
import { RotatingHeadline } from '../registry/ui/rotating-headline';

const user = () => userEvent.setup();

describe('restored form controls', () => {
  it('textarea forwards its ref and links label, help and error', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="说明" description="请填写项目说明" error="不能为空" />);
    expect(ref.current).toBe(screen.getByLabelText('说明'));
    expect(ref.current).toHaveAccessibleDescription('请填写项目说明 不能为空');
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
  });
  it('card choices preserve native form values and fieldset disabled semantics', async () => {
    render(<form aria-label="选项"><ChoiceGroup label="方案"><ChoiceField type="radio" name="plan" value="a" label="基础方案" variant="card" defaultChecked /><ChoiceField type="radio" name="plan" value="b" label="团队方案" variant="card" /></ChoiceGroup><ChoiceGroup label="锁定" disabled><ChoiceField label="不可更改" /></ChoiceGroup></form>);
    await user().click(screen.getByLabelText('团队方案'));
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('plan')).toBe('b');
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
  it('slider resets its visible value along with its native input', async () => {
    render(<form><Slider label="缩放" defaultValue={60} formatValue={(value) => `${value}%`} /><button type="reset">重置</button></form>);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '80%');
    await user().click(screen.getByText('重置'));
    expect(screen.getByRole('slider')).toHaveValue('60');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '60%');
  });
  it('search clear restores focus and cannot clear a read-only input', async () => {
    const clear = vi.fn();
    const { rerender } = render(<SearchInput label="文件" value="abc" onChange={() => undefined} onClear={clear} />);
    await user().click(screen.getByRole('button', { name: '清空文件' }));
    expect(clear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('searchbox')).toHaveFocus();
    rerender(<SearchInput label="文件" value="abc" readOnly onClear={clear} />);
    await user().click(screen.getByRole('button', { name: '清空文件' }));
    expect(clear).toHaveBeenCalledTimes(1);
  });
  it('submit buttons do not show success while pending or failed', () => {
    const { rerender } = render(<SubmitButton pending saved />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('保存中');
    rerender(<SubmitButton pending={false} saved error />);
    expect(screen.getByRole('button')).toHaveTextContent('保存');
    expect(screen.getByRole('button')).not.toHaveTextContent('已保存');
  });
  it('confirmation failures retain the dialog and can be retried', async () => {
    const confirm = vi.fn().mockRejectedValueOnce(new Error('请重试')).mockResolvedValue(undefined);
    render(<ConfirmSubmitButton title="移除项目" prompt="这是测试" onConfirm={confirm} />);
    await user().click(screen.getByRole('button', { name: /^删除$/ }));
    await user().click(screen.getByRole('button', { name: '确认删除' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('请重试');
    await user().click(screen.getByRole('button', { name: '确认删除' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(confirm).toHaveBeenCalledTimes(2);
  });
  it('copy failures are reported, never marked as copied', async () => {
    const interaction = user();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Denied'));
    const callback = vi.fn();
    render(<CopyButton text="sample" onCopyResult={callback} />);
    await interaction.click(screen.getByRole('button', { name: '复制' }));
    expect(await screen.findByRole('status')).toHaveTextContent('复制失败');
    expect(callback).toHaveBeenCalledWith(false);
  });
  it('progress clamps finite values and omits aria-valuenow for indeterminate progress', () => {
    const { rerender } = render(<Progress label="进度" value={200} max={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    rerender(<Progress label="进度" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
  it('semantic alerts announce errors distinctly from normal status', () => {
    render(<><Alert title="失败" tone="danger">请重试</Alert><Alert title="已完成" tone="success" /></>);
    expect(screen.getByRole('alert')).toHaveTextContent('失败');
    expect(screen.getByRole('status')).toHaveTextContent('已完成');
  });
});

type Row = { id: string; name: string; count: number };
const rows: Row[] = [{ id: 'a', name: 'Alpha', count: 3 }, { id: 'b', name: 'Beta', count: 1 }, { id: 'c', name: 'Gamma', count: 2 }];
const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: '名称' }, { accessorKey: 'count', header: '数量' }];

describe('table and navigation behavior', () => {
  it('table selections survive filtering, page changes and sorting by stable IDs', async () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} label="项目" pageSize={2} />);
    await user().click(screen.getByRole('checkbox', { name: '选择行 a' }));
    await user().click(screen.getByRole('button', { name: '下一页' }));
    await user().click(screen.getByRole('checkbox', { name: '选择行 c' }));
    expect(screen.getByText('已选 2 项')).toBeVisible();
    await user().type(screen.getByRole('searchbox', { name: '搜索项目' }), 'Alpha');
    expect(screen.getByRole('checkbox', { name: '选择行 a' })).toBeChecked();
    expect(screen.getByText('已选 2 项')).toBeVisible();
    await user().click(screen.getByRole('button', { name: '清空搜索项目' }));
    await user().click(screen.getByRole('button', { name: '数量' }));
    expect(screen.getByRole('checkbox', { name: '选择行 c' })).toBeChecked();
    await user().click(screen.getByRole('button', { name: '清空选择' }));
    expect(screen.getByRole('checkbox', { name: '选择行 c' })).not.toBeChecked();
  });
  it('select-all affects only the current page and exposes partial selection', async () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} label="项目" pageSize={2} />);
    await user().click(screen.getByRole('checkbox', { name: '选择行 a' }));
    expect((screen.getByRole('checkbox', { name: '选择本页全部' }) as HTMLInputElement).indeterminate).toBe(true);
    await user().click(screen.getByRole('checkbox', { name: '选择本页全部' }));
    expect(screen.getByText('已选 2 项')).toBeVisible();
    await user().click(screen.getByRole('button', { name: '下一页' }));
    expect(screen.getByRole('checkbox', { name: '选择行 c' })).not.toBeChecked();
  });
  it('table rejects unstable duplicate identifiers', () => {
    expect(() => render(<DataTable data={rows} columns={columns} getRowId={() => 'same'} label="项目" />)).toThrow('unique row IDs');
  });
  it('pagination never advances an empty dataset', async () => {
    const change = vi.fn(); render(<Pagination page={1} pageCount={0} onPageChange={change} />);
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
    await user().click(screen.getByRole('button', { name: '下一页' }));
    expect(change).not.toHaveBeenCalled();
  });
  it('dropdown checkbox options preserve checked state', async () => {
    function Menu() { const [checked, setChecked] = useState(false); return <DropdownMenu><DropdownMenuTrigger>菜单</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuCheckboxItem checked={checked} onCheckedChange={(next) => setChecked(next === true)}>显示详情</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>; }
    render(<Menu />);
    await user().click(screen.getByRole('button', { name: '菜单' }));
    await user().click(screen.getByRole('menuitemcheckbox', { name: '显示详情' }));
    await user().click(screen.getByRole('button', { name: '菜单' }));
    expect(screen.getByRole('menuitemcheckbox', { name: '显示详情' })).toHaveAttribute('aria-checked', 'true');
  });
  it('workspace tabs expose keyboard reordering without closing pinned tabs', () => {
    const reorder = vi.fn(); const close = vi.fn();
    render(<WorkspaceTabBar tabs={[{ id: 'p', title: '固定', pinned: true }, { id: 'a', title: '页面 A' }, { id: 'b', title: '页面 B' }]} activeTabId="a" onSelect={() => undefined} onReorder={reorder} onClose={close} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: '页面 A' }), { key: 'ArrowRight', altKey: true });
    expect(reorder).toHaveBeenCalledWith('a', 'b');
    expect(screen.queryByRole('button', { name: '关闭 固定' })).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('tab', { name: '页面 A' }), { key: 'ArrowLeft', altKey: true });
    expect(reorder).toHaveBeenCalledTimes(1);
  });
  it('workspace prevents closing the last remaining tab', () => {
    render(<WorkspaceTabBar tabs={[{ id: 'only', title: '唯一页面' }]} activeTabId="only" onSelect={() => undefined} onClose={() => undefined} />);
    expect(screen.getByRole('button', { name: '关闭 唯一页面' })).toBeDisabled();
  });
  it('conversation ordering preserves entries hidden by search', async () => {
    const change = vi.fn();
    render(<ConversationSidebar groups={[{ id: 'g', label: '今天', conversations: [{ id: 'a', title: '匹配 A' }, { id: 'hidden', title: '其他内容' }, { id: 'b', title: '匹配 B' }] }]} onSelect={() => undefined} onConversationOrderChange={change} />);
    await user().type(screen.getByRole('searchbox', { name: '搜索会话' }), '匹配');
    fireEvent.keyDown(screen.getByRole('button', { name: /^匹配 B$/ }), { key: 'ArrowUp', altKey: true });
    expect(change).toHaveBeenCalledWith('g', ['b', 'a', 'hidden']);
  });
});

describe('restored AI and display components', () => {
  it('safe Markdown ignores HTML and unsafe link protocols', () => {
    const { container } = render(<SafeStreamdown>{'<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))\n\n![tracking](https://example.test/pixel.png)'}</SafeStreamdown>);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container).toHaveTextContent('图片：tracking');
  });
  it('tool cards do not traverse result data before expansion', async () => {
    const ownKeys = vi.fn(() => ['answer']);
    const output = new Proxy({ answer: 'ok' }, { ownKeys });
    render(<ToolCallCard title="读取结果" state="completed" output={output} />);
    expect(ownKeys).not.toHaveBeenCalled();
    await user().click(screen.getByText('读取结果'));
    await waitFor(() => expect(ownKeys).toHaveBeenCalled());
  });
  it('tool previews handle cycles, long output and getters without evaluating accessors', () => {
    const getter = vi.fn(); const value: Record<string, unknown> = { text: 'x'.repeat(20000) }; value.self = value;
    Object.defineProperty(value, 'sensitive', { enumerable: true, get: getter });
    expect(toolPreview(value, 1000).length).toBeLessThan(1400);
    expect(toolPreview({ self: value }, 30000)).toContain('循环引用');
    expect(getter).not.toHaveBeenCalled();
  });
  it('composer tools prevent repeated asynchronous execution and retain failures', async () => {
    let reject!: (cause: Error) => void;
    const select = vi.fn(() => new Promise<void>((_, fail) => { reject = fail; }));
    render(<ChatComposerToolbar tools={[{ id: 'x', label: '检索', onSelect: select }]} pinnedIds={['x']} onPinnedIdsChange={() => undefined} />);
    const button = screen.getByRole('button', { name: /^检索$/ });
    fireEvent.click(button); fireEvent.click(button);
    expect(select).toHaveBeenCalledTimes(1);
    await act(async () => { reject(new Error('连接失败')); });
    expect(screen.getByRole('alert')).toHaveTextContent('连接失败');
    expect(button).toBeEnabled();
  });
  it('chat edits preserve the draft when the host rejects an edit', async () => {
    const edit = vi.fn().mockRejectedValue(new Error('保存失败'));
    render(<ChatThread messages={[{ id: 'u', role: 'user', content: '原始内容' }]} onSend={() => undefined} onEdit={edit} />);
    await user().click(screen.getByRole('button', { name: /^编辑$/ }));
    const draft = screen.getByRole('textbox', { name: '编辑消息' });
    await user().clear(draft); await user().type(draft, '新的内容');
    await user().click(screen.getByRole('button', { name: '保存编辑' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('保存失败');
    expect(draft).toHaveValue('新的内容');
  });
  it('chat branch controls call the host and obey bounds', async () => {
    const branch = vi.fn();
    render(<ChatThread messages={[{ id: 'a', role: 'assistant', content: '回答', branch: { index: 0, count: 2 } }]} onSend={() => undefined} onBranchChange={branch} />);
    expect(screen.getByRole('button', { name: '上一分支' })).toBeDisabled();
    await user().click(screen.getByRole('button', { name: '下一分支' }));
    expect(branch).toHaveBeenCalledWith('a', 1);
  });
  it('chat does not create unsafe attachment links', () => {
    render(<ChatThread messages={[{ id: 'u', role: 'user', content: '附件', attachments: [{ id: 'f', name: 'file.txt', href: 'javascript:alert(1)' }] }]} onSend={() => undefined} />);
    const log = screen.getByRole('log');
    expect(within(log).getByText('file.txt')).toBeVisible();
    expect(within(log).queryByRole('link')).not.toBeInTheDocument();
  });
  it('avatar fallback and reduced-motion headline remain readable', () => {
    render(<><Avatar><AvatarFallback>AS</AvatarFallback></Avatar><RotatingHeadline words={['专注', '清晰']} /></>);
    expect(screen.getByText('AS')).toBeVisible();
    expect(screen.getByText('专注', { exact: true })).toBeVisible();
  });
});
