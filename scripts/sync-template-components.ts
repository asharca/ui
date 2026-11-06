import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectSourceGraph, findRegistryTarget } from "@/lib/registry-server";
import { standaloneTemplates } from "@/lib/standalone-templates";

type TemplateManifest = { requiredRootComponents: string[] };
type PackageManifest = { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

/** Materialize the same source closure as the Registry so each app is movable. */
export async function syncTemplateComponents(slug: string) {
  const template = standaloneTemplates.find((entry) => entry.slug === slug);
  if (!template) throw new Error(`Unknown standalone template: ${slug}`);
  const destination = path.resolve(template.directory);
  const manifest = JSON.parse(await readFile(path.join(destination, "template.json"), "utf8")) as TemplateManifest;
  const sources = manifest.requiredRootComponents.flatMap((component) => {
    const target = findRegistryTarget(component);
    if (!target) throw new Error(`Unknown shared component for ${slug}: ${component}`);
    return [target.file, ...(target.extraFiles ?? [])];
  });
  const graph = await collectSourceGraph(sources);
  const packageManifest = JSON.parse(await readFile(path.join(destination, "package.json"), "utf8")) as PackageManifest;
  const declared = new Set([...Object.keys(packageManifest.dependencies ?? {}), ...Object.keys(packageManifest.devDependencies ?? {})]);
  const missing = graph.external.filter((dependency) => !dependency.startsWith("node:") && !declared.has(dependency));
  if (missing.length) throw new Error(`${slug} must declare copied-source dependencies: ${missing.join(", ")}`);

  for (const file of graph.files) {
    const target = path.resolve(destination, file.path);
    if (!target.startsWith(`${destination}${path.sep}`)) throw new Error(`Source path leaves template: ${file.path}`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.content);
  }
  await writeFile(path.join(destination, "LICENSE"), await readFile("LICENSE", "utf8"));
  return { template: slug, components: manifest.requiredRootComponents, files: graph.files.map((file) => file.path), dependencies: graph.external };
}

if (import.meta.main) {
  const [slug, ...extra] = process.argv.slice(2);
  if (!slug || extra.length) {
    console.error("Usage: bun scripts/sync-template-components.ts <template-slug>");
    process.exitCode = 1;
  } else {
    try {
      console.log(JSON.stringify(await syncTemplateComponents(slug), null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
