import { useState } from 'react';
import { ComponentTile } from './ComponentGallery';
import { componentDocs } from './ComponentDemos';
import { MaterialButtonDemo } from './demos/MaterialButtonDemo';

const items = [
  ['material-button', '基础控件'], ['tabs', '动效'], ['button', '动效'],
  ['switch', '基础控件'], ['avatar', '动效'], ['accordion', '动效'],
  ['dropdown-menu', '基础控件'], ['dialog', '基础控件'], ['choice-field', '基础控件'],
  ['chat-composer-toolbar', 'AI 交互'], ['tool-call-card', 'AI 交互'], ['data-table', '基础控件'],
];
const button = componentDocs.find((doc) => doc.id === 'button')!;
const material = { ...button, id: 'material-button', name: 'Metallic Button', demoFile: 'MaterialButtonDemo.tsx', preview: <MaterialButtonDemo /> };

export function ReferenceShowroom() {
  const [category, setCategory] = useState('全部');
  return <section className="ref-showroom" aria-label="精选交互展厅">
    <div className="ref-collection-bar"><div role="group" aria-label="展厅分类">{['全部', '基础控件', '动效', 'AI 交互'].map((name) => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div><a href="#/components" aria-label="浏览全部组件">全部组件</a></div>
    <div className="studio-catalog-grid ref-catalog-grid">{items.filter(([, group]) => category === '全部' || category === group).map(([id]) => {
      const doc = id === 'material-button' ? material : componentDocs.find((entry) => entry.id === id)!;
      return <ComponentTile key={id} doc={doc} href={`#/components/${id === 'material-button' ? 'button' : id}`} />;
    })}</div>
    <p className="ref-demo-note">本地交互演示，不连接外部服务。</p>
  </section>;
}
