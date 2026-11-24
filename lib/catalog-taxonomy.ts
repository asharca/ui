import { componentPath } from "@/lib/component-paths";
import {
  MOBILE_SCREEN_GROUPS,
  mobileScreenPath,
} from "@/lib/mobile-screens";
import { type ComponentEntry, type ComponentExample, registry } from "@/lib/registry";
import { standaloneTemplates } from "@/lib/standalone-templates";
import { webCatalogFamilies } from "@/lib/web-catalog-data";

export type CatalogSectionId =
  | "components"
  | "agents"
  | "blocks"
  | "pages"
  | "templates"
  | "charts"
  | "mobile";

export type CatalogItem = {
  slug: string;
  name: string;
  description: string;
  href: string;
  categorySlug: string;
  section: CatalogSectionId;
  variantCount: number;
  previewKey: string;
  badge?: "new";
  launchedAt?: string;
  widePreview: boolean;
  kind: "registry" | "standalone" | "native" | "mobile-screen";
  keywords?: string[];
};

export type CatalogSection = {
  id: CatalogSectionId;
  label: string;
  items: CatalogItem[];
};

export type IllustrationVariant = {
  slug: string;
  name: string;
  description: string;
  previewKey: string;
  file: string;
  previewFile: string;
  usageFile?: string;
  installSlug: string;
  badge?: "new";
  launchedAt?: string;
};

export type IllustrationCollection = {
  slug: string;
  publicSlug: string;
  name: string;
  description: string;
  docsHref: string;
  badge?: "new";
  launchedAt?: string;
  variants: IllustrationVariant[];
};

export type ExploreDomainId =
  | "all"
  | "ai"
  | "crypto"
  | "commerce"
  | "saas"
  | "collaboration"
  | "marketing";

export type ExploreItem = {
  id: string;
  familyName: string;
  variantName: string;
  typeLabel: "Component" | "Agent" | "Block" | "Page" | "Template" | "Chart";
  href: string;
  previewKey: string;
  domains: Exclude<ExploreDomainId, "all">[];
  badge?: "new";
  launchedAt?: string;
  widePreview: boolean;
};

export const EXPLORE_DOMAINS: readonly { id: ExploreDomainId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & agents" },
  { id: "crypto", label: "Crypto" },
  { id: "commerce", label: "Commerce" },
  { id: "saas", label: "SaaS & dashboards" },
  { id: "collaboration", label: "Collaboration" },
  { id: "marketing", label: "Marketing" },
];

const AGENT_WORKFLOW_BLOCK_SLUGS = new Set([
  "agent-builder",
  "knowledge-base",
  "questionnaire",
  "usage-budget",
  "diff-review",
]);

const PAGE_BLOCK_SLUGS = new Set([
  "auth",
  "onboarding",
  "checkout-pages",
  "settings-pages",
  "dashboards",
  "waitlist-pages",
  "status-pages",
  "pricing-pages",
  "search-pages",
  "docs-pages",
  "about",
  "careers",
  "changelog-pages",
  "blog-pages",
  "not-found",
  "trading-pages",
  "crypto-agent",
  "crypto-governance",
  "legal-pages",
]);

const LANDING_TEMPLATE_SLUGS = new Set([
  "ai-landing",
  "crypto-landing",
  "mobile-crypto-landing",
  "devtool-landing",
  "analytics-landing",
  "ai-workspace-landing",
  "personal-website",
]);

const STANDALONE_TEMPLATE_PREVIEWS: Record<string, string> = {
  "workflow-studio": "AgentBuilderAgentWorkspacePreview",
  "forecast-community": "blocks/prediction-market",
  "asset-workspace": "blocks/crypto-wallet-portfolio-overview",
  "assistant-workspace": "agents/chat-app",
};

