import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { allShadcnTargets } from "@/lib/registry-server";
import { createLocalRegistryItem, exportLocalComponent } from "@/scripts/export-component";
import policy from "@/skills/beui/source-policy.json";

const root = path.resolve(import.meta.dir, "..");
const skillPath = path.join(root, "skills/beui/SKILL.md");

describe("hybrid skill sources", () => {
  test("policy maps actual workspace entry points without claiming official ownership", async () => {
    expect(policy.project.repository).toBe("asharca/ui");
    expect(policy.upstream.repository).toBe("starc007/ui-components");
    expect(policy.rules.selfHostedServiceRequired).toBe(false);
    expect(policy.rules.sameNamedOfficialFallback).toBe(false);
    const targets = allShadcnTargets();
    const declared = new Set(policy.project.entries.flatMap((entry) => entry.files));
    for (const name of await readdir(path.join(root, "components/workspace"))) {
      if (name.endsWith(".tsx")) expect(declared.has(`components/workspace/${name}`)).toBe(true);
    }
    for (const entry of policy.project.entries) {
      const target = targets.find((candidate) => candidate.slug === entry.slug);
      if (!target) throw new Error(`Missing registry target for ${entry.slug}`);
      expect(target.categorySlug).toBe(entry.category);
      expect(entry.files).toContain(target.file);
    }
  });

  test("skill checks ownership and local changes before official discovery", async () => {
    const skill = await readFile(skillPath, "utf8");
    expect(skill.indexOf("## Source decision")).toBeLessThan(skill.indexOf("## Official workflow"));
    expect(skill).toContain("source-policy.json");
    expect(skill).toContain("references/workspace.md");
    expect(skill).toContain("OR one of its required helpers differs");
    expect(skill).toContain("No MCP connection is needed");
    expect(skill).toContain("npx shadcn@latest add @beui/<slug>");
    expect(skill).not.toMatch(/add @beui\/workspace-(?:shell|tab-bar)/);
    expect(skill).not.toContain("https://asharca.github.io/ui/r/");
  });

  test("bundled reference keeps the new APIs and separate checkout/consumer steps", async () => {
    const guide = await readFile(path.join(root, "skills/beui", policy.project.reference), "utf8");
    expect(guide).toContain("--branch rebuild/beui-workspace");
    expect(guide).toContain("git rev-parse HEAD");
    expect(guide).toContain("WorkspaceShell");
    expect(guide).toContain("onPinnedChange(id, pinned)");
    expect(guide).toContain("The command runs in the consumer");
    expect(guide).toContain("--dry-run");
    expect(guide).toContain("--diff");
    expect(guide).not.toContain("bun run dev");
  });

  test("routing evals cover official, project and mixed composition", async () => {
    const data = JSON.parse(await readFile(path.join(root, "skills/beui/evals.json"), "utf8")) as {
      evals: { expected_slugs: string[]; expected_sources: Record<string, string> }[];
    };
    const owned = new Set(policy.project.entries.map((entry) => entry.slug));
    expect(data.evals.some((entry) => new Set(Object.values(entry.expected_sources)).size === 2)).toBe(true);
    for (const entry of data.evals) {
      for (const slug of entry.expected_slugs) {
        expect(entry.expected_sources[slug]).toBe(owned.has(slug) ? "project" : "official");
      }
    }
  });
});

describe("local component export without a server", () => {
  test("shell includes real source, same-snapshot helpers, alias targets and MIT license", async () => {
    const item = await createLocalRegistryItem("workspace-shell");
    expect(item.name).toBe("workspace-shell");
    expect(item.registryDependencies).toEqual([]);
    expect(item.meta.repository).toBe("asharca/ui");
    expect(item.files.some((file) => file.path === "components/workspace/workspace-sidebar.tsx")).toBe(true);
    expect(item.files.some((file) => file.path === "components/motion/animated-sidebar.tsx")).toBe(true);
    expect(item.files.some((file) => file.path === "lib/ease.ts")).toBe(true);
    expect(item.files.find((file) => file.path === "LICENSE")?.content).toContain("MIT License");
    expect(item.dependencies).toContain("motion");
    expect(item.dependencies).not.toContain("next");
    for (const file of item.files) {
      expect(file.content.length).toBeGreaterThan(0);
      expect(file.target).toBeTruthy();
      expect(file.path).not.toContain("components/app/");
      const raw = await readFile(path.join(root, file.path), "utf8");
      if (file.path !== "LICENSE") {
        expect(file.content).toContain(`github.com/asharca/ui/blob/${item.meta.ref}/${file.path}`);
        if (raw.startsWith('"use client";')) expect(file.content.startsWith('"use client";')).toBe(true);
      }
    }
  });

  test("standalone tabs do not drag in the shell and never fetch an official replacement", async () => {
    const item = await createLocalRegistryItem("workspace-tab-bar");
    expect(item.files.some((file) => file.path === "components/workspace/workspace-shell.tsx")).toBe(false);
    expect(item.files.some((file) => file.path === "components/motion/context-menu.tsx")).toBe(true);
    await expect(createLocalRegistryItem("workspace-sidebar")).rejects.toThrow("Not a project-owned");
    await expect(createLocalRegistryItem("button-base")).rejects.toThrow("Not a project-owned");
    await expect(createLocalRegistryItem("../package.json")).rejects.toThrow("Not a project-owned");
  });

  test("writes valid self-contained JSON and refuses to replace an existing file", async () => {
    const temporary = await mkdtemp(path.join(os.tmpdir(), "asharca-export-"));
    try {
      const output = path.join(temporary, "nested/tab-bar.json");
      expect(await exportLocalComponent("workspace-tab-bar", output)).toBe(output);
      const original = await readFile(output, "utf8");
      expect(JSON.parse(original).name).toBe("workspace-tab-bar");
      await expect(exportLocalComponent("workspace-tab-bar", output)).rejects.toThrow();
      expect(await readFile(output, "utf8")).toBe(original);
      const existing = path.join(temporary, "custom.json");
      await writeFile(existing, "my existing customization");
      await expect(exportLocalComponent("workspace-shell", existing)).rejects.toThrow();
      expect(await readFile(existing, "utf8")).toBe("my existing customization");
      await expect(exportLocalComponent("workspace-shell", path.join(temporary, "source.tsx"))).rejects.toThrow("new .json");
    } finally { await rm(temporary, { recursive: true, force: true }); }
  });
});
