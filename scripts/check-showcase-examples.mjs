import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const declarations = join(root, 'dist/index.d.ts');
if (!existsSync(declarations)) {
  throw new Error('Run pnpm build before checking published example imports.');
}

// Keep fixtures inside the repo so normal React/TypeScript dependencies resolve.
// The temporary directory is always removed, including on type-check failures.
const temporaryDirectory = mkdtempSync(join(root, '.showcase-example-check-'));
try {
  const examples = ['ButtonDemo.tsx', 'DataTableDemo.tsx'];
  const files = examples.map((name) => {
    const source = readFileSync(join(root, 'showcase/demos', name), 'utf8')
      .replaceAll('"../../src/index"', '"@asharca/ui"');
    if (/from\s+['"]\./.test(source)) {
      throw new Error(`${name} is not self-contained: a relative import remains.`);
    }
    const path = join(temporaryDirectory, name);
    writeFileSync(path, source);
    return path;
  });
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    types: ['react', 'react-dom'],
    baseUrl: root,
    paths: { '@asharca/ui': [declarations] },
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
    console.log('ButtonDemo and DataTableDemo copied snippets type-check against public package declarations.');
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
