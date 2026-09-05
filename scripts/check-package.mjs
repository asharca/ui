import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const directory = mkdtempSync(join(tmpdir(), 'asharca-ui-consumer-'));
const archive = join(directory, 'ui.tgz');

try {
  execFileSync('pnpm', ['--config.ignore-scripts=true', 'pack', '--out', archive], { stdio: 'inherit' });
  writeFileSync(join(directory, 'package.json'), JSON.stringify({
    name: 'asharca-ui-consumer-check',
    private: true,
    type: 'module',
    dependencies: {
      '@asharca/ui': `file:${archive}`,
      ...Object.fromEntries(Object.keys(manifest.peerDependencies)
        .map((name) => [name, manifest.devDependencies[name]])),
      '@tailwindcss/postcss': manifest.devDependencies['@tailwindcss/postcss'],
      postcss: manifest.devDependencies.postcss,
    },
  }, null, 2));
  copyFileSync(new URL('../tests/package-smoke.mjs', import.meta.url), join(directory, 'smoke.mjs'));
  execFileSync('pnpm', ['install', '--ignore-scripts', '--strict-peer-dependencies', '--registry=https://registry.npmjs.org'], {
    cwd: directory,
    stdio: 'inherit',
    timeout: 180_000,
  });
  execFileSync(process.execPath, ['smoke.mjs'], { cwd: directory, stdio: 'inherit', timeout: 60_000 });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
