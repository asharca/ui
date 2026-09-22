import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
const api = async (slug) => JSON.parse(await readFile(`public/api-reference/${slug}.json`, 'utf8'));
test('primary tables put component APIs ahead of forwarded props and fold generic library noise', async () => {
  const button = (await api('button')).components[0];
  const own = button.props.filter((prop) => !prop.inherited);
  assert.deepEqual(own.slice(0, 3).map((prop) => prop.name), ['variant', 'size', 'loading']);
  assert.ok(!own.some((prop) => prop.name === 'style' || prop.name === 'defaultChecked'));
  const legend = (await api('chart-container')).components.find((component) => component.name === 'ChartLegend');
  assert.equal(legend.props.find((prop) => prop.name === 'onAuxClick').inherited, true);
  assert.equal(legend.props.find((prop) => prop.name === 'content').inherited, false);
});
