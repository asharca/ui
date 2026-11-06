import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveSourceImport } from "@/lib/source-files";
import { collectSourceGraph } from "@/lib/registry-server";

let directory: string;
let relative: string;

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), "beui-source-resolution-"));
  relative = path.relative(process.cwd(), directory).split(path.sep).join("/");
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

describe("registry source import resolution", () => {
  test("resolves dotted extensionless previews through relative and alias imports", async () => {
    await writeFile(path.join(directory, "runner.preview.tsx"), "export const runner = 1;");
    const expected = { path: `${relative}/runner.preview.tsx`, content: "export const runner = 1;" };
    expect(await resolveSourceImport("./runner.preview", `${relative}/pill.preview.tsx`)).toEqual(expected);
    expect(await resolveSourceImport(`@/${relative}/runner.preview`)).toEqual(expected);
  });

  test("resolves a dotted directory to its index without treating the name as an extension", async () => {
    await mkdir(path.join(directory, "shared.parts"));
    await writeFile(path.join(directory, "shared.parts/index.ts"), "export const part = 2;");
    expect(await resolveSourceImport("./shared.parts", `${relative}/preview.tsx`)).toEqual({
      path: `${relative}/shared.parts/index.ts`, content: "export const part = 2;",
    });
  });

  test("keeps explicit source paths exact and reports missing or external imports", async () => {
    await writeFile(path.join(directory, "theme.css"), ":root { color: red; }");
    await writeFile(path.join(directory, "missing.tsx.ts"), "export const wrong = true;");
    expect(await resolveSourceImport("./theme.css", `${relative}/preview.tsx`)).toEqual({
      path: `${relative}/theme.css`, content: ":root { color: red; }",
    });
    expect(await resolveSourceImport("./missing.tsx", `${relative}/preview.tsx`)).toBeNull();
    expect(await resolveSourceImport("./absent.preview", `${relative}/preview.tsx`)).toBeNull();
    expect(await resolveSourceImport("react", `${relative}/preview.tsx`)).toBeNull();
  });

  test("publishes real dependencies without following displayed import examples", async () => {
    await writeFile(path.join(directory, "preview.tsx"), [
      'import type { ReactNode } from "react";',
      'export { value } from "./real";',
      'export const load = () => import("./lazy");',
      'export const templateLoad = () => import(`./template`);',
      'const sample = \'import { value } from "./missing-display";\';',
      'const template = `export { value } from "./missing-template";`;',
      '// import missing from "./missing-comment";',
      'export const view = <pre>import "uninstalled-example";</pre>;',
    ].join("\n"));
    await writeFile(path.join(directory, "real.ts"), 'import { motion } from "motion/react"; export const value = motion;');
    await writeFile(path.join(directory, "lazy.ts"), "export const value = 1;");
    await writeFile(path.join(directory, "template.ts"), "export const value = 2;");
    const graph = await collectSourceGraph([`${relative}/preview.tsx`]);
    expect(graph.files.map(file => path.basename(file.path)).sort()).toEqual(["lazy.ts", "preview.tsx", "real.ts", "template.ts"]);
    expect(graph.external).toEqual(["motion", "react"]);
    expect(graph.internal).toEqual(["./lazy", "./real", "./template"]);
  });

  test("still rejects unresolved imports used by the published component", async () => {
    await writeFile(path.join(directory, "preview.tsx"), 'export { value } from "./missing-runtime";');
    await expect(collectSourceGraph([`${relative}/preview.tsx`])).rejects.toThrow('Cannot resolve internal import "./missing-runtime"');
  });
});
