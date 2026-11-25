import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { AiLandingPreview } from "@/components/previews/blocks/ai-landing-default.preview";
import { AiWorkspaceLandingPreview } from "@/components/previews/blocks/ai-workspace-landing-default.preview";
import { AnalyticsLandingPreview } from "@/components/previews/blocks/analytics-landing-default.preview";
import { CryptoLandingPreview } from "@/components/previews/blocks/crypto-landing-default.preview";
import { DevtoolLandingPreview } from "@/components/previews/blocks/devtool-landing-default.preview";
import { MobileCryptoLandingPreview } from "@/components/previews/blocks/mobile-crypto-landing-default.preview";
import { PersonalWebsitePreview } from "@/components/previews/blocks/personal-website-default.preview";

const LANDING_DEMO_PAGES: Record<
  string,
  { title: string; Preview: ComponentType<{ fullPage?: boolean }> }
> = {
  "mobile-crypto-landing": {
    title: "Mobile Crypto Landing · Live preview",
    Preview: MobileCryptoLandingPreview,
  },
  "personal-website": {
    title: "Personal Website · Live preview",
    Preview: PersonalWebsitePreview,
  },
  "ai-landing": {
    title: "AI Agent Landing · Live preview",
    Preview: AiLandingPreview,
  },
  "crypto-landing": {
    title: "Crypto Landing · Live preview",
    Preview: CryptoLandingPreview,
  },
  "devtool-landing": {
    title: "Devtool Landing · Live preview",
    Preview: DevtoolLandingPreview,
  },
  "analytics-landing": {
    title: "Analytics Landing · Live preview",
    Preview: AnalyticsLandingPreview,
  },
  "ai-workspace-landing": {
    title: "AI Workspace · Live preview",
    Preview: AiWorkspaceLandingPreview,
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LANDING_DEMO_PAGES).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = LANDING_DEMO_PAGES[slug];
  if (!entry) notFound();
  return {
    title: entry.title,
    robots: { index: false, follow: false },
  };
}

export default async function TemplateDemoPage({ params }: Props) {
  const { slug } = await params;
  const entry = LANDING_DEMO_PAGES[slug];
  if (!entry) notFound();
  const { Preview } = entry;
  return <Preview fullPage />;
}
