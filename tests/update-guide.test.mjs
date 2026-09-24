import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { renderUpdateGuide, splitUpdateGuide } from '../scripts/update-guide.mjs';

const template = await readFile(new URL('../docs/updating.md', import.meta.url), 'utf8');
const ids = ['model', 'prepare', 'inspect', 'unchanged', 'customized', 'agent', 'validate', 'rollback', 'troubleshooting', 'references'];

test('one guide supplies all stable TOC sections and safety boundaries', () => {
  const guide = splitUpdateGuide(renderUpdateGuide(template, 'https://asharca.github.io/ui/'));
  assert.equal(guide.title, '更新组件');
  assert.deepEqual(guide.sections.map((section) => section.id), ids);
  for (const section of guide.sections) assert.ok(section.markdown.length > 40);
  assert.match(guide.sections.find((section) => section.id === 'inspect').markdown, /utils\.ts/);
  assert.match(guide.sections.find((section) => section.id === 'unchanged').markdown, /整个安装条目/);
  assert.match(guide.sections.find((section) => section.id === 'customized').markdown, /无法判定冲突/);
  assert.match(guide.sections.find((section) => section.id === 'validate').markdown, /未跟踪新文件/);
  assert.match(guide.sections.find((section) => section.id === 'rollback').markdown, /锁文件/);
  assert.match(guide.sections.find((section) => section.id === 'model').markdown, /不可变的版本化 Registry/);
});

test('commands resolve deployment roots and package runners without touching registry placeholders', () => {
  for (const site of ['https://example.com', 'https://example.com/design/ui/', 'https://asharca.github.io/ui/']) {
    for (const runner of ['pnpm dlx shadcn@latest', 'npx shadcn@latest', 'yarn dlx shadcn@latest', 'bunx --bun shadcn@latest']) {
      const text = renderUpdateGuide(template, site, runner);
      const root = `${site.replace(/\/$/, '')}/`;
      assert.ok(text.includes(`${runner} add ${root}r/button.json --dry-run`));
      assert.ok(text.includes(`${runner} add ${root}r/button.json --diff utils.ts`));
      assert.ok(text.includes(`"@asharca": "${root}r/{name}.json"`));
      assert.doesNotMatch(text, /\{\{[A-Z_]+\}\}|%7Bname%7D/);
      if (!site.includes('asharca.github.io')) assert.ok(!text.includes('https://asharca.github.io/ui/'));
    }
  }
});

test('malformed guide inputs fail visibly rather than publishing wrong commands', () => {
  for (const site of ['file:///tmp/', 'https://example.com/?q=a', 'https://u:p@example.com/', 'https://example.com/#hash']) {
    assert.throws(() => renderUpdateGuide(template, site));
  }
  assert.throws(() => renderUpdateGuide('{{UNKNOWN}}', 'https://example.com/'));
  assert.throws(() => splitUpdateGuide('# Title\n\n## One <!-- same -->\nA\n## Two <!-- same -->\nB'), /Duplicate/);
  assert.throws(() => splitUpdateGuide('# Title\n## One <!-- one -->\n```text\nunfinished'), /unclosed/);
  assert.throws(() => splitUpdateGuide('Missing heading'), /H1/);
});

test('fenced example headings do not become navigation anchors', () => {
  const guide = splitUpdateGuide('# Title\nintro\n## One <!-- one -->\n```text\n## Example <!-- fake -->\n```\n## Two <!-- two -->\nDone');
  assert.deepEqual(guide.sections.map((section) => section.id), ['one', 'two']);
});

test('published Markdown and AI index use the same guide and the build deployment root', async () => {
  const { pages, siteUrl } = JSON.parse(await readFile('.generated/documents.json', 'utf8'));
  const page = pages.find((page) => page.route === '/docs/updating');
  assert.ok(page);
  const markdown = await readFile(`public/${page.markdownPath}`, 'utf8');
  assert.equal(markdown, renderUpdateGuide(template, siteUrl).trimEnd() + '\n');
  const llms = await readFile('public/llms.txt', 'utf8');
  assert.equal(llms.split('## Updating installed source').length, 2);
  assert.ok(llms.includes(page.markdownUrl));
  assert.match(llms, /explicit approval/);
  const installedDocs = await readFile('public/docs/installation.md', 'utf8');
  assert.ok(installedDocs.includes(new URL('docs/updating/', siteUrl).href));
  const componentDocs = await readFile('public/components/button.md', 'utf8');
  assert.ok(componentDocs.includes(new URL('docs/updating/', siteUrl).href));
});
