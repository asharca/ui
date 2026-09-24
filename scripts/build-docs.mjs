import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import docgen from 'react-docgen-typescript';
import { catalog } from '../registry/catalog.mjs';
import { fence, normalizeProps, propsMarkdown } from './docs-support.mjs';
import { renderUpdateGuide } from './update-guide.mjs';

// Same extraction approach as beUI's lib/props-extractor.ts (MIT): build once
// from the real TS program, never hand-write a second set of component APIs.
const root = path.resolve(import.meta.dirname, '..');
try { process.loadEnvFile(path.join(root, '.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const site = new URL(process.env.SITE_URL || 'https://asharca.github.io/ui/');
assert.ok(['http:', 'https:'].includes(site.protocol) && !site.search && !site.hash, 'Invalid SITE_URL');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const url = (route) => new URL(route.replace(/^\//, ''), site).href;
const files = catalog.map((entry) => path.join(root, `registry/ui/${entry.slug}.tsx`));
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(files, parsed.options);
const checker = program.getTypeChecker();
const parser = docgen.withDefaultConfig({
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  savePropValueAsString: true,
  skipChildrenPropWithoutDoc: false,
  propFilter: () => true,
});
const extracted = parser.parseWithProgramProvider(files, () => program);

function implementation(node) {
  if (!node) return undefined;
  if (ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) return node;
  if (ts.isCallExpression(node)) return node.arguments.map(implementation).find(Boolean);
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return implementation(node.expression);
}
function fileMetadata(file) {
  const defaults = new Map();
  const relatedTypes = [];
  const helpers = [];
  for (const statement of file.statements) {
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      relatedTypes.push({ name: statement.name.text, code: statement.getText(file) });
    }
    const functions = ts.isFunctionDeclaration(statement) ? [[statement.name?.text, statement]] : ts.isVariableStatement(statement)
      ? statement.declarationList.declarations.map((declaration) => [declaration.name.getText(file), implementation(declaration.initializer)]) : [];
    for (const [name, fn] of functions) {
      if (!fn || !name) continue;
      if (/^[a-z]/.test(name)) {
        const signature = checker.getSignatureFromDeclaration(fn);
        if (signature) helpers.push({ name, code: `export function ${name}${checker.signatureToString(signature, fn, ts.TypeFormatFlags.NoTruncation)};` });
      }
      const binding = fn.parameters[0]?.name;
      if (!binding || !ts.isObjectBindingPattern(binding)) continue;
      defaults.set(name, Object.fromEntries(binding.elements.filter((element) => element.initializer).map((element) => [(element.propertyName || element.name).getText(file).replace(/^['"]|['"]$/g, ''), element.initializer.getText(file)])));
    }
  }
  return { defaults, relatedTypes, helpers };
}
const apiFolder = path.join(root, 'public/api-reference');
await rm(apiFolder, { recursive: true, force: true });
await mkdir(apiFolder, { recursive: true });
await mkdir(path.join(root, 'public/components'), { recursive: true });
await mkdir(path.join(root, 'public/docs'), { recursive: true });
await mkdir(path.join(root, '.generated'), { recursive: true });
const pages = [];
async function emit(route, title, markdown, extra = {}) {
  const markdownPath = `${route.replace(/^\//, '')}.md`;
  await writeFile(path.join(root, 'public', markdownPath), `${markdown.trimEnd()}\n`, 'utf8');
  pages.push({ route, title, canonicalUrl: url(`${route}/`), markdownPath, markdownUrl: url(markdownPath), ...extra });
}
const requirements = 'Requires React 19, TypeScript, Tailwind CSS 4 and a project initialized with shadcn. Component files are installed under aliases.components/asharca from components.json. Reuses existing theme tokens without replacing them.';
const namespace = JSON.stringify({ registries: { '@asharca': url('r/{name}.json').replace('%7Bname%7D', '{name}') } }, null, 2);
const install = (slug) => [
  '## Installation', requirements, '',
  fence(`npx shadcn@latest add ${url(`r/${slug}.json`)}`, 'bash'), '',
  'For short commands, merge the following field into the consuming project\'s components.json. Preserve its other fields. Do not assume public directory acceptance.',
  fence(namespace, 'json'), fence(`npx shadcn@latest add @asharca/${slug}`, 'bash'), '',
  'Use project-local imports, for example @/components/asharca/button. Adjust @/ to your project alias.', '',
  '## Updating installed source', '',
  'Already installed or customized? Save your work first, inspect every file in the dependency closure, then preserve local modifications while applying upstream changes. --diff is inspection, not automatic merging; --overwrite replaces existing files and requires explicit approval for the complete affected scope.', '',
  fence(`npx shadcn@latest add ${url(`r/${slug}.json`)} --dry-run`, 'bash'), '',
  `[Complete update guide: diffs, customizations, verification and rollback](${url('docs/updating/')})`,
];
for (const entry of catalog) {
  const sourcePath = `registry/ui/${entry.slug}.tsx`;
  const file = program.getSourceFile(path.join(root, sourcePath));
  assert.ok(file, `Missing source ${entry.slug}`);
  const { defaults, relatedTypes, helpers } = fileMetadata(file);
  const docs = extracted.filter((doc) => path.resolve(doc.filePath) === path.resolve(file.fileName) && /^[A-Z]/.test(doc.displayName));
  assert.ok(docs.length, `No API documentation extracted for ${entry.slug}`);
  const components = docs.map((doc) => ({
    name: doc.displayName,
    description: doc.description || '',
    props: normalizeProps(doc, defaults.get(doc.displayName)),
  }));
  const api = { slug: entry.slug, title: entry.name, sourcePath, components, relatedTypes, helpers };
  await writeFile(path.join(apiFolder, `${entry.slug}.json`), JSON.stringify(api, null, 2) + '\n');
  const payload = JSON.parse(await readFile(path.join(root, `public/r/${entry.slug}.json`), 'utf8'));
  const markdown = [`# ${entry.name}`, '', entry.description, '', `Documentation: ${url(`components/${entry.slug}/`)}`, '', ...install(entry.slug), '', '## Usage'];
  for (const example of entry.examples) markdown.push('', `### ${example}`, fence(await readFile(path.join(root, `examples/${example}.tsx`), 'utf8'), 'tsx'));
  markdown.push('', '## API Reference', '', 'Generated from the same TypeScript source installed by the registry. “Required” reflects the type definition; defaults are taken from component implementation or parser metadata.');
  for (const component of components) {
    const primary = component.props.filter((prop) => !prop.inherited);
    const inherited = component.props.filter((prop) => prop.inherited);
    markdown.push('', `### ${component.name}`, component.description, propsMarkdown(primary));
    if (inherited.length) markdown.push('', `<details><summary>Inherited props (${inherited.length})</summary>`, '', propsMarkdown(inherited), '', '</details>');
  }
  if (relatedTypes.length || helpers.length) {
    markdown.push('', '### Related types and helpers');
    for (const item of [...relatedTypes, ...helpers]) markdown.push('', fence(item.code, 'typescript'));
  }
  markdown.push('', '## Manual installation', '', fence(`npm install ${payload.dependencies.join(' ')}`, 'bash'), '', `Fetch the full source payload: ${url(`r/${entry.slug}.json`)}`, '', 'Save every files[].content at files[].target. @components/ means aliases.components, not a literal directory. Keep relative imports intact.', '', ...payload.files.map((file) => `- ${file.target}`));
  if (entry.group === 'AI 组件') markdown.push('', '## Host integration', '', 'These are UI and interaction components, not an AI service. The host supplies model requests, streaming state, credentials, storage and permission checks. Website demos are local simulations.');
  if (entry.slug === 'safe-streamdown' || entry.slug === 'chat-thread') markdown.push('', '## Tables and Mermaid', '', 'ChatThread composes user/assistant Message bodies and PromptInput. SafeStreamdown renders Markdown and GFM tables. Enable diagrams with SafeStreamdown allowMermaid, or ChatThread markdownOptions={{ allowMermaid: true }}. Images remain separately opt-in. Mermaid and DOMPurify load on demand from local dependencies; no CDN or remote rendering service. Streaming waits until mode becomes static. Invalid/restricted/oversized diagrams retain source. Only plain supported diagram types are accepted; HTML, click/link, external assets, styling and configuration directives are rejected. Strict Mermaid output is sanitized and displayed as a static SVG image, never interactive host SVG. The host CSP must allow data: images; otherwise source remains available. Rendering is not a hard CPU-isolated sandbox. Mermaid 12 targets modern browsers; validate your application runtime.', '', 'Auto theme observes .dark / data-theme=dark ancestors. mermaidTheme can explicitly select light or dark. Review the rich examples for flowcharts, sequence diagrams and local streaming.');
  if (entry.slug === 'data-table') markdown.push('', '## Selection header', '', 'selectionPresentation defaults to header. Selecting rows replaces column controls in-place with the selected count and selectionToolbar actions, preserving native cells, widths and sort state. Clear restores the column controls. Selection persists across pages and filters; page select-all remains page-scoped. selectionPresentation=toolbar retains the old layout with always-visible sorting controls. Host applications supply batch execution, authorization and confirmations; demos only update/export local data.');
  markdown.push('', '## Source', '', `https://github.com/asharca/ui/blob/main/${sourcePath}`, '', 'MIT.');
  await emit(`/components/${entry.slug}`, entry.name, markdown.join('\n'), { apiPath: `api-reference/${entry.slug}.json`, registryUrl: url(`r/${entry.slug}.json`) });
}
await emit('/components', '组件', ['# 组件', '', 'Asharca UI — 可直接安装到项目的 React 组件源码。', '', ...install('button'), '', '## Components', '', ...catalog.map((entry) => `- [${entry.name}](${url(`components/${entry.slug}.md`)}): ${entry.description}`), '', `Registry index: ${url('r/registry.json')}`].join('\n'));
await emit('/docs/installation', '安装', ['# 安装', '', requirements, '', '## Prepare the project', fence('npx shadcn@latest init', 'bash'), '', ...install('button'), '', '## Local import', fence('import { Button } from "@/components/asharca/button";\n\nexport function Example() {\n  return <Button>开始使用</Button>;\n}', 'tsx'), '', '## Manual installation and updates', '', 'Use each component page\'s Manual tab for the full dependency list and source files. Review local modifications before updating. Never overwrite user changes silently.', '', `Components: ${url('components.md')}`, `Registry index: ${url('r/registry.json')}`].join('\n'));
await emit('/docs/updating', '更新组件', renderUpdateGuide(await readFile(path.join(root, 'docs/updating.md'), 'utf8'), site.href));
await writeFile(path.join(root, '.generated/documents.json'), JSON.stringify({ siteUrl: site.href, pages }, null, 2) + '\n');
let llms = await readFile(path.join(root, 'public/llms.txt'), 'utf8');
llms = llms.split('\n## Page Markdown\n')[0].split('\n## Updating installed source\n')[0].trimEnd();
llms += [
  '', '', '## Updating installed source', '',
  `Complete guide: ${url('docs/updating.md')}`, '',
  'Updating npm dependencies does not replace installed component source. In the consumer project, preserve existing work and configuration, use the original registry URL or configured @asharca namespace with add --dry-run, then --diff and --view for every affected file. Button also includes utils.ts; composite entries include their full local dependency closure.', '',
  'Preserve local APIs, callbacks, state, theme and layout. Asharca APIs come from its actual source, not the official shadcn component of the same name. Do not reinitialize the project, switch presets, replace files from raw GitHub URLs, or use --all as an installed-only updater. Never use --overwrite without explicit approval for the complete affected scope. Diffs do not establish the original installation baseline or guarantee automatic merging.', '',
  'Review package.json, lockfiles, new files and shared dependencies. Run the consumer project checks and create an isolated reviewed update commit for rollback. Current HTTP registry URLs track deployment, not immutable component versions; shadcn@latest selects the CLI version. See the full guide for Agent instructions, verification and rollback.',
].join('\n');
llms += '\n\n## Page Markdown\n\nThe same page documentation used by Copy Page and API Reference is available as static Markdown. These URLs contain public documentation only, never live preview input.\n\n';
llms += pages.map((page) => `- [${page.title}](${page.markdownUrl})`).join('\n') + '\n';
await writeFile(path.join(root, 'public/llms.txt'), llms, 'utf8');
console.log(`DOCS_PASS: ${catalog.length} API pages; ${pages.length} real Markdown documents; ${extracted.filter((doc) => /^[A-Z]/.test(doc.displayName)).length} component exports.`);
