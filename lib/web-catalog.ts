import type { CategoryEntry, ComponentEntry, ComponentExample } from "@/lib/registry";
import { webCatalogFamilies } from "@/lib/web-catalog-data";

export type WebCatalogFamily = {
  publicSlug: string;
  category: string;
  existingEntrySlug?: string;
  originalExample?: ComponentExample;
  entry: ComponentEntry;
};

/** Extend the existing catalog without replacing its public install contracts. */
export function withWebCatalog(categories: CategoryEntry[]): CategoryEntry[] {
  const slugs = new Set<string>();
  for (const category of categories) {
    for (const component of category.components) slugs.add(component.slug);
  }
  for (const family of webCatalogFamilies) {
    const category = categories.find((entry) => entry.slug === family.category);
    if (!category) throw new Error(`Unknown Web catalog category: ${family.category}`);
    if (!family.existingEntrySlug) {
      if (slugs.has(family.entry.slug)) throw new Error(`Duplicate component: ${family.entry.slug}`);
      category.components.push(family.entry);
      slugs.add(family.entry.slug);
      continue;
    }
    const component = category.components.find((entry) => entry.slug === family.existingEntrySlug);
    if (!component) throw new Error(`Missing reuse target: ${family.existingEntrySlug}`);
    const examples = component.examples ?? [];
    if (family.originalExample && !examples.some((example) => example.installSlug === family.originalExample?.installSlug)) {
      examples.unshift(family.originalExample);
    }
    examples.push(...(family.entry.examples ?? []));
    component.examples = examples;
    if (family.entry.extraFiles?.length) {
      component.extraFiles = [...new Set([...(component.extraFiles ?? []), ...family.entry.extraFiles])];
    }
  }
  return categories;
}
