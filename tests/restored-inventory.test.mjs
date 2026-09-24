import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { agentCatalog } from '../registry/agent-catalog.mjs';
import { allEntries, catalog, resolveFiles } from '../registry/catalog.mjs';

// Independent baseline: showcase/catalog-data.ts + component-metadata.ts at
// aeb90b1c5f34bd89061502a086bbcc1e098d4fdc, before the clean-site rewrite.
const original = `button icon-button input textarea select checkbox radio switch slider search-input field submit-button confirm-submit-button copy-button badge status-badge alert progress skeleton spinner card page section panel toolbar empty-state entity data-table accordion avatar tabs navigation-tabs chip breadcrumbs pagination dialog dropdown-menu popover tooltip context-menu hover-card chat-thread tool-call-card chat-composer-toolbar conversation-sidebar chat-shell safe-streamdown workspace-tab-bar workspace-sidebar sidebar-action-rail content-page rotating-headline tool-plane-logo choice-field chart-container`.split(' ');
const rewrite = `button input checkbox radio-group switch select tabs accordion badge dialog popover tooltip prompt-input message tool-result approval-card chat-panel`.split(' ');
const packageName = (specifier) => specifier.match(/^(@[^/]+\/[^@/]+|[^@/]+)/)?.[0];

test('all 55 original entries, six rewrite additions and the workspace shell remain discoverable', () => {
  assert.equal(original.length, 55);
  assert.equal(new Set(original).size, 55);
  const actual = new Set(catalog.map((entry) => entry.slug));
  for (const slug of original) assert.ok(actual.has(slug), `Original component removed again: ${slug}`);
  for (const slug of rewrite) assert.ok(actual.has(slug), `Current component removed: ${slug}`);
  assert.deepEqual(actual, new Set([...original, ...rewrite, 'workspace-shell', ...agentCatalog.map((item) => item.slug)]));
  assert.equal(actual.size, 79);
  assert.equal(original.filter((slug) => !rewrite.includes(slug)).length, 44);
});

test('every copied Usage example imports only files and dependencies installed by its component', async () => {
  for (const entry of catalog) {
    const closure = resolveFiles(entry.slug);
    const local = new Set(closure.map((item) => item.slug));
    const dependencies = new Set(['react', 'react-dom', ...closure.flatMap((item) => item.dependencies).map(packageName)]);
    for (const example of entry.examples) {
      const source = await readFile(`examples/${example}.tsx`, 'utf8');
      assert.match(source, /export default /, `${example} has no actual preview`);
      for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const specifier = match[1];
        if (specifier.startsWith('@/components/asharca/')) assert.ok(local.has(specifier.slice('@/components/asharca/'.length)), `${entry.slug} usage requires uninstalled ${specifier}`);
        else assert.ok(dependencies.has(packageName(specifier)), `${entry.slug} usage has undeclared dependency ${specifier}`);
      }
      assert.doesNotMatch(source, /from\s+['"]@asharca\/ui/);
    }
  }
});

test('restored implementations declare their external dependencies without reinstalling the old package', async () => {
  for (const entry of catalog) {
    const closure = resolveFiles(entry.slug);
    const dependencies = new Set(['react', 'react-dom', ...closure.flatMap((item) => item.dependencies).map(packageName)]);
    for (const item of closure) {
      const source = await readFile(`registry/ui/${item.slug}.${item.ext ?? (item.slug === 'utils' ? 'ts' : 'tsx')}`, 'utf8');
      for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        if (match[1].startsWith('./')) continue;
        assert.ok(dependencies.has(packageName(match[1])), `${entry.slug}: undeclared ${match[1]}`);
      }
    }
  }
});

test('table, chart and Markdown heavy dependencies are scoped to their source entries', () => {
  const dependencies = (slug) => resolveFiles(slug).flatMap((item) => item.dependencies).map(packageName);
  assert.ok(dependencies('data-table').includes('@tanstack/react-table'));
  assert.ok(dependencies('chart-container').includes('recharts'));
  assert.ok(dependencies('chat-thread').includes('react-markdown'));
  assert.ok(!dependencies('button').some((item) => ['recharts', '@tanstack/react-table', 'react-markdown', 'radix-ui'].includes(item)));
  assert.ok(!dependencies('workspace-sidebar').includes('recharts'));
});

test('the single llms index and built item count match the expanded catalog', async () => {
  const llms = await readFile('public/llms.txt', 'utf8');
  const items = await readdir('public/r');
  assert.ok(items.includes('registry.json'));
  assert.equal(items.filter((item) => item.endsWith('.json') && item !== 'registry.json').length, allEntries.length);
  for (const slug of original) assert.ok(llms.includes(`/r/${slug}.json`), `llms.txt omits ${slug}`);
  assert.doesNotMatch(llms, /@asharca\/ui(?:\/|["'])/);
});
