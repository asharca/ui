import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { agentCatalog } from '../registry/agent-catalog.mjs';
import { catalog, resolveFiles } from '../registry/catalog.mjs';

const expected = ['message-bubble', 'message', 'message-scroller', 'prompt-input', 'todo-list', 'code-block', 'approval-card', 'file-diff', 'tool-result', 'streaming-response', 'image-generation', 'tool-approval', 'citations', 'activity', 'loading-states', 'sidebar', 'chat-app'].map((name) => `agent-${name}`);
test('all 17 pinned public Agent families have examples and complete installed sources', async () => {
  assert.deepEqual(agentCatalog.map((item) => item.slug), expected);
  for (const slug of expected) {
    const entry = catalog.find((item) => item.slug === slug);
    assert.ok(entry && entry.group === 'AI 组件');
    assert.ok((await readFile(`examples/${slug}.tsx`, 'utf8')).includes('export default'));
    const closure = resolveFiles(slug);
    const payload = JSON.parse(await readFile(`public/r/${slug}.json`, 'utf8'));
    assert.equal(payload.files.length, closure.length);
    for (const file of payload.files) assert.doesNotMatch(file.content, /(?:from\s+|import\()["']@\/(?:components|lib)\//);
  }
});
test('every transplanted dependency carries its original MIT attribution', async () => {
  const manifest = JSON.parse(await readFile('docs/beui-agent-manifest.json', 'utf8'));
  assert.equal(manifest.commit, '1e23f4b10a404c17d9649086cf561e152527e2de');
  assert.equal(manifest.files.filter((file) => file.public).length, 17);
  for (const file of manifest.files) {
    assert.match(file.sourceSha256, /^[a-f0-9]{64}$/);
    const content = await readFile(file.target, 'utf8');
    assert.ok(content.includes(`Upstream path: ${file.source}`));
    assert.ok(content.includes('Copyright (c) 2026 Saurabh Chauhan'));
    assert.ok(content.includes('Permission is hereby granted'));
    assert.ok(content.includes('THE SOFTWARE IS PROVIDED'));
    assert.ok(!content.includes('beui-'), 'component-owned CSS names must not collide');
  }
});
test('existing component entries are not redirected to incompatible Agent APIs', () => {
  for (const slug of ['message', 'prompt-input', 'approval-card', 'tool-result', 'chat-thread', 'workspace-shell', 'workspace-sidebar', 'safe-streamdown', 'data-table']) {
    assert.ok(catalog.some((entry) => entry.slug === slug));
    assert.ok(!resolveFiles(slug).some((entry) => entry.slug.startsWith('agent-')));
  }
  assert.ok(resolveFiles('agent-chat-app').some((entry) => entry.slug === 'safe-streamdown'));
  assert.ok(!resolveFiles('button').some((entry) => entry.dependencies.some((dep) => dep.startsWith('shiki'))));
});