const COMPACT_BLOCK_SLUGS = new Set([
  "button",
  "switch",
  "tabs",
  "select",
  "combobox",
  "multi-select",
  "checkbox",
  "radio",
  "input",
  "tooltip",
  "popover",
  "context-menu",
  "command-palette",
  "morphing-search",
  "otp-input",
  "animated-badge",
  "animated-dropdown",
  "morphic-tooltip",
  "receipt",
  "emoji-picker",
  "flip-card",
  "expandable-control",
  "adaptive-stepper",
  "hold-action-button",
  "bloom-menu",
  "overflow-actions",
  "expandable-action-bar",
  "expandable-tabs",
  "morphing-tabs",
  "theme-toggle",
  "loader",
  "ai-thinking-loader",
  "loading-states",
  "voice-orb",
  "feedback-widget",
  "dynamic-island",
  "wallet-card",
  "prediction-market",
  "swap",
  "card-folder",
  "project-folder",
  "notification-stack",
  "swipeable-list",
  "card-dealer",
  "range-slider",
  "wheel-picker",
  "arc-picker",
  "color-picker",
  "color-selector",
  "date-time-picker",
  "date-range-picker",
  "breadcrumb",
  "pagination",
  "avatar-group",
  "tilt-card",
  "bouncy-accordion",
  "number",
  "text-animation",
  "action-swap",
  "animated-select",
  "model-picker",
  "referral-rewards",
  "leaderboard",
  "cookie-consent",
  "prompt-library",
  "mcp-connectors",
  "airdrop-claim",
]);

const ILLUSTRATION_ORDER = [
  "payments",
  "security",
  "metrics",
  "horizontal-stack",
  "rolling-stack",
  "icon-marquee",
  "arc-stack",
  "isometric-scenes",
  "app-preview",
  "chat-exchange",
  "document-cards",
  "layered-cards",
  "voice-note",
  "bar-wave",
  "connected-hub",
  "search-command",
  "file-flow",
  "live-presence",
  "split-reveal",
];

const ILLUSTRATION_DISPLAY_NAMES: Record<string, string> = {
  "illustration-horizontal-stack": "Horizontal Stack",
  "illustration-icon-marquee": "Icon Marquee",
  "illustration-arc-stack": "Arc Stack",
  "illustration-layered-cards": "Card Stack",
};

function defaultPreviewKeyFor(categorySlug: string, comp: ComponentEntry): string {
  return comp.examples?.[0]?.previewKey ?? `${categorySlug}/${comp.slug}`;
}

function isWideBlock(section: CatalogSectionId, slug: string): boolean {
  if (COMPACT_BLOCK_SLUGS.has(slug)) return false;
  if (section === "pages" || section === "templates") return true;
  if (section === "blocks") return true;
  if (section === "agents") {
    return [
      "chat-app",
      "agent-builder",
      "agent-workspace",
      "agent-team",
      "agent-traces",
      "diff-review",
      "knowledge-base",
      "file-diff",
      "tool-result",
      "code-block",
      "voice-conversation",
    ].includes(slug);
  }
  return ["table", "animated-sidebar", "file-tree", "cylinder-carousel", "marquee"].includes(slug);
}

function toCatalogItem(
  categorySlug: string,
  comp: ComponentEntry,
  section: CatalogSectionId,
): CatalogItem {
  return {
    slug: comp.slug,
    name: comp.name,
    description: comp.description,
    href: componentPath(categorySlug, comp.slug),
    categorySlug,
    section,
    variantCount: comp.examples?.length || 1,
    previewKey: defaultPreviewKeyFor(categorySlug, comp),
    badge: comp.badge,
    launchedAt: comp.launchedAt,
    widePreview: isWideBlock(section, comp.slug),
    kind: "registry",
    keywords: comp.keywords,
  };
}

export function classifyBlockSection(slug: string): CatalogSectionId {
  if (AGENT_WORKFLOW_BLOCK_SLUGS.has(slug)) return "agents";
  if (PAGE_BLOCK_SLUGS.has(slug)) return "pages";
  if (LANDING_TEMPLATE_SLUGS.has(slug)) return "templates";
  return "blocks";
}

