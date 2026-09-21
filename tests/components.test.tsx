import { createRef, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../registry/ui/button';
import { Input } from '../registry/ui/input';
import { Checkbox } from '../registry/ui/checkbox';
import { RadioGroup } from '../registry/ui/radio-group';
import { Switch } from '../registry/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../registry/ui/tabs';
import { Accordion, AccordionItem } from '../registry/ui/accordion';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '../registry/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '../registry/ui/popover';
import { Tooltip } from '../registry/ui/tooltip';
import { Badge } from '../registry/ui/badge';
import { Select } from '../registry/ui/select';
import { PromptInput } from '../registry/ui/prompt-input';
import { Message } from '../registry/ui/message';
import { ToolResult } from '../registry/ui/tool-result';
import { ApprovalCard } from '../registry/ui/approval-card';
import { ChatPanel } from '../registry/ui/chat-panel';

const user = () => userEvent.setup();
describe('native controls', () => {
  it('buttons do not accidentally submit a form', async () => {
    const submit = vi.fn((event) => event.preventDefault());
    render(<form onSubmit={submit}><Button>普通按钮</Button><Button type="submit">提交</Button></form>);
    await user().click(screen.getByText('普通按钮')); expect(submit).not.toHaveBeenCalled();
    await user().click(screen.getByText('提交')); expect(submit).toHaveBeenCalledTimes(1);
  });
  it('loading buttons prevent duplicate actions', async () => {
    const click = vi.fn(); render(<Button loading onClick={click}>保存</Button>);
    expect(screen.getByRole('button')).toBeDisabled(); expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    await user().click(screen.getByRole('button')); expect(click).not.toHaveBeenCalled();
  });
  it('input forwards refs and associates label, help and error', () => {
    const ref = createRef<HTMLInputElement>(); render(<Input ref={ref} label="名称" description="填写显示名称" error="名称不能为空" />);
    const input = screen.getByLabelText('名称'); expect(ref.current).toBe(input); expect(input).toHaveAttribute('aria-invalid', 'true'); expect(input).toHaveAccessibleDescription('填写显示名称 名称不能为空');
  });
  it('checkbox participates in native FormData', async () => {
    render(<form aria-label="偏好"><Checkbox name="notify" value="yes" label="接收通知" defaultChecked /></form>);
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('notify')).toBe('yes'); await user().click(screen.getByLabelText('接收通知')); expect(new FormData(form).has('notify')).toBe(false);
  });
  it('checkbox exposes native indeterminate and input ref', () => {
    const ref = createRef<HTMLInputElement>(); render(<Checkbox ref={ref} label="部分选择" indeterminate />);
    expect(ref.current).toBe(screen.getByRole('checkbox')); expect(ref.current?.indeterminate).toBe(true);
  });
  it('fieldset disabled state is preserved for choices', async () => {
    render(<fieldset disabled><Checkbox label="被锁定的长文字选项，可以自然换行而不改变控件位置" /><RadioGroup label="方案" options={[{ value: 'a', label: '方案 A' }]} /></fieldset>);
    expect(screen.getByRole('checkbox')).toBeDisabled(); expect(screen.getByRole('radio')).toBeDisabled();
    await user().click(screen.getByRole('checkbox')); expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  it('radio groups keep native values and reset behavior', async () => {
    render(<form aria-label="环境"><RadioGroup label="环境选择" name="env" defaultValue="preview" options={[{ value: 'preview', label: '预览' }, { value: 'production', label: '生产' }]} /><button type="reset">重置</button></form>);
    await user().click(screen.getByLabelText('生产')); expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('env')).toBe('production');
    await user().click(screen.getByText('重置')); expect(screen.getByLabelText('预览')).toBeChecked();
  });
  it('controlled radio changes are observable', async () => {
    function Harness() { const [value, setValue] = useState('a'); return <RadioGroup label="颜色" value={value} onValueChange={setValue} options={[{ value: 'a', label: '灰' }, { value: 'b', label: '黑' }]} />; }
    render(<Harness />); await user().click(screen.getByLabelText('黑')); expect(screen.getByLabelText('黑')).toBeChecked();
  });
  it('switch can be toggled from its label and with the keyboard', async () => {
    render(<Switch label="自动保存" />); await user().click(screen.getByText('自动保存')); expect(screen.getByRole('switch')).toBeChecked();
    screen.getByRole('switch').focus(); await user().keyboard(' '); expect(screen.getByRole('switch')).not.toBeChecked();
  });
  it('select exposes labels and keyboard options', async () => {
    const change = vi.fn(); render(<Select label="框架" items={[{ value: 'react', label: 'React' }, { value: 'next', label: 'Next.js' }]} onValueChange={change} />);
    const trigger = screen.getByRole('combobox', { name: '框架' }); trigger.focus(); fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await user().click(await screen.findByRole('option', { name: 'Next.js' })); expect(change).toHaveBeenCalledWith('next');
  });
});
describe('composed interactions', () => {
  it('tabs keep proper selection and panels', async () => {
    render(<Tabs defaultValue="a"><TabsList aria-label="页面"><TabsTrigger value="a">概览</TabsTrigger><TabsTrigger value="b">设置</TabsTrigger></TabsList><TabsContent value="a">概览内容</TabsContent><TabsContent value="b">设置内容</TabsContent></Tabs>);
    await user().click(screen.getByRole('tab', { name: '设置' })); expect(screen.getByRole('tab', { name: '设置' })).toHaveAttribute('aria-selected', 'true'); expect(screen.getByRole('tabpanel')).toHaveTextContent('设置内容');
  });
  it('accordion expands and collapses', async () => {
    render(<Accordion type="single" collapsible><AccordionItem value="a" title="帮助">更多说明</AccordionItem></Accordion>);
    const trigger = screen.getByRole('button', { name: '帮助' }); await user().click(trigger); expect(trigger).toHaveAttribute('aria-expanded', 'true'); await user().click(trigger); expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('dialog has a name and description and restores focus', async () => {
    render(<Dialog><DialogTrigger asChild><Button>打开</Button></DialogTrigger><DialogContent title="确认操作" description="不会实际执行操作"><DialogClose asChild><Button>返回</Button></DialogClose></DialogContent></Dialog>);
    const trigger = screen.getByRole('button', { name: '打开' }); await user().click(trigger);
    expect(screen.getByRole('dialog')).toHaveAccessibleName('确认操作'); expect(screen.getByRole('dialog')).toHaveAccessibleDescription('不会实际执行操作');
    await user().keyboard('{Escape}'); await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()); await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('popover is dismissible with Escape', async () => {
    render(<Popover><PopoverTrigger asChild><Button>设置面板</Button></PopoverTrigger><PopoverContent>面板内容</PopoverContent></Popover>);
    await user().click(screen.getByText('设置面板')); expect(screen.getByText('面板内容')).toBeVisible(); await user().keyboard('{Escape}'); await waitFor(() => expect(screen.queryByText('面板内容')).not.toBeInTheDocument());
  });
  it('tooltip supports keyboard focus', async () => {
    render(<Tooltip content="辅助说明" delayDuration={0}><Button>说明</Button></Tooltip>); screen.getByRole('button').focus(); expect(await screen.findByRole('tooltip')).toHaveTextContent('辅助说明');
  });
  it('badges keep visible semantic labels', () => { render(<Badge tone="error">失败</Badge>); expect(screen.getByText('失败')).toBeVisible(); });
});
describe('AI interfaces', () => {
  it('submits trimmed text and clears only after success', async () => {
    const send = vi.fn(); render(<PromptInput onSubmit={send} />); await user().type(screen.getByRole('textbox'), '  hello  '); await user().keyboard('{Enter}');
    await waitFor(() => expect(send).toHaveBeenCalledExactlyOnceWith('hello')); await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
  });
  it('Shift+Enter inserts a newline', async () => {
    const send = vi.fn(); render(<PromptInput onSubmit={send} />); await user().type(screen.getByRole('textbox'), 'hello{Shift>}{Enter}{/Shift}world'); expect(send).not.toHaveBeenCalled(); expect(screen.getByRole('textbox')).toHaveValue('hello\nworld');
  });
  it('IME confirmation does not send a Chinese draft', () => {
    const send = vi.fn(); render(<PromptInput defaultValue="中文输入" onSubmit={send} />); fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', keyCode: 229, isComposing: true }); expect(send).not.toHaveBeenCalled(); expect(screen.getByRole('textbox')).toHaveValue('中文输入');
  });
  it('rejected submission retains the draft for retry', async () => {
    const send = vi.fn().mockRejectedValue(new Error('连接中断')); render(<PromptInput defaultValue="不要丢掉这段文字" onSubmit={send} />); await user().click(screen.getByRole('button', { name: '发送消息' })); expect(await screen.findByRole('alert')).toHaveTextContent('连接中断'); expect(screen.getByRole('textbox')).toHaveValue('不要丢掉这段文字'); expect(screen.getByRole('button', { name: '发送消息' })).toBeEnabled();
  });
  it('prevents two same-tick submissions', async () => {
    let finish!: () => void; const send = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; })); render(<PromptInput defaultValue="hello" onSubmit={send} />); const form = screen.getByRole('form'); fireEvent.submit(form); fireEvent.submit(form); expect(send).toHaveBeenCalledTimes(1); await act(async () => { finish(); });
  });
  it('supports controlled drafts', async () => {
    function Harness() { const [value, setValue] = useState(''); return <PromptInput value={value} onValueChange={setValue} onSubmit={() => undefined} />; }
    render(<Harness />); await user().type(screen.getByRole('textbox'), '测试'); expect(screen.getByRole('textbox')).toHaveValue('测试'); await user().keyboard('{Enter}'); await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
  });
  it('busy stop calls the host callback', async () => { const stop = vi.fn(); render(<PromptInput busy onStop={stop} onSubmit={() => undefined} />); await user().click(screen.getByRole('button', { name: '停止生成' })); expect(stop).toHaveBeenCalledTimes(1); });
  it('never submits a blank or disabled prompt', async () => { const send = vi.fn(); const { rerender } = render(<PromptInput defaultValue="   " onSubmit={send} />); expect(screen.getByRole('button')).toBeDisabled(); fireEvent.submit(screen.getByRole('form')); rerender(<PromptInput defaultValue="hello" disabled onSubmit={send} />); fireEvent.submit(screen.getByRole('form')); expect(send).not.toHaveBeenCalled(); });
  it('message content is rendered as text, not executed markup', () => { const { container } = render(<Message role="assistant">{'<script>alert(1)</script>'}</Message>); expect(container.querySelector('script')).toBeNull(); expect(screen.getByText('<script>alert(1)</script>')).toBeVisible(); });
  it('message copying reports actual success', async () => { const interaction = user(); render(<Message role="assistant" copyText="内容">内容</Message>); await interaction.click(screen.getByRole('button', { name: '复制消息' })); expect(await navigator.clipboard.readText()).toBe('内容'); expect(screen.getByRole('status')).toHaveTextContent('已复制'); });
  it('tool results respect initial defaultOpen and collapse on completion', async () => {
    const { rerender } = render(<ToolResult title="构建" status="success" defaultOpen output="ok" />); expect(screen.getByText('ok')).toBeVisible(); rerender(<ToolResult title="构建" status="running" output="working" />); expect(screen.getByText('working')).toBeVisible(); rerender(<ToolResult title="构建" status="success" output="done" />); await waitFor(() => expect(screen.getByText('done')).not.toBeVisible());
  });
  it('failed approval can be retried, successful approval cannot be repeated', async () => {
    const decide = vi.fn().mockRejectedValueOnce(new Error('请重试')).mockResolvedValue(undefined); render(<ApprovalCard title="审批" description="演示" onDecision={decide} />); await user().click(screen.getByRole('button', { name: '允许执行' })); expect(await screen.findByRole('alert')).toHaveTextContent('请重试'); await user().click(screen.getByRole('button', { name: '允许执行' })); await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('已允许')); expect(screen.getByRole('button', { name: '拒绝' })).toBeDisabled(); expect(decide).toHaveBeenCalledTimes(2);
  });
  it('chat panel composes a named log and a host-controlled composer', async () => {
    const send = vi.fn(); render(<ChatPanel messages={[{ id: 'a', role: 'assistant', content: '你好' }]} onSend={send} />); expect(screen.getByRole('log', { name: '对话消息' })).toHaveTextContent('你好'); await user().type(screen.getByRole('textbox'), '你好'); await user().keyboard('{Enter}'); await waitFor(() => expect(send).toHaveBeenCalledWith('你好'));
  });
});
