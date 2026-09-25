import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pagesConfiguration } from "./pages/paths";

export async function verifyPages(directory: string, siteUrl: string) {
  const { basePath } = pagesConfiguration(siteUrl);
  const root = path.resolve(directory);
  const files = ["index.html", "workspace/index.html", "components/blocks/workspace-shell/index.html", "components/blocks/workspace-tab-bar/index.html", "components/blocks/workspace-shell.md", "components/blocks/workspace-tab-bar.md", "r/workspace-shell.json", "r/workspace-tab-bar.json", "r/index.json", "r/workspace-shell/detail.json", "r/workspace-shell/raw.txt", "llms.txt", "build-info.json", ".nojekyll", "api/github-stars.json"];
  for (const file of files) await stat(path.join(root, file));
  const llms = await readFile(path.join(root, "llms.txt"), "utf8");
  for (const slug of ["workspace-shell", "workspace-tab-bar"]) {
    if (!llms.includes(`${siteUrl}/components/blocks/${slug}.md`)) throw new Error(`Wrong documentation URL: ${slug}`);
    const item = JSON.parse(await readFile(path.join(root, `r/${slug}.json`), "utf8"));
    if (item.name !== slug || !item.files?.length || item.files.some((entry: { content?: string }) => !entry.content)) throw new Error(`Incomplete install JSON: ${slug}`);
  }
  if (llms.includes("localhost")) throw new Error("Localhost leaked into the deployed llms.txt.");
  const home = await readFile(path.join(root, "index.html"), "utf8");
  if (!home.includes(`${basePath}/_next/`)) throw new Error("Next asset base path is missing.");
  for (const match of home.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
    const value = match[1];
    if (!value?.startsWith(`${basePath}/_next/`)) continue;
    await stat(path.join(root, value.slice(basePath.length)));
  }
  console.log(`Verified ${files.length} publication targets, full workspace JSON, canonical URLs and Next assets.`);
}
if (import.meta.main) await verifyPages(process.argv[2] ?? "out", process.env.NEXT_PUBLIC_SITE_URL ?? "https://asharca.github.io/ui");
