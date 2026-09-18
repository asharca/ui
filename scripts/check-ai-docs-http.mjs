import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, preview } from 'vite';

// Test the real Vite configuration, not check-browser.mjs's custom static server.
// fetch().text() alone cannot detect browser navigation using the wrong charset.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = join(root, 'showcase/public');
const configFile = join(root, 'showcase/vite.config.ts');
const artifacts = join(root, 'ui-browser-artifacts');
const useBrowser = process.argv.includes('--browser');
const evidence = { baseline: null, checks: [] };
let browser;

async function documents(directory, prefix = '') {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}${entry.name}`;
    if (entry.isDirectory()) paths.push(...await documents(join(directory, entry.name), `${name}/`));
    else if (/\.(txt|md)$/.test(name)) paths.push(name);
  }
  return paths;
}
const paths = ['llms.txt', 'llms-full.txt', ...await documents(join(publicRoot, 'ai'), 'ai/')];
assert(paths.length >= 60, 'Build the showcase/AI docs before checking HTTP encoding.');
const expected = new Map(await Promise.all(paths.map(async (path) => [path, await readFile(join(publicRoot, path))])));
for (const [path, bytes] of expected) {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  assert(!text.includes('\uFFFD'), `${path}: replacement characters in generated source`);
  assert(text.startsWith('#'), `${path}: expected a BOM-free Markdown document`);
}

const serverOptions = { host: '127.0.0.1', port: 0, strictPort: true, open: false };
const devOptions = { ...serverOptions, hmr: false, watch: null };
const optimizeDeps = { noDiscovery: true, include: [] };
function address(httpServer, base = '/') {
  const info = httpServer.address();
  assert(info && typeof info !== 'string');
  return `http://127.0.0.1:${info.port}${base}`;
}
async function closePreview(server) {
  await new Promise((done, reject) => {
    server.httpServer.close((error) => error ? reject(error) : done());
    server.httpServer.closeAllConnections();
  });
}
async function checkedFetch(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
}

try {
  if (useBrowser) {
    assert(process.env.UI_BROWSER_ROOT, '--browser requires the isolated Playwright installation.');
    const require = createRequire(join(process.env.UI_BROWSER_ROOT, 'package.json'));
    browser = await require('playwright').chromium.launch();
    mkdirSync(artifacts, { recursive: true });
  }

  // Record default Vite's response to demonstrate the original failure mode.
  // Do not require it to stay broken if Vite itself later adds a charset.
  const baseline = await createServer({
    configFile: false, root: join(root, 'showcase'), base: '/',
    logLevel: 'error', server: devOptions, optimizeDeps,
  });
  try {
    await baseline.listen();
    const url = `${address(baseline.httpServer)}llms.txt`;
    const response = await checkedFetch(url);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(bytes, expected.get('llms.txt'));
    evidence.baseline = { contentType: response.headers.get('content-type'), validUtf8Bytes: true };
    if (browser) {
      const context = await browser.newContext({ locale: 'en-US' });
      try {
        const page = await context.newPage();
        await page.goto(url);
        const actual = await page.evaluate(() => ({ charset: document.characterSet, text: document.body.textContent }));
        evidence.baseline.browserCharset = actual.charset;
        evidence.baseline.renderedTextMatchesUtf8 = actual.text === bytes.toString('utf8');
        await page.screenshot({ path: join(artifacts, 'ai-docs-before-utf8.png') });
      } finally { await context.close(); }
    }
    console.log('BASELINE Vite static:', JSON.stringify(evidence.baseline));
  } finally { await baseline.close(); }

  for (const mode of ['dev', 'preview']) {
    for (const base of ['/', '/ui/']) {
      const config = { configFile, base, logLevel: 'error', optimizeDeps, server: devOptions, preview: serverOptions };
      const server = mode === 'dev' ? await createServer(config) : await preview(config);
      let context;
      try {
        if (mode === 'dev') await server.listen();
        const url = address(server.httpServer, base);
        let count = 0;
        for (const path of paths) {
          const response = await checkedFetch(new URL(path, url));
          assert.equal(response.status, 200, `${mode} ${base}${path}`);
          assert.match(response.headers.get('content-type') ?? '', /^text\/plain;\s*charset=utf-8$/i, `${mode} ${path}: missing charset`);
          assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
          assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.get(path), `${mode} ${path}: changed bytes`);
          count++;
        }
        const head = await checkedFetch(`${url}llms.txt`, { method: 'HEAD' });
        assert.equal(head.status, 200);
        assert.match(head.headers.get('content-type'), /charset=utf-8/i);
        assert.equal(Number(head.headers.get('content-length')), expected.get('llms.txt').byteLength);
        assert.equal((await head.arrayBuffer()).byteLength, 0);
        const encoded = await checkedFetch(`${url}llms%2Etxt?refresh=1`);
        assert.equal(encoded.status, 200);
        assert.deepEqual(Buffer.from(await encoded.arrayBuffer()), expected.get('llms.txt'));
        const missing = await checkedFetch(`${url}ai/components/not-a-real-component.md`);
        assert.equal(missing.status, 404, 'Missing AI docs must not fall back to SPA HTML.');
        assert.match(missing.headers.get('content-type'), /^text\/plain;.*charset=utf-8/i);
        await missing.arrayBuffer();

        const html = await checkedFetch(url);
        assert.match(html.headers.get('content-type'), /^text\/html/i, 'HTML MIME type was changed.');
        const htmlText = await html.text();
        const script = htmlText.match(/<script[^>]+src="([^"]+)"/);
        assert(script, 'Showcase HTML has no script entry.');
        const js = await checkedFetch(new URL(script[1], url));
        assert.equal(js.status, 200);
        assert.match(js.headers.get('content-type'), /javascript/i, 'JavaScript MIME type was changed.');
        await js.arrayBuffer();
        const image = await checkedFetch(`${url}workspace-preview.png`);
        assert.equal(image.status, 200);
        assert.match(image.headers.get('content-type'), /^image\/png/i);
        await image.arrayBuffer();

        let navigations = 0;
        if (browser) {
          context = await browser.newContext({ locale: 'en-US' });
          const page = await context.newPage();
          for (const path of ['llms.txt', 'llms-full.txt', 'ai/README.md', 'ai/components/checkbox.md']) {
            await page.goto(`${url}${path}`);
            const actual = await page.evaluate(() => ({ charset: document.characterSet, text: document.body.textContent }));
            assert.equal(actual.charset.toUpperCase(), 'UTF-8', `${mode} ${path}: browser chose the wrong encoding`);
            assert.equal(actual.text, expected.get(path).toString('utf8'), `${mode} ${path}: browser rendered mojibake`);
            navigations++;
            if (path === 'llms.txt') await page.screenshot({ path: join(artifacts, `ai-docs-${mode}-${base === '/' ? 'root' : 'subpath'}-utf8.png`) });
          }
        }
        evidence.checks.push({ mode, base, documents: count, browserNavigations: navigations, head: true, missing404: true, unchangedAssetTypes: true });
        console.log(`PASS ${mode} ${base}: ${count} UTF-8 documents, HEAD, query/encoded paths, 404 and asset MIME types${browser ? `; ${navigations} direct Chromium navigations` : ''}.`);
      } finally {
        await context?.close();
        if (mode === 'dev') await server.close();
        else await closePreview(server);
      }
    }
  }
} finally {
  if (useBrowser) {
    writeFileSync(join(artifacts, 'ai-docs-encoding.json'), JSON.stringify(evidence, null, 2));
  }
  await browser?.close();
}
