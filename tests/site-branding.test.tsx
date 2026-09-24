import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { ThreeColumnLayout } from "@/components/app/chrome/three-column-layout";
import { buildComponentMarkdown } from "@/lib/component-markdown";
import { buildGuideMarkdown } from "@/lib/guide-markdown";
import { findCategory, findComponent } from "@/lib/registry";
import { componentJsonLd } from "@/lib/seo";
import {
  GITHUB_REPOSITORY,
  GITHUB_REPOSITORY_URL,
  GITHUB_REPOSITORY_API_URL,
  GITHUB_LICENSE_URL,
  GITHUB_SKILL_INSTALL,
} from "@/lib/repository";

const ROOT = path.join(import.meta.dir, "..");

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.(?:tsx?|mjs|css|md)$/.test(entry.name) ? [file] : [];
  }));
  return files.flat();
}

describe("site sponsorship cleanup", () => {
  test("removes sponsorship navigation, checkout pages and source references", async () => {
    const files = (await Promise.all(["app", "components", "lib", "skills"].map((dir) => sourceFiles(path.join(ROOT, dir))))).flat();
    const matches: string[] = [];
    for (const file of files) {
      const source = await readFile(file, "utf8");
      if (/SponsorCard|SponsorPlanBeam|\/sponsors\b|sponsorship|Sponsored by|DODO_SPONSOR_|SPONSOR_(?:EVM|SOL)_ADDRESS/i.test(source)) matches.push(path.relative(ROOT, file));
    }
    expect(matches).toEqual([]);
  });

  test("removes sponsor-only files and funding links", async () => {
    for (const name of [
      ".github/FUNDING.yml",
      "app/sponsors/page.tsx",
      "components/app/chrome/right-sidebar.tsx",
      "components/app/docs/sponsor-card.tsx",
      "components/app/sponsors/sponsor-plan-beam.tsx",
      "public/sponsors/tracwell-icon-light.svg",
      "public/sponsors/tracwell-icon-dark.svg",
    ]) expect(existsSync(path.join(ROOT, name))).toBe(false);
  });

  test("omitting the right rail leaves no empty column or complementary region", () => {
    for (const rightSidebar of [undefined, null, false]) {
      const html = renderToStaticMarkup(<ThreeColumnLayout leftSidebar={<nav>Navigation</nav>} rightSidebar={rightSidebar}><main>Content</main></ThreeColumnLayout>);
      expect(html).toContain("Navigation");
      expect(html).toContain("Content");
      expect(html).not.toContain("<aside");
      expect(html).not.toContain("--right-sidebar-width");
    }
  });

  test("an explicitly supplied resource rail remains available without sponsor labels", () => {
    const html = renderToStaticMarkup(<ThreeColumnLayout leftSidebar={<nav>Navigation</nav>} rightSidebar={<p>Page contents</p>}><main>Content</main></ThreeColumnLayout>);
    expect(html).toContain('aria-label="Additional resources"');
    expect(html).toContain("--right-sidebar-width");
    expect(html).toContain("Page contents");
  });
});

describe("current repository identity", () => {
  test("links, API, license and Skill install identify asharca/ui", async () => {
    expect(GITHUB_REPOSITORY).toBe("asharca/ui");
    expect(GITHUB_REPOSITORY_URL).toBe("https://github.com/asharca/ui");
    expect(GITHUB_REPOSITORY_API_URL).toBe("https://api.github.com/repos/asharca/ui");
    expect(GITHUB_LICENSE_URL).toBe("https://github.com/asharca/ui/blob/main/LICENSE");
    expect(GITHUB_SKILL_INSTALL).toBe("npx skills add asharca/ui --skill beui");
    const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
    expect(pkg.repository.url).toBe(GITHUB_REPOSITORY_URL);
  });

  test("runtime project links do not drift back to the upstream repository", async () => {
    const files = (await Promise.all(["app", "components", "lib"].map((dir) => sourceFiles(path.join(ROOT, dir))))).flat();
    for (const file of files) {
      expect(await readFile(file, "utf8")).not.toMatch(/(?:github\.com|api\.github\.com\/repos)\/starc007\/ui-components/);
    }
    for (const name of ["site-header.tsx", "site-footer.tsx"]) {
      expect(await readFile(path.join(ROOT, "components/app/chrome", name), "utf8")).toContain("GITHUB_REPOSITORY_URL");
    }
  });

  test("generated component docs and agent guides use current project links", async () => {
    const markdown = await buildComponentMarkdown("blocks", "workspace-tab-bar");
    expect(markdown).not.toBeNull();
    expect(markdown).toContain(`- GitHub: ${GITHUB_REPOSITORY_URL}`);
    expect(buildGuideMarkdown("ai-agents")).toContain(GITHUB_SKILL_INSTALL);
    const category = findCategory("blocks");
    const component = findComponent("blocks", "workspace-tab-bar");
    if (!category || !component) throw new Error("Workspace registry entry missing.");
    const metadata = JSON.stringify(componentJsonLd(category, component));
    expect(metadata).toContain(`"codeRepository":"${GITHUB_REPOSITORY_URL}"`);
    expect(metadata).toContain(`"license":"${GITHUB_LICENSE_URL}"`);
  });

  test("README badges and install commands change without losing upstream attribution", async () => {
    const readme = await readFile(path.join(ROOT, "README.md"), "utf8");
    expect(readme).toContain(GITHUB_REPOSITORY_URL);
    expect(readme).toContain(GITHUB_SKILL_INSTALL);
    expect(readme).toContain("starc007/ui-components@1e23f4b");
    const reference = await readFile(path.join(ROOT, "README.beui.md"), "utf8");
    expect(reference).toContain("img.shields.io/github/stars/asharca/ui");
    expect(reference).toContain("repos=asharca/ui");
    expect(reference).not.toContain("starc007/ui-components");
    const license = await readFile(path.join(ROOT, "LICENSE"), "utf8");
    expect(license).toContain("MIT License");
    expect(license).toContain("Saurabh");
  });
});
