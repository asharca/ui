import type { TemplateHighlight } from "@/lib/standalone-templates";

export type TemplateShowcase = {
  slug: string;
  tagline: string;
  whatIsIt: string;
  whoIsItFor: string;
  highlights: readonly TemplateHighlight[];
};

const TEMPLATE_SHOWCASES: Record<string, TemplateShowcase> = {
  "mobile-crypto-landing": {
    slug: "mobile-crypto-landing",
    tagline:
      "Copy-paste React component or open the full-screen preview — ready to connect to your app store listings.",
    whatIsIt:
      "Mobile Crypto Landing is a multi-page product launch site built around an interactive center-stage phone showcase. Visitors can switch across Route, Review, and Safety previews inside the device frame, explore supported chains across Home, Networks, Security, and Download views, and inspect transaction clarity before signing.",
    whoIsItFor:
      "Crypto mobile wallet teams, payment apps, and self-custody startups looking for a launch site that explains multi-chain routing and transaction security clearly without visual clutter.",
    highlights: [
      {
        title: "Product-led phone hero",
        description:
          "Interactive phone preview lets visitors switch between Route, Review, and Safety stages directly inside the hero section.",
      },
      {
        title: "Complete multi-page system",
        description:
          "Includes Home, Networks, Security architecture, and Download pages wired seamlessly through controlled or router-driven navigation.",
      },
      {
        title: "Authentic network support",
        description:
          "Dedicated 8-network showcase grid with selectable detail cards linking directly to chain documentation.",
      },
      {
        title: "Purpose-built motion",
        description:
          "Smooth scroll reveals, interactive accordions, and responsive drawer navigation respecting reduced-motion settings.",
      },
      {
        title: "Trust-first storytelling",
        description:
          "Puts fee transparency, readable recipient checks, and self-custody recovery explanations front and center.",
      },
      {
        title: "Production-ready foundation",
        description:
          "Host-supplied routeHrefs, store links, and privacy URLs drop cleanly into Next.js App Router layouts.",
      },
    ],
  },
  "personal-website": {
    slug: "personal-website",
    tagline:
      "Copy-paste editorial portfolio component — customize biography, projects, writing links, and artwork.",
    whatIsIt:
      "Personal Website is a monochrome editorial portfolio designed around focused typography and subtle motion. It pairs a header theme switcher, expandable personal bio, hover-triggered link popovers, category-filtered project cards with morphing case-study modals, and curated writing references.",
    whoIsItFor:
      "Independent product engineers, designers, researchers, and founders wanting a fast, quiet personal site with rich interactive project modals and zero marketing bloat.",
    highlights: [
      {
        title: "Focused profile introduction",
        description:
          "Clean monochrome header paired with an expandable story toggle that keeps initial scan density effortless.",
      },
      {
        title: "Morphing link previews",
        description:
          "Hover or focus inline profile references to reveal context-rich Popover cards without navigating away.",
      },
      {
        title: "Original character artwork",
        description:
          " Crisp vector portrait and project artwork work in light and dark themes out of the box or swap seamlessly with custom photography.",
      },
      {
        title: "Visual project highlights",
        description:
          "Filterable Highlights grid opens each project inside a CenterMorphModal with role, focus tags, and full case-study copy.",
      },
      {
        title: "Quiet entrance motion",
        description:
          "Staggered reveals and circular theme transitions use shared motion tokens without distracting from reading.",
      },
      {
        title: "Responsive by design",
        description:
          "Balances single-column reading measure on desktop with thumb-friendly galleries on mobile screens.",
      },
      {
        title: "Easy to personalize",
        description:
          "Driven cleanly from one structured PersonalWebsiteProps config object covering experience, practice, writing, and availability.",
      },
    ],
  },
  "ai-landing": {
    slug: "ai-landing",
    tagline:
      "Copy-paste SRE & AI agent launch site — showcase recorded runs, capabilities, pricing, and FAQs.",
    whatIsIt:
      "AI Agent Landing showcases an autonomous incident-response partner without opaque black-box claims. The hero renders a dual-panel recorded run trace and investigation conversation, backed by an interactive multi-step trace explorer, capability breakdown, pricing switcher, and FAQ accordion.",
    whoIsItFor:
      "Developer-tool startups, AI SRE platforms, and enterprise copilot teams needing a high-trust launch site that demonstrates tool calls and human-approval boundaries.",
    highlights: [
      {
        title: "Agent-first hero",
        description:
          "Dual-pane recorded investigation preview immediately proves how the agent gathers signals and proposes reviewed fixes.",
      },
      {
        title: "Live run trace",
        description:
          "Switch across sample incident scenarios and step through individual tool calls, timing, and diagnostic findings.",
      },
      {
        title: "Capability storytelling",
        description:
          "Dedicated sections highlight tool permissions, context integrations, and transparent audit trails.",
      },
      {
        title: "Complete conversion path",
        description:
          "Includes integration badge strip, annual/monthly pricing cards, customer quotes, and expandable FAQs.",
      },
      {
        title: "Responsive motion",
        description:
          "Coordinated section reveals and interactive step selectors adapt smoothly between desktop and mobile viewports.",
      },
      {
        title: "Ready to customize",
        description:
          "Bind recorded runs, integration names, pricing plans, and onboarding CTAs via strongly typed AiLandingProps.",
      },
    ],
  },
  "crypto-landing": {
    slug: "crypto-landing",
    tagline:
      "Copy-paste self-custody portfolio launch site — interactive balance card, period toggles, and trust narrative.",
    whatIsIt:
      "Crypto Landing presents a serene portfolio-first launch site for multi-chain finance products. Visitors can toggle historical chart windows (1W, 1M, 1Y), inspect asset allocations across chains inside the interactive hero card, and review plans, proof, and security FAQs.",
    whoIsItFor:
      "Multi-chain wallet products, asset-tracking platforms, and crypto startups seeking a calm, high-contrast launch experience focused on clarity over hype.",
    highlights: [
      {
        title: "Portfolio hero",
        description:
          "Live interactive hero portfolio card displays multi-asset balances, percentage changes, and switchable 1W/1M/1Y trend curves.",
      },
      {
        title: "Chain-ready proof",
        description:
          "Surface Ethereum, Solana, Base, and custom network support with readable token holdings.",
      },
      {
        title: "Trust-led structure",
        description:
          "Separates read-only portfolio visibility narrative cleanly from signing and wallet authorization flows.",
      },
      {
        title: "Full buying journey",
        description:
          "Covers hero showcase, supported networks, capability pillars, transparent tiers, testimonials, and FAQ accordion.",
      },
      {
        title: "Theme-safe design",
        description:
          "High-contrast surface hierarchy tested across dark and light modes with crisp tabular numbers.",
      },
      {
        title: "Production stack",
        description:
          "Self-contained React + Motion + Tailwind component ready to connect to live pricing feeds and signup URLs.",
      },
    ],
  },
  "devtool-landing": {
    slug: "devtool-landing",
    tagline:
      "Copy-paste TypeScript framework launch site — interactive flow-field hero, policy snippets, and run traces.",
    whatIsIt:
      "Devtool Landing pairs a dark atmospheric shader header with an interactive agent policy and run-trace inspector. Developers can switch between sample agents, inspect TypeScript policy configs, step through recorded traces, copy install commands, and browse release changelogs.",
    whoIsItFor:
      "SDK maintainers, AI infrastructure startups, CLI authors, and open-source frameworks wanting a developer-native launch page that foregrounds real code and deterministic traces.",
    highlights: [
      {
        title: "Flow-field hero",
        description:
          "GPU shader flow-field backdrop paired with copyable package install command and pause/motion controls.",
      },
      {
        title: "Agent directory demo",
        description:
          "Cycle or select across Research, Engineering, and Operations agent definitions to inspect code policies side by side.",
      },
      {
        title: "Durable run trace",
        description:
          "Shows step-by-step execution checks and permission boundaries alongside every TypeScript snippet.",
      },
      {
        title: "Content-ready pages",
        description:
          "Includes engineering articles, versioned changelog milestones, pricing plans, and developer FAQs.",
      },
      {
        title: "Responsive interactions",
        description:
          "Handles reduced-motion preferences gracefully by pausing auto-rotation and freezing shader movement.",
      },
      {
        title: "Modern foundation",
        description:
          "Typed TypeScript props make swapping install commands, docs links, and code snippets effortless.",
      },
    ],
  },
  "analytics-landing": {
    slug: "analytics-landing",
    tagline:
      "Copy-paste product analytics launch site — coordinated period metrics, funnel drop-off Q&A, and charts.",
    whatIsIt:
      "Analytics Landing combines executive metric tiles and funnel breakdowns with an interactive natural-language Q&A bar. Switching between 7-day and 30-day windows updates charts, conversion funnels, revenue totals, and source-linked answers in unison.",
    whoIsItFor:
      "B2B analytics SaaS products, telemetry platforms, and conversion intelligence startups showcasing real-time metrics alongside natural-language querying.",
    highlights: [
      {
        title: "Funnel dashboard hero",
        description:
          "Coordinated visitor trend sparkline, revenue readout, and multi-stage conversion funnel respond live to period switches.",
      },
      {
        title: "Natural-language analysis",
        description:
          "Prompt suggestions and custom question submission compute conversion rates and drop-off points via an abortable host handler.",
      },
      {
        title: "Data-focused system",
        description:
          "Built around tabular numbers, source citations under every answer, and crisp semantic error recovery.",
      },
      {
        title: "Complete product site",
        description:
          "Includes period-aware hero demo, core product storytelling, transparent plans, customer proof, and FAQ accordion.",
      },
      {
        title: "Light and dark",
        description:
          "Carefully calibrated semantic border, card, and muted tokens adapt cleanly across system themes.",
      },
      {
        title: "Production-ready stack",
        description:
          "Plug your real query backend directly into onAnalyze with AbortSignal cancellation and source attribution.",
      },
    ],
  },
  "ai-workspace-landing": {
    slug: "ai-workspace-landing",
    tagline:
      "Copy-paste editorial AI workspace site — interactive partner switcher, prompt composer, and team stories.",
    whatIsIt:
      "AI Workspace Landing tells the story of a collaborative team workspace anchored by an interactive multi-partner prompt composer. Visitors can switch specialized assistants (Planner, Writer, Facilitator), trigger sample prompts into structured outlines, and explore shared projects.",
    whoIsItFor:
      "Collaborative AI workspace products, knowledge tools, and SaaS teams that want a warm, human-centric product launch page with a working interactive composer preview.",
    highlights: [
      {
        title: "Conversational hero",
        description:
          "Interactive composer lets visitors pick specialized partners, choose starter prompts, and inspect structured output.",
      },
      {
        title: "Motion-rich illustrations",
        description:
          "Expressive partner cards and shared project previews bring abstract collaboration workflows to life.",
      },
      {
        title: "Human product story",
        description:
          "Balances technical depth with approachable use cases, collaborator presence, and customer quotes.",
      },
      {
        title: "Complete site system",
        description:
          "Hero composer, partner directory, shared workspace scenarios, pricing switcher, and FAQ accordion.",
      },
      {
        title: "Responsive and accessible",
        description:
          "Full keyboard navigation, live status announcements, and reduced-motion-safe transitions throughout.",
      },
      {
        title: "Easy to own",
        description:
          "Connect your own assistant API through onSubmit and supply real projects, partners, and plans.",
      },
    ],
  },
};

export function getTemplateShowcase(slug: string): TemplateShowcase | undefined {
  return TEMPLATE_SHOWCASES[slug];
}

export const LANDING_SHOWCASE_SLUGS = Object.keys(TEMPLATE_SHOWCASES);
