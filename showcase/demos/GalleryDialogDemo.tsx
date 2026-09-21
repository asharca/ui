import { useId, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Input, Switch, ChoiceField, ChoiceGroup } from '../../src/index';

export function GalleryDialogDemo() {
  const id = useId();
  const [project, setProject] = useState('My workspace');
  const [type, setType] = useState('agent');
  const [stream, setStream] = useState(true);
  const [saved, setSaved] = useState(false);
  return <Dialog><DialogTrigger asChild><Button variant="outline" style={{ borderRadius: 999 }}><Settings2 size={15} />编辑项目</Button></DialogTrigger><DialogPortal><DialogOverlay /><DialogContent style={{ maxWidth: 400 }}><DialogTitle>项目设置</DialogTitle><DialogDescription>本地预览</DialogDescription><form aria-label="项目配置演示" onSubmit={(event) => { event.preventDefault(); setSaved(true); }} onChange={() => setSaved(false)} style={{ display: 'grid', gap: 20 }}>
    <label htmlFor={id} style={{ display: 'grid', gap: 8 }}>项目名称<Input id={id} required value={project} onChange={(event) => setProject(event.target.value)} /></label>
    <ChoiceGroup legend="项目类型"><ChoiceField type="radio" name={`${id}-type`} value="app" label="应用界面" checked={type === 'app'} onChange={() => setType('app')} /><ChoiceField type="radio" name={`${id}-type`} value="agent" label="AI 工作流" checked={type === 'agent'} onChange={() => setType('agent')} /></ChoiceGroup>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><label htmlFor={`${id}-stream`}>流式响应</label><Switch id={`${id}-stream`} checked={stream} onCheckedChange={(value) => { setStream(value); setSaved(false); }} /></div>
    {saved && <p role="status">配置已保存 · 仅本地演示</p>}<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><DialogClose asChild><Button variant="ghost">关闭</Button></DialogClose><Button type="submit" variant="primary">保存配置</Button></div>
  </form></DialogContent></DialogPortal></Dialog>;
}
