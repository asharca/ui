import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { allComponents } from "@/lib/registry";
import { buildComponentMarkdown } from "@/lib/component-markdown";
import { buildGuideMarkdown, GUIDE_SLUGS } from "@/lib/guide-markdown";
import { allRegistryTargets, allShadcnTargets, buildEntry, buildIndex, buildShadcnItem, buildShadcnRegistry } from "@/lib/registry-server";
import { readSourceFile } from "@/lib/source-files";
import { GET as llms } from "@/app/llms.txt/route";
import { staticResourcePath } from "./paths";
import { getComponentProps } from "@/lib/props-extractor";
import { getGithubStarCount } from "@/lib/github";

export async function writePagesData(directory: string, siteUrl: string) {
  const root = path.resolve(directory);
  const write = async (rel: string, value: string | object) => {
    const destination = path.resolve(root, rel.replace(/^\//, ""));
    if (!destination.startsWith(`${root}${path.sep}`)) throw new Error(`Invalid output path: ${rel}`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
  };
  const resource = (value: string) => value.startsWith(siteUrl)
    ? `${siteUrl}${staticResourcePath(value.slice(siteUrl.length))}` : value;
  const markdown = (value: string) => value.replace(/https?:\/\/[^\s<>"')]+/g, resource);
  const index = await buildIndex();
  index.endpoints.index = `${siteUrl}/r/index.json`;
  index.endpoints.detail = `${siteUrl}/r/{slug}/detail.json`;
  index.endpoints.raw = `${siteUrl}/r/{slug}/raw.txt`;
  index.components = index.components.map((entry) => ({ ...entry, detail_url: resource(entry.detail_url), raw_url: resource(entry.raw_url) }));
  await write("r/index.json", index);
  const registry = await buildShadcnRegistry();
  await write("r/registry.json", registry);
  await write("registry.json", registry);
  for (const target of allShadcnTargets()) {
    const item = await buildShadcnItem(target.categorySlug, target.slug);
    if (!item) throw new Error(`Missing install entry: ${target.slug}`);
    // Both entrypoints are self-contained; no raw source fetch is needed by CLI.
    await write(`r/${target.slug}.json`, item);
    await write(`${target.slug}.json`, item);
  }
  for (const target of allRegistryTargets()) {
    const entry = await buildEntry(target.categorySlug, target.slug);
    if (!entry) throw new Error(`Missing registry detail: ${target.slug}`);
    await write(`r/${target.slug}/detail.json`, { ...entry, detail_url: resource(entry.detail_url), raw_url: resource(entry.raw_url), source_url: resource(entry.source_url) });
    await write(`r/${target.slug}/raw.txt`, await readSourceFile(target.file));
  }
  const docs = new Map<string, string>();
  for (const component of allComponents()) {
    const text = await buildComponentMarkdown(component.category.slug, component.slug);
    if (!text) throw new Error(`Missing Markdown: ${component.slug}`);
    const value = markdown(text);
    docs.set(component.slug, value);
    const rel = component.category.slug === "charts" ? `charts/${component.slug}.md` : `components/${component.category.slug}/${component.slug}.md`;
    await write(rel, value);
  }
  for (const target of allRegistryTargets()) {
    const value = docs.get(target.pageSlug);
    if (!value) throw new Error(`Missing variant Markdown: ${target.slug}`);
    await write(`r/${target.slug}.md`, value);
  }
  for (const slug of GUIDE_SLUGS) {
    const value = buildGuideMarkdown(slug);
    if (!value) throw new Error(`Missing guide: ${slug}`);
    await write(`docs/${slug}.md`, markdown(value));
  }
  await write("llms.txt", markdown(await (await llms()).text()));
  await write(".nojekyll", "");
  await write("build-info.json", { commit: process.env.GITHUB_SHA ?? "local", repository: "asharca/ui", siteUrl, builtAt: new Date().toISOString(), components: allComponents().length });
}

// Use a short-lived process so the TypeScript documentation graph is released
// before Next starts its compilation and prerender workers.
if (import.meta.main) {
  const [directory, siteUrl] = process.argv.slice(2);
  if (!directory || !siteUrl) throw new Error("Usage: bun scripts/pages/data.ts <temporary-public-directory> <site-url>");
  await writePagesData(directory, siteUrl);
  await mkdir(path.join(directory, "api"), { recursive: true });
  await writeFile(path.join(directory, "api/github-stars.json"), JSON.stringify({ count: await getGithubStarCount(), snapshot: true }));
  const apiFiles = new Set(allComponents().flatMap((entry) => [entry.file, ...(entry.examples ?? []).map((example) => example.file)]));
  const props = Object.fromEntries([...apiFiles].map((file) => [file, getComponentProps(file)]));
  const lib = path.resolve(directory, "../lib");
  await writeFile(path.join(lib, "pages-props.json"), JSON.stringify(props));
  await writeFile(path.join(lib, "props-extractor.ts"), `import data from "./pages-props.json";
export type PropDoc = { name: string; type: string; required: boolean; defaultValue: string | null; description: string };
export type ComponentPropsDoc = { displayName: string; props: PropDoc[] };
const props: Record<string, ComponentPropsDoc[]> = data;
export function getComponentProps(file: string): ComponentPropsDoc[] {
  if (!Object.hasOwn(props, file)) throw new Error(\`Missing generated component props: \${file}\`);
  return props[file];
}
`);
  console.log(`Materialized Pages registry, Markdown and ${Object.keys(props).length} API references.`);
}
