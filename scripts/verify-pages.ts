import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pagesConfiguration } from "./pages/paths";

export async function verifyPages(directory: string, siteUrl: string) {
  const { basePath } = pagesConfiguration(siteUrl);
  const origin = new URL(siteUrl).origin;
  const root = path.resolve(directory);
  const available = new Set<string>();
  async function walk(rel: string) {
    for (const entry of await readdir(path.join(root, rel), { withFileTypes: true })) {
      const file = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile()) available.add(file);
      else throw new Error(`Unexpected non-file in Pages output: ${file}`);
    }
  }
  await walk("");
  const files = ["index.html", "workspace/index.html", "components/blocks/workspace-shell/index.html", "components/blocks/workspace-tab-bar/index.html", "components/blocks/workspace-shell.md", "components/blocks/workspace-tab-bar.md", "r/workspace-shell.json", "r/workspace-tab-bar.json", "r/index.json", "r/workspace-shell/detail.json", "r/workspace-shell/raw.txt", "llms.txt", "build-info.json", ".nojekyll", "api/github-stars.json", "robots.txt", "sitemap.xml", "manifest.webmanifest"];
  for (const file of files) if (!available.has(file)) throw new Error(`Missing publication file: ${file}`);
  const llms = await readFile(path.join(root, "llms.txt"), "utf8");
  for (const slug of ["workspace-shell", "workspace-tab-bar"]) {
    if (!llms.includes(`${siteUrl}/components/blocks/${slug}.md`)) throw new Error(`Wrong documentation URL: ${slug}`);
    const item = JSON.parse(await readFile(path.join(root, `r/${slug}.json`), "utf8"));
    if (item.name !== slug || !item.files?.length || item.files.some((entry: { content?: string }) => !entry.content)) throw new Error(`Incomplete install JSON: ${slug}`);
  }
  if (llms.includes("localhost")) throw new Error("Localhost leaked into the deployed llms.txt.");
  const home = await readFile(path.join(root, "index.html"), "utf8");
  if (!home.includes(`${basePath}/_next/`)) throw new Error("Next asset base path is missing.");
  let pages = 0;
  for (const file of available) {
    if (!file.endsWith(".html")) continue;
    pages += 1;
    const html = await readFile(path.join(root, file), "utf8");
    for (const match of html.matchAll(/\b(?:src|href)="([^"\s]+)"/g)) {
      const value = match[1].replaceAll("&amp;", "&");
      if (!value.startsWith("/") && !value.startsWith(`${origin}/`)) continue;
      const url = new URL(value, `${siteUrl}/`);
      if (url.origin !== origin) continue;
      const pathname = decodeURIComponent(url.pathname);
      if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
        throw new Error(`${file}: unscoped local link ${value}`);
      }
      const rel = pathname.slice(basePath.length).replace(/^\//, "").replace(/\/$/, "");
      if (!available.has(rel) && !available.has(rel ? `${rel}/index.html` : "index.html")) {
        throw new Error(`${file}: local resource has no generated file: ${value}`);
      }
    }
  }
  console.log(`Verified ${files.length} publication targets and all local links/assets across ${pages} HTML pages.`);
}
if (import.meta.main) await verifyPages(process.argv[2] ?? "out", process.env.NEXT_PUBLIC_SITE_URL ?? "https://asharca.github.io/ui");
