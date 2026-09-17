import type { ComponentMetadata } from './component-metadata.ts';

export function publicExample(source: string) {
  return source.replace(/(['"])\.\.\/\.\.\/src\/index\1/g, '"@asharca/ui"');
}
function cell(value: string) { return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>'); }
export function componentMarkdown(doc: ComponentMetadata, source: string, version: string) {
  const example = publicExample(source);
  // A longer fence keeps Markdown examples containing backticks valid.
  const fence = '`'.repeat(Math.max(3, ...(example.match(/`+/g) ?? []).map((run) => run.length + 1)));
  return [
    `# ${doc.name}`, '', doc.description, '',
    `Package: @asharca/ui · workspace version: ${version} · category: ${doc.group}`, '',
    '> 本文对应当前工作区代码，不代表 npm 上同版本已经包含这些新增 API。先核对目标项目的 package.json、exports 与已安装类型声明。', '',
    '## 安装与样式', '', '```sh', 'pnpm add @asharca/ui', '```', '',
    '需要 React 19、React DOM 19、Tailwind CSS 4；聊天运行时遵守 package.json 的 peerDependencies，不要擅自升级或关闭严格 peer 检查。', '',
    '```css', '@import "tailwindcss";', '@import "@asharca/ui/styles.css";', '```', '',
    '## 按需导入', '', '```tsx', `import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`, '```', '',
    '## 主要 API', '', '| 属性 | 类型 | 默认值 | 说明 |', '| --- | --- | --- | --- |',
    ...doc.api.map((row) => `| ${row.map(cell).join(' | ')} |`), '',
    '## 完整示例', '', `${fence}tsx`, example.trim(), fence, '',
    '## 接入边界', '', doc.notes, '',
    '回调、业务权限、模型服务、路由和持久化由宿主提供。示例仅使用本地状态；涉及图片时请替换演示资源。', '',
    `实现文件：src/${doc.file}。示例文件：showcase/demos/${doc.demoFile}。完整原生属性以公开 TypeScript 声明为准。`, '',
  ].join('\n');
}
