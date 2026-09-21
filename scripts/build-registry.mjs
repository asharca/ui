import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { registryItemSchema, registrySchema } from 'shadcn/schema';
import { allEntries, catalog, resolveFiles } from '../registry/catalog.mjs';

const root = resolve(import.meta.dirname, '..');
const site = new URL(process.env.SITE_URL || 'https://asharca.github.io/ui/');
if (!['https:', 'http:'].includes(site.protocol) || site.search || site.hash) throw new Error('SITE_URL must be an HTTP(S) deployment URL.');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const url = (path) => new URL(path, site).href;
await rm(resolve(root, 'public/r'), { recursive: true, force: true });
await mkdir(resolve(root, 'public/r'), { recursive: true });
const items = [];
for (const entry of allEntries) {
  const closure = resolveFiles(entry.slug);
  const files = await Promise.all(closure.map(async (item) => {
    const path = `registry/ui/${item.slug}.${item.slug === 'utils' ? 'ts' : 'tsx'}`;
    return { path, type: 'registry:component', target: `@components/asharca/${item.slug}.${item.slug === 'utils' ? 'ts' : 'tsx'}`, content: await readFile(resolve(root, path), 'utf8') };
  }));
  const item = registryItemSchema.parse({
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: entry.slug, type: entry.slug === 'chat-panel' ? 'registry:block' : 'registry:component',
    title: entry.name, description: entry.description, author: 'asharca',
    dependencies: [...new Set(closure.flatMap((item) => item.dependencies))].sort(),
    files, categories: [entry.group],
    docs: 'Requires React 19, TypeScript, Tailwind CSS 4 and shadcn theme tokens. Files are installed below aliases.components/asharca. No global styles or existing theme values are overwritten. Model calls and authentication belong to your app.',
  });
  await writeFile(resolve(root, `public/r/${entry.slug}.json`), JSON.stringify(item, null, 2) + '\n');
  items.push(item);
}
const registry = registrySchema.parse({ $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'asharca', homepage: site.href, items });
await writeFile(resolve(root, 'public/registry.json'), JSON.stringify(registry, null, 2) + '\n');
const text = [
  '# Asharca UI', '',
  '> 简约的 React 组件源码。通过 shadcn 安装，然后在自己的项目中修改。', '',
  '## Endpoints', '',
  `- Registry index: ${url('registry.json')}`,
  `- Component source and dependencies: ${url('r/{slug}.json')}`,
  `- Installation guide: ${url('docs/installation/')}`, '',
  '## Installation', '',
  'Requires React 19, TypeScript, Tailwind CSS 4 and a project initialized with shadcn. Existing shadcn theme tokens are reused; installing a component does not replace the project theme.', '',
  `npx shadcn@latest add ${url('r/button.json')}`, '',
  'Each JSON payload contains the complete local dependency closure: copy every files[].content to the path described by files[].target and install all dependencies. @components/ resolves to aliases.components in components.json, not a literal folder. Relative imports must stay relative; keep all installed files in the same asharca directory.', '',
  'Example with the conventional @/ alias:', '',
  'import { Button } from "@/components/asharca/button";', '',
  'Use project-local imports. Read the actual TypeScript prop types in the payload instead of inventing APIs. Follow the host project aliases when they differ from @/. Do not silently overwrite locally modified files. CLI and manual installation use identical source.', '',
  '## Components', '',
  ...catalog.map((entry) => `- [${entry.name}](${url(`r/${entry.slug}.json`)}): ${entry.description} Preview: ${url(`components/${entry.slug}/`)}`), '',
  '## AI interfaces', '',
  'AI components are presentation and interaction only. The host supplies model requests, streaming state, credentials, persistence and permission enforcement. ApprovalCard only calls the supplied decision callback; it does not grant permissions by itself. Chat previews on the website are local simulations, not model connections.', '',
  '## Source', '',
  'https://github.com/asharca/ui', '',
  'MIT. Visual direction: beui.dev. See THIRD_PARTY_NOTICES.md for attribution.', '',
].join('\n');
await writeFile(resolve(root, 'public/llms.txt'), text, 'utf8');
console.log(`Built ${catalog.length} components, ${items.length} validated registry items and one UTF-8 llms.txt.`);