function buildCatalogSections(): CatalogSection[] {
  const motionCat = registry.find((c) => c.slug === "motion");
  const agentsCat = registry.find((c) => c.slug === "agents");
  const blocksCat = registry.find((c) => c.slug === "blocks");
  const chartsCat = registry.find((c) => c.slug === "charts");

  const componentsItems: CatalogItem[] = (motionCat?.components ?? [])
    .filter((comp) => !comp.slug.startsWith("illustration-"))
    .map((comp) => toCatalogItem("motion", comp, "components"));

  const agentBaseItems: CatalogItem[] = (agentsCat?.components ?? []).map((comp) =>
    toCatalogItem("agents", comp, "agents"),
  );

  const agentWorkflowItems: CatalogItem[] = [];
  const blocksItems: CatalogItem[] = [];
  const pagesItems: CatalogItem[] = [];
  const landingTemplateItems: CatalogItem[] = [];

  for (const comp of blocksCat?.components ?? []) {
    const section = classifyBlockSection(comp.slug);
    const item = toCatalogItem("blocks", comp, section);
    if (section === "agents") agentWorkflowItems.push(item);
    else if (section === "pages") pagesItems.push(item);
    else if (section === "templates") landingTemplateItems.push(item);
    else blocksItems.push(item);
  }

  const standaloneItems: CatalogItem[] = standaloneTemplates.map((template) => ({
    slug: template.slug,
    name: template.name,
    description: template.description,
    href: `/templates/${template.slug}`,
    categorySlug: "templates",
    section: "templates",
    variantCount: 1,
    previewKey:
      STANDALONE_TEMPLATE_PREVIEWS[template.slug] ?? "agents/chat-app",
    widePreview: true,
    kind: "standalone",
    keywords: [template.slug, "template", "app"],
  }));

  const chartItems: CatalogItem[] = (chartsCat?.components ?? []).map((comp) =>
    toCatalogItem("charts", comp, "charts"),
  );

  const mobileItems: CatalogItem[] = MOBILE_SCREEN_GROUPS.map((group) => ({
    slug: group.slug,
    name: group.title,
    description: group.description,
    href: mobileScreenPath(group.slug),
    categorySlug: "mobile",
    section: "mobile",
    variantCount: group.variants.length,
    previewKey: group.variants[0]?.previewKey ?? "",
    badge: group.badge,
    launchedAt: group.launchedAt,
    widePreview: false,
    kind: "mobile-screen",
    keywords: [
      group.slug,
      group.domain,
      ...group.variants.map((v) => v.name),
      "react native",
      "mobile",
    ],
  }));

  return [
    { id: "components", label: "Components", items: componentsItems },
    { id: "agents", label: "Agents", items: [...agentBaseItems, ...agentWorkflowItems] },
    { id: "blocks", label: "Blocks", items: blocksItems },
    { id: "pages", label: "Pages", items: pagesItems },
    { id: "templates", label: "Templates", items: [...standaloneItems, ...landingTemplateItems] },
    { id: "charts", label: "Charts", items: chartItems },
    { id: "mobile", label: "Mobile", items: mobileItems },
  ];
}

export const CATALOG_SECTIONS: CatalogSection[] = buildCatalogSections();

export function getCatalogSection(id: CatalogSectionId): CatalogSection {
  return CATALOG_SECTIONS.find((section) => section.id === id) ?? CATALOG_SECTIONS[0];
}

export const WEB_CATALOG_ITEMS: CatalogItem[] = CATALOG_SECTIONS.filter(
  (section) => section.id !== "mobile",
).flatMap((section) => section.items);

