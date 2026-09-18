import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Connect, Plugin } from 'vite';

// Only generated, public AI references belong to this handler. Do not change
// Content-Type globally: Vite's HTML, JS, CSS and asset responses must stay intact.
const documentPath = /^(?:llms(?:-full)?\.txt|ai\/(?:llms(?:-full)?\.txt|README\.md|PATTERNS\.md|components\/[a-z0-9-]+\.md))$/;

function documentMiddleware(directory: string, base: string): Connect.NextHandleFunction {
  const mount = base === './' || base === '' ? '/' : new URL(base, 'http://vite.local').pathname;
  const prefix = mount.endsWith('/') ? mount : `${mount}/`;

  return (request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    const [rawPath, query = ''] = (request.url ?? '').split('?');
    const params = new URLSearchParams(query);
    // Leave module/asset imports to Vite rather than returning document text as JS.
    if (['raw', 'url', 'import'].some((key) => params.has(key))) return next();
    let pathname: string;
    try {
      pathname = decodeURIComponent(rawPath);
    } catch {
      return next();
    }
    if (!pathname.startsWith(prefix)) return next();
    const relative = pathname.slice(prefix.length);
    // The allowlist excludes dot segments, backslashes and arbitrary files.
    if (!documentPath.test(relative)) return next();

    void readFile(resolve(directory, relative)).then((content) => {
      response.statusCode = 200;
      // Raw Markdown is intentionally served as readable plain text in browsers.
      // Bytes remain BOM-free UTF-8, suitable for fetch/curl and AI clients too.
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Content-Length', content.byteLength);
      response.end(request.method === 'HEAD' ? undefined : content);
    }).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') return next(error);
      // A missing document is not a successful SPA HTML response.
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('Cache-Control', 'no-cache');
      response.end(request.method === 'HEAD' ? undefined : 'AI document not found. Run pnpm docs:ai and rebuild if needed.\n');
    });
  };
}

/** Explicit charset for direct document navigation, in both Vite server modes. */
export function aiDocsUtf8(): Plugin {
  return {
    name: 'asharca-ai-docs-utf8',
    configureServer(server) {
      if (server.config.publicDir) {
        server.middlewares.use(documentMiddleware(server.config.publicDir, server.config.base));
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use(documentMiddleware(
        resolve(server.config.root, server.config.build.outDir),
        server.config.base,
      ));
    },
  };
}
