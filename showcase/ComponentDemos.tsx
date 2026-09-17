/// <reference types="vite/client" />
import { Component, lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Spinner } from '../src/Feedback';
import { componentMetadata } from './component-metadata';

class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">示例加载失败，请刷新页面重试。</p> : this.props.children; }
}
// Keep metadata independent of chat runtimes and import demos on demand.
const loaders = import.meta.glob<Record<string, ComponentType>>('./demos/*.tsx');
export const componentDocs = componentMetadata.map((metadata) => {
  // The original ToolbarDemo name belongs to the chat composer toolbar.
  const doc = { ...metadata, demoFile: metadata.name === 'Toolbar' ? 'ToolbarLayoutDemo.tsx' : metadata.demoFile };
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
