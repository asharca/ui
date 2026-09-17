import { useId, useState } from 'react';
import { Button, ChoiceField, ChoiceGroup, Field, FieldDescription, FieldLabel, Input } from '../../src/index';

export function SettingsExample() {
  const id = useId();
  const [name, setName] = useState('我的工作区');
  const [delivery, setDelivery] = useState('digest');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">组合示例 / 设置</span><h1>工作区偏好</h1><p>使用真实组件组合的设置页。修改仅保存在当前演示内存中。</p></div>
    <form className="settings-example" onSubmit={(event) => { event.preventDefault(); setSaved(true); }} onChange={() => setSaved(false)}>
      <section className="settings-section"><div><h2>基本信息</h2><p>统一标题、输入框和帮助文字的层级。</p></div><div><Field><FieldLabel htmlFor={`${id}-name`}>工作区名称</FieldLabel><Input id={`${id}-name`} required value={name} onChange={(event) => setName(event.target.value)} aria-describedby={`${id}-help`} /><FieldDescription id={`${id}-help`}>显示在侧边栏与工作区切换菜单中。</FieldDescription></Field></div></section>
      <section className="settings-section"><div><h2>通知偏好</h2><p>单选项互斥，复选项独立；标题与说明从同一列开始。</p></div><div className="demo-choice-stack"><ChoiceField label="接收工作区通知" description="包含重要更新和运行状态，不会改变任何真实账号设置。" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /><ChoiceGroup legend="通知频率" disabled={!notifications}><ChoiceField type="radio" variant="card" name={`${id}-delivery`} value="digest" label="每日摘要" description="每天汇总一次，减少打扰。" checked={delivery === 'digest'} onChange={(event) => setDelivery(event.target.value)} /><ChoiceField type="radio" variant="card" name={`${id}-delivery`} value="instant" label="及时通知" description="重要状态变化时立即通知。" checked={delivery === 'instant'} onChange={(event) => setDelivery(event.target.value)} /></ChoiceGroup></div></section>
      <footer className="settings-actions"><p role="status">{saved ? '演示设置已保存。' : '这里只演示表单，不调用后端服务。'}</p><Button type="submit" variant="primary">保存偏好</Button></footer>
    </form>
  </>;
}
