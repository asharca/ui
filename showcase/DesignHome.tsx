import { ArrowRight } from 'lucide-react';
import { CopyButton } from '../src/Forms';
import { ReferenceShowroom } from './ReferenceShowroom';

export function DesignHome() {
  return <div className="studio-home ref-home">
    <header className="ref-hero">
      <h1>组件与交互</h1>
      <p>React 组件，细节到位。</p>
      <div className="ref-install"><code>pnpm add @asharca/ui</code><CopyButton text="pnpm add @asharca/ui" label="复制安装命令" copiedLabel="已复制安装命令" failedLabel="复制失败" iconOnly /></div>
    </header>
    <ReferenceShowroom />
    <div className="ref-browse"><a href="#/components">全部组件<ArrowRight size={15} /></a></div>
    <footer className="studio-footer ref-footer"><a href="#/home"><strong>asharca / ui</strong></a><nav aria-label="页脚导航"><a href="#/installation">文档</a><a href="#/themes">主题</a><a href="#/examples">示例</a><a href="#/ai">AI 文档</a></nav></footer>
  </div>;
}
