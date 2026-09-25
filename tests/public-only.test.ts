import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { allShadcnTargets, buildShadcnItem } from "@/lib/registry-server";

const ROOT = path.resolve(import.meta.dir, "..");
const forbidden = /pro\.beui\.dev|beui-pro|BEUI_PRO_TOKEN|PRO_(?:REGISTRY|API)_URL|\b(?:FreeAndPro|ProCard)\b|(?:Get|Explore|beUI) Pro|free_to_pro/;
const extensions = /\.(?:[cm]?[jt]sx?|md|jsonc?|css|ya?ml)$/;
const ignoredDirectories = new Set(["node_modules", ".git", ".next", ".wrangler"]);

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(filename);
    return entry.isFile() && extensions.test(entry.name) ? [filename] : [];
  });
}

describe("public-only distribution", () => {
  test("site, examples, docs, skills and MCP do not promote or configure the removed product", () => {
    const directories = ["app", "components", "lib", "docs", "skills", "mcp", "public"];
    const files = [
      ...directories.flatMap((dir) => filesIn(path.join(ROOT, dir))),
      ...["README.md", "README.beui.md", "AGENTS.md", "UPSTREAM.md", "next.config.mjs", ".env.example"]
        .map((filename) => path.join(ROOT, filename)),
    ];
    const matches = files.filter((filename) => forbidden.test(readFileSync(filename, "utf8")));
    expect(matches.map((filename) => path.relative(ROOT, filename))).toEqual([]);
  });

  test("dead marketing, authorization and private-registry modules are removed", () => {
    for (const filename of [
      "components/app/docs/pro-card.tsx",
      "components/app/landing/free-and-pro.tsx",
      "components/app/rainbow-cta.tsx",
      "skills/beui-pro/SKILL.md",
      "mcp/src/pro-server.ts",
      "mcp/src/pro-registry.ts",
      "mcp/src/oauth.ts",
    ]) {
      expect(existsSync(path.join(ROOT, filename)), filename).toBe(false);
    }
    for (const filename of ["mcp/package.json", "mcp/bun.lock", "mcp/src/index.ts", "mcp/wrangler.jsonc"]) {
      expect(readFileSync(path.join(ROOT, filename), "utf8"), filename)
        .not.toMatch(/workers-oauth-provider|OAuthProvider|OAUTH_KV/);
    }
  });

  test("the application no longer redirects to the removed sales site", async () => {
    const { default: config } = await import("../next.config.mjs");
    if (!config.redirects) throw new Error("Redirect configuration is missing.");
    const redirects = await config.redirects();
    expect(redirects.some((item) => item.source === "/pro" || forbidden.test(item.destination))).toBe(false);
    expect(redirects.some((item) => item.source === "/components/charts")).toBe(true);
  });

  test("changed examples stay installable and ship no promotion in Registry source", async () => {
    for (const slug of ["center-morph-modal", "preview-rail", "radio"]) {
      const item = await buildShadcnItem("motion", slug);
      expect(item).not.toBeNull();
      const source = item?.files.map((file) => file.content).join("\n") ?? "";
      expect(source.length).toBeGreaterThan(0);
      expect(source).not.toMatch(forbidden);
    }
    const names = allShadcnTargets().map((item) => item.slug);
    expect(names).toContain("workspace-shell");
    expect(names).toContain("workspace-tab-bar");
    expect(names).toContain("chat-app");
  });

  test("default CI performs code checks without launching servers, browsers or builds", () => {
    const workflow = readFileSync(path.join(ROOT, ".github/workflows/ci.yml"), "utf8");
    expect(workflow).toContain("bun run check");
    expect(workflow).toContain("run: bun test");
    expect(workflow).toContain("working-directory: mcp");
    expect(workflow).not.toMatch(/playwright|chromium|screenshot|bun run (?:dev|start|build)|test:workspace:browser/);
  });
});
