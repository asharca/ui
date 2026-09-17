/// <reference types="vite/client" />
import { Component, lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Spinner } from '../src/Feedback';
import { componentMetadata, type ApiRow } from './component-metadata';

class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">示例加载失败，请刷新页面重试。</p> : this.props.children; }
}
const logoApi: readonly ApiRow[] = [
  ['svgSize', 'number', '28', '品牌图形尺寸（像素）'],
  ['showWordmark', 'boolean', 'true', '是否显示 ToolPlane 文字'],
  ['wordmarkClass', 'string', 'text-2xl', '品牌文字样式'],
  ['className / 原生 span 属性', 'HTML span 属性', '—', '外层布局和可访问名称'],
];
// Metadata does not load chat runtimes; demos are imported only when mounted.
const loaders = import.meta.glob<Record<string, ComponentType>>('./demos/*.tsx');
export const componentDocs = componentMetadata.map((metadata) => {
  // The historic ToolbarDemo file is for the chat composer, not layout Toolbar.
  const doc = { ...metadata, demoFile: metadata.name === 'Toolbar' ? 'ToolbarLayoutDemo.tsx' : metadata.demoFile, api: metadata.name === 'ToolPlaneLogo' ? logoApi : metadata.api };
  const Demo = lazy(async () => {
    const load = loaders[`./demos/${doc.demoFile}`];
    if (!load) throw new Error(`Missing demo: ${doc.demoFile}`);
    const module = await load();
    const component = module[doc.demoFile.replace(/\.tsx$/, '')];
    if (!component) throw new Error(`Missing export in ${doc.demoFile}`);
    return { default: component };
  });
  return { ...doc, code: '', preview: <DemoBoundary><Suspense fallback={<Spinner label="加载组件示例" />}><Demo /></Suspense></DemoBoundary> };
});
