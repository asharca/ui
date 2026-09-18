import { useId, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, SlidersHorizontal } from 'lucide-react';
import { Button, Field, FieldDescription, FieldLabel, Input, Select, Switch, Textarea } from '../src/Controls';
import { ChoiceField, ChoiceGroup } from '../src/ChoiceField';
import { Badge } from '../src/Feedback';
import { Card } from '../src/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { ToolCallCard, type ToolCallCardLabels, type ToolCallState } from '../src/ToolCallCard';
import './design-specimens.css';

function Specimen({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section className="design-specimen">
    <header className="design-specimen-heading"><span aria-hidden="true">{number}</span><div><h3>{title}</h3><p>{description}</p></div></header>
    <div className="design-specimen-body">{children}</div>
  </section>;
}

function ControlSpecimens() {
  const id = useId();
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState('产品设计助手');
  const [notifications, setNotifications] = useState(true);
  const [format, setFormat] = useState('summary');
  return <div className="design-specimen-grid">
    <Specimen number="01" title="操作有主次" description="主操作、次操作和危险操作不争抢注意力。">
      <div className="design-specimen-row"><Button variant="primary" onClick={() => setSaved(true)}><Check size={15} aria-hidden="true" />保存样本</Button><Button variant="secondary">次要操作</Button><Button variant="outline"><Copy size={15} aria-hidden="true" />轮廓按钮</Button></div>
      <div className="design-specimen-row"><Button variant="ghost">轻量操作</Button><Button variant="danger">危险样式</Button><Button variant="danger-secondary">危险次级</Button></div>
      <div className="design-specimen-row"><Button size="sm">小号</Button><Button>标准</Button><Button size="lg">大号</Button><Button disabled>不可操作</Button><Button loading>加载样本</Button></div>
      <p className="design-specimen-note">除保存样本外，其余按钮用于对照外观，不执行业务操作。</p>
      <span role="status" className="design-specimen-result">{saved ? '样本已保存，切换风格不会清空这个状态。' : ''}</span>
    </Specimen>
    <Specimen number="02" title="输入有状态" description="默认、填充、只读和错误状态共享同一套几何规则。">
      <Field><FieldLabel htmlFor={`${id}-draft`}>示例名称</FieldLabel><Input id={`${id}-draft`} value={draft} onChange={(event) => setDraft(event.target.value)} aria-describedby={`${id}-draft-help`} /><FieldDescription id={`${id}-draft-help`}>试着修改，再切换风格或画廊标签。</FieldDescription></Field>
      <Field><FieldLabel htmlFor={`${id}-filled`}>填充式输入</FieldLabel><Input id={`${id}-filled`} data-appearance="filled" placeholder="与普通输入相比，背景层次更明显" /></Field>
      <div className="design-specimen-columns"><Field><FieldLabel htmlFor={`${id}-readonly`}>只读内容</FieldLabel><Input id={`${id}-readonly`} readOnly value="workspace/design" /></Field><Field><FieldLabel htmlFor={`${id}-disabled`}>禁用内容</FieldLabel><Input id={`${id}-disabled`} disabled value="由组织管理" /></Field></div>
      <Field><FieldLabel htmlFor={`${id}-invalid`}>错误状态样本</FieldLabel><Input id={`${id}-invalid`} defaultValue="名称太短" aria-invalid="true" aria-describedby={`${id}-invalid-help`} /><p id={`${id}-invalid-help`} className="design-specimen-error">这是用于比较错误外观的样本，不会提交数据。</p></Field>
    </Specimen>
    <Specimen number="03" title="选择有依据" description="控件对齐标题首行，说明独立成层，长文字自然换行。">
      <ChoiceGroup legend="摘要格式" description="原生单选互斥，支持方向键切换。">
        <ChoiceField type="radio" name={`${id}-format`} value="summary" variant="card" label="重点摘要" description="先给出结论，再列出来源与下一步行动建议。" checked={format === 'summary'} onChange={(event) => setFormat(event.target.value)} />
        <ChoiceField type="radio" name={`${id}-format`} value="full" variant="card" label="包含完整上下文的研究记录" description="用于需要比较多条信息、保留分析记录的场景。即使说明较长，也不改变控件与标题之间的对齐。" checked={format === 'full'} onChange={(event) => setFormat(event.target.value)} />
      </ChoiceGroup>
      <ChoiceField label="在完成后通知我" description="点击标题或说明都可以切换。" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
      <ChoiceGroup legend="组织策略" disabled><ChoiceField label="由管理员统一管理" description="整组禁用后，文字仍保持可读。" defaultChecked /></ChoiceGroup>
    </Specimen>
    <Specimen number="04" title="设置有节奏" description="多行输入、选择器与即时开关保持一致的信息密度。">
      <Field><FieldLabel htmlFor={`${id}-strategy`}>执行策略样本</FieldLabel><Select id={`${id}-strategy`} defaultValue="review"><option value="review">每次确认</option><option value="preview">只读预览</option></Select></Field>
      <Field><FieldLabel htmlFor={`${id}-instructions`}>助手说明</FieldLabel><Textarea id={`${id}-instructions`} rows={3} placeholder="描述助手需要完成什么，以及不应该执行什么。" /></Field>
      <div className="design-switch-row"><label htmlFor={`${id}-switch`}>显示执行细节<span>即时切换，不代表后端权限发生变化。</span></label><Switch id={`${id}-switch`} defaultChecked /></div>
      <div className="design-switch-row"><label htmlFor={`${id}-locked`}>受限设置<span>当前示例不允许更改。</span></label><Switch id={`${id}-locked`} disabled /></div>
      <div className="design-specimen-row"><Badge tone="neutral">草稿</Badge><Badge tone="brand">已选中</Badge><Badge tone="success">完成</Badge><Badge tone="warning">需确认</Badge><Badge tone="danger">失败</Badge></div>
    </Specimen>
  </div>;
}

const stateOptions: ReadonlyArray<readonly [ToolCallState, string]> = [
  ['pending', '准备就绪'], ['running', '运行中'], ['awaiting-approval', '等待审批'],
  ['completed', '已完成'], ['failed', '失败'], ['rejected', '已拒绝'], ['cancelled', '已取消'],
];
const toolLabels: ToolCallCardLabels = {
  pending: '准备就绪', running: '运行中', awaitingApproval: '等待审批', completed: '已完成',
  failed: '失败', rejected: '已拒绝', cancelled: '已取消', input: '参数样本', output: '结果样本',
  allow: '模拟允许', reject: '模拟拒绝', approvalDescription: '这只是本地审批演示，不会授权或执行任何真实工具。',
  approvalFailed: '模拟提交失败。关闭失败开关后可以重试。', approvalSubmitted: '本地审批状态已更新',
  showMore: '展开完整样本', showLess: '收起样本', copy: '复制可见样本',
};

function ToolSpecimens() {
  const [state, setState] = useState<ToolCallState>('awaiting-approval');
  const [fail, setFail] = useState(false);
  const [revision, setRevision] = useState(0);
  function changeState(next: ToolCallState) { setState(next); setRevision((value) => value + 1); }
  return <div className="design-specimen-grid design-specimen-grid--tools">
    <Specimen number="05" title="执行过程可辨认" description="七种状态可独立查看；不是把运行、失败、取消都显示成完成。">
      <label className="design-specimen-select">工具状态<Select aria-label="工具状态样本" value={state} onChange={(event) => changeState(event.target.value as ToolCallState)}>{stateOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label>
      <ChoiceField label="模拟审批提交失败" description="用于体验失败反馈与重试，不会发起网络请求。" checked={fail} onChange={(event) => setFail(event.target.checked)} />
      <div className="design-specimen-tool-preview"><ToolCallCard key={revision} name="workspace.inspect" state={state} labels={toolLabels} presentation={{ label: '检查工作区配置', kind: 'mcp', description: '本地状态样本 · 当前没有连接任何工具服务。' }} input={{ workspace: 'design-preview', mode: 'read-only' }} output={state === 'completed' ? { summary: '配置检查结果样本', executed: false } : state === 'failed' ? { error: '连接失败（示例）', executed: false } : undefined} onApprove={async (approved) => { await Promise.resolve(); if (fail) throw new Error('Simulated approval failure'); setState(approved ? 'completed' : 'rejected'); }} /></div>
      <div className="design-specimen-row"><Button variant="outline" size="sm" onClick={() => { setFail(false); changeState('awaiting-approval'); }}>重置审批样本</Button><Button asChild variant="ghost" size="sm"><a href="#/components/tool-call-card">查看组件文档<ArrowUpRight size={14} aria-hidden="true" /></a></Button></div>
    </Specimen>
    <Specimen number="06" title="任务信息有层次" description="品牌色强调当前动作；结果、风险和中止各用独立语义。">
      <dl className="design-state-reference">{stateOptions.map(([value, label]) => <div key={value} data-state={value}><dt><span aria-hidden="true" />{label}</dt><dd>{({ pending: '尚未开始，不暗示正在运行。', running: '表达正在处理，而不是虚构进度。', 'awaiting-approval': '先展示参数，再交由用户决定。', completed: '收到真实结果后才使用完成状态。', failed: '保留失败原因，明确下一步。', rejected: '用户未允许执行，与执行失败不同。', cancelled: '任务已停止，不显示成功。' } as Record<ToolCallState, string>)[value]}</dd></div>)}</dl>
      <p className="design-specimen-note">本页可以手动切换状态来检查外观。实际应用必须由运行时提供状态，不应据此自动批准工具。</p>
    </Specimen>
  </div>;
}

function SurfaceSpecimens() {
  return <div className="design-specimen-grid">
    <Specimen number="07" title="表面有层次" description="只有明确标记的展示容器使用玻璃；菜单与输入保持实色。">
      <div className="design-surface-stack"><Card><strong>标准表面</strong><p>正文、表单和一般内容。</p></Card><Card data-surface="elevated"><strong>抬高层级</strong><p>通过边界与阴影强调，不添加假按钮交互。</p></Card><Card data-surface="inset"><strong>内嵌区域</strong><p>参数、辅助信息与次级内容。</p></Card><Card data-surface="glass"><strong>轻透明表面</strong><p>在 Glass 风格下启用；不支持模糊时保留实色。</p></Card></div>
    </Specimen>
    <Specimen number="08" title="导航有语境" description="同样的键盘与无障碍语义，按内容选择视觉表达。">
      {(['segmented', 'underline', 'pills'] as const).map((variant) => <div key={variant} className="design-tabs-sample"><span>{({ segmented: '分段式 · 设置切换', underline: '下划线 · 内容导航', pills: '胶囊式 · 轻量筛选' })[variant]}</span><Tabs defaultValue="overview"><TabsList data-variant={variant} aria-label={`${variant} 标签样本`}><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="details">详情</TabsTrigger><TabsTrigger value="locked" disabled>受限</TabsTrigger></TabsList><TabsContent value="overview"><p>概览内容。用方向键切换标签。</p></TabsContent><TabsContent value="details"><p>详情内容。主题不会改变交互约定。</p></TabsContent></Tabs></div>)}
    </Specimen>
    <Specimen number="09" title="颜色成对使用" description="色板直接读取当前 CSS 变量，不维护第二份颜色表。">
      <div className="design-token-grid">{[['card', 'card-foreground', '内容表面'], ['muted', 'muted-foreground', '辅助信息'], ['brand', 'brand-foreground', '主要操作'], ['popover', 'popover-foreground', '浮层表面']].map(([background, foreground, label]) => <div key={background} className="design-token-sample" style={{ background: `hsl(var(--${background}))`, color: `hsl(var(--${foreground}))` }}><strong>{label}</strong><span>Aa 中文</span><code>{background}<br />{foreground}</code></div>)}</div>
    </Specimen>
    <Specimen number="10" title="从细节进入文档" description="继续查看真实组件、源代码和供 AI 使用的上下文。">
      <div className="design-specimen-links">{[['button', '按钮与禁用边界'], ['choice-field', '选择项与原生表单'], ['chat-thread', '聊天、输入与流式回复'], ['data-table', '表格与稳定行选择']].map(([id, title]) => <a key={id} href={`#/components/${id}`}>{title}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
      <p className="design-specimen-note">切换皮肤只调整配色、表面和几何。组件行为、业务权限与数据持久化仍由原有组件和宿主管理。</p>
    </Specimen>
  </div>;
}

/** Kept mounted across tab/style changes so a visual comparison never loses a draft. */
export function DesignSpecimens() {
  const [section, setSection] = useState('controls');
  return <section className="design-specimens" data-toolplane-ui="design-specimens" aria-label="设计细节画廊">
    <header className="design-specimens-title"><div><span className="design-kicker">COMPONENT DETAILS / 02</span><h2>细节，放在一起比较。</h2><p>先看层级，再看状态。切换上方风格，观察同一套控件如何变化。</p></div><SlidersHorizontal size={22} aria-hidden="true" /></header>
    <Tabs value={section} onValueChange={setSection}>
      <TabsList className="design-specimens-nav" aria-label="设计细节分类"><TabsTrigger value="controls">基础控件</TabsTrigger><TabsTrigger value="tools">AI 执行状态</TabsTrigger><TabsTrigger value="surfaces">表面与变量</TabsTrigger></TabsList>
      <TabsContent value="controls" forceMount hidden={section !== 'controls'}><ControlSpecimens /></TabsContent>
      <TabsContent value="tools" forceMount hidden={section !== 'tools'}><ToolSpecimens /></TabsContent>
      <TabsContent value="surfaces" forceMount hidden={section !== 'surfaces'}><SurfaceSpecimens /></TabsContent>
    </Tabs>
  </section>;
}
