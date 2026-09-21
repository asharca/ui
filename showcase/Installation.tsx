import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../src/Navigation';
import { DocCode } from './DocCode';
import { version, devDependencies } from '../package.json';

export const packageCommands: Record<string, string> = { pnpm: 'pnpm add', npm: 'npm install', yarn: 'yarn add', bun: 'bun add' };
export function Installation() {
  const [manager, setManager] = useState('pnpm');
  const command = packageCommands[manager];
  return <div className="ex-document ex-installation"><header className="ex-page-title"><h1>安装</h1><p>选一种方式，开始使用。</p></header>
    <section id="requirements"><div className="ex-requirements"><span>React 19</span><span>Tailwind CSS 4</span><span>TypeScript</span></div></section>
    <section id="dependencies"><h2>安装组件库</h2><div className="ex-package-tabs"><Tabs value={manager} onValueChange={setManager}><TabsList aria-label="安装工具" data-variant="underline">{Object.keys(packageCommands).map((name) => <TabsTrigger key={name} value={name}>{name}</TabsTrigger>)}</TabsList></Tabs></div><DocCode label="安装命令" language="bash" code={`${command} @asharca/ui`} />
      <details className="ex-details"><summary>依赖未自动安装或版本冲突？</summary><DocCode label="完整依赖安装命令" language="bash" code={`${command} @asharca/ui @assistant-ui/react@${devDependencies['@assistant-ui/react']} react@^19 react-dom@^19 tailwindcss@^4`} /></details>
    </section>
    <section id="styles"><h2>引入样式</h2><p>在已配置 Tailwind 4 的项目中，按顺序导入。</p><DocCode label="app.css" language="css" code={'@import "tailwindcss";\n@import "@asharca/ui/styles.css";\n@import "@asharca/ui/themes.css";'} /></section>
    <section id="first-component"><h2>使用组件</h2><DocCode label="App.tsx" code={'import { Button } from "@asharca/ui/controls";\nimport "./app.css";\n\nexport default function App() {\n  return (\n    <main data-ui-style="minimal">\n      <Button variant="primary">开始使用</Button>\n    </main>\n  );\n}'} /><a className="ex-text-link" href="#/components/button">Button<ArrowUpRight size={14} /></a></section>
    <section id="theme"><h2>主题</h2><p>为文档根元素设置主题，浮层会保持一致。</p><DocCode label="根元素配置" code={'// 在应用初始化时设置，或直接写在 HTML 根元素上。\ndocument.documentElement.dataset.uiStyle = "minimal";\ndocument.documentElement.dataset.uiDensity = "comfortable";\n// 深色模式\ndocument.documentElement.classList.add("dark");'} /><a className="ex-text-link" href="#/themes">Minimal · Tech · Glass<ArrowUpRight size={14} /></a></section>
    <section id="copy"><h2>复制示例</h2><p>组件卡片右下角打开源码。复制对应 React 示例，保留组件库与样式依赖。</p></section>
    <section id="skill"><h2>交给 AI</h2><DocCode label="安装 Skill" language="bash" code="npx skills add asharca/ui" /><a className="ex-text-link" href="#/ai">Skill 与 AI 文档<ArrowUpRight size={14} /></a></section>
    <p className="ex-version">文档 v{version} · 请核对已安装版本与导出。</p>
  </div>;
}
