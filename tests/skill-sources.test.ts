import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { allShadcnTargets } from "@/lib/registry-server";
import { createLocalRegistryItem, exportLocalComponent } from "@/scripts/export-component";
import policy from "@/skills/beui/source-policy.json";

const root = path.resolve(import.meta.dir, "..");
const skillPath = path.join(root, "skills/beui/SKILL.md");

describe("custom component skill supplement", () => {
  test("the export inventory describes real entries without component-selection rules", async () => {
    expect(policy.project.repository).toBe("asharca/ui");
    expect(policy.upstream.repository).toBe("starc007/ui-components");
    expect("rules" in policy).toBe(false);
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

  test("skill adds custom APIs while keeping official use and composition available", async () => {
    const skill = await readFile(skillPath, "utf8");
    expect(skill).toContain("## Official beUI components");
    expect(skill).toContain("## Custom workspace components");
    expect(skill).toContain("source-policy.json");
    expect(skill).toContain("references/workspace.md");
    expect(skill).toContain("can be freely combined with custom components");
    expect(skill).toContain("onPinnedChange(id, pinned)");
    expect(skill).toContain("npx shadcn@latest add @beui/<slug>");
    expect(skill).not.toContain("## Source decision");
    expect(skill).not.toContain("unchanged components only");
    expect(skill).not.toContain("Do not install an official lookalike");
    expect(skill).not.toContain("OR one of its required helpers differs");
    expect(skill).not.toContain("| Avoid |");
    expect(skill).not.toMatch(/add @beui\/workspace-(?:shell|tab-bar)/);
    expect(skill).not.toContain("https://asharca.github.io/ui/r/");
  });

  test("bundled reference keeps the APIs and separate checkout/consumer steps", async () => {
    const guide = await readFile(path.join(root, "skills/beui", policy.project.reference), "utf8");
    expect(guide).toContain("--branch rebuild/beui-workspace");
    expect(guide).toContain("git rev-parse HEAD");
    expect(guide).toContain("WorkspaceShell");
    expect(guide).toContain("onPinnedChange(id, pinned)");
    expect(guide).toContain("The command runs in the consumer");
    expect(guide).toContain("Official beUI components can be freely combined");
    expect(guide).toContain("--dry-run");
    expect(guide).toContain("--diff");
    expect(guide).not.toContain("bun run dev");
  });

  test("examples cover official and custom components without excluding official workspace content", async () => {
    const data = JSON.parse(await readFile(path.join(root, "skills/beui/evals.json"), "utf8")) as {
      evals: { id: string; expected_slugs: string[]; not_slugs: string[]; expected_sources: Record<string, string> }[];
    };
    const custom = new Set(policy.project.entries.map((entry) => entry.slug));
    const mixed = data.evals.find((entry) => entry.id === "mixed-sources");
    if (!mixed) throw new Error("Missing mixed composition example");
    expect(mixed.expected_slugs).toContain("workspace-shell");
    expect(mixed.expected_slugs).toContain("tabs");
    expect(mixed.not_slugs).toEqual([]);
    expect(data.evals.some((entry) => entry.expected_slugs.includes("chat-app"))).toBe(true);
    for (const entry of data.evals) {
      for (const slug of entry.expected_slugs) {
        expect(entry.expected_sources[slug]).toBe(custom.has(slug) ? "project" : "official");
      }
      if (entry.expected_slugs.some((slug) => custom.has(slug))) expect(entry.not_slugs).toEqual([]);
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

  test("standalone tabs include their dependencies and validate custom export entry names", async () => {
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
