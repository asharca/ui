import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Checkbox } from '../registry/ui/checkbox';
import { Radio } from '../registry/ui/radio';
import { Switch } from '../registry/ui/switch';

it('choice controls preserve explicit accessible names and external descriptions', () => {
  render(<><span id="external-name">外部名称</span><span id="external-help">外部说明</span>
    <Checkbox label="视觉多选标题" aria-label="自定义多选" description="内部说明" aria-describedby="external-help" />
    <Radio label="视觉单选标题" aria-labelledby="external-name" aria-label="不应覆盖关联名称" description="单选说明" />
    <Switch label="视觉开关标题" aria-label="自定义开关" description="开关说明" />
  </>);
  expect(screen.getByRole('checkbox', { name: '自定义多选' })).toHaveAccessibleDescription('外部说明 内部说明');
  expect(screen.getByRole('radio', { name: '外部名称' })).toHaveAccessibleDescription('单选说明');
  expect(screen.getByRole('switch', { name: '自定义开关' })).toHaveAccessibleDescription('开关说明');
});

it('a switch name excludes its helper while the whole label stays clickable', async () => {
  render(<Switch label="自动同步" description="只在无线网络下同步" />);
  const control = screen.getByRole('switch', { name: '自动同步' });
  expect(control).toHaveAccessibleDescription('只在无线网络下同步');
  await userEvent.setup().click(screen.getByText('只在无线网络下同步'));
  expect(control).toBeChecked();
});
