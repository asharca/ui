import { Box, ArrowRight } from 'lucide-react';
import { ComponentGallery } from './ComponentGallery';
import { componentDocs } from './ComponentDemos';
import { MaterialButtonDemo } from './demos/MaterialButtonDemo';

const button = componentDocs.find((doc) => doc.id === 'button')!;
const featured = [
  { ...button, id: 'material-button', name: 'Metallic Button', demoFile: 'MaterialButtonDemo.tsx', preview: <MaterialButtonDemo /> },
  ...['tabs', 'switch', 'button', 'dropdown-menu', 'dialog', 'avatar', 'accordion', 'choice-field', 'chat-composer-toolbar', 'tool-call-card', 'data-table'].map((id) => componentDocs.find((doc) => doc.id === id)!),
];
export function DesignHome() {
  return <div className="ex-home studio-home"><header className="ex-hero"><span className="ex-hero-mark" aria-hidden="true"><Box size={22} strokeWidth={1.5} /></span><h1>组件与交互</h1><p>为 React 与 AI 应用而设计。<br />预览、复制，直接使用。</p><div><button type="button" className="ex-pill ex-pill-primary" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })}>浏览组件</button><a href="#/installation" className="ex-pill">安装</a></div></header><ComponentGallery featured={featured} /><div className="ex-browse"><a href="#/components" aria-label="浏览全部组件">全部组件<ArrowRight size={14} /></a></div></div>;
}
