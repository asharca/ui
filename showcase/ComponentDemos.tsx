/// <reference types="vite/client" />
import { Component, lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Spinner } from '../src/Feedback';
import { catalogMetadata } from './catalog-data';

class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">示例加载失败，请使用“重置组件预览”重试。</p> : this.props.children; }
}
const loaders = import.meta.glob<Record<string, ComponentType>>('./demos/*.tsx');
export const componentDocs = catalogMetadata.map((doc) => {
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
