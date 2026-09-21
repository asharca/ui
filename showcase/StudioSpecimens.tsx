import { useEffect, useId, useState } from 'react';
import { ArrowUp, Check, CheckCheck, ChevronRight, Command, CornerDownLeft, Layers3, Play, Plus, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { Button, Input, Switch, Textarea } from '../src/Controls';
import { ChoiceField, ChoiceGroup } from '../src/ChoiceField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { ToolCallCard } from '../src/ToolCallCard';

/** These are local compositions of the real public controls, not product claims. */
export function ProjectSpecimen() {
  const id = useId();
  const [project, setProject] = useState('My next idea');
  const [type, setType] = useState('agent');
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  return <div className="studio-project">
    <div className="studio-specimen-heading"><span className="studio-app-icon"><Layers3 size={19} /></span><div><h3>让想法，有个起点。</h3><p>创建你的下一个工作区</p></div></div>
    <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }} onChange={() => setSaved(false)}>
      <label className="studio-field" htmlFor={`${id}-project`}>项目名称<Input id={`${id}-project`} required value={project} onChange={(event) => setProject(event.target.value)} /></label>
      <ChoiceGroup legend="选择起点"><div className="studio-choices">
        <ChoiceField type="radio" name={`${id}-type`} value="app" checked={type === 'app'} onChange={() => setType('app')} label="应用界面" description="专注产品体验" variant="card" />
        <ChoiceField type="radio" name={`${id}-type`} value="agent" checked={type === 'agent'} onChange={() => setType('agent')} label="AI 工作流" description="从对话到行动" variant="card" />
      </div></ChoiceGroup>
      <div className="studio-setting"><label htmlFor={`${id}-stream`}>流式响应<small>让每一步进展清晰可见</small></label><Switch id={`${id}-stream`} aria-label="流式响应" checked={enabled} onCheckedChange={(value) => { setEnabled(value); setSaved(false); }} /></div>
      <Button type="submit" variant="primary" className="studio-save">{saved ? <Check size={15} /> : <Plus size={15} />}{saved ? '已保存' : '保存配置'}</Button>
      <p className="studio-form-status" role="status">{saved ? '配置已保存 · 仅本地演示' : '只在当前页面演示，不会创建真实项目'}</p>
    </form>
  </div>;
}

export function AgentSpecimen() {
  const [prompt, setPrompt] = useState('整理设计资源，搭建我的下一个界面');
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const [request, setRequest] = useState('为新的工作区，整理一套界面方案。');
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setTimeout(() => setPhase('done'), 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);
  return <div className="studio-agent">
    <header className="studio-agent-header"><span className="studio-app-icon"><Sparkles size={18} /></span><div><strong>设计搭档</strong><small>从一个问题，到下一步行动</small></div><span className="studio-status-dot" aria-label="本地演示已就绪" /></header>
    <div className="studio-user-message">{request}</div>
    <div className="studio-agent-answer"><span className="studio-agent-glyph"><Command size={17} /></span><div><p>{phase === 'running' ? '正在整理组件与交互状态…' : phase === 'done' ? '方案已就绪。从这些组件开始组合。' : '好的。先让每一处细节，都使用同一套设计语言。'}</p><span className="studio-caption">演示数据 · 不连接模型或外部服务</span></div></div>
    <div className="studio-agent-tools"><ToolCallCard name="design__components" state={phase === 'running' ? 'running' : 'completed'} presentation={{ label: '整理界面组件', kind: 'mcp' }} labels={{ running: '整理中', completed: '已完成', output: '组件清单' }} output={{ components: ['Button', 'Tabs', 'ChoiceField'], source: 'local demo' }} /><div className="studio-task-row"><span><CheckCheck size={15} />对齐间距、圆角与交互状态</span><span>03 / 03</span></div></div>
    <div className="studio-context"><span><Layers3 size={12} />组件文档</span><span><Wand2 size={12} />设计约定</span></div>
    <form className="studio-composer" onSubmit={(event) => { event.preventDefault(); if (!prompt.trim() || phase === 'running') return; setRequest(prompt.trim()); setPhase('running'); }}>
      <Textarea aria-label="向演示助手发送任务" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={2} placeholder="描述你的下一个想法…" />
      <div><span><Plus size={14} aria-hidden="true" />本地交互演示</span><Button type="submit" variant="primary" size="sm" aria-label="运行助手演示" disabled={!prompt.trim() || phase === 'running'} loading={phase === 'running'}><ArrowUp size={16} /></Button></div>
    </form>
    <span className="studio-sr-status" role="status">{phase === 'running' ? '正在运行本地演示' : phase === 'done' ? '本地演示已完成' : ''}</span>
  </div>;
}

const panels = [
  { id: 'overview', label: '概览', title: '小交互，大不同。', detail: '切换标签，感受连续的状态过渡。', icon: Layers3 },
  { id: 'activity', label: '活动', title: '每一步，都有回应。', detail: '高亮跟随焦点，内容保持稳定。', icon: Sparkles },
  { id: 'settings', label: '设置', title: '动效，恰到好处。', detail: '支持键盘操作与减少动态效果。', icon: Command },
];
export function MotionSpecimen() {
  const [tab, setTab] = useState('overview');
  return <div className="studio-motion">
    <Tabs value={tab} onValueChange={setTab}><TabsList aria-label="动效体验" data-variant="pills">{panels.map((panel) => <TabsTrigger key={panel.id} value={panel.id}>{panel.label}</TabsTrigger>)}</TabsList>
      {panels.map(({ id, title, detail, icon: Icon }) => <TabsContent key={id} value={id}><div className="studio-motion-orbit"><Icon size={25} strokeWidth={1.5} /></div><h3>{title}</h3><p>{detail}</p></TabsContent>)}
    </Tabs>
    <Button size="sm" variant="ghost" onClick={() => setTab(panels[(panels.findIndex((panel) => panel.id === tab) + 1) % panels.length].id)}><Play size={12} />重播动效</Button>
  </div>;
}

export function ActionSpecimen() {
  const [saved, setSaved] = useState(false);
  return <div className="studio-actions-specimen"><span className="studio-caption">有分寸的反馈，不抢走注意力。</span><div><Button variant="primary" size="sm" onClick={() => setSaved((value) => !value)}>{saved ? <Check size={14} /> : <CornerDownLeft size={14} />}{saved ? '已保存' : '试着点击'}</Button><Button variant="outline" size="sm" aria-label="重置按钮演示" onClick={() => setSaved(false)}><RotateCcw size={14} /></Button><Button size="sm" variant="ghost" asChild><a href="#/components/button">更多<ChevronRight size={14} /></a></Button></div><span role="status" className="studio-caption">{saved ? '更改已保存 · 本地示例' : '悬停 · 按下 · 焦点 · 完成'}</span></div>;
}
