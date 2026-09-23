import { Component, Suspense, lazy, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { Monitor, RotateCcw, Smartphone } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../registry/ui/tabs';
import { fadeTransition } from '../registry/ui/utils';
import { CodeBlock } from './code';
import { RegistryFiles, useRegistry } from './registry';
import './preview.css';

const modules = import.meta.glob<{ default: ComponentType }>('../examples/*.tsx');
const rawModules = import.meta.glob<string>('../examples/*.tsx', { query: '?raw', import: 'default' });
const demos: Record<string, LazyExoticComponent<ComponentType>> = {};
for (const [path, load] of Object.entries(modules)) demos[path.split('/').at(-1)!.replace('.tsx', '')] = lazy(load);
class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert" className="small-note">示例暂时无法加载，请刷新页面重试。</p> : this.props.children; }
}
export function Preview({ name, eager = false }: { name: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);
  useEffect(() => {
    if (ready) return;
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ready]);
  const Demo = demos[name];
  return <div ref={ref} className={`demo-content${eager ? '' : ' self-start min-h-full'}`}><PreviewBoundary key={name}><Suspense fallback={<span role="status" className="small-note">正在加载组件…</span>}>{ready && Demo ? <Demo /> : <span className="preview-placeholder" aria-hidden="true" />}</Suspense></PreviewBoundary></div>;
}
function Usage({ name }: { name: string }) {
  const [code, setCode] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const loader = rawModules[`../examples/${name}.tsx`];
    if (!loader) { setFailed(true); return; }
    loader().then((text) => { if (active) setCode(text); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [name]);
  return failed ? <p role="alert">示例源码加载失败，请刷新重试。</p> : code ? <CodeBlock code={code} label={`${name}.tsx`} /> : <p role="status" className="small-note">正在读取用法…</p>;
}
export function ExampleSection({ slug, name, title }: { slug: string; name: string; title: string }) {
  const [tab, setTab] = useState('preview');
  const [revision, setRevision] = useState(0);
  const [width, setWidth] = useState<'full' | 'narrow'>('full');
  const reduce = useReducedMotion();
  const { payload, error, retry } = useRegistry(slug);
  return <section className="example-section"><h2>{title}</h2><Tabs value={tab} onValueChange={setTab} className="example-workbench">
    <div className="preview-toolbar workbench-toolbar">
      <TabsList variant="underline" aria-label={`${title}显示方式`} className="gap-3 border-0">
        <TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <div className="workbench-actions">
        <div role="group" aria-label="预览宽度" className="workbench-width">
          <button type="button" className="workbench-tool" aria-label="宽屏预览" title="宽屏预览" aria-pressed={width === 'full'} disabled={tab !== 'preview'} onClick={() => setWidth('full')}><Monitor size={15} aria-hidden="true" /></button>
          <button type="button" className="workbench-tool" aria-label="窄屏预览" title="窄屏预览（容器宽度 360px，并非设备模拟）" aria-pressed={width === 'narrow'} disabled={tab !== 'preview'} onClick={() => setWidth('narrow')}><Smartphone size={15} aria-hidden="true" /></button>
        </div>
        <span aria-hidden="true" className="workbench-divider" />
        <button type="button" className="workbench-tool" aria-label="重置预览" title="重置预览" disabled={tab !== 'preview'} onClick={() => setRevision((value) => value + 1)}>
          <motion.span initial={false} animate={{ rotate: reduce ? 0 : revision * -180 }} transition={fadeTransition}><RotateCcw size={15} aria-hidden="true" /></motion.span>
        </button>
      </div>
    </div>
    <TabsContent value="preview" forceMount hidden={tab !== 'preview'} inert={tab !== 'preview'} className="detail-preview data-[state=inactive]:hidden">
      <div data-preview-width={width} className="preview-canvas" style={{ maxWidth: width === 'narrow' ? 360 : '100%' }}><Preview key={revision} name={name} eager /></div>
    </TabsContent>
    <TabsContent value="usage" className="workbench-source"><Usage key={name} name={name} /></TabsContent>
    <TabsContent value="code" className="workbench-source">{error ? <p role="alert">源码加载失败：{error} <button type="button" onClick={retry}>重试</button></p> : payload ? <RegistryFiles payload={payload} slug={slug} /> : <p role="status" className="small-note">正在读取源码…</p>}</TabsContent>
  </Tabs></section>;
}
