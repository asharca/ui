import { useState, type ReactNode } from 'react';
import { ArrowUpRight, Code2, RotateCcw } from 'lucide-react';
import { DocCode } from './DocCode';
import { publicExample } from './component-markdown';
import { MaterialButtonDemo } from './demos/MaterialButtonDemo';
import materialSource from './demos/MaterialButtonDemo.tsx?raw';
import { ActionSpecimen, AgentSpecimen, MotionSpecimen, ProjectSpecimen } from './StudioSpecimens';

function Exhibit({ name, detail, tag, children, href, source, tone = 'neutral' }: {
  name: string; detail: string; tag: string; children: ReactNode; href: string; source?: string; tone?: string;
}) {
  const [code, setCode] = useState(false);
  const [revision, setRevision] = useState(0);
  return <article className="ref-exhibit" data-tone={tone}>
    <div className="ref-exhibit-surface">
      <div className="ref-exhibit-tools"><span>{tag}</span><div>{source && <button type="button" aria-label={`${code ? '预览' : '查看源码'} ${name}`} aria-pressed={code} onClick={() => setCode((value) => !value)}><Code2 size={15} /></button>}<button type="button" aria-label={`重播 ${name}`} onClick={() => { setRevision((value) => value + 1); setCode(false); }}><RotateCcw size={14} /></button></div></div>
      <div className="ref-exhibit-stage" hidden={code} key={revision}>{children}</div>
      {code && <div className="ref-exhibit-code"><DocCode label={`${name} 完整示例`} code={publicExample(source!)} /></div>}
    </div>
    <a className="ref-exhibit-caption" href={href}><div><h3>{name}</h3><p>{detail}</p></div><ArrowUpRight size={16} /></a>
  </article>;
}

export function ReferenceShowroom() {
  const [category, setCategory] = useState('全部');
  const visible = (group: string) => category === '全部' || category === group;
  return <section className="ref-showroom" aria-label="精选交互展厅">
    <div className="ref-collection-bar"><div role="group" aria-label="展厅分类">{['全部', 'AI 交互', '基础控件', '动效'].map((name) => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div><span>可直接操作 · 不连接外部服务</span></div>
    <div className="ref-exhibit-grid">
      {visible('基础控件') && <Exhibit name="Metallic Button" detail="金属边缘、流动反光与按压反馈。" tag="01 / MATERIAL · beUI" href="#/components/button" source={materialSource} tone="silver"><MaterialButtonDemo /></Exhibit>}
      {visible('动效') && <Exhibit name="Sliding Tabs" detail="让切换有连续性，而不只是换个颜色。" tag="02 / MOTION" href="#/components/tabs" tone="pearl"><MotionSpecimen /></Exhibit>}
      {visible('基础控件') && <Exhibit name="Stateful Actions" detail="悬停、按下、确认，每一步都清晰可见。" tag="03 / FEEDBACK" href="#/components/button" tone="ink"><ActionSpecimen /></Exhibit>}
      {visible('AI 交互') && <Exhibit name="Agent Conversation" detail="把输入、工具状态与上下文放在同一张画布。" tag="04 / AI NATIVE" href="#/components/tool-call-card" tone="agent"><AgentSpecimen /></Exhibit>}
      {visible('基础控件') && <Exhibit name="Project Settings" detail="可编辑的表单，而不是静态的产品截图。" tag="05 / FORMS" href="#/components/choice-field" tone="form"><ProjectSpecimen /></Exhibit>}
    </div>
  </section>;
}
