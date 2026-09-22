import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { catalog, resolveFiles } from '../registry/catalog.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
test('workspace shell installs its full composition without a dependency cycle', async () => {
  const entry = catalog.find((item) => item.slug === 'workspace-shell');
  assert.deepEqual(entry.examples, ['workspace-shell', 'workspace-shell-simple']);
  const closure = resolveFiles('workspace-shell');
  for (const slug of ['workspace-shell', 'workspace-sidebar', 'workspace-tab-bar', 'icon-button', 'button', 'utils']) assert.ok(closure.some((item) => item.slug === slug));
  const payload = JSON.parse(await read('public/r/workspace-shell.json'));
  const installed = payload.files.map((file) => file.path);
  for (const item of closure) assert.ok(installed.includes(`registry/ui/${item.slug}.${item.slug === 'utils' ? 'ts' : 'tsx'}`));
  assert.ok(!payload.dependencies.includes('@asharca/ui'));
  for (const example of entry.examples) {
    const source = await read(`examples/${example}.tsx`);
    for (const match of source.matchAll(/@\/components\/asharca\/([a-z-]+)/g)) assert.ok(closure.some((item) => item.slug === match[1]), `Uninstalled example dependency: ${match[1]}`);
  }
});

test('workspace shell has generated API, Markdown, AI index and opt-in variant docs', async () => {
  const api = JSON.parse(await read('public/api-reference/workspace-shell.json'));
  const component = api.components.find((item) => item.name === 'WorkspaceShell');
  assert.ok(component);
  for (const name of ['sidebar', 'tabBar', 'mobileHeader', 'header', 'footer', 'scroll', 'contentProps']) assert.ok(component.props.some((prop) => prop.name === name), `Missing ${name} docs`);
  const markdown = await read('public/components/workspace-shell.md');
  for (const phrase of ['WorkspaceShell', 'variant="inset"', 'scroll="none"', '--workspace-surface', 'contentProps', 'workspace-shell-simple']) assert.ok(markdown.includes(phrase), `Missing documentation: ${phrase}`);
  assert.ok((await read('public/llms.txt')).includes('components/workspace-shell.md'));
  for (const slug of ['workspace-sidebar', 'workspace-tab-bar']) {
    const related = JSON.parse(await read(`public/api-reference/${slug}.json`));
    assert.ok(related.components.some((item) => item.props.some((prop) => prop.name === 'variant')));
  }
});
