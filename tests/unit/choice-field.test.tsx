import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ChoiceField, ChoiceGroup } from '../../src/ChoiceField';

afterEach(cleanup);
describe('ChoiceField', () => {
  it('associates the title, description and native ref without including help in the name', async () => {
    const ref = createRef<HTMLInputElement>();
    render(<ChoiceField ref={ref} label="接收更新" description="按月发送摘要" />);
    const input = screen.getByRole('checkbox', { name: '接收更新', exact: true });
    expect(input).toHaveAccessibleDescription('按月发送摘要');
    expect(ref.current).toBe(input);
    await userEvent.setup().click(screen.getByText('按月发送摘要'));
    expect(input).toBeChecked();
  });
  it('uses unique generated ids across instances', () => {
    render(<><ChoiceField label="第一个" /><ChoiceField label="第二个" /></>);
    const inputs = screen.getAllByRole('checkbox');
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
  it('merges descriptions and exposes validation errors', () => {
    render(<><p id="external">外部说明</p><ChoiceField label="确认" aria-describedby="external" description="选项说明" error="请先确认" /></>);
    expect(screen.getByRole('checkbox', { name: '确认' })).toHaveAccessibleDescription('外部说明 选项说明 请先确认');
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });
  it('preserves native form submission values and label activation', async () => {
    const { container } = render(<form><ChoiceField name="notify" value="release" label="发布" /></form>);
    await userEvent.setup().click(screen.getByText('发布'));
    expect(new FormData(container.querySelector('form')!).get('notify')).toBe('release');
  });
  it('keeps radios mutually exclusive while other groups remain independent', async () => {
    render(<><ChoiceGroup legend="周期"><ChoiceField type="radio" name="period" value="m" label="按月" defaultChecked /><ChoiceField type="radio" name="period" value="y" label="按年" /></ChoiceGroup><ChoiceField type="radio" name="separate" label="独立组" defaultChecked /></>);
    await userEvent.setup().click(screen.getByText('按年'));
    expect(screen.getByRole('radio', { name: '按月' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: '按年' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '独立组' })).toBeChecked();
  });
  it('respects both direct disabled and disabled fieldsets', async () => {
    render(<><ChoiceField label="不可用" disabled /><ChoiceGroup legend="锁定设置" disabled><ChoiceField label="继承禁用" /></ChoiceGroup></>);
    for (const input of screen.getAllByRole('checkbox')) expect(input).toBeDisabled();
    await userEvent.setup().click(screen.getByText('继承禁用'));
    expect(screen.getByRole('checkbox', { name: '继承禁用' })).not.toBeChecked();
  });
  it('allows explicit accessible names and invalid state overrides', () => {
    render(<ChoiceField label="可见标题" aria-label="自定义名称" aria-invalid={false} error="提示" variant="card" />);
    expect(screen.getByRole('checkbox', { name: '自定义名称' })).toHaveAttribute('aria-invalid', 'false');
  });
});
