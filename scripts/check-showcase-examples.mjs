import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const declarations = join(root, 'dist/index.d.ts');
assert(existsSync(declarations), 'Run pnpm build before checking the public examples.');
const directory = mkdtempSync(join(root, '.showcase-consumer-'));
try {
  const demos = readdirSync(join(root, 'showcase/demos')).filter((name) => name.endsWith('.tsx')).sort();
  const files = demos.map((name) => {
    const source = readFileSync(join(root, 'showcase/demos', name), 'utf8');
    assert(source.includes('"../../src/index"'), `${name} must import the public component surface.`);
    const copy = source.replaceAll('"../../src/index"', '"@asharca/ui"');
    assert(!/from\s+['"]\./.test(copy), `${name} is not self-contained: it imports another local file.`);
    const path = join(directory, name); writeFileSync(path, copy); return path;
  });
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    noEmit: true,
    paths: { '@asharca/ui': [declarations] },
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length) {
    console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    }));
    process.exitCode = 1;
  } else {
    console.log(`${demos.length} self-contained demos type-check against the built public package declarations.`);
  }
} finally { rmSync(directory, { recursive: true, force: true }); }
