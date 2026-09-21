import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { catalog } from '../registry/catalog.mjs';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const workspace = resolve(root, '.consumer');
await rm(workspace, { recursive: true, force: true });
await mkdir(workspace, { recursive: true });
function run(command, args, cwd) {
  return new Promise((accept, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', env: { ...process.env, CI: 'true' } });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? accept() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`)));
  });
}
const server = createServer(async (request, response) => {
  const path = new URL(request.url || '/', 'http://localhost').pathname;
  if (!/^\/r\/[a-z-]+\.json$/.test(path)) { response.writeHead(404); response.end(); return; }
  try {
    const content = await readFile(resolve(root, `public${path}`));
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(content);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
const url = `http://127.0.0.1:${server.address().port}`;
const sentinel = 'export const existingProjectButton = "must-not-change";\n';
const css = '@import "tailwindcss";\n@theme { --color-background: #fcfcfc; --color-foreground: #171717; --color-primary: #171717; --color-primary-foreground: #fff; --color-muted: #f1f1f1; --color-muted-foreground: #666; --color-border: #ddd; --color-ring: #777; --color-popover: #fff; --color-popover-foreground: #171717; --color-destructive: #be123c; }\n/* project-owned theme: do not replace */\n';
async function fixture(name, prefix, sourceDir, componentDir, entries) {
  const cwd = resolve(workspace, name);
  const installed = `${sourceDir}/${componentDir}/asharca`;
  await mkdir(resolve(cwd, `${sourceDir}/${componentDir}/ui`), { recursive: true });
  const pkg = {
    name: `registry-consumer-${name}`, private: true, type: 'module', packageManager: manifest.packageManager,
    scripts: { build: 'tsc --noEmit && vite build' },
    dependencies: { react: manifest.dependencies.react, 'react-dom': manifest.dependencies['react-dom'] },
    devDependencies: Object.fromEntries(['typescript', 'vite', '@vitejs/plugin-react', '@tailwindcss/vite', 'tailwindcss', '@types/react', '@types/react-dom', '@types/node'].map((key) => [key, manifest.devDependencies[key]])),
  };
  await writeFile(resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2));
  await writeFile(resolve(cwd, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, esModuleInterop: true, baseUrl: '.', paths: { [`${prefix}/*`]: [`${sourceDir}/*`] } }, include: [sourceDir] }, null, 2));
  await writeFile(resolve(cwd, 'components.json'), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: false, tsx: true, tailwind: { config: '', css: `${sourceDir}/index.css`, baseColor: 'neutral', cssVariables: true }, aliases: { components: `${prefix}/${componentDir}`, ui: `${prefix}/${componentDir}/ui`, utils: `${prefix}/lib/utils`, lib: `${prefix}/lib`, hooks: `${prefix}/hooks` }, registries: { '@asharca': `${url}/r/{name}.json` } }, null, 2));
  await writeFile(resolve(cwd, `${sourceDir}/index.css`), css);
  await writeFile(resolve(cwd, `${sourceDir}/${componentDir}/ui/button.tsx`), sentinel);
  await writeFile(resolve(cwd, 'vite.config.ts'), `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nimport { fileURLToPath } from 'node:url';\nexport default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '${prefix}': fileURLToPath(new URL('./${sourceDir}', import.meta.url)) } } });\n`);
  await writeFile(resolve(cwd, 'index.html'), `<html lang="zh-CN"><head><meta charset="UTF-8" /></head><body><div id="root"></div><script type="module" src="/${sourceDir}/main.tsx"></script></body></html>`);
  await writeFile(resolve(cwd, `${sourceDir}/main.tsx`), `import { createRoot } from 'react-dom/client';\nimport { Button } from '${prefix}/${componentDir}/asharca/button';\nimport './index.css';\ncreateRoot(document.getElementById('root')!).render(<Button>Installed source</Button>);\n`);
  await run('pnpm', ['install', '--no-frozen-lockfile'], cwd);
  const cli = resolve(root, 'node_modules/shadcn/dist/index.js');
  await run(process.execPath, [cli, 'add', `${url}/r/button.json`, '--cwd', cwd, '--yes'], root);
  let installedPackage = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
  assert.ok(!Object.keys(installedPackage.dependencies).some((key) => /assistant|recharts|streamdown|radix/.test(key)), 'Button pulled in unrelated dependencies');
  assert.equal(await readFile(resolve(cwd, `${installed}/button.tsx`), 'utf8'), await readFile(resolve(root, 'registry/ui/button.tsx'), 'utf8'));
  if (entries.length) await run(process.execPath, [cli, 'add', ...entries.map((entry) => `@asharca/${entry.slug}`), '--cwd', cwd, '--yes'], root);
  assert.equal(await readFile(resolve(cwd, `${sourceDir}/${componentDir}/ui/button.tsx`), 'utf8'), sentinel, 'Existing project component was overwritten');
  assert.equal(await readFile(resolve(cwd, `${sourceDir}/index.css`), 'utf8'), css, 'Project theme was modified');
  const allFiles = await readdir(resolve(cwd, installed));
  assert.ok(allFiles.includes('button.tsx') && allFiles.includes('utils.ts'));
  for (const entry of entries) assert.ok(allFiles.includes(`${entry.slug}.tsx`), `Missing installed component: ${entry.slug}`);
  for (const path of allFiles) {
    const content = await readFile(resolve(cwd, installed, path), 'utf8');
    assert.ok(!content.includes('@asharca/ui'), 'Old package import survived');
    assert.ok(!content.includes('registry/ui'), 'Consumer still points at repository source');
  }
  installedPackage = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
  assert.ok(!Object.keys(installedPackage.dependencies).includes('@asharca/ui'));
  await run('pnpm', ['build'], cwd);
  console.log(`CONSUMER_PASS ${name}: real CLI, ${allFiles.length} installed files, intact theme and existing component, TypeScript + Vite build.`);
}
try {
  await fixture('standard', '@', 'src', 'components', catalog.filter((entry) => entry.slug !== 'button'));
  await fixture('custom-alias', '~', 'app', 'widgets', catalog.filter((entry) => entry.slug === 'dialog' || entry.slug === 'chat-panel'));
} finally { await new Promise((accept) => server.close(accept)); }
