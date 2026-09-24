import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { registryItemSchema, registrySchema } from 'shadcn/schema';
import { allEntries, catalog, resolveFiles } from '../registry/catalog.mjs';
const json = async (path) => JSON.parse(await readFile(path, 'utf8'));

test('all registry items validate against the official shadcn schema', async () => {
  registrySchema.parse(await json('public/r/registry.json'));
  for (const entry of allEntries) registryItemSchema.parse(await json(`public/r/${entry.slug}.json`));
});
test('every payload contains the exact source and its complete dependency closure', async () => {
  for (const entry of allEntries) {
    const payload = await json(`public/r/${entry.slug}.json`);
    const closure = resolveFiles(entry.slug);
    assert.deepEqual(payload.dependencies, [...new Set(closure.flatMap((item) => item.dependencies))].sort());
    assert.equal(payload.files.length, closure.length);
    const installed = new Set(payload.files.map((file) => file.path.split('/').at(-1).replace(/\.tsx?$/, '')));
    for (const file of payload.files) {
      assert.equal(file.content, await readFile(file.path, 'utf8'));
      assert.match(file.target, /^@components\/asharca\/[^/]+\.tsx?$/);
      for (const match of file.content.matchAll(/from ['"]\.\/([^'"]+)['"]/g)) assert.ok(installed.has(match[1]), `${entry.slug}: missing ${match[1]}`);
      assert.ok(!file.content.includes('@asharca/ui'));
      assert.ok(!file.content.includes('showcase/'));
    }
    assert.equal(payload.css, undefined); assert.equal(payload.cssVars, undefined);
  }
});
test('basic controls do not install unrelated runtimes', async () => {
  const button = await json('public/r/button.json');
  assert.deepEqual(button.files.map((file) => file.path), ['registry/ui/utils.ts', 'registry/ui/button.tsx']);
  assert.ok(!button.dependencies.some((name) => /assistant|recharts|streamdown|radix|tanstack|markdown/.test(name)));
});
test('all previews have real source files', async () => { for (const entry of catalog) for (const example of entry.examples) await access(`examples/${example}.tsx`); });
test('exactly one AI documentation endpoint describes the actual catalog', async () => {
  const text = await readFile('public/llms.txt', 'utf8');
  assert.ok(text.startsWith('# Asharca UI\n')); assert.ok(!text.includes('\ufffd')); assert.ok(text.includes('中文') || text.includes('源码'));
  for (const entry of catalog) assert.ok(text.includes(`/r/${entry.slug}.json`));
  for (const removed of ['docs/ai', 'skills', 'llms-full.txt', 'showcase', 'src/index.ts', '.github/workflows/publish-ui.yml']) await assert.rejects(access(removed));
});
test('repository is a private site, not a publishable component package', async () => {
  const pkg = await json('package.json'); assert.equal(pkg.private, true);
  for (const field of ['main', 'module', 'types', 'exports', 'files', 'publishConfig', 'peerDependencies']) assert.equal(pkg[field], undefined);
  for (const script of ['prepack', 'postbuild', 'test:package', 'publish', 'migrate']) assert.equal(pkg.scripts[script], undefined);
});
test('catalog rejects dependency cycles and unknown names', () => {
  assert.throws(() => resolveFiles('does-not-exist'), /Unknown/);
  assert.equal(new Set(catalog.map((item) => item.slug)).size, catalog.length);
  assert.equal(catalog.length, 79);
  const button = catalog.find((item) => item.slug === 'button');
  button.needs.push('button');
  try { assert.throws(() => resolveFiles('button'), /Circular/); }
  finally { button.needs.pop(); }
});
