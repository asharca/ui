import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogMetadata } from '../showcase/catalog-data.ts';
import { componentMarkdown } from '../showcase/component-markdown.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const publicRoot = join(root, 'showcase/public');
const guide = readFileSync(join(root, 'docs/ai/README.md'), 'utf8');
const patterns = readFileSync(join(root, 'docs/ai/PATTERNS.md'), 'utf8');
assert.equal(new Set(catalogMetadata.map((doc) => doc.id)).size, catalogMetadata.length, 'Duplicate document IDs');
const pages = catalogMetadata.map((doc) => {
  assert(/^[a-z0-9-]+$/.test(doc.id), `Unsafe document path: ${doc.id}`);
  assert(manifest.exports[doc.module ? `./${doc.module}` : '.'], `Unpublished subpath for ${doc.name}`);
  const source = readFileSync(join(root, 'showcase/demos', doc.demoFile), 'utf8');
  return { doc, markdown: componentMarkdown(doc, source, manifest.version) };
});
const index = (prefix) => [
  '# @asharca/ui', '',
  '> React 控件、表单、工作区与 ToolPlane 风格聊天组件。此索引与当前工作区同时生成；不是 shadcn CLI 注册表。', '',
  `Workspace version: ${manifest.version}. Verify installed exports before using unreleased branch APIs.`, '',
  '## 接入规则', '', `- [AI 使用指南](${prefix}README.md)`, `- [组合模式与检查清单](${prefix}PATTERNS.md)`, '',
  '## 组件', '', ...pages.map(({ doc }) => `- [${doc.name}](${prefix}components/${doc.id}.md): ${doc.description}`), '',
].join('\n');
const full = [index('./'), guide, patterns, ...pages.map(({ markdown }) => markdown)].join('\n\n---\n\n');
// These directories contain generated documentation only. Never clear public/ itself.
for (const destination of [join(publicRoot, 'ai'), join(root, 'dist/ai')]) {
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(join(destination, 'components'), { recursive: true });
  writeFileSync(join(destination, 'README.md'), guide);
  writeFileSync(join(destination, 'PATTERNS.md'), patterns);
  writeFileSync(join(destination, 'llms.txt'), index('./'));
  writeFileSync(join(destination, 'llms-full.txt'), full);
  for (const { doc, markdown } of pages) writeFileSync(join(destination, 'components', `${doc.id}.md`), markdown);
}
writeFileSync(join(publicRoot, 'llms.txt'), index('./ai/'));
writeFileSync(join(publicRoot, 'llms-full.txt'), full.replaceAll('](./components/', '](./ai/components/').replaceAll('](./README.md)', '](./ai/README.md)').replaceAll('](./PATTERNS.md)', '](./ai/PATTERNS.md)'));
for (const { doc } of pages) assert(existsSync(join(publicRoot, 'ai/components', `${doc.id}.md`)));
console.log(`Generated AI docs for ${pages.length} components: llms.txt, llms-full.txt, public/ai and dist/ai.`);
