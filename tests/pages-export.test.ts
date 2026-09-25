import { describe, expect, test } from "bun:test";
import { pagesConfiguration, staticResourcePath, withBasePath } from "@/scripts/pages/paths";
import { transformSiteSource } from "@/scripts/pages/transform";

describe("GitHub Pages publication adapter", () => {
  test("resolves repository and custom-domain base paths", () => {
    expect(pagesConfiguration("https://asharca.github.io/ui/")).toEqual({ siteUrl: "https://asharca.github.io/ui", basePath: "/ui" });
    expect(pagesConfiguration("https://ui.example.com").basePath).toBe("");
    expect(() => pagesConfiguration("https://user:secret@example.com")).toThrow();
    expect(() => pagesConfiguration("https://example.com/?x=1")).toThrow();
    expect(() => pagesConfiguration("file:///tmp/site")).toThrow();
  });
  test("uses explicit JSON and text extensions without redirecting install items", () => {
    expect(staticResourcePath("/r")).toBe("/r/index.json");
    expect(staticResourcePath("/r/workspace-shell")).toBe("/r/workspace-shell/detail.json");
    expect(staticResourcePath("/r/workspace-shell/raw")).toBe("/r/workspace-shell/raw.txt");
    expect(staticResourcePath("/r/workspace-shell.json")).toBe("/r/workspace-shell.json");
    expect(staticResourcePath("/r/registry.json")).toBe("/r/registry.json");
    expect(staticResourcePath("/r/{slug}")).toBe("/r/{slug}/detail.json");
  });
  test("preserves external links, fragments and already prefixed resources", () => {
    for (const value of ["https://beui.dev/r/registry.json", "//example.com/logo.png", "#preview", "/ui/logo.png"]) {
      expect(withBasePath(value, "/ui")).toBe(value);
    }
    expect(withBasePath("/llms.txt", "/ui")).toBe("/ui/llms.txt");
  });
  test("prefixes native assets but lets Next Link handle its own basePath", () => {
    const input = `'use client'; export const Demo = () => <><Link href="/workspace" /><a href="/workspace" /><img src="/beui-mark.png" /><link href="/r" /></>;`;
    const output = transformSiteSource(input, "test.tsx", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('Link href="/workspace"');
    expect(output).toContain('a href="/ui/workspace"');
    expect(output).toContain('src="/ui/beui-mark.png"');
    expect(output).toContain('href="/ui/r/index.json"');
    expect(output).toMatch(/^['"]use client['"]/);
  });
  test("updates fetches and detached windows without changing external requests", () => {
    const input = `fetch('/api/github-stars'); fetch(markdownPath); new URL('/workspace', location.href); fetch('https://beui.dev/r');`;
    const output = transformSiteSource(input, "test.ts", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('/ui/api/github-stars.json');
    expect(output).toContain('"/ui" + markdownPath');
    expect(output).toContain('/ui/workspace/');
    expect(output).toContain('https://beui.dev/r');
  });
  test("uses a static OpenGraph resource and a scoped web manifest", () => {
    const input = 'const image = `/api/og?component=${slug}`; const manifest = { start_url: "/", icons: [{src: "/beui-mark.png"}] };';
    const output = transformSiteSource(input, "test.ts", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('https://asharca.github.io/ui/api/og.png');
    expect(output).toContain('start_url: "/ui/"');
    expect(output).toContain('src: "/ui/beui-mark.png"');
  });
});
