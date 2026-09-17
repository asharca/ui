import { useEffect, useId, useState } from 'react';
import { ArrowUpRight, Bot, Check, Circle, Command, Layers3, SlidersHorizontal, Square, WandSparkles } from 'lucide-react';
import { Button, Field, FieldDescription, FieldLabel, Input, Select, Switch, Textarea } from '../src/Controls';
import { ChoiceField, ChoiceGroup } from '../src/ChoiceField';
import { Badge, Progress } from '../src/Feedback';
import { Card, DataTable } from '../src/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../src/Dialog';
import { ToolCallCard, type ToolCallState } from '../src/ToolCallCard';

const toolLabels = {
  pending: '准备就绪', running: '运行中', completed: '已完成', failed: '失败',
  awaitingApproval: '等待确认', rejected: '已拒绝', cancelled: '已停止',
  input: '输入', output: '输出', allow: '允许', reject: '拒绝',
  showMore: '展开完整结果', showLess: '收起结果', copy: '复制可见内容',
};
const taskHeaders = [{ label: '任务' }, { label: '状态' }, { label: '负责人' }];

/** A local interactive scene, not a model connection or a real execution engine. */
export function DesignShowcase() {
  const id = useId();
  const [name, setName] = useState('产品研究助手');
  const [model, setModel] = useState('balanced');
  const [review, setReview] = useState(true);
  const [toolState, setToolState] = useState<ToolCallState>('pending');
  const [selected, setSelected] = useState<string[]>([]);
  const [tabStyle, setTabStyle] = useState('segmented');
  const [saved, setSaved] = useState(false);
  const running = toolState === 'running';

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setToolState('completed'), 1400);
    return () => clearTimeout(timer);
  }, [running]);

  return (
    <div className="design-console" data-toolplane-ui="design-console">
      <div className="design-console-top">
        <span className="design-app-mark" aria-hidden="true"><Layers3 size={17} /></span>
        <strong>Agent Workspace</strong>
        <span className="design-console-path">/ design-preview</span>
        <Badge tone="neutral">本地演示</Badge>
      </div>
      <div className="design-console-content">
        <div className="design-console-heading">
          <div>
            <span className="design-kicker">WORKSPACE / 01</span>
            <h2>把想法，变成下一步。</h2>
            <p>同一套组件，不同的视觉表达。这里的操作不会访问外部服务。</p>
          </div>
          <Dialog>
            <DialogTrigger asChild><Button size="sm" variant="outline"><SlidersHorizontal size={14} />工作区设置</Button></DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogTitle>预览工作区设置</DialogTitle>
                <DialogDescription>此浮层挂载到 body，使用与页面一致的全局风格。不会修改真实项目。</DialogDescription>
                <Field>
                  <FieldLabel htmlFor={`${id}-dialog-name`}>工作区名称</FieldLabel>
                  <Input id={`${id}-dialog-name`} value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <div className="design-dialog-actions"><DialogClose asChild><Button variant="primary">完成预览</Button></DialogClose></div>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>

        <div className="design-stat-grid">
          <Card padded={false}><span>组件与场景</span><strong>统一表达<Layers3 size={16} aria-hidden="true" /></strong><small>颜色、层次、焦点与状态</small></Card>
          <Card padded={false}><span>交互约定</span><strong>保持不变<Command size={16} aria-hidden="true" /></strong><small>原生事件与受控状态</small></Card>
          <Card padded={false}><span>执行方式</span><strong>{review ? '人工确认' : '仅预览'}<Check size={16} aria-hidden="true" /></strong><small>不自动赋予工具权限</small></Card>
        </div>

        <div className="design-scene-grid">
          <Card data-surface="glass" className="design-form-card">
            <div className="design-section-title">
              <span className="design-app-mark" aria-hidden="true"><Bot size={17} /></span>
              <div><h3>配置你的助手</h3><p>清楚的标签，合适的信息密度。</p></div>
            </div>
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>助手名称</FieldLabel>
              <Input id={`${id}-name`} aria-describedby={`${id}-name-help`} value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} />
              <FieldDescription id={`${id}-name-help`}>风格切换不会清空正在编辑的内容。</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-model`}>运行策略</FieldLabel>
              <Select id={`${id}-model`} value={model} onChange={(event) => setModel(event.target.value)}>
                <option value="balanced">均衡 · 通用任务</option><option value="careful">严谨 · 多步分析</option>
              </Select>
            </Field>
            <ChoiceGroup legend="输出格式">
              <ChoiceField type="radio" name={`${id}-format`} value="summary" label="结构化摘要" description="重点在前，保留来源与下一步建议。" variant="card" defaultChecked />
              <ChoiceField type="radio" name={`${id}-format`} value="report" label="完整研究记录" description="呈现分析过程与工具结果。" variant="card" />
            </ChoiceGroup>
            <div className="design-switch-row">
              <label htmlFor={`${id}-review`}>展示工具审批<span>预览中也保持清晰的权限边界</span></label>
              <Switch id={`${id}-review`} checked={review} onCheckedChange={setReview} />
            </div>
            <div className="design-form-actions">
              <Button variant="primary" onClick={() => setSaved(true)}>保存预览设置</Button>
              <span role="status">{saved ? '已保存到演示状态' : ''}</span>
            </div>
          </Card>

          <div className="design-agent-column">
            <Card data-surface="elevated" className="design-agent-card">
              <div className="design-agent-heading">
                <span className="design-app-mark" aria-hidden="true"><WandSparkles size={17} /></span>
                <div><h3>让执行过程更清楚</h3><p>对话、工具与结果，在同一条线上。</p></div>
                <Badge tone="brand">AI UI</Badge>
              </div>
              <p className="design-user-message">帮我整理这次产品迭代的设计要点。</p>
              <div className="design-assistant-message">
                <span className="design-avatar" aria-hidden="true"><Bot size={15} /></span>
                <div><strong>研究助手</strong><p>我会先整理上下文，再把结果归纳为可操作的任务。你可以随时停止这个本地演示。</p></div>
              </div>
              <ToolCallCard
                name="research.context" state={toolState}
                presentation={{ label: '整理设计上下文', kind: 'skill' }} labels={toolLabels}
                input={running ? { task: '整理设计要点', source: 'local-demo' } : undefined}
                output={toolState === 'completed' ? { summary: '统一层级、保留交互、清楚呈现执行状态。', source: '本地模拟结果' } : undefined}
              />
              <div className="design-run-footer">
                <Progress aria-label="本地演示进度" value={running ? 55 : toolState === 'completed' ? 100 : 0} />
                <span>{running ? '正在整理' : toolState === 'completed' ? '演示完成' : toolState === 'cancelled' ? '演示已停止' : '等待开始'}</span>
              </div>
              <div className="design-mini-composer">
                <label className="design-sr-only" htmlFor={`${id}-prompt`}>演示提示词</label>
                <Textarea id={`${id}-prompt`} rows={2} placeholder="描述下一步想完成的任务…" />
                <div>
                  <span><Command size={12} />本地预览 · 不会发送请求</span>
                  <Button size="sm" variant={running ? 'secondary' : 'primary'} onClick={() => setToolState(running ? 'cancelled' : 'running')}>
                    {running ? <Square size={13} /> : <ArrowUpRight size={14} />}{running ? '停止演示' : '运行演示'}
                  </Button>
                </div>
              </div>
            </Card>
            <div className="design-state-legend">
              <span><Circle size={10} />状态不只靠颜色区分</span>
              <a href="#/components/tool-call-card">查看工具卡片<ArrowUpRight size={13} /></a>
            </div>
          </div>
        </div>

        <Card className="design-table-card">
          <div className="design-table-heading">
            <div><h3>控件在真实内容中工作</h3><p>切换标签样式，检查数据、错误与禁用状态。</p></div>
            <Select aria-label="标签视觉样式" controlSize="sm" value={tabStyle} onChange={(event) => setTabStyle(event.target.value)}>
              <option value="segmented">分段式</option><option value="underline">下划线</option><option value="pills">胶囊式</option>
            </Select>
          </div>
          <Tabs defaultValue="tasks">
            <TabsList data-variant={tabStyle} aria-label="设计系统示例内容">
              <TabsTrigger value="tasks">任务列表</TabsTrigger><TabsTrigger value="states">控件状态</TabsTrigger><TabsTrigger value="disabled" disabled>受限区域</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <DataTable headers={taskHeaders} label="设计预览任务" selectable strictSelection rowIds={['design', 'docs', 'verify']} rowLabels={['视觉语言', 'AI 文档', '浏览器检查']} selectedRowIds={selected} onSelectedRowIdsChange={setSelected}>
                <tbody>
                  <tr><td>视觉语言与主题</td><td><Badge tone="success">已就绪</Badge></td><td>Design</td></tr>
                  <tr><td>AI 接入文档</td><td><Badge tone="brand">可读取</Badge></td><td>Developer</td></tr>
                  <tr><td>浏览器检查</td><td><Badge tone="neutral">演示数据</Badge></td><td>QA</td></tr>
                </tbody>
              </DataTable>
              <p className="design-selection-status" role="status">当前选择 {selected.length} 项</p>
            </TabsContent>
            <TabsContent value="states">
              <div className="design-control-states">
                <Field><FieldLabel htmlFor={`${id}-filled`}>填充式输入</FieldLabel><Input id={`${id}-filled`} data-appearance="filled" placeholder="更轻的表面层级" /></Field>
                <Field><FieldLabel htmlFor={`${id}-error`}>错误状态</FieldLabel><Input id={`${id}-error`} aria-invalid="true" aria-describedby={`${id}-error-help`} defaultValue="无效的标识" /><span id={`${id}-error-help`} className="ui-field-error">请使用字母、数字或连字符。</span></Field>
                <Field><FieldLabel htmlFor={`${id}-readonly`}>只读状态</FieldLabel><Input id={`${id}-readonly`} readOnly value="workspace-preview" /></Field>
                <Field><FieldLabel htmlFor={`${id}-disabled`}>禁用状态</FieldLabel><Input id={`${id}-disabled`} disabled value="由管理员管理" readOnly /></Field>
              </div>
              <div className="design-button-states">
                <Button variant="primary">主操作</Button><Button variant="secondary">次操作</Button><Button variant="outline">轮廓</Button><Button variant="ghost">轻操作</Button><Button variant="danger">危险操作</Button><Button disabled>不可用</Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
