import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { pagesConfiguration } from "./pages/paths";
import { transformSiteSource } from "./pages/transform";

/** Build a disposable static site from the real Next.js app. The source checkout
 * and normal Next/Cloudflare server build retain all their runtime capabilities. */
export async function buildPages() {
  const root = path.resolve(import.meta.dir, "..");
  if (path.resolve(process.cwd()) !== root) throw new Error("Run from the repository root.");
  const { siteUrl, basePath } = pagesConfiguration(process.env.NEXT_PUBLIC_SITE_URL ?? "https://asharca.github.io/ui");
  // Set before importing registry/metadata modules that read environment constants.
  process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  const stage = await mkdtemp(path.join(os.tmpdir(), "asharca-pages-"));
  const copyPaths = ["app", "components", "lib", "assets", "public", "package.json", "bun.lock", "tsconfig.json", "postcss.config.mjs", "next.config.mjs"];
  for (const item of copyPaths) await cp(path.join(root, item), path.join(stage, item), { recursive: true });
  await symlink(path.join(root, "node_modules"), path.join(stage, "node_modules"), "dir");
  // These endpoints are materialized below as files with explicit MIME extensions.
  // Proxy, live analytics and request-dependent OG rendering require a server.
  for (const item of ["app/r", "app/[slug]", "app/docs/[slug]", "app/llms.txt", "app/registry.json", "app/api"]) {
    await rm(path.join(stage, item), { recursive: true, force: true });
  }
  const serverConfig = await import(pathToFileURL(path.join(root, "next.config.mjs")).href);
  const redirects = await serverConfig.default.redirects?.() ?? [];
  await writeFile(path.join(stage, "next.config.mjs"), `export default { output: 'export', basePath: ${JSON.stringify(basePath)}, trailingSlash: true, reactStrictMode: true, images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] }, experimental: { cpus: 2 } };\n`);
  await writeFile(path.join(stage, "app/components/page.tsx"), `import CategoryPage from './[category]/page';\nexport default function Page() { return <CategoryPage params={Promise.resolve({ category: 'motion' })} />; }\n`);
  await writeFile(path.join(stage, "app/workspace/page.tsx"), `import { Suspense } from 'react';\nimport WorkspacePageClient from './workspace-page-client';\nexport const metadata = { title: 'Asharca Workspace', robots: { index: false, follow: false } };\nexport default function Page() { return <Suspense fallback={<p>Loading workspace…</p>}><WorkspacePageClient /></Suspense>; }\n`);
  await writeFile(path.join(stage, "app/workspace/workspace-page-client.tsx"), `'use client';\nimport { useSearchParams } from 'next/navigation';\nimport { WorkspaceDemo } from '@/components/previews/blocks/workspace-shell.preview';\nexport default function WorkspacePageClient() { const params = useSearchParams(); return <WorkspaceDemo fullPage detachedKey={params.get('window') ?? undefined} />; }\n`);
  async function transformDirectory(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await transformDirectory(file);
      else if (/\.[jt]sx?$/.test(entry.name)) await writeFile(file, transformSiteSource(await readFile(file, "utf8"), file, siteUrl, basePath));
    }
  }
  await transformDirectory(path.join(stage, "app"));
  await transformDirectory(path.join(stage, "components/app"));
  await transformDirectory(path.join(stage, "components/previews"));
  for (const rel of ["lib/seo.ts"]) {
    const file = path.join(stage, rel);
    await writeFile(file, transformSiteSource(await readFile(file, "utf8"), file, siteUrl, basePath));
  }
  const publicDir = path.join(stage, "public");
  const data = Bun.spawn([process.execPath, "scripts/pages/data.ts", publicDir, siteUrl], {
    cwd: root, stdout: "inherit", stderr: "inherit", env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl },
  });
  if (await data.exited !== 0) throw new Error("Pages documentation generation failed.");
  await mkdir(path.join(publicDir, "api"), { recursive: true });
  await cp(path.join(root, "public/beui-mark.png"), path.join(publicDir, "api/og.png"));
  console.log(`Building static Pages site for ${siteUrl} in ${stage}`);
  const child = Bun.spawn([process.execPath, "run", "build", "--webpack"], {
    cwd: stage, stdout: "inherit", stderr: "inherit",
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl, NEXT_TELEMETRY_DISABLED: "1" },
  });
  if (await child.exited !== 0) throw new Error(`Pages build failed. Temporary source retained at ${stage}`);
  const out = path.join(root, "out");
  await rm(out, { recursive: true, force: true });
  await cp(path.join(stage, "out"), out, { recursive: true });
  // Materialize concrete historical redirects as HTML; patterns remain a 404.
  for (const redirect of redirects as { source: string; destination: string }[]) {
    if (redirect.source.includes(":") || redirect.destination.includes(":")) continue;
    if (path.extname(redirect.source)) continue;
    const destination = `${basePath}${redirect.destination}/`;
    const file = path.join(out, redirect.source, "index.html");
    try { await readFile(file); continue; } catch { /* A generated page always wins. */ }
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${destination}"><title>Moved</title><a href="${destination}">Continue</a>`);
  }
  const { verifyPages } = await import("./verify-pages");
  await verifyPages(out, siteUrl);
  await rm(stage, { recursive: true, force: true });
}

if (import.meta.main) await buildPages();
