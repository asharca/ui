import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, RotateCcw } from 'lucide-react';
import { IconButton, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { componentDocs } from './ComponentDemos';
import { componentMarkdown, publicExample } from './component-markdown';
import { DocCode } from './DocCode';
import { DesignControls } from './DesignControls';
import { previewHref, themeSetup, type DesignStyle, type DesignDensity } from './design-settings';
import { version } from '../package.json';

const demos = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const sources = import.meta.glob<string>('../src/*.{tsx,ts,css}', { query: '?raw', import: 'default' });

export function ComponentPage({ id, dark, style, density, onStyleChange }: { id: string; dark: boolean; style: DesignStyle; density: DesignDensity; onStyleChange: (style: DesignStyle) => void }) {
  const doc = componentDocs.find((item) => item.id === id)!;
  const [view, setView] = useState('preview');
  const [viewport, setViewport] = useState('inline');
  const [canvas, setCanvas] = useState('plain');
  const [revision, setRevision] = useState(0);
  const [example, setExample] = useState('');
  const [error, setError] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [file, setFile] = useState(doc.file);
  const [source, setSource] = useState('');
  const [sourceError, setSourceError] = useState(false);
  const standalone = previewHref(id, dark, style, density);
  useEffect(() => {
    let active = true;
    const load = demos[`./demos/${doc.demoFile}`];
    Promise.resolve().then(() => { if (!load) throw new Error('Missing demo'); return load(); })
      .then((text) => { if (active) setExample(publicExample(text)); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [doc.demoFile]);
  useEffect(() => {
    if (!sourceOpen) return;
    let active = true; setSource(''); setSourceError(false);
    const load = sources[`../src/${file}`];
    Promise.resolve().then(() => { if (!load) throw new Error('Missing source'); return load(); })
      .then((text) => { if (active) setSource(text); }).catch(() => { if (active) setSourceError(true); });
    return () => { active = false; };
  }, [file, sourceOpen]);
  const index = componentDocs.indexOf(doc);
  return <div className="ex-document ex-detail">
    <header className="ex-page-title"><h1>{doc.name}</h1><p>{doc.description}</p></header>
    <section id="preview" className="ex-playground"><Tabs className="docs-component-tabs" style={{ position: 'relative' }} value={view} onValueChange={setView}>
      <div className="ex-playground-tabs"><TabsList data-variant="pills" aria-label="组件示例视图"><TabsTrigger value="preview">预览</TabsTrigger><TabsTrigger value="code" aria-label="用法代码">React</TabsTrigger><TabsTrigger value="css">CSS</TabsTrigger><TabsTrigger value="install">安装</TabsTrigger></TabsList>{example && <CopyButton text={componentMarkdown(doc, example, version)} label="复制给 AI" copiedLabel="已复制 Markdown" failedLabel="复制失败" />}</div>
      <TabsContent value="preview" forceMount aria-hidden={view !== 'preview'} inert={view !== 'preview'} style={view === 'preview' ? undefined : { visibility: 'hidden', position: 'absolute', insetInline: 0, top: 0 }}>
        <div className="ex-detail-stage docs-preview-catalog" data-canvas={canvas}>{viewport === 'inline' ? <div className="docs-demo-canvas" key={revision}>{doc.preview}</div> : <div className="docs-viewport-scroll"><iframe className="docs-preview-frame" key={`${revision}-${viewport}`} title={`${doc.name} ${viewport}px 预览`} src={standalone} style={{ width: Number(viewport) }} /></div>}</div>
        {view === 'preview' && <div className="ex-preview-options"><div className="ex-backgrounds" role="group" aria-label="预览背景">{[['plain', '纯色'], ['dots', '点阵'], ['grid', '网格']].map(([value, label]) => <button key={value} type="button" aria-label={label} title={label} data-background={value} aria-pressed={canvas === value} onClick={() => setCanvas(value)} />)}</div><div className="docs-preview-actions"><DesignControls style={style} onStyleChange={onStyleChange} /><Select aria-label="预览视口" value={viewport} controlSize="sm" onChange={(event) => setViewport(event.target.value)}><option value="inline">自适应</option><option value="375">手机 · 375px</option><option value="768">平板 · 768px</option><option value="1280">桌面 · 1280px</option></Select><IconButton label="重置组件预览" icon={<RotateCcw size={14} />} size="sm" variant="ghost" onClick={() => setRevision((value) => value + 1)} /><a href={standalone} target="_blank" rel="noreferrer" aria-label="独立打开示例"><ExternalLink size={14} /></a></div></div>}
      </TabsContent>
      <TabsContent value="code">{error ? <p role="alert">示例加载失败，请刷新重试。</p> : example ? <DocCode code={example} label="用法 TSX" /> : <p role="status">加载源码…</p>}</TabsContent>
      <TabsContent value="css"><DocCode label="主题 CSS" language="css" code={themeSetup(dark, style, density)} /></TabsContent>
      <TabsContent value="install"><DocCode label="组件安装命令" language="bash" code="pnpm add @asharca/ui" /><DocCode label="组件导入" code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`} /><a className="ex-text-link" href="#/installation">完整安装步骤<ArrowRight size={14} /></a></TabsContent>
    </Tabs></section>
    <section id="installation" className="ex-quick-install"><h2>安装与导入</h2><DocCode label="按需导入" code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`} /><a className="ex-text-link" href="#/installation">安装与样式配置<ArrowRight size={13} /></a></section>
    <section id="api"><details className="ex-details"><summary role="button"><h2>API 参考</h2></summary><div className="docs-api-scroll" role="region" aria-label={`${doc.name} 属性说明`} tabIndex={0}><table className="docs-api-table"><thead><tr>{['属性', '类型', '默认值', '说明'].map((name) => <th key={name} scope="col">{name}</th>)}</tr></thead><tbody>{doc.api.map(([name, type, value, description]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{value}</td><td>{description}</td></tr>)}</tbody></table></div></details></section>
    <section id="usage"><details className="ex-details"><summary role="button"><h2>使用约定</h2></summary><p>{doc.notes}</p><div className="docs-related">{componentDocs.filter((item) => item.group === doc.group && item.id !== id).slice(0, 4).map((item) => <a href={`#/components/${item.id}`} key={item.id}>{item.name}</a>)}</div></details></section>
    <section id="source"><details className="ex-details" open={sourceOpen} onToggle={(event) => setSourceOpen(event.currentTarget.open)}><summary role="button">查看组件实现</summary>{sourceOpen && <><Select aria-label="源码文件" value={file} onChange={(event) => setFile(event.target.value)}>{[doc.file, ...Object.keys(sources).map((path) => path.replace('../src/', '')).filter((path) => path !== doc.file).sort()].map((path) => <option key={path}>{path}</option>)}</Select>{sourceError ? <p role="alert">源码加载失败，请重试。</p> : source ? <DocCode code={source} label={`src/${file}`} language={file.endsWith('.css') ? 'css' : 'tsx'} /> : <p role="status">加载源码…</p>}</>}</details></section>
    <p className="ex-version">文档 v{version} · <a href={`${import.meta.env.BASE_URL}ai/components/${id}.md`}>Markdown</a></p>
    <footer className="docs-pager">{index > 0 ? <a href={`#/components/${componentDocs[index - 1].id}`}><ArrowLeft size={14} />{componentDocs[index - 1].name}</a> : <span />}{index < componentDocs.length - 1 && <a href={`#/components/${componentDocs[index + 1].id}`}>{componentDocs[index + 1].name}<ArrowRight size={14} /></a>}</footer>
  </div>;
}
