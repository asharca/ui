import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_PRECONNECT_RE =
  /<link\s+rel="preconnect"\s+href="\/"(?:\s+crossorigin(?:="[^"]*")?)?\s*\/?>/gi;

export function stripRootPreconnectHtml(html: string): string {
  return html.replace(ROOT_PRECONNECT_RE, "");
}

async function sanitizeExportedHtml(dir: string) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await sanitizeExportedHtml(file);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      const html = await readFile(file, "utf8");
      const nextHtml = stripRootPreconnectHtml(html);
      if (nextHtml !== html) {
        await writeFile(file, nextHtml, "utf8");
      }
    }
  }
}

export const STANDALONE_DEMO_SLUGS = [
  "workflow-studio",
  "forecast-community",
  "asset-workspace",
  "assistant-workspace",
] as const;

export async function buildTemplateDemos(
  targetDir: string,
  basePathPrefix = "",
) {
  const root = path.resolve(import.meta.dir, "..");
  const normalizedPrefix = basePathPrefix.replace(/\/+$/, "");
  await mkdir(targetDir, { recursive: true });

  for (const slug of STANDALONE_DEMO_SLUGS) {
    const templateDir = path.join(root, "templates", slug);
    const demoBasePath = `${normalizedPrefix}/demos/${slug}`;
    const outDir = path.join(templateDir, "out");
    const destDir = path.join(targetDir, slug);

    await rm(outDir, { recursive: true, force: true });
    console.log(`Building standalone demo "${slug}" with basePath="${demoBasePath}"...`);
    const child = Bun.spawn([process.execPath, "run", "build"], {
      cwd: templateDir,
      stdout: "inherit",
      stderr: "inherit",
      env: {
        ...process.env,
        NEXT_PUBLIC_BASE_PATH: demoBasePath,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    });
    if ((await child.exited) !== 0) {
      throw new Error(`Failed building standalone demo "${slug}"`);
    }

    await rm(destDir, { recursive: true, force: true });
    await cp(outDir, destDir, { recursive: true });
    await sanitizeExportedHtml(destDir);
    await rm(outDir, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  const root = path.resolve(import.meta.dir, "..");
  const targetDir = process.argv[2]
    ? path.resolve(root, process.argv[2])
    : path.join(root, "public", "demos");
  const prefix = process.argv[3] ?? "";
  await buildTemplateDemos(targetDir, prefix);
}
