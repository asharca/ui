import { describe, expect, test } from "bun:test";
import { demoUrlFor, SITE_BASE_PATH } from "@/lib/site";
import { standaloneTemplates } from "@/lib/standalone-templates";
import { getTemplateShowcase, LANDING_SHOWCASE_SLUGS } from "@/lib/template-showcase";
import { stripRootPreconnectHtml } from "@/scripts/build-template-demos";
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
    expect(staticResourcePath("/native/r")).toBe("/native/r/index.json");
    expect(staticResourcePath("/native/r/button")).toBe("/native/r/button.json");
    expect(staticResourcePath("/native/r/{slug}")).toBe("/native/r/{slug}.json");
    expect(staticResourcePath("/native/r/button.json")).toBe("/native/r/button.json");
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
    // biome-ignore lint/suspicious/noTemplateCurlyInString: TS source fixture, not an interpolated test string.
    const input = 'const image = `/api/og?component=${slug}`; const manifest = { start_url: "/", icons: [{src: "/beui-mark.png"}] };';
    const output = transformSiteSource(input, "test.ts", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('https://asharca.github.io/ui/api/og.png');
    expect(output).toContain('start_url: "/ui/"');
    expect(output).toContain('src: "/ui/beui-mark.png"');
  });
  test("publishes absolute metadata URLs for static registry resources", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Intentionally exercise template expressions in source.
    const input = 'const detail = `/r/${slug}`; const raw = `/r/${slug}/raw`; const item = `/r/${slug}.json`; const directory = `/${slug}.json`;';
    const output = transformSiteSource(input, "test.ts", "https://asharca.github.io/ui", "/ui");
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Check the printed source expression.
    expect(output).toContain('https://asharca.github.io/ui/r/${slug}/detail.json');
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Check the printed source expression.
    expect(output).toContain('https://asharca.github.io/ui/r/${slug}/raw.txt');
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Check the printed source expression.
    expect(output).toContain('https://asharca.github.io/ui/r/${slug}.json');
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Check the printed source expression.
    expect(output).toContain('https://asharca.github.io/ui/${slug}.json');
  });
  test("scopes demo links and 404 defaults to the project base path", () => {
    const input = 'const links = { homeHref: "/", browseHref: "/components/motion", url: "/docs/ai-agents" };';
    const output = transformSiteSource(input, "/stage/components/previews/demo.tsx", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('homeHref: "/ui/"');
    expect(output).toContain('browseHref: "/ui/components/motion"');
    expect(output).toContain('url: "/ui/docs/ai-agents"');
  });
  test("keeps TypeScript generic functions intact instead of parsing them as JSX", () => {
    const output = transformSiteSource('const pick = <T>(value: T) => value;', "test.ts", "https://asharca.github.io/ui", "/ui");
    expect(output).toContain('const pick = <T>(value: T) => value;');
  });
  test("native discovery URLs resolve to JSON without changing external endpoints", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Executable source fixture for deployment transformation.
    const input = 'const SITE_URL = "https://asharca.github.io/ui"; const slug = "button"; const index = { url: "/native/r", types: { "application/json": "/native/r" } }; const detail = `/native/r/${slug}`; const guide = `${SITE_URL}/native/r`; const external = "https://beui.dev/native/r"; const explicit = "/native/r/button.json"; return { index, detail, guide, external, explicit };';
    const output = transformSiteSource(input, "test.ts", "https://asharca.github.io/ui", "/ui");
    const result = new Function(output)();
    expect(result.index.url).toBe("https://asharca.github.io/ui/native/r/index.json");
    expect(result.index.types["application/json"]).toBe(result.index.url);
    expect(result.guide).toBe(result.index.url);
    expect(result.detail).toBe("https://asharca.github.io/ui/native/r/button.json");
    expect(result.explicit).toBe(result.detail);
    expect(result.external).toBe("https://beui.dev/native/r");
  });
  test("scopes the shared RSS URL for native anchors and metadata", () => {
    for (const siteUrl of ["https://asharca.github.io/ui", "https://ui.example.com"]) {
      const input = 'const CHANGELOG_FEED_PATH = "/changelog/rss.xml"; return { anchor: CHANGELOG_FEED_PATH, metadata: { "application/rss+xml": CHANGELOG_FEED_PATH } };';
      const output = transformSiteSource(input, "/stage/lib/changelog/index.ts", siteUrl, pagesConfiguration(siteUrl).basePath);
      const result = new Function(output)();
      expect(result.anchor).toBe(`${siteUrl}/changelog/rss.xml`);
      expect(result.metadata["application/rss+xml"]).toBe(result.anchor);
    }
  });
  test("scopes quoted link and image data and resolves demo destinations", () => {
    const links = ["/docs", "/guides", "/components/ai", "/components/all", "#details", "https://example.com"];
    const input = `return { "brand": { "href": "/" }, "image": { "src": "/landing/coastal-sketch.webp" }, "links": ${JSON.stringify(links.map(href => ({ href })))} };`;
    const output = new Function(transformSiteSource(input, "demo.ts", "https://asharca.github.io/ui", "/ui"))();
    expect(output.brand.href).toBe("/ui/");
    expect(output.image.src).toBe("/ui/landing/coastal-sketch.webp");
    expect(output.links.map((link: { href: string }) => link.href)).toEqual(["/ui/docs/ai-agents", "/ui/docs/motion-patterns", "/ui/components/agents", "/ui/components/motion", "#details", "https://example.com"]);
  });
  test("leaves site navigation descriptors for Next Link to prefix", () => {
    const input = 'return { links: [{ href: "/charts" }], image: { src: "/beui-mark.png" } };';
    const result = new Function(transformSiteSource(input, "/stage/components/app/chrome/sidebar.tsx", "https://asharca.github.io/ui", "/ui"))();
    expect(result.links[0].href).toBe("/charts");
    expect(result.image.src).toBe("/ui/beui-mark.png");
  });
  test("resolves template demo URLs cleanly and ships complete showcase metadata for all 11 templates", () => {
    const forbidden = /pro\.beui\.dev|beui-pro|BEUI_PRO_TOKEN|beUI Pro|Buy for \$/i;
    expect(demoUrlFor("workflow-studio")).toBe(`${SITE_BASE_PATH}/demos/workflow-studio/`);
    expect(demoUrlFor("/ai-landing/")).toBe(`${SITE_BASE_PATH}/demos/ai-landing/`);
    expect(withBasePath("/demos/workflow-studio/", pagesConfiguration("https://asharca.github.io/ui").basePath)).toBe("/ui/demos/workflow-studio/");

    expect(standaloneTemplates.length).toBe(4);
    for (const template of standaloneTemplates) {
      expect(template.whatIsIt.length).toBeGreaterThan(20);
      expect(template.whoIsItFor.length).toBeGreaterThan(20);
      expect(template.highlights.length).toBeGreaterThanOrEqual(4);
      expect(forbidden.test(`${template.whatIsIt} ${template.whoIsItFor}`)).toBe(false);
    }

    expect(LANDING_SHOWCASE_SLUGS.length).toBe(7);
    for (const slug of LANDING_SHOWCASE_SLUGS) {
      const showcase = getTemplateShowcase(slug);
      expect(showcase).toBeDefined();
      expect(showcase?.whatIsIt.length).toBeGreaterThan(20);
      expect(showcase?.whoIsItFor.length).toBeGreaterThan(20);
      expect(showcase?.highlights.length).toBeGreaterThanOrEqual(6);
      expect(forbidden.test(`${showcase?.tagline} ${showcase?.whatIsIt} ${showcase?.whoIsItFor}`)).toBe(false);
    }
  });
  test("strips redundant root preconnect links from exported template demo HTML without touching scoped links", () => {
    const html =
      '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><link rel="preconnect" href="/" crossorigin=""/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/><link rel="stylesheet" href="/ui/demos/workflow-studio/_next/static/chunks/app.css"/></head><body><a href="/ui/demos/workflow-studio/editor/">Editor</a></body></html>';
    const cleaned = stripRootPreconnectHtml(html);
    expect(cleaned).not.toContain('href="/"');
    expect(cleaned).toContain('href="https://fonts.gstatic.com"');
    expect(cleaned).toContain('href="/ui/demos/workflow-studio/_next/static/chunks/app.css"');
    expect(cleaned).toContain('href="/ui/demos/workflow-studio/editor/"');
  });
});
