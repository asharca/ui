import type { MetadataRoute } from "next";
import { ILLUSTRATION_COLLECTIONS } from "@/lib/catalog-taxonomy";
import { changelogEntries } from "@/lib/changelog";
import { componentDates } from "@/lib/component-dates";
import {
  categoryPath,
  componentPath,
  NATIVE_PATH,
  nativeComponentPath,
} from "@/lib/component-paths";
import {
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREENS_PATH,
  mobileScreenPath,
} from "@/lib/mobile-screens";
import { native } from "@/lib/native";
import { allComponents, registry } from "@/lib/registry";
import { seoPagePath, seoPages } from "@/lib/seo-pages";
import { SITE_URL as SITE } from "@/lib/site";
import { standaloneTemplates } from "@/lib/standalone-templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const components = allComponents();
  const newestComponentDate = components
    .map((component) => componentDates(component.category.slug, component.slug).updatedAt)
    .sort()
    .at(-1);
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: newestComponentDate, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/components`, lastModified: newestComponentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/explore`, lastModified: newestComponentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/illustrations`, lastModified: newestComponentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/studio`, lastModified: newestComponentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/installation`, lastModified: "2026-11-04", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/ai-agents`, lastModified: "2026-07-04", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/motion-patterns`, lastModified: "2026-07-09", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/openui`, lastModified: "2026-08-13", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/native-setup`, lastModified: "2026-10-16", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/theme`, lastModified: "2026-07-04", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/changelog`, lastModified: changelogEntries[0]?.date, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/templates`, lastModified: "2026-11-04", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/llms.txt`, lastModified: newestComponentDate, changeFrequency: "weekly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = registry.map((category) => {
    const lastModified = category.components
      .map((component) => componentDates(category.slug, component.slug).updatedAt)
      .sort()
      .at(-1);
    return {
      url: `${SITE}${categoryPath(category.slug)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // Component detail pages are the primary content. Machine endpoints
  // (/r/* JSON and raw text) are intentionally excluded from search.
  const componentPages: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${SITE}${componentPath(c.category.slug, c.slug)}`,
    lastModified: componentDates(c.category.slug, c.slug).updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const illustrationPages: MetadataRoute.Sitemap = ILLUSTRATION_COLLECTIONS.map(
    (collection) => ({
      url: `${SITE}/illustrations/${collection.slug}`,
      lastModified: collection.launchedAt ?? "2026-11-04",
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const templatePages: MetadataRoute.Sitemap = standaloneTemplates.map((template) => ({
    url: `${SITE}/templates/${template.slug}`,
    lastModified: "2026-11-04",
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // beUI Native & Mobile screen pages.
  const nativeLaunch = "2026-10-16";
  const mobileLaunch = "2026-11-15";
  const nativePages: MetadataRoute.Sitemap = [
    { url: `${SITE}/mobile`, lastModified: mobileLaunch, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}${MOBILE_SCREENS_PATH}`, lastModified: mobileLaunch, changeFrequency: "weekly", priority: 0.85 },
    ...MOBILE_SCREEN_GROUPS.map((group) => ({
      url: `${SITE}${mobileScreenPath(group.slug)}`,
      lastModified: group.launchedAt ?? mobileLaunch,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    { url: `${SITE}${NATIVE_PATH}`, lastModified: nativeLaunch, changeFrequency: "weekly", priority: 0.8 },
    ...native.components.map((component) => ({
      url: `${SITE}${nativeComponentPath(component.slug)}`,
      lastModified: nativeLaunch,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // Comparison and tutorial pages. Nothing on the site links to them, so the
  // sitemap is how crawlers find them.
  const landingPages: MetadataRoute.Sitemap = (["alternatives", "guides"] as const).flatMap(
    (kind) =>
      seoPages(kind).map((page) => ({
        url: `${SITE}${seoPagePath(kind, page.slug)}`,
        lastModified: page.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...componentPages,
    ...illustrationPages,
    ...templatePages,
    ...nativePages,
    ...landingPages,
  ];
}
