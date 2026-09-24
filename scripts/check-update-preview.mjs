import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Runs only against fixtures created by check-consumer.mjs, never a user project.
const root = resolve(import.meta.dirname, '..');
const cli = resolve(root, 'node_modules/shadcn/dist/index.js');
function run(args) {
  return new Promise((accept, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: root, env: { ...process.env, CI: 'true', NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('Update preview CLI timed out.')); }, 120000);
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.once('error', (error) => { clearTimeout(timer); reject(error); });
    child.once('exit', (code) => { clearTimeout(timer); code === 0 ? accept(output) : reject(new Error(`CLI exited ${code}: ${output}`)); });
  });
}
async function snapshot(cwd, dir = '') {
  const hashes = {};
  for (const entry of await readdir(resolve(cwd, dir), { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const name = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) Object.assign(hashes, await snapshot(cwd, name));
    else if (entry.isFile()) hashes[name] = createHash('sha256').update(await readFile(resolve(cwd, name))).digest('hex');
  }
  return hashes;
}
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  if (!/^\/r\/[a-z-]+\.json$/.test(pathname)) { response.writeHead(404); response.end(); return; }
  try {
    const content = await readFile(resolve(root, `public${pathname}`));
    response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(content);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const [name, directory] of [['standard', 'src/components'], ['custom-alias', 'app/widgets']]) {
    const cwd = resolve(root, '.consumer', name);
    const config = JSON.parse(await readFile(resolve(cwd, 'components.json'), 'utf8'));
    config.registries['@asharca'] = `${origin}/r/{name}.json`;
    await writeFile(resolve(cwd, 'components.json'), JSON.stringify(config, null, 2));
    const installed = `${directory}/asharca`;
    for (const file of ['button.tsx', 'utils.ts']) {
      const path = resolve(cwd, installed, file);
      await writeFile(path, (await readFile(path, 'utf8')) + `\n// local-${name}-${file}: preserve this customization\n`);
    }
    const before = await snapshot(cwd);
    const source = name === 'standard' ? `${origin}/r/button.json` : '@asharca/button';
    for (const flags of [['--dry-run'], ['--diff', 'button.tsx'], ['--diff', 'utils.ts'], ['--view', 'button.tsx']]) {
      const output = await run(['add', source, '--cwd', cwd, ...flags]);
      assert.deepEqual(await snapshot(cwd), before, `${flags.join(' ')} wrote project files for ${name}`);
      if (flags[0] === '--diff') assert.ok(output.includes(`local-${name}-${flags[1]}`), `Diff omitted local changes: ${flags[1]}`);
      if (flags[0] === '--dry-run') assert.ok(output.includes('button.tsx') && output.includes('utils.ts'), 'Preview omitted the dependency closure');
      if (flags[0] === '--view') assert.ok(output.includes('Button'), 'View did not return source');
    }
    // Explicit overwrite is intentional ONLY in these disposable fixtures.
    await run(['add', source, '--cwd', cwd, '--overwrite', '--yes']);
    for (const file of ['button.tsx', 'utils.ts']) {
      assert.equal(await readFile(resolve(cwd, installed, file), 'utf8'), await readFile(resolve(root, 'registry/ui', file), 'utf8'));
    }
    const after = await snapshot(cwd);
    assert.equal(after[`${directory}/ui/button.tsx`], before[`${directory}/ui/button.tsx`], 'Unrelated component changed');
    const cssPath = name === 'standard' ? 'src/index.css' : 'app/index.css';
    assert.equal(after[cssPath], before[cssPath], 'Project theme changed');
    assert.equal(after['components.json'], before['components.json'], 'Project configuration changed');
    console.log(`UPDATE_PREVIEW_PASS ${name}: dry-run/diff/view are read-only, both custom files visible, explicit overwrite updates the closure without touching theme or other UI.`);
  }
} finally { await new Promise((accept) => server.close(accept)); }
