import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { allShadcnTargets, buildShadcnItem } from "@/lib/registry-server";
import { withSignature } from "@/lib/signature";
import policy from "@/skills/beui/source-policy.json";

export function assertSourceCheckout(cwd = process.cwd()) {
  if (realpathSync(cwd) !== realpathSync(path.resolve(import.meta.dir, ".."))) {
    throw new Error("Run the exporter from the asharca/ui source checkout, not the consuming project.");
  }
}

/** Export reviewed project-owned source without a Next server or remote MCP.
 * Uses the same transitive dependency graph and alias targets as the registry.
 */
export async function createLocalRegistryItem(slug: string) {
  assertSourceCheckout();
  const owned = policy.project.entries.find((entry) => entry.slug === slug);
  if (!owned) {
    throw new Error(`Not a project-owned install entry: ${slug}. Check source-policy.json; unchanged components use the official registry.`);
  }
  const target = allShadcnTargets().find((entry) => entry.slug === slug);
  if (!target || target.categorySlug !== owned.category) {
    throw new Error(`Source policy is out of sync with the registry: ${slug}`);
  }
  const item = await buildShadcnItem(owned.category, slug);
  if (!item) throw new Error(`Cannot export component: ${slug}`);
  for (const file of owned.files) {
    if (!item.files.some((entry) => entry.path === file)) {
      throw new Error(`Missing owned source in dependency graph: ${file}`);
    }
  }

  let commit: string | null = null;
  let dirty: boolean | null = null;
  try {
    commit = execFileSync("git", ["rev-parse", "--verify", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    dirty = Boolean(execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim());
  } catch {
    // A source archive is usable too; do not pretend it has a verified Git SHA.
  }
  const ref = commit ?? policy.project.ref;
  const files = await Promise.all(item.files.map(async (file) => {
    // Replace website provenance with repository provenance, not code changes.
    // Keep use-client directives, all original comments and helper implementations.
    const source = await readFile(file.path, "utf8");
    return { ...file, content: withSignature(source, file.path,
      `https://github.com/${policy.project.repository}/blob/${ref}/${file.path}`) };
  }));
  files.push({ path: "LICENSE", type: "registry:lib", target: "~/licenses/asharca-ui-LICENSE.txt", content: await readFile("LICENSE", "utf8") });
  return {
    ...item,
    files,
    meta: {
      repository: policy.project.repository,
      ref,
      commit,
      dirty,
      // The actual local bytes win. Uncommitted changes are not an upstream release.
      source: "local-checkout",
    },
  };
}

export async function exportLocalComponent(slug: string, output: string) {
  if (path.extname(output).toLowerCase() !== ".json") {
    throw new Error("Output must be a new .json file.");
  }
  const item = await createLocalRegistryItem(slug);
  const destination = path.resolve(output);
  await mkdir(path.dirname(destination), { recursive: true });
  // Never overwrite a consumer file, previous artifact, or local customizations.
  await writeFile(destination, `${JSON.stringify(item, null, 2)}\n`, { flag: "wx" });
  return destination;
}

if (import.meta.main) {
  const [slug, flag, output, ...extra] = process.argv.slice(2);
  if (!slug || flag !== "--out" || !output || extra.length) {
    console.error("Usage: bun scripts/export-component.ts <project-slug> --out <new-file.json>\nRun from the asharca/ui source checkout; no website is started.");
    process.exitCode = 1;
  } else {
    try { console.log(await exportLocalComponent(slug, output)); }
    catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
