import { createRef } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../registry/ui/button';
import { Checkbox } from '../registry/ui/checkbox';
import { Radio } from '../registry/ui/radio';
import { RadioGroup } from '../registry/ui/radio-group';
import { Switch } from '../registry/ui/switch';
import { Textarea } from '../registry/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../registry/ui/tabs';
import { Accordion, AccordionItem } from '../registry/ui/accordion';

describe('refined controls retain their native contracts', () => {
  it('keeps the same label node and accessible name while loading', () => {
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(<Button ref={ref}>保存更改</Button>);
    const label = screen.getByText('保存更改');
    rerender(<Button ref={ref} loading>保存更改</Button>);
    expect(screen.getByRole('button', { name: '保存更改' })).toBe(ref.current);
    expect(screen.getByText('保存更改')).toBe(label);
    expect(ref.current).toBeDisabled();
    expect(ref.current).toHaveAttribute('aria-busy', 'true');
    rerender(<Button ref={ref}>保存更改</Button>);
    expect(ref.current).toBeEnabled();
    expect(ref.current).not.toHaveAttribute('aria-busy');
  });

  it('checkbox decoration follows the real input across form reset', async () => {
    const interaction = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(<form aria-label="偏好"><Checkbox ref={ref} label="通知" description="仅重要消息" name="notify" value="yes" defaultChecked /><button type="reset">恢复</button></form>);
    const input = screen.getByRole('checkbox', { name: '通知' });
    expect(input).toHaveAccessibleDescription('仅重要消息');
    await interaction.click(input);
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('notify')).toBe(false);
    await interaction.click(screen.getByRole('button', { name: '恢复' }));
    expect(ref.current).toBeChecked();
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('notify')).toBe('yes');
  });

  it('standalone and grouped radios preserve descriptions, values and fieldset disabling', async () => {
    const interaction = userEvent.setup();
    render(<><Radio label="单独选项" description="辅助说明" name="standalone" /><RadioGroup label="环境" name="env" required defaultValue="a" options={[{ value: 'a', label: '开发', description: '本地运行' }, { value: 'b', label: '生产', disabled: true }]} /></>);
    expect(screen.getByRole('radio', { name: '单独选项' })).toHaveAccessibleDescription('辅助说明');
    expect(screen.getByRole('radio', { name: '开发' })).toHaveAccessibleDescription('本地运行');
    expect(screen.getByRole('radio', { name: '开发' })).toBeRequired();
    await interaction.click(screen.getByRole('radio', { name: '生产' }));
    expect(screen.getByRole('radio', { name: '开发' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: '单独选项' }));
    expect(screen.getByRole('radio', { name: '开发' })).toBeChecked();
  });

  it('does not invent internal checked state for a controlled switch', async () => {
    const change = vi.fn();
    const { rerender } = render(<Switch label="同步" checked={false} onCheckedChange={change} />);
    await userEvent.setup().click(screen.getByRole('switch', { name: '同步' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Switch label="同步" checked onCheckedChange={change} />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('textarea retains errors, refs and native readonly semantics', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="备注" description="完整描述" error="需要补充" readOnly defaultValue="草稿" />);
    expect(ref.current).toHaveAttribute('readonly');
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toHaveAccessibleDescription('完整描述 需要补充');
    expect(ref.current).toHaveValue('草稿');
  });
});

describe('navigation and disclosure motion', () => {
  it.each(['soft', 'underline', 'pill'] as const)('%s tabs preserve keyboard selection', async (variant) => {
    render(<Tabs defaultValue="a"><TabsList variant={variant} aria-label="页面"><TabsTrigger value="a">甲</TabsTrigger><TabsTrigger value="b">乙</TabsTrigger></TabsList><TabsContent value="a">内容甲</TabsContent><TabsContent value="b">内容乙</TabsContent></Tabs>);
    screen.getByRole('tab', { name: '甲' }).focus();
    await userEvent.setup().keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '乙' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('内容乙');
  });

  it('two tab lists share selection without losing either local indicator', async () => {
    const { container } = render(<Tabs defaultValue="a">{['上方', '下方'].map((name) => <TabsList key={name} aria-label={name}><TabsTrigger value="a">甲</TabsTrigger><TabsTrigger value="b">乙</TabsTrigger></TabsList>)}<TabsContent value="a">内容甲</TabsContent><TabsContent value="b">内容乙</TabsContent></Tabs>);
    await userEvent.setup().click(within(screen.getByRole('tablist', { name: '上方' })).getByRole('tab', { name: '乙' }));
    expect(within(screen.getByRole('tablist', { name: '下方' })).getByRole('tab', { name: '乙' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelectorAll('[data-slot="tab-indicator"]')).toHaveLength(2);
  });

  it('multiple accordions keep independently open items and unmount closed content', async () => {
    const interaction = userEvent.setup();
    render(<Accordion type="multiple" defaultValue={['a']}><AccordionItem value="a" title="甲">内容甲</AccordionItem><AccordionItem value="b" title="乙">内容乙</AccordionItem></Accordion>);
    await interaction.click(screen.getByRole('button', { name: '乙' }));
    expect(screen.getByText('内容甲')).toBeVisible();
    expect(screen.getByText('内容乙')).toBeVisible();
    await interaction.click(screen.getByRole('button', { name: '甲' }));
    await waitFor(() => expect(screen.queryByText('内容甲')).not.toBeInTheDocument());
    expect(screen.getByText('内容乙')).toBeVisible();
  });

  it('controlled accordion changes wait for the host and preserve its ref', async () => {
    const change = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const view = (value: string) => <Accordion ref={ref} type="single" collapsible value={value} onValueChange={change}><AccordionItem value="a" title="设置"><input aria-label="详情输入" /></AccordionItem></Accordion>;
    const { rerender } = render(view(''));
    await userEvent.setup().click(screen.getByRole('button', { name: '设置' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('a');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    rerender(view('a'));
    expect(ref.current).toContainElement(screen.getByRole('textbox'));
    rerender(view(''));
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
  });
});
