import assert from 'node:assert/strict';
import { test } from 'node:test';
import { access, readFile, readdir } from 'node:fs/promises';
import { allEntries } from '../registry/catalog.mjs';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

test('directory index is flat, complete and contains no embedded source content', async () => {
  const index = await readJson('public/r/registry.json');
  assert.deepEqual(index.items.map((item) => item.name), allEntries.map((entry) => entry.slug));
  const directory = new Set(await readdir('public/r'));
  for (const item of index.items) {
    assert.ok(directory.has(`${item.name}.json`), `Missing sibling installation endpoint: ${item.name}`);
    const payload = await readJson(`public/r/${item.name}.json`);
    assert.equal(payload.name, item.name);
    assert.equal(item.files.length, payload.files.length);
    for (const [position, file] of item.files.entries()) {
      assert.equal(Object.hasOwn(file, 'content'), false, `${item.name} exposes source in its index entry`);
      const actual = payload.files[position];
      assert.equal(typeof actual.content, 'string');
      assert.ok(actual.content.length > 0);
      const metadata = Object.fromEntries(Object.entries(actual).filter(([key]) => key !== 'content'));
      assert.deepEqual(file, metadata);
    }
  }
});

test('the old generated root index is removed rather than published as a second index', async () => {
  await assert.rejects(access('public/registry.json'), { code: 'ENOENT' });
});

test('llms.txt distinguishes directory metadata from installable source and explains namespace setup', async () => {
  const llms = await readFile('public/llms.txt', 'utf8');
  assert.match(llms, /Registry index: https?:\/\/[^\s]+\/r\/registry\.json/);
  assert.ok(llms.includes('"@asharca"'));
  assert.ok(llms.includes('/r/{name}.json'));
  assert.ok(llms.includes('npx shadcn@latest add @asharca/button'));
  assert.ok(llms.includes('The registry index contains metadata only.'));
  assert.ok(llms.includes('Do not assume public directory acceptance.'));
});
