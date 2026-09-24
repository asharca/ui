import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { catalog } from '../registry/catalog.mjs';
import { cell, fence, propsMarkdown, normalizeProps } from '../scripts/docs-support.mjs';

const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const api = (slug) => json(`public/api-reference/${slug}.json`);
test('all 62 components document every named public component export from its actual source', async () => {
  assert.equal(catalog.length, 62);
  for (const entry of catalog) {
    const doc = await api(entry.slug);
    assert.equal(doc.slug, entry.slug);
    assert.equal(doc.sourcePath, `registry/ui/${entry.slug}.tsx`);
    assert.ok(doc.components.length > 0);
    const source = await readFile(doc.sourcePath, 'utf8');
    const ast = ts.createSourceFile(doc.sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const exported = [];
    for (const statement of ast.statements) {
      if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
      if (ts.isFunctionDeclaration(statement)) exported.push(statement.name.text);
      if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) exported.push(declaration.name.getText(ast));
    }
    assert.deepEqual(doc.components.map((item) => item.name).sort(), exported.filter((name) => /^[A-Z]/.test(name)).sort(), `Incomplete API exports: ${entry.slug}`);
    for (const component of doc.components) {
      assert.equal(new Set(component.props.map((prop) => prop.name)).size, component.props.length);
      for (const prop of component.props) {
        assert.equal(typeof prop.type, 'string');
        assert.equal(typeof prop.required, 'boolean');
        assert.equal(typeof prop.inherited, 'boolean');
      }
    }
    assert.doesNotMatch(JSON.stringify(doc), /\/home\/runner|\/mnt\/data/);
  }
});
test('API metadata reports real defaults, required flags, compound components and generic types', async () => {
  const button = (await api('button')).components.find((component) => component.name === 'Button');
  const property = (component, name) => component.props.find((prop) => prop.name === name);
  assert.equal(property(button, 'variant').defaultValue, "'default'");
  assert.equal(property(button, 'size').defaultValue, "'md'");
  assert.equal(property(button, 'loading').defaultValue, 'false');
  assert.ok(property(button, 'children'), 'children cannot disappear from API tables');
  assert.match(property(button, 'variant').type, /"outline"/);
  const input = (await api('input')).components[0];
  assert.equal(property(input, 'label').required, true);
  const dialog = await api('dialog');
  assert.deepEqual(dialog.components.map((component) => component.name).sort(), ['Dialog', 'DialogTrigger', 'DialogContent', 'DialogClose'].sort());
  assert.equal(property(dialog.components.find((component) => component.name === 'DialogContent'), 'title').required, true);
  const table = (await api('data-table')).components[0];
  assert.equal(property(table, 'data').type, 'T[]');
  assert.equal(property(table, 'getRowId').required, true);
  assert.ok((await api('tool-call-card')).helpers.some((helper) => helper.name === 'toolPreview'));
});
test('every copyable page is a real UTF-8 Markdown file containing its API and exact examples', async () => {
  const { pages } = await json('.generated/documents.json');
  assert.equal(pages.length, catalog.length + 3);
  for (const page of pages) {
    const markdown = await readFile(`public/${page.markdownPath}`, 'utf8');
    assert.ok(markdown.startsWith(`# ${page.title}\n`));
    assert.ok(page.markdownUrl.endsWith(page.markdownPath));
    assert.doesNotMatch(markdown, /<!doctype html|<div id="root"|\ufffd/i);
    const slug = page.route.split('/').at(-1);
    const entry = catalog.find((item) => item.slug === slug);
    if (!entry) continue;
    assert.ok(markdown.includes('## API Reference'));
    for (const example of entry.examples) assert.ok(markdown.includes((await readFile(`examples/${example}.tsx`, 'utf8')).trimEnd()), `Wrong Usage in ${slug}`);
    for (const component of (await api(slug)).components) {
      assert.ok(markdown.includes(`### ${component.name}\n`));
      for (const prop of component.props) assert.ok(markdown.includes(`| ${cell(prop.name)} | ${cell(prop.type)} |`));
    }
  }
});
test('Markdown handles pipes, multiline values and nested code fences without truncating source', () => {
  assert.equal(cell('"a" | "b"\nnext'), '"a" \\| "b"<br />next');
  const code = 'const markdown = "```tsx\\nexample\\n```";';
  assert.ok(fence(code, 'tsx').startsWith('````tsx\n'));
  assert.ok(fence(code, 'tsx').includes(code));
  assert.match(propsMarkdown([{name:'mode',type:'"a" | "b"',required:true,defaultValue:null,description:'A\nB'}]), /Yes \| — \| A<br \/>B/);
});
test('inline props remain documented while untraceable inherited noise is folded', () => {
  const doc = { props: {
    label: {name:'label',type:{name:'string'},required:true,parent:{fileName:'x/registry/ui/input.tsx'}},
    onAnimationIterationCapture: {name:'onAnimationIterationCapture',type:{name:'Function'},required:false},
  } };
  assert.equal(normalizeProps(doc)[0].inherited, false);
  assert.equal(normalizeProps(doc)[1].inherited, true);
  assert.equal(normalizeProps({props:{value:{name:'value',type:{name:'string'},required:true}}})[0].inherited, false);
});
test('llms.txt stays the single entry point and indexes every real Markdown page', async () => {
  const { pages } = await json('.generated/documents.json');
  const llms = await readFile('public/llms.txt', 'utf8');
  assert.equal(llms.split('## Page Markdown').length, 2);
  for (const page of pages) assert.ok(llms.includes(page.markdownUrl));
  assert.doesNotMatch(llms, /llms-full\.txt|docs\/ai|skills\//);
});
