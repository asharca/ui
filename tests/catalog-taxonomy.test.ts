import { describe, expect, test } from "bun:test";
import { previews } from "@/components/previews";
import {
  CATALOG_SECTIONS,
  EXPLORE_DOMAINS,
  getCatalogSection,
  getExploreItems,
  ILLUSTRATION_COLLECTIONS,
  ILLUSTRATION_VARIANT_COUNT,
} from "@/lib/catalog-taxonomy";
import { findComponent, registry } from "@/lib/registry";

describe("catalog presentation taxonomy", () => {
  test("maps every non-illustration registry component into exactly one web section", () => {
    const webRegistryItems = CATALOG_SECTIONS.filter(
      (section) => section.id !== "mobile",
    ).flatMap((section) =>
      section.items
        .filter((item) => item.kind === "registry")
        .map((item) => `${item.categorySlug}/${item.slug}`),
    );

    const expected = registry.flatMap((category) =>
      category.components
        .filter((component) => !component.slug.startsWith("illustration-"))
        .map((component) => `${category.slug}/${component.slug}`),
    );

    expect(new Set(webRegistryItems).size).toBe(webRegistryItems.length);
    expect(webRegistryItems.sort()).toEqual(expected.sort());
  });

  test("includes all 19 illustration collections and 40 variants with valid previews", () => {
    expect(ILLUSTRATION_COLLECTIONS.length).toBe(19);
    expect(ILLUSTRATION_VARIANT_COUNT).toBe(40);
    for (const collection of ILLUSTRATION_COLLECTIONS) {
      expect(collection.variants.length).toBeGreaterThan(0);
      for (const variant of collection.variants) {
        expect(previews[variant.previewKey]).toBeDefined();
        expect(variant.installSlug.length).toBeGreaterThan(0);
      }
    }
  });

  test("includes all 14 added web families in their expected sections and variant counts", () => {
    const compSlugs = new Set(getCatalogSection("components").items.map((i) => i.slug));
    const agentSlugs = new Set(getCatalogSection("agents").items.map((i) => i.slug));
    const blockSlugs = new Set(getCatalogSection("blocks").items.map((i) => i.slug));
    const pageSlugs = new Set(getCatalogSection("pages").items.map((i) => i.slug));

    expect(compSlugs.has("animated-select")).toBe(true);
    expect(agentSlugs.has("model-picker")).toBe(true);
    expect(pageSlugs.has("legal-pages")).toBe(true);

    for (const slug of [
      "deployments",
      "webhooks",
      "referral-rewards",
      "leaderboard",
      "invoice",
      "cookie-consent",
      "prompt-library",
      "mcp-connectors",
      "airdrop-claim",
      "eval-results",
      "bento-showcase",
    ]) {
      expect(blockSlugs.has(slug)).toBe(true);
    }

    expect(findComponent("agents", "agent-team")?.examples?.length).toBe(3);
    expect(findComponent("blocks", "hero-sections")?.examples?.length).toBe(13);
    expect(findComponent("blocks", "feature-sections")?.examples?.length).toBe(14);
    expect(findComponent("blocks", "social-proof")?.examples?.length).toBe(4);
    expect(findComponent("blocks", "roadmap")?.examples?.length).toBe(2);
    expect(findComponent("blocks", "careers")?.examples?.length).toBe(4);
  });

  test("includes all 11 templates (4 standalone + 7 landing templates)", () => {
    const templates = getCatalogSection("templates").items;
    expect(templates.length).toBe(11);
    expect(templates.filter((t) => t.kind === "standalone").length).toBe(4);
    expect(templates.filter((t) => t.kind === "registry").length).toBe(7);
  });

  test("explore items cover every domain tab and resolve valid preview keys", () => {
    const items = getExploreItems();
    expect(items.length).toBeGreaterThan(300);

    for (const domain of EXPLORE_DOMAINS) {
      const domainId = domain.id;
      const matching =
        domainId === "all"
          ? items
          : items.filter((item) => item.domains.includes(domainId));
      expect(matching.length).toBeGreaterThan(0);
    }

    for (const item of items) {
      expect(previews[item.previewKey]).toBeDefined();
    }
  });
});