function buildIllustrationCollections(): IllustrationCollection[] {
  const families = webCatalogFamilies.filter((family) =>
    family.publicSlug.startsWith("illustration-"),
  );

  const mapped: IllustrationCollection[] = families.map((family) => {
    const shortSlug = family.publicSlug.replace(/^illustration-/, "");
    const targetSlug = family.existingEntrySlug ?? family.entry.slug;
    const docsHref = componentPath(family.category, targetSlug);
    const variants: IllustrationVariant[] = (family.entry.examples ?? []).map(
      (ex: ComponentExample) => ({
        slug: ex.slug,
        name: ex.name,
        description: ex.description ?? family.entry.description,
        previewKey: ex.previewKey,
        file: ex.file,
        previewFile: ex.previewFile,
        usageFile: ex.usageFile,
        installSlug: ex.installSlug ?? targetSlug,
        badge: ex.badge,
        launchedAt: ex.launchedAt,
      }),
    );

    return {
      slug: shortSlug,
      publicSlug: family.publicSlug,
      name:
        ILLUSTRATION_DISPLAY_NAMES[family.publicSlug] ?? family.entry.name,
      description: family.entry.description,
      docsHref,
      badge: family.entry.badge,
      launchedAt: family.entry.launchedAt,
      variants,
    };
  });

  const orderIndex = new Map(ILLUSTRATION_ORDER.map((slug, idx) => [slug, idx]));
  return mapped.sort(
    (a, b) =>
      (orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

export const ILLUSTRATION_COLLECTIONS: IllustrationCollection[] =
  buildIllustrationCollections();

export const ILLUSTRATION_VARIANT_COUNT = ILLUSTRATION_COLLECTIONS.reduce(
  (sum, item) => sum + item.variants.length,
  0,
);

export function findIllustrationCollection(slug: string) {
  return ILLUSTRATION_COLLECTIONS.find(
    (item) => item.slug === slug || item.publicSlug === slug,
  );
}

function classifyDomains(
  slug: string,
  name: string,
  description: string,
  section: CatalogSectionId,
): Exclude<ExploreDomainId, "all">[] {
  const text = `${slug} ${name} ${description}`.toLowerCase();
  const domains = new Set<Exclude<ExploreDomainId, "all">>();

  if (
    section === "agents" ||
    /\b(ai|agent|prompt|llm|model|chat|voice|reasoning|citation|artifact|tool|mcp|eval|assistant|context|research)\b/.test(
      text,
    )
  ) {
    domains.add("ai");
  }
  if (
    /\b(crypto|wallet|token|swap|chain|trading|defi|airdrop|governance|market|prediction|candlestick|order-book|liquidity)\b/.test(
      text,
    )
  ) {
    domains.add("crypto");
  }
  if (
    /\b(commerce|ecommerce|checkout|pricing|invoice|receipt|payment|cart|order|billing|credit|subscription)\b/.test(
      text,
    )
  ) {
    domains.add("commerce");
  }
  if (
    section === "charts" ||
    section === "pages" ||
    /\b(dashboard|kpi|analytics|audit|log|status|settings|api-key|usage|budget|data-table|table|report|metric|funnel|heatmap|calendar|file-manager|onboarding|auth|search|docs|workspace)\b/.test(
      text,
    )
  ) {
    domains.add("saas");
  }
  if (
    /\b(collaborat|team|invite|kanban|comment|messaging|notification|presence|roadmap|share|approval|diff|calendar|folder)\b/.test(
      text,
    )
  ) {
    domains.add("collaboration");
  }
  if (
    section === "templates" ||
    /\b(hero|feature|cta|footer|testimonial|faq|logo|newsletter|contact|social-proof|how-it-works|comparison|trust|security|blog|case-stud|about|career|waitlist|landing|showcase|tour|use-case|gallery|announcement|navbar|banner|changelog|what-we-offer|content-section|stats)\b/.test(
      text,
    )
  ) {
    domains.add("marketing");
  }

  if (domains.size === 0) {
    domains.add("saas");
  }
  return Array.from(domains);
}

const EXPLORE_PRIORITY_SLUGS = [
  "hero-sections",
  "feature-sections",
  "agent-team",
  "deployments",
  "webhooks",
  "bento-showcase",
  "eval-results",
  "model-picker",
  "leaderboard",
  "referral-rewards",
  "mcp-connectors",
  "pricing",
  "dashboards",
  "cta-sections",
  "kpi-overview",
  "approval-queue",
  "kanban-board",
  "ai-artifacts",
  "crypto-wallet",
  "ecommerce",
  "collaboration",
  "integrations",
  "testimonials",
  "comparison",
  "stats",
  "navbar",
  "footer-sections",
];

function sectionTypeLabel(section: CatalogSectionId): ExploreItem["typeLabel"] {
  switch (section) {
    case "agents":
      return "Agent";
    case "blocks":
      return "Block";
    case "pages":
      return "Page";
    case "templates":
      return "Template";
    case "charts":
      return "Chart";
    default:
      return "Component";
  }
}

export function getExploreItems(): ExploreItem[] {
  const items: ExploreItem[] = [];
  const priorityMap = new Map(
    EXPLORE_PRIORITY_SLUGS.map((slug, idx) => [slug, idx]),
  );

  // Include standalone templates first among templates
  for (const template of standaloneTemplates) {
    items.push({
      id: `template-${template.slug}`,
      familyName: "Template",
      variantName: template.name,
      typeLabel: "Template",
      href: `/templates/${template.slug}`,
      previewKey: STANDALONE_TEMPLATE_PREVIEWS[template.slug] ?? "agents/chat-app",
      domains: classifyDomains(
        template.slug,
        template.name,
        template.description,
        "templates",
      ),
      widePreview: true,
    });
  }

  for (const category of registry) {
    for (const comp of category.components) {
      if (comp.slug.startsWith("illustration-")) continue;

      const section: CatalogSectionId =
        category.slug === "motion"
          ? "components"
          : category.slug === "agents"
            ? "agents"
            : category.slug === "charts"
              ? "charts"
              : classifyBlockSection(comp.slug);

      const typeLabel = sectionTypeLabel(section);
      const baseHref = componentPath(category.slug, comp.slug);

      if (comp.examples?.length) {
        for (const ex of comp.examples) {
          // Skip duplicated illustration examples embedded in marquee/cylinder-carousel
          if (ex.slug.startsWith("illustration-")) continue;
          items.push({
            id: `${category.slug}-${comp.slug}-${ex.slug}`,
            familyName: comp.name,
            variantName: ex.name,
            typeLabel,
            href: `${baseHref}#${ex.slug}`,
            previewKey: ex.previewKey,
            domains: classifyDomains(
              `${comp.slug} ${ex.slug}`,
              `${comp.name} ${ex.name}`,
              ex.description ?? comp.description,
              section,
            ),
            badge: ex.badge ?? comp.badge,
            launchedAt: ex.launchedAt ?? comp.launchedAt,
            widePreview: isWideBlock(section, comp.slug),
          });
        }
      } else {
        items.push({
          id: `${category.slug}-${comp.slug}`,
          familyName: comp.name,
          variantName: comp.name,
          typeLabel,
          href: baseHref,
          previewKey: `${category.slug}/${comp.slug}`,
          domains: classifyDomains(
            comp.slug,
            comp.name,
            comp.description,
            section,
          ),
          badge: comp.badge,
          launchedAt: comp.launchedAt,
          widePreview: isWideBlock(section, comp.slug),
        });
      }
    }
  }

  // Interleave top-priority families round-robin so the Explore grid opens
  // with diverse UI types instead of grouping all variants of one family together.
  const buckets = new Map<string, ExploreItem[]>();
  const rest: ExploreItem[] = [];

  for (const item of items) {
    const slug = item.href.split("/").pop()?.split("#")[0] ?? "";
    if (priorityMap.has(slug)) {
      const list = buckets.get(slug) ?? [];
      list.push(item);
      buckets.set(slug, list);
    } else {
      rest.push(item);
    }
  }

  const interleaved: ExploreItem[] = [];
  let round = 0;
  let pushed = true;
  while (pushed) {
    pushed = false;
    for (const slug of EXPLORE_PRIORITY_SLUGS) {
      const item = buckets.get(slug)?.[round];
      if (item) {
        interleaved.push(item);
        pushed = true;
      }
    }
    round += 1;
  }

  rest.sort((a, b) => (b.launchedAt ?? "").localeCompare(a.launchedAt ?? ""));
  return [...interleaved, ...rest];
}

export const SHOWCASE_DIRECTORY_SLUGS = [
  { num: "01", label: "Hero", category: "blocks", slug: "hero-sections" },
  { num: "02", label: "Feature", category: "blocks", slug: "feature-sections" },
  { num: "03", label: "Pricing", category: "blocks", slug: "pricing" },
  { num: "04", label: "Testimonials", category: "blocks", slug: "testimonials" },
  { num: "05", label: "CTA", category: "blocks", slug: "cta-sections" },
  { num: "06", label: "Footer", category: "blocks", slug: "footer-sections" },
  { num: "07", label: "Logo Cloud", category: "blocks", slug: "logo-cloud" },
  { num: "08", label: "How It Works", category: "blocks", slug: "how-it-works" },
  { num: "09", label: "FAQ Blocks", category: "blocks", slug: "faq-blocks" },
  { num: "10", label: "Stats", category: "blocks", slug: "stats" },
  { num: "11", label: "Content", category: "blocks", slug: "content-sections" },
  { num: "12", label: "Integrations", category: "blocks", slug: "integrations" },
  { num: "13", label: "Image Galleries", category: "blocks", slug: "image-galleries" },
  { num: "14", label: "Newsletter", category: "blocks", slug: "newsletter" },
  { num: "15", label: "Team", category: "blocks", slug: "team" },
] as const;
